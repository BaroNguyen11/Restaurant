import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const useAddresses = (userId, userMetadata = null) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const localKey = userId ? `saved_addresses_${userId}` : null;

  // Load addresses from local storage when userId changes
  useEffect(() => {
    if (userId && localKey) {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAddresses(parsed);
        const defaultAddr = parsed.find(a => a.isDefault) || parsed[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setSelectedAddress(defaultAddr);
        }
      } else {
        // Fallback: create default starting address using User profile info
        const initialAddr = {
          id: 'addr_default',
          label: 'Home',
          fullName: userMetadata?.full_name || '',
          phone: '',
          address: '',
          isDefault: true
        };
        const defaultList = [initialAddr];
        setAddresses(defaultList);
        setSelectedAddressId(initialAddr.id);
        setSelectedAddress(initialAddr);
        localStorage.setItem(localKey, JSON.stringify(defaultList));
      }
    } else {
      setAddresses([]);
      setSelectedAddressId(null);
      setSelectedAddress(null);
    }
  }, [userId, localKey, userMetadata]);

  const selectAddress = useCallback((addrId) => {
    setSelectedAddressId(addrId);
    const addr = addresses.find(a => a.id === addrId);
    if (addr) {
      setSelectedAddress(addr);
    }
    return addr;
  }, [addresses]);

  const addAddress = useCallback((newAddr) => {
    if (!userId || !localKey) return;

    const newId = `addr_${Date.now()}`;
    const newAddressItem = {
      id: newId,
      label: newAddr.label || 'Home',
      fullName: newAddr.fullName,
      phone: newAddr.phone,
      address: newAddr.address,
      isDefault: addresses.length === 0
    };

    const updatedList = [...addresses, newAddressItem];
    setAddresses(updatedList);
    localStorage.setItem(localKey, JSON.stringify(updatedList));

    setSelectedAddressId(newId);
    setSelectedAddress(newAddressItem);
    toast.success("New address added successfully!");
    return newAddressItem;
  }, [addresses, userId, localKey]);

  const deleteAddress = useCallback((addrId) => {
    if (!userId || !localKey) return;

    const updatedList = addresses.filter(a => a.id !== addrId);
    setAddresses(updatedList);
    localStorage.setItem(localKey, JSON.stringify(updatedList));

    if (selectedAddressId === addrId) {
      const nextSelected = updatedList[0];
      if (nextSelected) {
        setSelectedAddressId(nextSelected.id);
        setSelectedAddress(nextSelected);
      } else {
        setSelectedAddressId(null);
        setSelectedAddress(null);
      }
    }
    toast.success("Address deleted.");
  }, [addresses, selectedAddressId, userId, localKey]);

  return {
    addresses,
    selectedAddressId,
    selectedAddress,
    selectAddress,
    addAddress,
    deleteAddress
  };
};
export default useAddresses;

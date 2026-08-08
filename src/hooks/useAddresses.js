import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const useAddresses = (userId, profile = null) => {
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
        
        // Tìm và tự động cập nhật lại địa chỉ mặc định 'addr_default' nếu nó bị trống nhưng profile đã có dữ liệu
        let hasUpdated = false;
        const updatedParsed = parsed.map(addr => {
          if (addr.id === 'addr_default' && (!addr.address || !addr.phone) && (profile?.address || profile?.phone)) {
            hasUpdated = true;
            return {
              ...addr,
              fullName: profile?.full_name || addr.fullName || '',
              phone: profile?.phone || addr.phone || '',
              address: profile?.address || addr.address || '',
            };
          }
          return addr;
        });

        if (hasUpdated) {
          setAddresses(updatedParsed);
          localStorage.setItem(localKey, JSON.stringify(updatedParsed));
          const defaultAddr = updatedParsed.find(a => a.isDefault) || updatedParsed[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setSelectedAddress(defaultAddr);
          }
        } else {
          setAddresses(parsed);
          const defaultAddr = parsed.find(a => a.isDefault) || parsed[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setSelectedAddress(defaultAddr);
          }
        }
      } else {
        // Fallback: tạo địa chỉ mặc định từ thông tin Profile của Database
        const initialAddr = {
          id: 'addr_default',
          label: 'Home',
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
          address: profile?.address || '',
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
  }, [userId, localKey, profile]);

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

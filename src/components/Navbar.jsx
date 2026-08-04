import * as React from "react";
import {
  Armchair,
  ChefHat,
  CircleStar,
  House,
  Info,
  Mail,
  Menu,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [openOrder, setOpenOrder] = React.useState(false);
  const isOrderActive =
    isActive("/order/order_food") || isActive("/order/order_table");
  const [openMobile, setOpenMobile] = React.useState(false);
  const getLinkStyle = (path) => `
    ${navigationMenuTriggerStyle()} 
    ${isActive(path) ? "!text-[#9e1c20] !bg-[#fff8f0] " : "text-gray-600"}
    text-base px-6
  `;
  return (
    <>
      <div className="hidden md:block">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/" className={getLinkStyle("/")}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/about" className={getLinkStyle("/about")}>
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`
                ${navigationMenuTriggerStyle()} 
                ${isOrderActive ? "text-[#9e1c20]! bg-[#fff8f0]! " : "text-gray-600"}
                text-base px-6 bg-transparent
            `}
              >
                Order
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-50 gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/order/order_food"
                        className="flex-row items-center "
                      >
                        <ChefHat size={16} className="inline-block mr-2" />
                        Order food
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/order/order_table"
                        className="flex-row items-center "
                      >
                        <Armchair size={16} className="inline-block mr-2" />
                        Reserve a table
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/contact" className={getLinkStyle("/contact")}>
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
        >
          {openMobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50"
          >
            <ul className="flex flex-col divide-y">
              <Link
                to="/"
                onClick={() => setOpenMobile(false)}
                className="px-4 py-3 hover:bg-gray-100 flex items-center"
              >
                <House size={16} className="inline-block mr-2" />
                Home
              </Link>

              <Link
                to="/about"
                onClick={() => setOpenMobile(false)}
                className="px-4 py-3 hover:bg-gray-100 flex items-center"
              >
                <Info size={16} className="inline-block mr-2" />
                About
              </Link>

              <div>
                <button
                  onClick={() => setOpenOrder(!openOrder)}
                  className="px-4 py-3 flex justify-between items-center w-full cursor-pointer  "
                >
                  <div className="flex items-center">
                    <CircleStar size={16} className="inline-block mr-2" />
                    Order
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openOrder ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openOrder && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden pl-6"
                    >
                      <Link
                        to="/order/order_food"
                        className=" py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setOpenMobile(false);
                          setOpenOrder(!openOrder);
                        }}
                      >
                        <ChefHat size={16} className="inline-block mr-2" />
                        Order food
                      </Link>

                      <Link
                        to="/order/order_table"
                        className=" py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setOpenMobile(false);
                          setOpenOrder(!openOrder);
                        }}
                      >
                        <Armchair size={16} className="inline-block mr-2" />
                        Reserve table
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/contact"
                onClick={() => setOpenMobile(false)}
                className="px-4 py-3 hover:bg-gray-100 flex items-center"
              >
                <Mail size={16} className="inline-block mr-2" />
                Contact
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;

import * as React from 'react';
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Coffee,
  Pizza,
  Utensils,
  IceCream,
  Beer,
  ChefHat,
  Flame,
  ChevronDown 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const menuCategories = [
  {
    title: 'Starters',
    href: '/menu?tab=starters',
    description: 'Light bites to start your meal.',
    icon: ChefHat
  },
  {
    title: 'Breakfast',
    href: '/menu?tab=breakfast',
    description: 'Start your day with energy.',
    icon: Coffee
  },
  {
    title: 'Main Course',
    href: '/menu?tab=main',
    description: 'Hearty meals, steaks & grills.',
    icon: Utensils
  },
  {
    title: 'Pizza & Burger',
    href: '/menu?tab=pizza',
    description: 'Cheesy pizzas and juicy burgers.',
    icon: Pizza
  },
  {
    title: 'Desserts',
    href: '/menu?tab=dessert',
    description: 'Sweet treats to finish.',
    icon: IceCream
  },
  {
    title: 'Drinks',
    href: '/menu?tab=drinks',
    description: 'Refreshing cocktails & juices.',
    icon: Beer
  },
];


function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isOrderActive = isActive('/order/order_food') || isActive('/order/order_table');
  const [openMobile, setOpenMobile] = React.useState(false);
  const getLinkStyle = (path) => `
    ${navigationMenuTriggerStyle()} 
    ${isActive(path) ? '!text-[#9e1c20] !bg-[#fff8f0] ' : 'text-gray-600'}
    text-base px-6
  `;
  return (
    <>
      <div className="hidden md:block">
        <NavigationMenu viewport={false}>
          <NavigationMenuList >
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/" className={getLinkStyle('/')}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/about" className={getLinkStyle('/about')}>About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={getLinkStyle('/menu')}>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">

                  {/* CỘT TRÁI: FEATURED CARD (Món nổi bật) */}
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md hover:bg-[#b33338]! from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md bg-[#9e1c20] relative overflow-hidden group"
                        to="/order/order_food"
                      >
                        {/* Ảnh nền mờ */}
                        <img src="https://godrejyummiez.in/images/products/details/Non-Veg/Crispy_Fried_Chicken_Plate.png"
                          className="absolute -right-5 -top-5 w-32 opacity-2 rotate-12  group-hover:scale-110 transition-all duration-500" />

                        <div className="relative z-10">
                          <Flame className="h-6 w-6 text-[#FFA500] mb-2 animate-pulse" />
                          <div className="mb-2 mt-2 text-lg font-black text-white">
                            Special Offer
                          </div>
                          <p className="text-sm leading-tight text-white/80 mb-4">
                            Get 20% off on all Burgers this weekend!
                          </p>
                          <span className="bg-white text-[#9e1c20] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm group-hover:bg-[#FFA500] group-hover:text-white transition-colors">
                            Order Now
                          </span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  {/* CỘT PHẢI: DANH SÁCH MENU */}
                  {menuCategories.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}

                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`
                ${navigationMenuTriggerStyle()} 
                ${isOrderActive ? 'text-[#9e1c20]! bg-[#fff8f0]! ' : 'text-gray-600'}
                text-base px-6 bg-transparent
            `}
              >Order</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-50 gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/order/order_food" className="flex-row items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 416 512" className="text-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"></path>
                        </svg>
                        Order food
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/order/order_table" className="flex-row items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M112 128c0-29.5 16.2-55 40-68.9V256h48V48h48v208h48V59.1c23.8 13.9 40 39.4 40 68.9v128h48V128C384 57.3 326.7 0 256 0h-64C121.3 0 64 57.3 64 128v128h48zm334.3 213.9l-10.7-32c-4.4-13.1-16.6-21.9-30.4-21.9H42.7c-13.8 0-26 8.8-30.4 21.9l-10.7 32C-5.2 362.6 10.2 384 32 384v112c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384h256v112c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V384c21.8 0 37.2-21.4 30.3-42.1z">
                          </path>
                        </svg>
                        Reverse a table
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/contact" className={getLinkStyle('/contact')}>Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="p-2 rounded-md border border-gray-200"
        >
          {openMobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {openMobile && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
          <ul className="flex flex-col divide-y">

            <Link to="/" onClick={() => setOpenMobile(false)}
              className="px-4 py-3 hover:bg-gray-100">
              Home
            </Link>

            <Link to="/about" onClick={() => setOpenMobile(false)}
              className="px-4 py-3 hover:bg-gray-100">
              About
            </Link>

            {/* MENU DROPDOWN */}
            <details className="group">
              <summary className="px-4 py-3 cursor-pointer flex justify-between items-center">
                Menu
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
              </summary>

              <div className="pl-6 pb-2 space-y-2">
                {menuCategories.map(item => (
                  <Link
                    key={item.title}
                    to={item.href}
                    onClick={() => setOpenMobile(false)}
                    className="block py-2 text-sm text-gray-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="px-4 py-3 cursor-pointer flex justify-between items-center">
                Order
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
              </summary>

              <div className="pl-6 pb-2 space-y-2">
               <Link 
                    to="/order/order_food" 
                    onClick={() => setOpenMobile(false)}
                    className="block py-2 hover:bg-[#f4f4f4] transition-colors"
                >
                  Order food
                </Link>
               <Link 
                    to="/order/order_table" 
                    onClick={() => setOpenMobile(false)}
                    className="block py-2 hover:bg-[#f4f4f4]transition-colors"
                >
                  Reserve table
                </Link>
              </div>
            </details>

            <Link to="/contact" onClick={() => setOpenMobile(false)}
              className="px-4 py-3 hover:bg-gray-100">
              Contact
            </Link>

          </ul>
        </div>
      )}

    </>
  );
}
export default Navbar;
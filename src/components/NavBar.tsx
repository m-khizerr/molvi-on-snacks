"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Box, Users } from "lucide-react";
import { BiHome } from "react-icons/bi";

export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <BiHome size={22} />, label: "Dashboard" },
    { href: "/orders", icon: <Package size={22} />, label: "Orders" },
    { href: "/items", icon: <Box size={22} />, label: "Items" },
    { href: "/users", icon: <Users size={22} />, label: "Users" },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-around w-[260px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl shadow-lg px-6 py-3 border border-gray-200 dark:border-neutral-800">
        {navItems.map((item) => {
          const active = path === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`relative flex flex-col items-center text-gray-500 dark:text-gray-400 transition ${
                active ? "text-black dark:text-white" : "hover:text-gray-700"
              }`}
            >
              <motion.div
                className="relative flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
                {active && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"
                  />
                )}
              </motion.div>
              {/* Tooltip */}
              <span className="absolute bottom-10 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

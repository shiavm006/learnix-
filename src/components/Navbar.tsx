'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ShoppingCart, AlertTriangle, Menu as HamburgerIcon, X as CloseIcon } from "lucide-react";
import Cart from "./Cart";
import { cn } from "@/lib/utils";
import { ThemeButton } from "./ThemeButton";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollUp, setScrollUp] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      setLastScrollY(window.scrollY);
      setScrollUp(window.scrollY > lastScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all ease-in-out duration-700",
        "bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl backdrop-saturate-200",
        "border-b border-white/10 dark:border-gray-800/10",
        scrolled && "shadow-lg shadow-black/5 dark:shadow-white/5 bg-white/80 dark:bg-gray-950/80",
        scrollUp && "transform -translate-y-full"
      )}
    >
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-8 h-20 max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link 
            href="/" 
            className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Learnix
          </Link>
        </motion.div>

        {/* Center Navigation Menu */}
        <div className="hidden sm:block">
          <Menu setActive={setActive}>
            <Link href="/">
              <MenuItem 
                setActive={setActive} 
                active={active} 
                item="Home"
                className="hover:text-rose-500 transition-all duration-300 hover:scale-105 font-medium"
              />
            </Link>

            <MenuItem 
              setActive={setActive} 
              active={active} 
              item="Courses"
              className="hover:text-rose-500 transition-all duration-300 hover:scale-105 font-medium"
            >
              <div className="flex flex-col space-y-4 text-sm p-8 min-w-[240px] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20">
                <HoveredLink href="/all-courses">All Courses</HoveredLink>
                {session?<HoveredLink href="/channel">Dashboard</HoveredLink>:null }
                {!session && <HoveredLink href="/signin">Login</HoveredLink>}
                {session?.user.isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-red-900 hover:text-red-700 transition-colors duration-300"
                  >
                    Admin <AlertTriangle className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </MenuItem>

            <MenuItem 
              setActive={setActive} 
              active={active} 
              item="Content"
              className="hover:text-rose-500 transition-all duration-300 hover:scale-105 font-medium"
            >
              <div className="flex flex-col space-y-4 text-sm p-8 min-w-[240px] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20">
                <HoveredLink href="/newsletters">Newsletter</HoveredLink>
                <div className="relative">
                  <HoveredLink href="/books/e-books">
                    <div className="flex items-center gap-2">
                      E-Books
                      <span className="px-2 py-0.5 text-xs font-medium bg-rose-500 text-white rounded-full">New</span>
                    </div>
                  </HoveredLink>
                </div>
                <HoveredLink href="/videos">Videos</HoveredLink>
                <HoveredLink href="/blogs">Blogs</HoveredLink>
                <HoveredLink href="/upcoming-courses">Upcoming Courses</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-6">
          {/* Hamburger Menu for Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors duration-300"
            >
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {menuOpen ? 
                  <CloseIcon className="w-6 h-6 text-rose-500" /> : 
                  <HamburgerIcon className="w-6 h-6" />
                }
              </motion.div>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {session ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="border-2 border-rose-500/50 hover:border-rose-500 hover:bg-rose-500/10 transition-all duration-300 font-medium px-6 py-5 text-base rounded-xl"
                  >
                    Logout
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <Cart icon={<ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-300" />} />
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <HoveredLink href="/signin">
                  <Button 
                    variant="outline"
                    className="border-2 border-rose-500/50 hover:border-rose-500 hover:bg-rose-500/10 transition-all duration-300 font-medium px-6 py-5 text-base rounded-xl"
                  >
                    Login
                  </Button>
                </HoveredLink>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }}>
              <ThemeButton />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={menuOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-white/10 dark:border-gray-800/10"
      >
        <div className="flex flex-col items-center space-y-4 py-8 px-6 max-w-7xl mx-auto">
          <motion.div className="w-full space-y-2">
            {[
              { href: "/", text: "Home" },
              { href: "/all-courses", text: "All Courses" },
              { href: "/channel", text: "Dashboard" },
              ...(session?.user.isAdmin ? [{ href: "/admin", text: "Admin", icon: <AlertTriangle className="w-5 h-5" /> }] : []),
              { href: "/newsletters", text: "Newsletter" },
              { href: "/books/e-books", text: "E-Books" },
              { href: "/videos", text: "Videos" },
              { href: "/blogs", text: "Blogs" },
              { href: "/upcoming-courses", text: "Upcoming Courses" }
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.02, x: 10 }}
                className="w-full"
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-3 w-full rounded-xl hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors duration-300"
                  onClick={closeMenu}
                >
                  <span className="text-gray-800 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 font-medium">
                    {item.text}
                  </span>
                  {item.icon}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="pt-6">
            <ThemeButton />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
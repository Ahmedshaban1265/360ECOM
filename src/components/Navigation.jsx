// src/components/Navigation.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import content from "../utils/content";
import newLogo from "@/assets/360ecomlogo.png";

export default function Navigation({ language, setLanguage, isDark, setIsDark }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const location = useLocation();

    const t = content[language];
    const isRTL = language === "ar";

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        if (isRTL) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [isDark, isRTL]);

    const toggleTheme = () => setIsDark(!isDark);
    const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <motion.nav
            className={`fixed top-0 w-full z-40 transition-all duration-300 ${
                scrollY > 50
                    ? "bg-background/95 backdrop-blur-md border-b shadow-lg"
                    : "bg-transparent"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto  py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/" className="flex items-center">
                            <img src={newLogo} alt="360ECOM" className="h-8 w-auto" />
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {[
                            { key: "home", path: "/" },
                            { key: "services", path: "/services" },
                            { key: "about", path: "/about" },
                            { key: "clients", path: "/clients" },
                            { key: "case-studies", path: "/case-studies" },
                            { key: "ProjectsPage", path: "/our-projects" },
                            { key: "academy", path: "/360academy" },
                            { key: "testimonials", path: "/testimonials" },
                            { key: "contact", path: "/contact" },
                        ].map((item, index) => (
                            <motion.div key={item.key}>
                                <Link
                                    to={item.path}
                                    className={`relative hover:text-blue-600 transition-colors group ${
                                        location.pathname === item.path
                                            ? "text-blue-600"
                                            : ""
                                    }`}
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {t.nav[item.key]}
                                    <motion.div
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ${
                                            location.pathname === item.path
                                                ? "w-full"
                                                : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            </motion.div>
                        ))}

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.9 }} >
                            <Button
                                onClick={toggleLanguage}
                                variant="ghost"
                                size="icon"
                                className="relative overflow-hidden px-5"

                            >
                                <Languages className="w-5 h-5 " />
                                <span className="text-xs">
                                    {language.toUpperCase()}
                                </span>
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                onClick={toggleTheme}
                                variant="ghost"
                                size="icon"
                                className="relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ rotate: isDark ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isDark ? (
                                        <Sun className="w-5 h-5" />
                                    ) : (
                                        <Moon className="w-5 h-5" />
                                    )}
                                </motion.div>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/booking">
                                <Button className="cursor-pointer bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 relative overflow-hidden group">
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10">{t.nav.getStarted}</span>
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Button onClick={toggleLanguage} variant="ghost" size="icon">
                            <Languages className="w-5 h-5" />
                        </Button>
                        <Button onClick={toggleTheme} variant="ghost" size="icon">
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <Button onClick={toggleMenu} variant="ghost" size="icon">
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </motion.div>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu - Fixed Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="fixed inset-0 top-0 left-0 w-full h-full bg-background/98 backdrop-blur-lg z-50 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Close button */}
                            <div className="absolute top-4 right-4">
                                <Button
                                    onClick={toggleMenu}
                                    variant="ghost"
                                    size="icon"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Menu content */}
                            <div className="flex flex-col items-center justify-center h-full space-y-8">
                                <div className="mb-8 flex justify-center">
                                    <img src={newLogo} alt="360ECOM" className="h-12 w-auto" />
                                </div>

                                {[
                                    { key: "home", path: "/" },
                                    { key: "services", path: "/services" },
                                    { key: "about", path: "/about" },
                                    { key: "clients", path: "/clients" },
                                    { key: "case-studies", path: "/case-studies" },
                                    { key: "ProjectsPage", path: "/our-projects" },
                                    { key: "academy", path: "/360academy" },
                                    { key: "testimonials", path: "/testimonials" },
                                    { key: "contact", path: "/contact" },
                                ].map((item, index) => (
                                    <motion.div key={item.key}>
                                        <Link
                                            to={item.path}
                                            className="text-2xl hover:text-blue-600 transition-colors block text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {t.nav[item.key]}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link to="/booking">
                                        <Button
                                            className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 text-lg px-8 py-3"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {t.nav.getStarted}
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

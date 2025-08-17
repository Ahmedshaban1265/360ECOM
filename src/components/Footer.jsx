import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import content from "../utils/content";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import newLogo from "@/assets/new-logo.png";

export default function Footer({ language }) {
    const t = content[language];
    const isRTL = language === "ar";

    const socialLinks = [
        { icon: <MessageCircle className="w-5 h-5" />, href: "https://wa.me/1234567890", label: "WhatsApp" },
        { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/360ecom", label: "Instagram" },
        { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/360ecom", label: "Facebook" },
        { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/360ecom", label: "LinkedIn" },
        { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/360ecom", label: "Twitter" }
    ];

    return (
        <footer className="py-12 border-t bg-muted/30">
            <div className="container mx-auto px-4">
                <ScrollAnimationWrapper>
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div>
                            <div className="mb-4">
                                <img src={newLogo} alt="360ECOM" className="h-8 w-auto" />
                            </div>
                            <p className="text-muted-foreground mb-6" lang={language}>
                                {t.footer.description}
                            </p>
                            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4" lang={language}>{t.footer.services}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link to="/services" className="hover:text-blue-600 transition-colors">E-commerce Development</Link></li>
                                <li><Link to="/services" className="hover:text-blue-600 transition-colors">Digital Marketing</Link></li>
                                <li><Link to="/services" className="hover:text-blue-600 transition-colors">Web Development</Link></li>
                                <li><Link to="/360academy" className="hover:text-blue-600 transition-colors">{language === 'ar' ? 'أكاديمية 360' : '360Academy'}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4" lang={language}>{t.footer.company}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link to="/about" className="hover:text-blue-600 transition-colors" lang={language}>{language === 'ar' ? 'من نحن' : 'About Us'}</Link></li>
                                <li><Link to="/team" className="hover:text-blue-600 transition-colors" lang={language}>{language === 'ar' ? 'فريقنا' : 'Our Team'}</Link></li>
                                <li><Link to="/contact" className="hover:text-blue-600 transition-colors" lang={language}>{language === 'ar' ? 'الوظائف' : 'Careers'}</Link></li>
                                <li><Link to="/contact" className="hover:text-blue-600 transition-colors" lang={language}>{language === 'ar' ? 'تواصل معنا' : 'Contact'}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4" lang={language}>{t.footer.connect}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="mailto:hello@360ecom.com" className="hover:text-blue-600 transition-colors">hello@360ecom.com</a></li>
                                <li><a href="tel:+1234567890" className="hover:text-blue-600 transition-colors">+1 (234) 567-890</a></li>
                                <li><span>123 Business St, City, Country</span></li>
                            </ul>
                        </div>
                    </div>
                </ScrollAnimationWrapper>

                <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                    <p lang={language}>{t.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}

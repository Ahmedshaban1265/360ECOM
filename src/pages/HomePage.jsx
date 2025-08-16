import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
    ArrowRight,
    Play,
    CheckCircle,
    Users,
    BarChart3,
    Globe,
    Zap,
    Star,
    ShoppingCart,
    TrendingUp,
    Code,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Download,
    Quote,
    Calendar,
    Award,
    Target,
    Smartphone
} from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import useCountUp from "@/hooks/useCountUp";
import content from "@/utils/content";
import heroImage from "@/assets/T5rUVexWESsO.jpeg";
import serviceImage1 from "@/assets/VuvKLBzKOhjO.jpg";
import serviceImage2 from "@/assets/AAURk47hOcIJ.webp";
import serviceImage3 from "@/assets/NEkzEGDqinT1.jpg";
import clientLogo1 from "@/assets/client-logo-1.png";
import clientLogo2 from "@/assets/client-logo-2.png";
import clientLogo3 from "@/assets/client-logo-3.png";
import clientLogo4 from "@/assets/client-logo-4.png";
import clientLogo5 from "@/assets/client-logo-5.png";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Sparkles from "@/components/ui/sparkles";
import ProfessionalCarousel from "@/components/ProfessionalCarousel";
import { Link } from "react-router-dom";

export default function HomePage({ language = "en" }) {
    const t = content[language];
    const isRTL = language === "ar";
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const { scrollYProgress } = useScroll()
    const yRange = useTransform(scrollYProgress, [0, 1], [0, -100])

    // Stats counter refs
    const statsRef = useRef(null)
    const statsInView = useInView(statsRef, { margin: "-100px" })

    useEffect(() => {
        // const handleMouseMove = (e) => {
        //   setMousePosition({ x: e.clientX, y: e.clientY })
        // }

        // window.addEventListener('mousemove', handleMouseMove)
        // return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Testimonials for carousel
    const testimonialItems = t.testimonials.items

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Hero Section - Keep exactly as is */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/20 to-purple-900/20 dark:from-emerald-900/40 dark:via-blue-900/40 dark:to-purple-900/40"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <motion.div
                    className="container mx-auto px-4 py-20 relative z-10"
                    style={{ y: yRange }}
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollAnimationWrapper>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white relative overflow-hidden group">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    <Sparkles className="w-4 h-4 mr-2 relative z-10" />
                                    <span className="relative z-10">{t.hero.badge}</span>
                                </Badge>
                            </motion.div>

                            <motion.h1
                                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                {t.hero.title}
                                <motion.span
                                    className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block"
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    {t.hero.titleHighlight}
                                </motion.span>
                                {t.hero.titleEnd}
                            </motion.h1>

                            <motion.p
                                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {t.hero.description}
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-lg px-8 relative overflow-hidden group">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                        <span className="relative z-10 flex items-center">
                                            {t.hero.ctaPrimary}
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </motion.div>
                                        </span>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" variant="outline" className="text-lg px-8 group border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Play className="mr-2 w-5 h-5" />
                                        </motion.div>
                                        {t.hero.ctaSecondary}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper delay={0.2}>
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="absolute -inset-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl opacity-20 blur-xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.2, 0.3, 0.2],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <img
                                    src={heroImage}
                                    alt="Digital Marketing Agency"
                                    className="rounded-2xl shadow-2xl w-full h-auto relative z-10"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl z-20"></div>

                                {/* Floating Stats */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-30"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-2xl font-bold text-emerald-600">+300%</div>
                                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-30"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.4 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-2xl font-bold text-blue-600">200+</div>
                                    <div className="text-sm text-muted-foreground">Projects</div>
                                </motion.div>
                            </motion.div>
                        </ScrollAnimationWrapper>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section with Counter Animation */}
            <section className="py-20 bg-muted/30" ref={statsRef}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {t.stats.map((stat, index) => {
                            const count = useCountUp(stat.number, 2000, statsInView)

                            return (
                                <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                    <motion.div
                                        className="text-center group"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                                            {count}{stat.suffix}
                                        </div>
                                        <div className="text-muted-foreground">{stat.label}</div>
                                    </motion.div>
                                </ScrollAnimationWrapper>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {t.services.badge}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.services.title}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {t.services.titleHighlight}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t.services.description}
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {t.services.items.slice(0, 3).map((service, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={index === 0 ? serviceImage1 : index === 1 ? serviceImage2 : serviceImage3}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                {index === 0 ? <ShoppingCart className="w-8 h-8" /> :
                                                    index === 1 ? <TrendingUp className="w-8 h-8" /> :
                                                        <Code className="w-8 h-8" />}
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base leading-relaxed mb-4">
                                                {service.description}
                                            </CardDescription>
                                            <div className="space-y-2 mb-4">
                                                {service.features.slice(0, 2).map((feature, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>

                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <Link to="/services">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    Explore All Services
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* About Us Preview Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollAnimationWrapper>
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {t.about.badge}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.about.title}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {t.about.titleHighlight}
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {t.about.description}
                            </p>
                            <div className="space-y-4 mb-8">
                                {t.about.features.slice(0, 3).map((feature, index) => (
                                    <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span>{feature}</span>
                                        </div>
                                    </ScrollAnimationWrapper>
                                ))}
                            </div>
                            <Link to="/about">
                                <Button className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    Learn More About Us
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper delay={0.2}>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-6 text-center">
                                    <Users className="w-8 h-8 mx-auto mb-4 text-emerald-600" />
                                    <div className="text-2xl font-bold">50+</div>
                                    <div className="text-sm text-muted-foreground">Team Members</div>
                                </Card>
                                <Card className="p-6 text-center mt-8">
                                    <Globe className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                                    <div className="text-2xl font-bold">25+</div>
                                    <div className="text-sm text-muted-foreground">Countries</div>
                                </Card>
                                <Card className="p-6 text-center">
                                    <Zap className="w-8 h-8 mx-auto mb-4 text-purple-600" />
                                    <div className="text-2xl font-bold">99%</div>
                                    <div className="text-sm text-muted-foreground">Uptime</div>
                                </Card>
                                <Card className="p-6 text-center mt-8">
                                    <BarChart3 className="w-8 h-8 mx-auto mb-4 text-emerald-600" />
                                    <div className="text-2xl font-bold">300%</div>
                                    <div className="text-sm text-muted-foreground">Avg Growth</div>
                                </Card>
                            </div>
                        </ScrollAnimationWrapper>
                    </div>
                </div>
            </section>

            {/* Our Clients Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {language === 'ar' ? 'عملاؤنا' : 'Our Clients'}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {language === 'ar' ? 'شراكات' : 'Trusted'}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {language === 'ar' ? 'استراتيجية' : 'Partnerships'}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {language === 'ar' 
                                    ? 'نفخر بالعمل مع أفضل العلامات التجارية والشركات الرائدة'
                                    : 'We are proud to work with the best brands and leading companies'
                                }
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    {/* Client Success Stories Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                metric: '300%',
                                description: language === 'ar' ? 'زيادة في المبيعات' : 'Increase in Sales',
                                client: 'TechFlow',
                                icon: <TrendingUp className="w-8 h-8 text-emerald-600" />
                            },
                            {
                                metric: '150%',
                                description: language === 'ar' ? 'نمو في ��ركة المرور' : 'Traffic Growth',
                                client: 'ShopMax',
                                icon: <BarChart3 className="w-8 h-8 text-blue-600" />
                            },
                            {
                                metric: '95%',
                                description: language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction',
                                client: 'StyleHub',
                                icon: <Star className="w-8 h-8 text-purple-600" />
                            }
                        ].map((story, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Card className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="mb-4">{story.icon}</div>
                                        <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            {story.metric}
                                        </div>
                                        <div className="text-muted-foreground mb-2">{story.description}</div>
                                        <div className="text-sm text-muted-foreground">{story.client}</div>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>

                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <Link to="/clients">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    View All Clients
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* Case Studies Preview Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {language === 'ar' ? 'دراسات الحالة' : 'Case Studies'}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {language === 'ar' ? 'نتائج' : 'Real Results for'}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {language === 'ar' ? 'حقيقية' : 'Real Businesses'}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {language === 'ar' 
                                    ? 'تعمق في مشاريعنا الأكثر نجاحاً واكتشف كيف ساعدنا الشركات'
                                    : 'Dive deep into our most successful projects and discover how we\'ve helped businesses'
                                }
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    {/* Featured Case Study */}
                    <ScrollAnimationWrapper>
                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <Badge className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                        {language === 'ar' ? 'الأزياء والتجزئة' : 'Fashion & Retail'}
                                    </Badge>
                                    <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                                        Featured
                                    </Badge>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        2024
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold mb-6">
                                    {language === 'ar' 
                                        ? 'فاشن فورورد: زيادة المبيعات 300% في 6 أشهر'
                                        : 'FashionForward: 300% Sales Increase in 6 Months'
                                    }
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {[
                                        { label: language === 'ar' ? 'المبيعات' : 'Sales', value: '+300%' },
                                        { label: language === 'ar' ? 'التحويل' : 'Conversion', value: '+45%' },
                                        { label: language === 'ar' ? 'المرور' : 'Traffic', value: '+200%' },
                                        { label: language === 'ar' ? 'الإيرادات' : 'Revenue', value: '$2.5M+' }
                                    ].map((result, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {result.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {result.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-muted/50 p-6 rounded-lg mb-6">
                                    <div className="flex items-start gap-4">
                                        <Quote className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-muted-foreground italic mb-4">
                                                "{language === 'ar' 
                                                    ? 'فريق 360ECOM حول أعمالنا بالكامل. انتقلنا من الكفاح لتحقيق المبيعات إلى أن نصبح رائدين في السوق'
                                                    : 'The team at 360ECOM transformed our business completely. We went from struggling to make sales to becoming a market leader'
                                                }"
                                            </p>
                                            <div>
                                                <div className="font-semibold">Sarah Johnson</div>
                                                <div className="text-sm text-muted-foreground">CEO, FashionForward</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="aspect-video bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center mb-6">
                                    <div className="text-6xl text-muted-foreground">
                                        <Globe />
                                    </div>
                                </div>

                                <Card className="bg-background border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {language === 'ar' ? 'تحسين المقاييس الرئيسية' : 'Key Metrics Improvement'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { label: language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue', before: '$50K', after: '$200K' },
                                                { label: language === 'ar' ? 'معدل التحويل' : 'Conversion Rate', before: '0.8%', after: '3.2%' }
                                            ].map((metric, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">{metric.label}</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">{metric.before}</span>
                                                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm font-semibold text-emerald-600">{metric.after}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </ScrollAnimationWrapper>

                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <Link to="/case-studies">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    Explore All Case Studies
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* Our Projects Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {language === 'ar' ? 'مشاريعنا' : 'Our Projects'}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {language === 'ar' ? 'محفظة' : 'Portfolio of'}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {language === 'ar' ? 'النجاح' : 'Success'}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {language === 'ar' 
                                    ? 'استكشف أحدث مشاريعنا وشاهد كيف ساعدنا الشركات على تحقيق نمو ملحوظ'
                                    : 'Explore our latest projects and see how we\'ve helped businesses achieve remarkable growth'
                                }
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    {/* Featured Projects Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                title: language === 'ar' ? 'متجر إلكتروني للأزياء الفاخرة' : 'Luxury Fashion E-commerce',
                                category: language === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce',
                                icon: <ShoppingCart className="w-8 h-8" />,
                                results: [
                                    language === 'ar' ? 'زيادة 300% في معدل التحويل' : '300% increase in conversion rate',
                                    language === 'ar' ? '2 مليون+ مستخدم نشط شهرياً' : '2M+ monthly active users'
                                ]
                            },
                            {
                                title: language === 'ar' ? 'تطبيق توصيل الطعام' : 'Food Delivery Mobile App',
                                category: language === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps',
                                icon: <Smartphone className="w-8 h-8" />,
                                results: [
                                    language === 'ar' ? 'مليون+ تحميل في الشهر الأول' : '1M+ downloads in first month',
                                    language === 'ar' ? 'تقييم 4.8/5 في متجر التطبيقات' : '4.8/5 app store rating'
                                ]
                            },
                            {
                                title: language === 'ar' ? 'لوحة تحليلات الأعمال' : 'Business Analytics Dashboard',
                                category: language === 'ar' ? 'لوحات التحكم' : 'Dashboards',
                                icon: <BarChart3 className="w-8 h-8" />,
                                results: [
                                    language === 'ar' ? 'اتخاذ قرارات أسرع بنسبة 60%' : '60% faster decision making',
                                    language === 'ar' ? 'رؤى البيانات في الوقت الفعلي' : 'Real-time data insights'
                                ]
                            }
                        ].map((project, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -10 }}>
                                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        <div className="relative h-48 bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                                            <div className="text-emerald-600">
                                                {project.icon}
                                            </div>
                                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                                                {project.category}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
                                                {project.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {project.results.map((result, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm">{result}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>

                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <Link to="/our-projects">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    View All Projects
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* Testimonials Carousel Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {t.testimonials.badge}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.testimonials.title}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {t.testimonials.titleHighlight}
                                </span>
                            </h2>
                        </div>
                    </ScrollAnimationWrapper>

                    <ScrollAnimationWrapper delay={0.2}>
                        <ProfessionalCarousel
                            items={testimonialItems.slice(0, 6)}
                            renderItem={(testimonial, isCenter) => (
                                <Card className={`p-6 border-0 shadow-lg transition-all duration-300 w-80 ${isCenter ? 'bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20' : 'bg-background'
                                    }`}>
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        />
                    </ScrollAnimationWrapper>

                    <ScrollAnimationWrapper delay={0.4}>
                        <div className="text-center mt-12">
                            <Link to="/testimonials">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    Read More Testimonials
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* Contact Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
                                {t.contact.badge}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.contact.title}
                                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                    {t.contact.titleHighlight}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t.contact.description}
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                icon: <Mail className="w-8 h-8 text-emerald-600" />,
                                title: t.contact.email,
                                info: "hello@360ecom.com",
                                bgColor: "bg-emerald-100 dark:bg-emerald-900"
                            },
                            {
                                icon: <Phone className="w-8 h-8 text-blue-600" />,
                                title: t.contact.phone,
                                info: "+1 (234) 567-890",
                                bgColor: "bg-blue-100 dark:bg-blue-900"
                            },
                            {
                                icon: <MapPin className="w-8 h-8 text-purple-600" />,
                                title: t.contact.office,
                                info: "123 Business St, City, Country",
                                bgColor: "bg-purple-100 dark:bg-purple-900"
                            }
                        ].map((contact, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className={`w-16 h-16 mx-auto mb-4 ${contact.bgColor} rounded-lg flex items-center justify-center`}>
                                            {contact.icon}
                                        </div>
                                        <h3 className="font-semibold mb-2">{contact.title}</h3>
                                        <p className="text-muted-foreground">{contact.info}</p>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>

                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <Link to="/contact">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700">
                                    Get In Touch
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>
        </div>
    )
}

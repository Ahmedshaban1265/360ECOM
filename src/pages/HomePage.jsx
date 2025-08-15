import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import {  Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
    Code
} from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import useCountUp from "@/hooks/useCountUp";
import content from "@/utils/content";
import heroImage from "@/assets/T5rUVexWESsO.jpeg";
import serviceImage1 from "@/assets/VuvKLBzKOhjO.jpg";
import serviceImage2 from "@/assets/AAURk47hOcIJ.webp";
import serviceImage3 from "@/assets/NEkzEGDqinT1.jpg";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Sparkles from "@/components/ui/sparkles";
import ProfessionalCarousel from "@/components/ProfessionalCarousel";



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

    // const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    //   id: i,
    //   x: Math.random() * 100,
    //   y: Math.random() * 100,
    //   delay: Math.random() * 2,
    //   duration: 3 + Math.random() * 2
    // }))

    // Testimonials for carousel
    const testimonialItems = t.testimonials.items

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Floating Background Elements */}
            {/* <div className="fixed inset-0 pointer-events-none z-0">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div> */}

            {/* Cursor Follower */}
            {/* <motion.div
        className="fixed w-4 h-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      /> */}

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/20 to-purple-900/20 dark:from-emerald-900/40 dark:via-blue-900/40 dark:to-purple-900/40"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGUpPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

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

                    <div className="grid lg:grid-cols-3 gap-8">
                        {t.services.items.map((service, index) => (
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
                                            <div className="space-y-2">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="ghost" className="mt-4 p-0 h-auto font-semibold group-hover:text-emerald-600">
                                                Learn More
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>
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
                            items={testimonialItems}
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
                </div>
            </section>
        </div>
    )
}

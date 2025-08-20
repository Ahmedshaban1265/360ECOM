import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Users,
    Star,
    BookOpen,
    Code,
    TrendingUp,
    Target,
    Award,
    Play,
    Download,
    Calendar,
    Laptop,
    ShoppingCart,
    BarChart3,
    Globe,
    Zap
} from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

export default function AcademyPage({ language = "en" }) {
    useLivePublishedEdits('360academy');
    const isRTL = language === "ar";

    const content = {
        en: {
            hero: {
                badge: "360Academy",
                title: "Master Your Skills with",
                titleHighlight: "Professional Courses",
                description: "Transform your career with our comprehensive courses designed by industry experts. Learn the skills that matter in today's digital economy.",
                ctaPrimary: "Explore All Courses",
                ctaSecondary: "Download Brochure"
            },
            stats: [
                { number: 5000, suffix: "+", label: "Students Enrolled" },
                { number: 95, suffix: "%", label: "Completion Rate" },
                { number: 50, suffix: "+", label: "Expert Instructors" },
                { number: 4.9, suffix: "/5", label: "Average Rating" }
            ],
            courses: {
                badge: "Our Courses",
                title: "Industry-Leading",
                titleHighlight: "Training Programs",
                description: "Each course is carefully crafted to provide hands-on experience and real-world skills that employers are looking for.",
                items: [
                    {
                        title: "Shopify Development",
                        description: "Master the art of building high-converting Shopify stores with our comprehensive development course.",
                        duration: "12 weeks",
                        level: "Intermediate",
                        students: "2,500+",
                        rating: 4.9,
                        price: "$599",
                        originalPrice: "$799",
                        image: "shopify",
                        icon: <ShoppingCart className="w-8 h-8" />,
                        features: [
                            "Custom theme development",
                            "App integration and customization",
                            "Performance optimization",
                            "Payment gateway setup",
                            "SEO best practices",
                            "Real-world projects"
                        ],
                        highlights: [
                            "Build 5 complete Shopify stores",
                            "Learn advanced Liquid templating",
                            "Master Shopify API integration",
                            "Get certified upon completion"
                        ]
                    },
                    {
                        title: "Digital Marketing",
                        description: "Learn to create and execute winning marketing campaigns that drive real business results.",
                        duration: "10 weeks",
                        level: "Beginner to Advanced",
                        students: "3,200+",
                        rating: 4.8,
                        price: "$499",
                        originalPrice: "$699",
                        image: "marketing",
                        icon: <TrendingUp className="w-8 h-8" />,
                        features: [
                            "Social media marketing strategy",
                            "Google Ads & Facebook Ads",
                            "Content marketing",
                            "Email marketing automation",
                            "Analytics and reporting",
                            "Campaign optimization"
                        ],
                        highlights: [
                            "Launch real marketing campaigns",
                            "Work with actual client projects",
                            "Learn advanced targeting",
                            "Get Google Ads certification"
                        ]
                    },
                    {
                        title: "Media Buying",
                        description: "Become a media buying expert and learn to optimize ad spend for maximum ROI across all platforms.",
                        duration: "8 weeks",
                        level: "Advanced",
                        students: "1,800+",
                        rating: 4.9,
                        price: "$699",
                        originalPrice: "$899",
                        image: "media-buying",
                        icon: <Target className="w-8 h-8" />,
                        features: [
                            "Advanced Facebook Ads",
                            "Google Ads optimization",
                            "Cross-platform campaigns",
                            "Budget management",
                            "Creative testing",
                            "ROI optimization"
                        ],
                        highlights: [
                            "Manage $50K+ ad budgets",
                            "Master advanced targeting",
                            "Learn scaling strategies",
                            "Work with real campaigns"
                        ]
                    },
                    {
                        title: "Shopify Basics",
                        description: "Perfect starting point for entrepreneurs wanting to launch their first successful online store.",
                        duration: "6 weeks",
                        level: "Beginner",
                        students: "4,100+",
                        rating: 4.7,
                        price: "$299",
                        originalPrice: "$399",
                        image: "shopify-basics",
                        icon: <BookOpen className="w-8 h-8" />,
                        features: [
                            "Store setup and configuration",
                            "Product catalog management",
                            "Basic theme customization",
                            "Order management",
                            "Customer service setup",
                            "Launch strategy"
                        ],
                        highlights: [
                            "Launch your first store",
                            "Learn essential tools",
                            "Master basic operations",
                            "Get ongoing support"
                        ]
                    }
                ]
            },
            benefits: {
                title: "Why Choose",
                titleHighlight: "360Academy",
                items: [
                    {
                        icon: <Award className="w-8 h-8 text-yellow-600" />,
                        title: "Industry Certification",
                        description: "Get recognized certificates that employers value"
                    },
                    {
                        icon: <Users className="w-8 h-8 text-blue-600" />,
                        title: "Expert Instructors",
                        description: "Learn from professionals with years of industry experience"
                    },
                    {
                        icon: <Laptop className="w-8 h-8 text-green-600" />,
                        title: "Hands-on Projects",
                        description: "Build real projects that showcase your skills to employers"
                    },
                    {
                        icon: <Clock className="w-8 h-8 text-purple-600" />,
                        title: "Flexible Learning",
                        description: "Study at your own pace with lifetime access to materials"
                    }
                ]
            },
            cta: {
                title: "Ready to Transform Your Career?",
                description: "Join thousands of successful graduates who have transformed their careers with 360Academy",
                primaryButton: "Enroll Now",
                secondaryButton: "Book Free Consultation"
            }
        },
        ar: {
            hero: {
                badge: "أكاديمية 360",
                title: "أتقن مهاراتك ��ع",
                titleHighlight: "الدورات الاحترافية",
                description: "غيّر مسارك المهني مع دوراتنا الشاملة المصممة من قبل خبراء الصناعة. تعلم المهارات المهمة في الاقتصاد الرقمي اليوم.",
                ctaPrimary: "استكشف جميع الدورات",
                ctaSecondary: "تحميل الكتيب"
            },
            stats: [
                { number: 5000, suffix: "+", label: "طالب مسجل" },
                { number: 95, suffix: "%", label: "معدل الإتمام" },
                { number: 50, suffix: "+", label: "مدرب خبير" },
                { number: 4.9, suffix: "/5", label: "التقييم المتوسط" }
            ],
            courses: {
                badge: "دوراتنا",
                title: "برامج تدريبية",
                titleHighlight: "رائدة في الصناعة",
                description: "كل دورة مصممة بعناية لتوفير خبرة عملية ومهارات حقيقية يبحث عنها أصحاب العمل.",
                items: [
                    {
                        title: "تطوير شوبيفاي",
                        description: "أتقن فن بناء متاجر شوبيفاي عالية التحويل مع دورتنا الشاملة في التطوير.",
                        duration: "12 أسبوع",
                        level: "متوسط",
                        students: "2,500+",
                        rating: 4.9,
                        price: "$599",
                        originalPrice: "$799",
                        image: "shopify",
                        icon: <ShoppingCart className="w-8 h-8" />,
                        features: [
                            "تطوير قوالب مخصصة",
                            "تكامل وتخصيص التطبيقات",
                            "تحسين الأداء",
                            "إعداد بوابات الدفع",
                            "أفضل ممارسات السيو",
                            "مشاريع عملية"
                        ],
                        highlights: [
                            "بناء 5 متاجر شوبيفاي كاملة",
                            "تعلم قوالب Liquid المتقدمة",
                            "إتقان تكامل API شوبيفاي",
                            "احصل على شهادة عند الإتمام"
                        ]
                    },
                    {
                        title: "التسويق الرقمي",
                        description: "تعلم إنشاء وتنفيذ حملات تسويقية ناجحة تحقق نتائج أعمال حقيقية.",
                        duration: "10 أسابيع",
                        level: "مبتدئ إلى متقدم",
                        students: "3,200+",
                        rating: 4.8,
                        price: "$499",
                        originalPrice: "$699",
                        image: "marketing",
                        icon: <TrendingUp className="w-8 h-8" />,
                        features: [
                            "استراتيجية تسويق وسائل التواصل",
                            "إعلانات جوجل وفيسبوك",
                            "تسويق المحتوى",
                            "أتمتة التسويق بالبريد الإلكتروني",
                            "التحليلات والتقارير",
                            "تحسين الحملات"
                        ],
                        highlights: [
                            "إطلاق حملات تسويقية حقيقية",
                            "العمل مع مشاريع عملاء فعلية",
                            "تعلم الاستهداف المتقدم",
                            "احصل على شهادة جوجل آدز"
                        ]
                    },
                    {
                        title: "شراء الوسائط",
                        description: "كن خبيراً في شراء الوسائط وتعلم تحسين إنفاق الإعلانات لتحقيق أقصى عائد استثمار.",
                        duration: "8 أسابيع",
                        level: "متقدم",
                        students: "1,800+",
                        rating: 4.9,
                        price: "$699",
                        originalPrice: "$899",
                        image: "media-buying",
                        icon: <Target className="w-8 h-8" />,
                        features: [
                            "إعلانات فيسبوك المتقدمة",
                            "تحسين إعلانات جوجل",
                            "حملات متعددة المنصات",
                            "إدارة الميزانية",
                            "اختبار الإبداعات",
                            "تحسين العائد على الاستثمار"
                        ],
                        highlights: [
                            "إدارة ميزانيات إعلانية +50 ألف$",
                            "إتقان الاستهداف المتقدم",
                            "تعلم استراتيجيات التوسع",
                            "العمل مع حملات حقيقية"
                        ]
                    },
                    {
                        title: "أساسيات شوبيفاي",
                        description: "نقطة البداية المثالية لرواد الأعمال الذين يريدون إطلاق متجرهم الإلكتروني الأول بنجاح.",
                        duration: "6 أسابيع",
                        level: "مبتدئ",
                        students: "4,100+",
                        rating: 4.7,
                        price: "$299",
                        originalPrice: "$399",
                        image: "shopify-basics",
                        icon: <BookOpen className="w-8 h-8" />,
                        features: [
                            "إعداد وتكوين المتجر",
                            "إدارة كتالوج المنتجات",
                            "تخصيص القالب الأساسي",
                            "إدارة الطلبات",
                            "إعداد خدمة العملاء",
                            "استراتيجية الإطلاق"
                        ],
                        highlights: [
                            "أطلق متجرك الأول",
                            "تعلم الأدوات الأساسية",
                            "أتقن العمليات الأساسية",
                            "احصل على دعم مستمر"
                        ]
                    }
                ]
            },
            benefits: {
                title: "لماذا تختار",
                titleHighlight: "أكاديمية 360",
                items: [
                    {
                        icon: <Award className="w-8 h-8 text-yellow-600" />,
                        title: "شهادة معتمدة من الصناعة",
                        description: "احصل على شهادات معترف بها يقدرها أصحاب العمل"
                    },
                    {
                        icon: <Users className="w-8 h-8 text-blue-600" />,
                        title: "مدربون خبراء",
                        description: "تعلم من محترفين لديهم سنوات من الخبرة في الصناعة"
                    },
                    {
                        icon: <Laptop className="w-8 h-8 text-green-600" />,
                        title: "مشاريع عملية",
                        description: "اعمل على مشاريع حقيقية تعرض مهاراتك لأصحاب العمل"
                    },
                    {
                        icon: <Clock className="w-8 h-8 text-purple-600" />,
                        title: "تعلم مرن",
                        description: "ادرس بوتيرتك الخاصة مع وصول مدى الحياة للمواد"
                    }
                ]
            },
            cta: {
                title: "مستعد لتغيير مسارك المهني؟",
                description: "انضم إلى آلاف الخريجين الناجحين الذين غيروا مسارهم المهني مع أكاديمية 360",
                primaryButton: "سجل الآن",
                secondaryButton: "احجز استشارة مجانية"
            }
        }
    };

    const t = content[language];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 "></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <motion.div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="text-center">
                        <ScrollAnimationWrapper>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Badge className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black mb-6">
                                    {t.hero.badge}
                                </Badge>
                            </motion.div>

                            <motion.h1
                                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                lang={language}
                                dir={isRTL ? "rtl" : "ltr"}
                            >
                                {t.hero.title}
                                <motion.span
                                    className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block"
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
                            </motion.h1>

                            <motion.p
                                className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                lang={language}
                                dir={isRTL ? "rtl" : "ltr"}
                            >
                                {t.hero.description}
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 text-lg px-8 relative overflow-hidden group">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                                    <Button size="lg" variant="outline" className="text-lg px-8 group border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                                        <Download className="mr-2 w-5 h-5" />
                                        {t.hero.ctaSecondary}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </ScrollAnimationWrapper>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {t.stats.map((stat, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div
                                    className="text-center group"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                                        {stat.number}{stat.suffix}
                                    </div>
                                    <div className="text-muted-foreground" lang={language}>{stat.label}</div>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                                {t.courses.badge}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6" lang={language} dir={isRTL ? "rtl" : "ltr"}>
                                {t.courses.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block">
                                    {t.courses.titleHighlight}
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" lang={language} dir={isRTL ? "rtl" : "ltr"}>
                                {t.courses.description}
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {t.courses.items.map((course, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 dark:from-blue-900/20 dark:via-blue-600/20 dark:to-blue-400/20 flex items-center justify-center">
                                            <div className="text-blue-600 group-hover:scale-110 transition-transform">
                                                {course.icon}
                                            </div>
                                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                                                {course.level}
                                            </Badge>
                                            {course.originalPrice && (
                                                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                                                    -{Math.round(((parseFloat(course.originalPrice.replace('$', '')) - parseFloat(course.price.replace('$', ''))) / parseFloat(course.originalPrice.replace('$', ''))) * 100)}%
                                                </Badge>
                                            )}
                                        </div>

                                        <CardHeader>
                                            <div className="flex items-center justify-between mb-2">
                                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors" lang={language}>
                                                    {course.title}
                                                </CardTitle>
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {course.students}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="text-base leading-relaxed mb-4" lang={language}>
                                                {course.description}
                                            </CardDescription>

                                            <div className="mb-4">
                                                <h4 className="font-semibold mb-2" lang={language}>
                                                    {language === 'ar' ? 'المميزات الرئيسية:' : 'Key Features:'}
                                                </h4>
                                                <div className="space-y-2">
                                                    {course.features.slice(0, 3).map((feature, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2">
                                                            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                            <span className="text-sm" lang={language}>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2" lang={language}>
                                                    {language === 'ar' ? 'النقاط المميزة:' : 'Course Highlights:'}
                                                </h4>
                                                <div className="space-y-2">
                                                    {course.highlights.slice(0, 2).map((highlight, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2">
                                                            <Zap className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                                            <span className="text-sm font-medium" lang={language}>{highlight}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                                                    {course.originalPrice && (
                                                        <span className="text-lg text-muted-foreground line-through">{course.originalPrice}</span>
                                                    )}
                                                </div>
                                                <Button className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400">
                                                    <span lang={language}>{language === 'ar' ? 'سجل الآن' : 'Enroll Now'}</span>
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6" lang={language} dir={isRTL ? "rtl" : "ltr"}>
                                {t.benefits.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block">
                                    {t.benefits.titleHighlight}
                                </span>
                            </h2>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {t.benefits.items.map((benefit, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                        <div className="mb-4">
                                            {benefit.icon}
                                        </div>
                                        <h3 className="font-semibold mb-2" lang={language}>{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground" lang={language}>{benefit.description}</p>
                                    </Card>
                                </motion.div>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6" lang={language} dir={isRTL ? "rtl" : "ltr"}>
                                {t.cta.title}
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" lang={language} dir={isRTL ? "rtl" : "ltr"}>
                                {t.cta.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contact">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 text-lg px-8">
                                        <span lang={language}>{t.cta.primaryButton}</span>
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/booking">
                                    <Button size="lg" variant="outline" className="text-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                                        <Calendar className="mr-2 w-5 h-5" />
                                        <span lang={language}>{t.cta.secondaryButton}</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>
        </div>
    );
}

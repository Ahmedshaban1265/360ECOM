import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import content from '../utils/content';
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

export default function BookingPage({ language = 'en' }) {
    useLivePublishedEdits('booking');
    // const t = content[language];
    // const isRTL = language === 'ar';

    const packages = [
        {
            name: language === 'en' ? 'Starter Consultation' : 'استشارة البداية',
            price: language === 'en' ? '$149' : '149$',
            duration: language === 'en' ? '60 minutes' : '60 دقيقة',
            description: language === 'en' 
                ? 'Perfect for new businesses looking to establish their digital presence'
                : 'مثالي للشركات الجديدة التي تتطلع إلى تأسيس حضورها الرقمي',
            features: language === 'en' 
                ? [
                    'Business assessment',
                    'Digital strategy overview',
                    'Platform recommendations',
                    'Next steps roadmap',
                    'Q&A session'
                ]
                : [
                    'تقييم الأعمال',
                    'نظرة عامة على الاستراتيجية الرقمية',
                    'توصيات المنصة',
                    'خارطة طريق الخطوات التالية',
                    'جلسة أسئلة وأجوبة'
                ],
            icon: Users,
            gradient: 'from-emerald-500 to-teal-600',
            popular: false
        },
        {
            name: language === 'en' ? 'Growth Strategy Session' : 'جلسة استراتيجية النمو',
            price: language === 'en' ? '$299' : '299$',
            duration: language === 'en' ? '90 minutes' : '90 دقيقة',
            description: language === 'en' 
                ? 'Comprehensive growth planning for established businesses'
                : 'تخطيط نمو شامل للشركات الراسخة',
            features: language === 'en' 
                ? [
                    'In-depth business analysis',
                    'Custom growth strategy',
                    'Marketing plan development',
                    'Technical audit',
                    'Implementation timeline',
                    '30-day follow-up'
                ]
                : [
                    'تحليل متعمق للأعمال',
                    'استراتيجية نمو مخصصة',
                    'تطوير خطة التسويق',
                    'تدقيق تقني',
                    'جدول زمني للتنفيذ',
                    'متابعة 30 يوم'
                ],
            icon: Zap,
            gradient: 'from-blue-500 to-purple-600',
            popular: true
        },
        {
            name: language === 'en' ? 'Enterprise Solutions' : 'حلول المؤسسات',
            price: language === 'en' ? '$499' : '499$',
            duration: language === 'en' ? '2 hours' : 'ساعتان',
            description: language === 'en' 
                ? 'Advanced consultation for large-scale e-commerce operations'
                : 'استشارة متقدمة لعمليات التجارة الإلكترونية واسعة النطاق',
            features: language === 'en' 
                ? [
                    'Enterprise-level assessment',
                    'Multi-channel strategy',
                    'Technology stack planning',
                    'Team training overview',
                    'ROI projections',
                    'Dedicated account manager',
                    '60-day implementation support'
                ]
                : [
                    'تقييم على مستوى المؤسسة',
                    'استراتيجية متعددة القنوات',
                    'تخطيط مجموعة التكنولوجيا',
                    'نظرة عامة على تدريب الفريق',
                    'توقعات العائد على الاستثمار',
                    'مدير حساب مخصص',
                    'دعم التنفيذ لمدة 60 يوم'
                ],
            icon: Clock,
            gradient: 'from-purple-500 to-pink-600',
            popular: false
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-12"
                    >
                        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300  mb-6">
                            <span className="text-sm font-medium bg-black bg-clip-text text-transparent">
                                {language === 'en' ? 'Book Your Consultation' : 'احجز استشارتك'}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {language === 'en' ? 'Choose Your' : 'اختر'}{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent">
                                {language === 'en' ? 'Growth Path' : 'مسار نموك'}
                            </span>
                        </h1>
                        
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {language === 'en' 
                                ? 'Get expert guidance tailored to your business needs. Choose the consultation package that fits your goals and start your journey to e-commerce success.'
                                : 'احصل على إرشادات الخبراء المصممة خصيصاً لاحتياجات عملك. اختر حزمة الاستشارة التي تناسب أهدافك وابدأ رحلتك نحو نجاح التجارة الإلكترونية.'
                            }
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="pb-20 px-4">
                <div className="container mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    >
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative"
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black px-4 py-1 rounded-full text-sm font-medium">
                                            {language === 'en' ? 'Most Popular' : 'الأكثر شعبية'}
                                        </div>
                                    </div>
                                )}
                                
                                <Card className={`p-8 h-full transition-all duration-300 hover:shadow-2xl border-2 ${
                                    pkg.popular 
                                        ? 'border-blue-600/50 shadow-lg' 
                                        : 'border-border hover:border-emerald-600/30'
                                }`}>
                                    <div className="text-center mb-6">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${pkg.gradient} mb-4`}>
                                            <pkg.icon className="w-8 h-8 text-white" />
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                        <p className="text-muted-foreground mb-4">{pkg.description}</p>
                                        
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <span className="text-4xl font-bold">{pkg.price}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {pkg.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-300 flex items-center justify-center mt-0.5">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button 
                                            className={`w-full ${
                                                pkg.popular
                                                    ? 'bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 hover:from-blue-800 hover:via-blue-700 hover:to-blue-600 cursor-pointer'
                                                    : 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 cursor-pointer'
                                            } text-white border-0`}
                                            size="lg"
                                        >
                                            {language === 'en' ? 'Book Now' : 'احجز الآن'}
                                        </Button>
                                    </motion.div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {language === 'en' ? 'Not sure which package is right for you?' : 'لست متأكد من الحزمة المناسبة لك؟'}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            {language === 'en' 
                                ? 'Contact our team for a free 15-minute discovery call to help you choose the perfect consultation package.'
                                : 'تواصل مع فريقنا للحصول على مكالمة استكشافية مجانية لمدة 15 دقيقة لمساعدتك في اختيار حزمة الاستشارة المثالية.'
                            }
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                variant="outline" 
                                size="lg"
                                className="border-2 cursor-pointer text-blue-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                            >
                                {language === 'en' ? 'Schedule Free Call' : 'جدولة مكالمة مجانية'}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

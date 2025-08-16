import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Code, ShoppingCart, TrendingUp } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { motion } from "framer-motion";
import content from "@/utils/content";

// Import images
import serviceImage1 from "@/assets/VuvKLBzKOhjO.jpg";
import serviceImage2 from "@/assets/AAURk47hOcIJ.webp";
import serviceImage3 from "@/assets/NEkzEGDqinT1.jpg";

export default function ServicesPage({ language }) {
    const t = content[language];
    const isRTL = language === 'ar';

    const services = [
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: t.services.items[0].title,
            description: t.services.items[0].description,
            image: serviceImage1,
            features: t.services.items[0].features
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: t.services.items[1].title,
            description: t.services.items[1].description,
            image: serviceImage2,
            features: t.services.items[1].features
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: t.services.items[2].title,
            description: t.services.items[2].description,
            image: serviceImage3,
            features: t.services.items[2].features
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
                                {t.services.badge}
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.services.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent block">
                                    {t.services.titleHighlight}
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t.services.description}
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -10 }} className="group">
                                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                {service.icon}
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
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
                                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="mt-4 p-0 h-auto font-semibold group-hover:text-blue-600"
                                            >
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
        </div>
    );
}

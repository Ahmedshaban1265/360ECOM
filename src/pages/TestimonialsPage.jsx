import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { motion } from "framer-motion";
import content from "@/utils/content";
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

export default function TestimonialsPage({ language }) {
    useLivePublishedEdits('testimonials');
    const t = content[language];
    const isRTL = language === "ar";

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                                {t.testimonials.badge}
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.testimonials.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block">
                                    {t.testimonials.titleHighlight}
                                </span>
                            </h1>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {t.testimonials.items.map((testimonial, index) => (
                            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                <motion.div whileHover={{ y: -5 }}>
                                    <Card className="h-full p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="flex mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            "{testimonial.text}"
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{testimonial.name}</div>
                                                <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                                            </div>
                                        </div>
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

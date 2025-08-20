import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Globe, Zap, BarChart3, CheckCircle } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import content from "@/utils/content";
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

export default function AboutPage({ language }) {
    useLivePublishedEdits('about');
    const t = content[language];
    const isRTL = language === "ar";

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollAnimationWrapper>
                            <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                                {t.about.badge}
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.about.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block">
                                    {t.about.titleHighlight}
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {t.about.description}
                            </p>
                            <div className="space-y-4">
                                {t.about.features.map((feature, index) => (
                                    <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span>{feature}</span>
                                        </div>
                                    </ScrollAnimationWrapper>
                                ))}
                            </div>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper delay={0.2}>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-6 text-center">
                                    <Users className="w-8 h-8 mx-auto mb-4 text-blue-600" />
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
                                    <BarChart3 className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                                    <div className="text-2xl font-bold">300%</div>
                                    <div className="text-sm text-muted-foreground">Avg Growth</div>
                                </Card>
                            </div>
                        </ScrollAnimationWrapper>
                    </div>
                </div>
            </section>
        </div>
    );
}

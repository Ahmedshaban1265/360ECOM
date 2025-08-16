import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import content from "@/utils/content";

export default function ContactPage({ language }) {
    const t = content[language];
    const isRTL = language === "ar";

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScrollAnimationWrapper>
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                                {t.contact.badge}
                            </Badge>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                {t.contact.title}
                                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent block">
                                    {t.contact.titleHighlight}
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                {t.contact.description}
                            </p>
                        </div>
                    </ScrollAnimationWrapper>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <ScrollAnimationWrapper>
                            <Card className="p-8 border-0 shadow-lg">
                                <h3 className="text-2xl font-bold mb-6">{t.contact.getInTouch}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{t.contact.email}</div>
                                            <div className="text-muted-foreground">hello@360ecom.com</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{t.contact.phone}</div>
                                            <div className="text-muted-foreground">+1 (234) 567-890</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{t.contact.office}</div>
                                            <div className="text-muted-foreground">123 Business St, City, Country</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </ScrollAnimationWrapper>

                        <ScrollAnimationWrapper delay={0.2}>
                            <Card className="p-8 border-0 shadow-lg">
                                <h3 className="text-2xl font-bold mb-6">{t.contact.sendMessage}</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.contact.firstName}</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.contact.lastName}</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t.contact.email}</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t.contact.message}</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder={t.contact.messagePlaceholder}
                                        ></textarea>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-blue-700 hover:via-blue-500 hover:to-blue-400 text-lg py-3">
                                        {t.contact.sendBtn}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </form>
                            </Card>
                        </ScrollAnimationWrapper>
                    </div>
                </div>
            </section>
        </div>
    );
}

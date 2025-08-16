import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  ArrowRight,
  TrendingUp,
  Users,
  ShoppingCart,
  Globe,
  BarChart3,
  Target,
  Award,
  CheckCircle,
  Calendar,
  Clock,
  ExternalLink,
  Download,
  Play,
  Star,
  Quote
} from 'lucide-react'

const content = {
  en: {
    hero: {
      badge: "Case Studies",
      title: "Real Results for",
      titleHighlight: "Real Businesses",
      description: "Dive deep into our most successful projects and discover how we've helped businesses achieve extraordinary growth through strategic digital solutions."
    },
    caseStudies: [
      {
        id: 1,
        title: "FashionForward: 300% Sales Increase in 6 Months",
        client: "FashionForward",
        industry: "Fashion & Retail",
        duration: "6 months",
        year: "2024",
        featured: true,
        challenge: "FashionForward was struggling with low online sales and poor user experience on their existing e-commerce platform. Their conversion rate was below 1% and they were losing customers to competitors.",
        solution: "We redesigned their entire e-commerce experience using Shopify Plus, implemented advanced analytics, optimized their product pages, and created a comprehensive digital marketing strategy.",
        results: {
          sales: "+300%",
          conversion: "+45%",
          traffic: "+200%",
          revenue: "$2.5M+"
        },
        testimonial: {
          text: "The team at 360ECOM transformed our business completely. We went from struggling to make sales to becoming a market leader in our niche.",
          author: "Sarah Johnson",
          position: "CEO, FashionForward"
        },
        technologies: ["Shopify Plus", "React", "Google Analytics", "Facebook Ads"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "Monthly Revenue", before: "$50K", after: "$200K" },
          { label: "Conversion Rate", before: "0.8%", after: "3.2%" },
          { label: "Average Order Value", before: "$45", after: "$78" },
          { label: "Customer Retention", before: "25%", after: "65%" }
        ]
      },
      {
        id: 2,
        title: "TechStart: From Startup to Industry Leader",
        client: "TechStart Inc.",
        industry: "Technology",
        duration: "8 months",
        year: "2023",
        featured: true,
        challenge: "TechStart needed a complete digital presence overhaul to establish credibility and generate qualified leads for their B2B SaaS platform.",
        solution: "We created a comprehensive digital strategy including a new website, content marketing, SEO optimization, and lead generation campaigns across multiple channels.",
        results: {
          leads: "+450%",
          traffic: "+320%",
          conversions: "+280%",
          revenue: "$1.8M+"
        },
        testimonial: {
          text: "360ECOM didn't just build us a website, they built us a growth engine. Our lead quality and quantity have never been better.",
          author: "Michael Chen",
          position: "Founder, TechStart Inc."
        },
        technologies: ["React", "Next.js", "HubSpot", "Google Ads"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "Monthly Leads", before: "50", after: "275" },
          { label: "Website Traffic", before: "5K", after: "21K" },
          { label: "Lead Quality Score", before: "6/10", after: "9/10" },
          { label: "Sales Cycle", before: "90 days", after: "45 days" }
        ]
      },
      {
        id: 3,
        title: "HealthPlus: Mobile App Success Story",
        client: "HealthPlus",
        industry: "Healthcare",
        duration: "10 months",
        year: "2023",
        featured: false,
        challenge: "HealthPlus wanted to digitize their healthcare services and provide patients with easy access to consultations and health records through a mobile app.",
        solution: "We developed a comprehensive mobile application with telemedicine features, appointment booking, health records management, and secure payment processing.",
        results: {
          downloads: "100K+",
          rating: "4.9/5",
          retention: "88%",
          consultations: "50K+"
        },
        testimonial: {
          text: "The app has revolutionized how we serve our patients. The user experience is exceptional and our patient satisfaction has skyrocketed.",
          author: "Dr. Amanda Rodriguez",
          position: "Medical Director, HealthPlus"
        },
        technologies: ["React Native", "Node.js", "MongoDB", "Stripe"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "App Downloads", before: "0", after: "100K+" },
          { label: "Patient Satisfaction", before: "7.2/10", after: "9.6/10" },
          { label: "Consultation Time", before: "45 min", after: "25 min" },
          { label: "Revenue Growth", before: "0%", after: "+180%" }
        ]
      }
    ],
    process: {
      title: "Our Case Study Process",
      subtitle: "How We Deliver Measurable Results",
      steps: [
        {
          number: "01",
          title: "Discovery & Analysis",
          description: "Deep dive into business challenges, market analysis, and goal setting."
        },
        {
          number: "02",
          title: "Strategy Development",
          description: "Create comprehensive strategy with clear KPIs and success metrics."
        },
        {
          number: "03",
          title: "Implementation",
          description: "Execute the strategy with regular monitoring and optimization."
        },
        {
          number: "04",
          title: "Results & Optimization",
          description: "Measure results, optimize performance, and scale successful tactics."
        }
      ]
    },
    cta: {
      title: "Ready to Become Our Next Success Story?",
      description: "Let's discuss how we can help you achieve similar results for your business.",
      button: "Start Your Success Story",
      contact: "Download Full Case Studies"
    }
  },
  ar: {
    hero: {
      badge: "دراسات الحالة",
      title: "نتائج حقيقية",
      titleHighlight: "لأعمال حقيقية",
      description: "تعمق في مشاريعنا الأكثر نجاحاً واكتشف كيف ساعدنا الشركات في تحقيق نمو استثنائي من خلال الحلول الرقمية الاستراتيجية."
    },
    caseStudies: [
      {
        id: 1,
        title: "فاشن فورورد: زيادة المبيعات 300% في 6 أشهر",
        client: "فاشن فورورد",
        industry: "الأزياء والتجزئة",
        duration: "6 أشهر",
        year: "2024",
        featured: true,
        challenge: "كانت فاشن فورورد تعاني من انخفاض المبيعات عبر الإنترنت وضعف تجربة المستخدم على منصة التجارة الإلكترونية الحالية. كان معدل التحويل أقل من 1% وكانوا يفقدون العملاء للمنافسين.",
        solution: "أعدنا تصميم تجربة التجارة الإلكترونية بالكامل باستخدام Shopify Plus، وطبقنا تحليلات متقدمة، وحسنا صفحات المنتجات، وأنشأنا استراتيجية تسويق رقمي شاملة.",
        results: {
          sales: "+300%",
          conversion: "+45%",
          traffic: "+200%",
          revenue: "2.5 مليون$+"
        },
        testimonial: {
          text: "فريق 360ECOM حول أعمالنا بالكامل. انتقلنا من الكفاح لتحقيق المبيعات إلى أن نصبح رائدين في السوق في مجالنا.",
          author: "سارة جونسون",
          position: "الرئيس التنفيذي، فاشن فورورد"
        },
        technologies: ["Shopify Plus", "React", "Google Analytics", "Facebook Ads"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "الإيرادات الشهرية", before: "50 ألف$", after: "200 ألف$" },
          { label: "معدل التحويل", before: "0.8%", after: "3.2%" },
          { label: "متوسط قيمة الطلب", before: "45$", after: "78$" },
          { label: "الاحتفاظ بالعملاء", before: "25%", after: "65%" }
        ]
      },
      {
        id: 2,
        title: "تك ستارت: من شركة ناشئة إلى رائد في الصناعة",
        client: "تك ستارت",
        industry: "التكنولوجيا",
        duration: "8 أشهر",
        year: "2023",
        featured: true,
        challenge: "احتاجت تك ستارت إلى إصلاح شامل للحضور الرقمي لتأسيس المصداقية وتوليد عملاء محتملين مؤهلين لمنصة SaaS الخاصة بهم.",
        solution: "أنشأنا استراتيجية رقمية شاملة تشمل موقع ويب جديد وتسويق المحتوى وتحسين محركات البحث وحملات توليد العملاء المحتملين عبر قنوات متعددة.",
        results: {
          leads: "+450%",
          traffic: "+320%",
          conversions: "+280%",
          revenue: "1.8 مليون$+"
        },
        testimonial: {
          text: "360ECOM لم يبنوا لنا موقعاً فحسب، بل بنوا لنا محرك نمو. جودة وكمية العملاء المحتملين لم تكن أفضل من أي وقت مضى.",
          author: "مايكل تشين",
          position: "المؤسس، تك ستارت"
        },
        technologies: ["React", "Next.js", "HubSpot", "Google Ads"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "العملاء المحتملون الشهريون", before: "50", after: "275" },
          { label: "زيارات الموقع", before: "5 آلاف", after: "21 ألف" },
          { label: "نقاط جودة العملاء المحتملين", before: "6/10", after: "9/10" },
          { label: "دورة المبيعات", before: "90 يوم", after: "45 يوم" }
        ]
      },
      {
        id: 3,
        title: "هيلث بلس: قصة نجاح تطبيق الجوال",
        client: "هيلث بلس",
        industry: "الرعاية الصحية",
        duration: "10 أشهر",
        year: "2023",
        featured: false,
        challenge: "أرادت هيلث بلس رقمنة خدمات الرعاية الصحية وتوفير وصول سهل للمرضى للاستشارات والسجلات الصحية من خلال تطبيق جوال.",
        solution: "طورنا تطبيق جوال شامل مع ميزات الطب عن بُعد وحجز المواعيد وإدارة السجلات الصحية ومعالجة الدفع الآمنة.",
        results: {
          downloads: "100 ألف+",
          rating: "4.9/5",
          retention: "88%",
          consultations: "50 ألف+"
        },
        testimonial: {
          text: "التطبيق أحدث ثورة في طريقة خدمة مرضانا. تجربة المستخدم استثنائية ورضا المرضى ارتفع بشكل كبير.",
          author: "د. أماندا رودريجيز",
          position: "المدير الطبي، هيلث بلس"
        },
        technologies: ["React Native", "Node.js", "MongoDB", "Stripe"],
        image: "/api/placeholder/800/500",
        metrics: [
          { label: "تحميلات التطبيق", before: "0", after: "100 ألف+" },
          { label: "رضا المرضى", before: "7.2/10", after: "9.6/10" },
          { label: "وقت الاستشارة", before: "45 دقيقة", after: "25 دقيقة" },
          { label: "نمو الإيرادات", before: "0%", after: "+180%" }
        ]
      }
    ],
    process: {
      title: "عملية دراسة الحالة لدينا",
      subtitle: "كيف نحقق نتائج قابلة للقياس",
      steps: [
        {
          number: "01",
          title: "الاكتشاف والتحليل",
          description: "تعمق في تحديات الأعمال وتحليل السوق ووضع الأهداف."
        },
        {
          number: "02",
          title: "تطوير الاستراتيجية",
          description: "إنشاء استراتيجية شاملة مع مؤشرات أداء رئيسية واضحة ومقاييس نجاح."
        },
        {
          number: "03",
          title: "التنفيذ",
          description: "تنفيذ الاستراتيجية مع المراقبة والتحسين المنتظم."
        },
        {
          number: "04",
          title: "النتائج والتحسين",
          description: "قياس النتائج وتحسين الأداء وتوسيع التكتيكات الناجحة."
        }
      ]
    },
    cta: {
      title: "مستعد لتصبح قصة نجاحنا القادمة؟",
      description: "دعنا نناقش كيف يمكننا مساعدتك في تحقيق نتائج مماثلة لأعمالك.",
      button: "ابدأ قصة نجاحك",
      contact: "تحميل دراسات الحالة الكاملة"
    }
  }
}


function ScrollAnimationWrapper({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function CaseStudiesPage({ language = 'en', isDark = false }) {
  
  const [selectedCase, setSelectedCase] = useState(null)
  const t = content[language]
  const isRTL = language === 'ar'

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 ">
        <div className="absolute inset-0 " />
        <div className="container mx-auto px-6 relative">
          <ScrollAnimationWrapper className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black border-0 px-6 py-2 text-sm font-medium">
              {t.hero.badge}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent">
              {t.hero.title}
              <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.hero.description}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 ">
        <div className="container mx-auto px-6">
          <div className="space-y-20">
            {t.caseStudies.map((caseStudy, index) => (
              <ScrollAnimationWrapper key={caseStudy.id} delay={index * 0.2}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <Badge className="bg-gradient-to-r from-blue-600 via-blue-400 to-purple-300 text-black">
                        {caseStudy.industry}
                      </Badge>
                      {caseStudy.featured && (
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          Featured
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {caseStudy.year}
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {caseStudy.title}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {Object.entries(caseStudy.results).map(([key, value], resultIndex) => (
                        <div key={resultIndex} className="text-center">
                          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent">
                            {value}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Challenge
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {caseStudy.challenge}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Solution
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {caseStudy.solution}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                          <Quote className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                              "{caseStudy.testimonial.text}"
                            </p>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {caseStudy.testimonial.author}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {caseStudy.testimonial.position}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {caseStudy.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <Button className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live Project
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Case Study
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image/Metrics */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="space-y-6">
                      {/* Project Image */}
                      <div className="aspect-video bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-blue-900/20 dark:via-blue-600/20 dark:to-blue-400/20 rounded-lg flex items-center justify-center">
                        <div className="text-6xl text-gray-400 dark:text-gray-600">
                          <Globe />
                        </div>
                      </div>

                      {/* Metrics Comparison */}
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Key Metrics Improvement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {caseStudy.metrics.map((metric, metricIndex) => (
                              <div key={metricIndex} className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {metric.label}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {metric.before}
                                  </span>
                                  <ArrowRight className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-semibold text-blue-600">
                                    {metric.after}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.process.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t.process.subtitle}
            </p>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.process.steps.map((step, index) => (
              <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.cta.title}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                {t.cta.button}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold">
                <Download className="w-5 h-5 mr-2" />
                {t.cta.contact}
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </div>
  )
  
}
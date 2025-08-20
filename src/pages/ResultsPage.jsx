import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, ShoppingCart, BarChart3, Target, Award, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card } from '@/components/ui/card.jsx'
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

// Import result images
import shopifyDashboard from '../assets/shopify-dashboard-1.png'
import analyticsDashboard from '../assets/analytics-dashboard-2.png'
import socialMediaResults from '../assets/social-media-results-3.png'
import ecommerceGrowth from '../assets/ecommerce-growth-4.png'
import clientSuccess from '../assets/client-success-5.png'

// ScrollAnimationWrapper component
function ScrollAnimationWrapper({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

// Counter Animation Component
function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  
  React.useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return <span>{prefix}{count}{suffix}</span>
}

// Results Gallery Component
function ResultsGallery({ language = 'en' }) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  const resultImages = [
    {
      src: shopifyDashboard,
      title: language === 'ar' ? 'لوحة تحكم شوبيفاي' : 'Shopify Dashboard',
      description: language === 'ar' ? 'نمو المبيعات بنسبة 63% وزيادة الطلبات بنسبة 52%' : '63% sales growth and 52% increase in orders'
    },
    {
      src: analyticsDashboard,
      title: language === 'ar' ? 'تحليلات جوجل' : 'Google Analytics',
      description: language === 'ar' ? 'زيادة حركة المرور وتحسين معدل التحويل' : 'Increased traffic and improved conversion rates'
    },
    {
      src: socialMediaResults,
      title: language === 'ar' ? 'نتائج وسائل التواصل' : 'Social Media Results',
      description: language === 'ar' ? 'نمو المتابعين وزيادة التفاعل' : 'Follower growth and increased engagement'
    },
    {
      src: ecommerceGrowth,
      title: language === 'ar' ? 'نمو التجارة الإلكترونية' : 'E-commerce Growth',
      description: language === 'ar' ? 'مقارنة قبل وبعد النتائج' : 'Before and after results comparison'
    },
    {
      src: clientSuccess,
      title: language === 'ar' ? 'قصة نجاح العميل' : 'Client Success Story',
      description: language === 'ar' ? 'نتائج شاملة لأحد عملائنا' : 'Comprehensive results for one of our clients'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Main Display */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        <img 
          src={resultImages[selectedImage].src} 
          alt={resultImages[selectedImage].title}
          className="w-full h-auto"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-white text-xl font-bold mb-2">
            {resultImages[selectedImage].title}
          </h3>
          <p className="text-gray-200">
            {resultImages[selectedImage].description}
          </p>
        </div>
      </motion.div>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-5 gap-4">
        {resultImages.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedImage(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
              selectedImage === index 
                ? 'ring-4 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={image.src} 
              alt={image.title}
              className="w-full h-20 object-cover"
            />
            {selectedImage === index && (
              <div className="absolute inset-0 bg-blue-500/20"></div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ResultsPage Component
function ResultsPage({ language = 'en' }) {
  useLivePublishedEdits('results')
  const keyMetrics = [
    {
      icon: TrendingUp,
      value: 300,
      suffix: '%',
      label: language === 'ar' ? 'زيادة المبيعات' : 'Sales Increase',
      color: 'text-green-600'
    },
    {
      icon: Users,
      value: 150,
      suffix: '%',
      label: language === 'ar' ? 'نمو العملاء' : 'Customer Growth',
      color: 'text-blue-600'
    },
    {
      icon: ShoppingCart,
      value: 250,
      suffix: '%',
      label: language === 'ar' ? 'زيادة الطلبات' : 'Order Increase',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      value: 180,
      suffix: '%',
      label: language === 'ar' ? 'نمو حركة المرور' : 'Traffic Growth',
      color: 'text-orange-600'
    }
  ]

  const caseStudies = [
    {
      client: 'TechFlow Solutions',
      industry: language === 'ar' ? 'التكنولوجيا' : 'Technology',
      results: [
        { metric: language === 'ar' ? 'زيادة الإيرادات' : 'Revenue Increase', value: '400%' },
        { metric: language === 'ar' ? 'نمو حركة المرور' : 'Traffic Growth', value: '250%' },
        { metric: language === 'ar' ? 'معدل التحويل' : 'Conversion Rate', value: '3.2%' }
      ]
    },
    {
      client: 'StyleHub Fashion',
      industry: language === 'ar' ? 'الأزياء' : 'Fashion',
      results: [
        { metric: language === 'ar' ? 'زيادة المبيعات' : 'Sales Increase', value: '320%' },
        { metric: language === 'ar' ? 'نمو المتابعين' : 'Follower Growth', value: '180%' },
        { metric: language === 'ar' ? 'معدل التفاعل' : 'Engagement Rate', value: '8.5%' }
      ]
    },
    {
      client: 'ShopMax E-commerce',
      industry: language === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce',
      results: [
        { metric: language === 'ar' ? 'زيادة الطلبات' : 'Order Increase', value: '280%' },
        { metric: language === 'ar' ? 'تحسين معدل التحويل' : 'Conversion Improvement', value: '150%' },
        { metric: language === 'ar' ? 'قيمة الطلب المتوسط' : 'Average Order Value', value: '+$45' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-6 py-20">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
              {language === 'ar' ? 'نتائجنا' : 'Our Results'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'ar' ? 'النتائج التي' : 'Results That'}
              <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent block">
                {language === 'ar' ? 'تتحدث عن نفسها' : 'Speak for Themselves'}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'اكتشف كيف ساعدنا عملاءنا في تحقيق نمو استثنائي وتحسين أدائهم الرقمي'
                : 'Discover how we helped our clients achieve exceptional growth and improve their digital performance'
              }
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Key Metrics */}
        <ScrollAnimationWrapper delay={0.2}>
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <metric.icon className={`w-12 h-12 mx-auto mb-4 ${metric.color}`} />
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-gray-600 dark:text-gray-300">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollAnimationWrapper>

        {/* Results Gallery */}
        <ScrollAnimationWrapper delay={0.4}>
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {language === 'ar' ? 'لقطات من لوحات التحكم الحقيقية' : 'Real Dashboard Screenshots'}
            </h2>
            <ResultsGallery language={language} />
          </div>
        </ScrollAnimationWrapper>

        {/* Case Studies */}
        <ScrollAnimationWrapper delay={0.6}>
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              {language === 'ar' ? 'دراسات حالة مفصلة' : 'Detailed Case Studies'}
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {study.client}
                      </h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {study.industry}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-300">{result.metric}</span>
                          <span className="font-bold text-green-600 flex items-center">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            {result.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Call to Action */}
        <ScrollAnimationWrapper delay={0.8}>
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'هل تريد نتائج مماثلة؟' : 'Want Similar Results?'}
            </h3>
            <p className="text-xl mb-8 opacity-90">
              {language === 'ar' 
                ? 'دعنا نساعدك في تحقيق نمو استثنائي لعملك'
                : 'Let us help you achieve exceptional growth for your business'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              {language === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'}
            </motion.button>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  )
}

export default ResultsPage


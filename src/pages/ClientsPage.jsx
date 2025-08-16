import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card } from '@/components/ui/card.jsx'

// Import client logos
import clientLogo1 from '../assets/client-logo-1.png'
import clientLogo2 from '../assets/client-logo-2.png'
import clientLogo3 from '../assets/client-logo-3.png'
import clientLogo4 from '../assets/client-logo-4.png'
import clientLogo5 from '../assets/client-logo-5.png'

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

function ClientsPage({ language = 'en' }) {
  const clientLogos = [
    { name: 'TechFlow', logo: clientLogo1 },
    { name: 'ShopMax', logo: clientLogo2 },
    { name: 'StyleHub', logo: clientLogo3 },
    { name: 'GrowthLab', logo: clientLogo4 },
    { name: 'VitalCare', logo: clientLogo5 },
  ]

  const successStories = [
    {
      metric: '300%',
      description: language === 'ar' ? 'زيادة في المبيعات' : 'Increase in Sales',
      client: 'TechFlow'
    },
    {
      metric: '150%',
      description: language === 'ar' ? 'نمو في حركة المرور' : 'Traffic Growth',
      client: 'ShopMax'
    },
    {
      metric: '95%',
      description: language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction',
      client: 'StyleHub'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-6 py-20">
        <ScrollAnimationWrapper>
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent">
            {language === 'ar' ? 'عملاؤنا' : 'Our Clients'}
          </h1>
        </ScrollAnimationWrapper>
        
        <ScrollAnimationWrapper delay={0.2}>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'نفخر بالعمل مع أفضل العلامات التجارية والشركات الرائدة في مختلف الصناعات'
              : 'We are proud to work with the best brands and leading companies across various industries'
            }
          </p>
        </ScrollAnimationWrapper>
        
        {/* Client Logos Grid */}
        <ScrollAnimationWrapper delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
            {clientLogos.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              >
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </ScrollAnimationWrapper>

        {/* Client Success Stories */}
        <ScrollAnimationWrapper delay={0.6}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              {language === 'ar' ? 'قصص نجاح عملائنا' : 'Client Success Stories'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">{story.metric}</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-2">{story.description}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{story.client}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Call to Action */}
        <ScrollAnimationWrapper delay={0.8}>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {language === 'ar' ? 'هل تريد أن تكون العميل التالي؟' : 'Want to be our next success story?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {language === 'ar' 
                ? 'انضم إلى قائمة عملائنا الناجحين واحصل على نتائج مذهلة'
                : 'Join our list of successful clients and achieve amazing results'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-200 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              {language === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'}
            </motion.button>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  )
}

export default ClientsPage


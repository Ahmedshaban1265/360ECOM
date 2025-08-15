import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Linkedin, Twitter, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card } from '@/components/ui/card.jsx'

// Import team member photos
import teamMember1 from '../assets/team-member-1.png'
import teamMember2 from '../assets/team-member-2.png'
import teamMember3 from '../assets/team-member-3.png'
import teamMember4 from '../assets/team-member-4.png'
import teamMember5 from '../assets/team-member-5.png'

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

// Professional Team Carousel Component
function ProfessionalTeamCarousel({ items, language = 'en' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [items.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const getItemPosition = (index) => {
    const diff = index - currentIndex
    const totalItems = items.length
    
    if (diff === 0) return 'center'
    if (diff === 1 || diff === -(totalItems - 1)) return 'right'
    if (diff === -1 || diff === totalItems - 1) return 'left'
    return 'hidden'
  }

  const getItemStyles = (position) => {
    switch (position) {
      case 'center':
        return {
          scale: 1,
          opacity: 1,
          zIndex: 3,
          x: 0
        }
      case 'left':
        return {
          scale: 0.8,
          opacity: 0.7,
          zIndex: 2,
          x: -120
        }
      case 'right':
        return {
          scale: 0.8,
          opacity: 0.7,
          zIndex: 2,
          x: 120
        }
      default:
        return {
          scale: 0.6,
          opacity: 0.4,
          zIndex: 1,
          x: 0
        }
    }
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Container */}
      <div className="relative h-96 flex items-center justify-center overflow-hidden">
        {items.map((item, index) => {
          const position = getItemPosition(index)
          const styles = getItemStyles(position)
          
          return (
            <motion.div
              key={index}
              className="absolute"
              animate={styles}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <Card className="w-80 bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={item.photo} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Linkedin className="w-4 h-4 text-white" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Twitter className="w-4 h-4 text-white" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Mail className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                    {item.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.bio}
                  </p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// TeamPage Component
function TeamPage({ language = 'en' }) {
  const teamMembers = [
    {
      name: 'Michael Johnson',
      position: language === 'ar' ? 'الرئيس التنفيذي والمؤسس' : 'CEO & Founder',
      photo: teamMember1,
      bio: language === 'ar' 
        ? 'قائد رؤيوي مع أكثر من 10 سنوات من الخبرة في التجارة الإلكترونية والتسويق الرقمي'
        : 'Visionary leader with 10+ years of experience in e-commerce and digital marketing'
    },
    {
      name: 'Sarah Williams',
      position: language === 'ar' ? 'مديرة التسويق' : 'Marketing Director',
      photo: teamMember2,
      bio: language === 'ar'
        ? 'خبيرة في استراتيجيات التسويق الرقمي وإدارة الحملات الإعلانية الناجحة'
        : 'Expert in digital marketing strategies and managing successful advertising campaigns'
    },
    {
      name: 'David Chen',
      position: language === 'ar' ? 'كبير المطورين' : 'Lead Developer',
      photo: teamMember3,
      bio: language === 'ar'
        ? 'مطور متخصص في تقنيات الويب الحديثة وتطوير متاجر شوبيفاي المتقدمة'
        : 'Developer specialized in modern web technologies and advanced Shopify store development'
    },
    {
      name: 'Emma Rodriguez',
      position: language === 'ar' ? 'مصممة UX/UI' : 'UX/UI Designer',
      photo: teamMember4,
      bio: language === 'ar'
        ? 'مصممة مبدعة تركز على تجربة المستخدم وتصميم واجهات جذابة وسهلة الاستخدام'
        : 'Creative designer focused on user experience and designing attractive, user-friendly interfaces'
    },
    {
      name: 'James Thompson',
      position: language === 'ar' ? 'مدير المشاريع' : 'Project Manager',
      photo: teamMember5,
      bio: language === 'ar'
        ? 'خبير في إدارة المشاريع وضمان تسليم الحلول في الوقت المحدد وبأعلى جودة'
        : 'Expert in project management and ensuring solutions are delivered on time with the highest quality'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-6 py-20">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {language === 'ar' ? 'فريقنا' : 'Our Team'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'ar' ? 'تعرف على' : 'Meet Our'}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent block">
                {language === 'ar' ? 'الخبراء' : 'Experts'}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'فريق من المحترفين المتخصصين في التجارة الإلكترونية والتسويق الرقمي وتطوير المواقع'
                : 'A team of professionals specialized in e-commerce, digital marketing, and web development'
              }
            </p>
          </div>
        </ScrollAnimationWrapper>
        
        {/* Team Carousel */}
        <ScrollAnimationWrapper delay={0.2}>
          <ProfessionalTeamCarousel items={teamMembers} language={language} />
        </ScrollAnimationWrapper>

        {/* Team Stats */}
        <ScrollAnimationWrapper delay={0.4}>
          <div className="grid md:grid-cols-4 gap-6 mt-20">
            {[
              {
                number: '15+',
                label: language === 'ar' ? 'أعضاء الفريق' : 'Team Members'
              },
              {
                number: '8+',
                label: language === 'ar' ? 'سنوات خبرة' : 'Years Experience'
              },
              {
                number: '200+',
                label: language === 'ar' ? 'مشروع مكتمل' : 'Projects Completed'
              },
              {
                number: '50+',
                label: language === 'ar' ? 'عميل سعيد' : 'Happy Clients'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollAnimationWrapper>

        {/* Call to Action */}
        <ScrollAnimationWrapper delay={0.6}>
          <div className="text-center mt-20">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {language === 'ar' ? 'هل تريد الانضمام إلى فريقنا؟' : 'Want to join our team?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {language === 'ar' 
                ? 'نحن دائماً نبحث عن المواهب المتميزة للانضمام إلى فريقنا المتنامي'
                : 'We are always looking for exceptional talent to join our growing team'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </motion.button>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  )
}

export default TeamPage


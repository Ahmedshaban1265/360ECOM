import React, { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  TrendingUp,
  Smartphone,
  Globe,
  ShoppingCart,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'


import projectEcommerce from '../assets/project-ecommerce-1.png'
import projectMobile from '../assets/project-mobile-app-2.png'
import projectDashboard from '../assets/project-dashboard-3.png'


const content = {
  en: {
    title: "Our Projects",
    subtitle: "Portfolio of Success",
    description: "Explore our latest projects and see how we've helped businesses achieve remarkable growth through innovative solutions.",
    filterAll: "All Projects",
    filterWeb: "Web Development",
    filterMobile: "Mobile Apps",
    filterEcommerce: "E-commerce",
    filterDashboard: "Dashboards",
    searchPlaceholder: "Search projects...",
    viewProject: "View Project",
    liveDemo: "Live Demo",
    sourceCode: "Source Code",
    projectDetails: "Project Details",
    technologies: "Technologies",
    duration: "Duration",
    teamSize: "Team Size",
    results: "Results",
    projects: [
      {
        id: 1,
        title: "Luxury Fashion E-commerce",
        description: "A premium e-commerce platform for luxury fashion brands with advanced filtering, wishlist functionality, and seamless checkout experience.",
        category: "E-commerce",
        image: projectEcommerce,
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
        duration: "4 months",
        teamSize: "5 developers",
        results: [
          "300% increase in conversion rate",
          "50% reduction in cart abandonment",
          "2M+ monthly active users"
        ],
        features: [
          "Advanced product filtering",
          "Real-time inventory management",
          "Multi-currency support",
          "Mobile-responsive design",
          "SEO optimized"
        ],
        client: "Fashion Forward Inc.",
        year: "2024",
        status: "Completed"
      },
      {
        id: 2,
        title: "Food Delivery Mobile App",
        description: "A comprehensive food delivery application with real-time tracking, multiple payment options, and restaurant management system.",
        category: "Mobile Apps",
        image: projectMobile,
        technologies: ["React Native", "Firebase", "Google Maps API", "Stripe", "Node.js"],
        duration: "6 months",
        teamSize: "7 developers",
        results: [
          "1M+ downloads in first month",
          "4.8/5 app store rating",
          "40% faster delivery times"
        ],
        features: [
          "Real-time order tracking",
          "In-app payments",
          "Restaurant dashboard",
          "Push notifications",
          "Offline mode support"
        ],
        client: "QuickBite Solutions",
        year: "2024",
        status: "Completed"
      },
      {
        id: 3,
        title: "Business Analytics Dashboard",
        description: "A comprehensive business intelligence dashboard with real-time analytics, custom reporting, and data visualization tools.",
        category: "Dashboards",
        image: projectDashboard,
        technologies: ["React", "D3.js", "Python", "PostgreSQL", "Docker"],
        duration: "3 months",
        teamSize: "4 developers",
        results: [
          "60% faster decision making",
          "Real-time data insights",
          "Custom reporting system"
        ],
        features: [
          "Real-time data visualization",
          "Custom report generation",
          "Multi-user access control",
          "Export functionality",
          "Mobile responsive"
        ],
        client: "DataTech Corp",
        year: "2024",
        status: "Completed"
      }
    ]
  },
  ar: {
    title: "مشاريعنا",
    subtitle: "محفظة النجاح",
    description: "استكشف أحدث مشاريعنا وشاهد كيف ساعدنا الشركات على تحقيق نمو ملحوظ من خلال الحلول المبتكرة.",
    filterAll: "جميع المشاريع",
    filterWeb: "تطوير الويب",
    filterMobile: "تطبيقات الجوال",
    filterEcommerce: "التجارة الإلكترونية",
    filterDashboard: "لوحات التحكم",
    searchPlaceholder: "البحث في المشاريع...",
    viewProject: "عرض المشروع",
    liveDemo: "عرض مباشر",
    sourceCode: "الكود المصدري",
    projectDetails: "تفاصيل المشروع",
    technologies: "التقنيات",
    duration: "المدة",
    teamSize: "حجم الفريق",
    results: "النتائج",
    projects: [
      {
        id: 1,
        title: "متجر إلكتروني للأزياء الفاخرة",
        description: "منصة تجارة إلكترونية متميزة للعلامات التجارية الفاخرة مع تصفية متقدمة ووظائف قائمة الأمنيات وتجربة دفع سلسة.",
        category: "التجارة الإلكترونية",
        image: projectEcommerce,
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
        duration: "4 أشهر",
        teamSize: "5 مطورين",
        results: [
          "زيادة 300% في معدل التحويل",
          "تقليل 50% في هجر السلة",
          "أكثر من 2 مليون مستخدم نشط شهرياً"
        ],
        features: [
          "تصفية متقدمة للمنتجات",
          "إدارة المخزون في الوقت الفعلي",
          "دعم متعدد العملات",
          "تصميم متجاوب للجوال",
          "محسن لمحركات البحث"
        ],
        client: "شركة الأزياء المتقدمة",
        year: "2024",
        status: "مكتمل"
      },
      {
        id: 2,
        title: "تطبيق توصيل الطعام",
        description: "تطبيق شامل لتوصيل الطعام مع تتبع في الوقت الفعلي وخيارات دفع متعددة ونظام إدارة المطاعم.",
        category: "تطبيقات الجوال",
        image: projectMobile,
        technologies: ["React Native", "Firebase", "Google Maps API", "Stripe", "Node.js"],
        duration: "6 أشهر",
        teamSize: "7 مطورين",
        results: [
          "أكثر من مليون تحميل في الشهر الأول",
          "تقييم 4.8/5 في متجر التطبيقات",
          "أوقات توصيل أسرع بنسبة 40%"
        ],
        features: [
          "تتبع الطلبات في الوقت الفعلي",
          "مدفوعات داخل التطبيق",
          "لوحة تحكم المطاعم",
          "إشعارات فورية",
          "دعم الوضع غير المتصل"
        ],
        client: "حلول الطعام السريع",
        year: "2024",
        status: "مكتمل"
      },
      {
        id: 3,
        title: "لوحة تحليلات الأعمال",
        description: "لوحة تحكم شاملة لذكاء الأعمال مع تحليلات في الوقت الفعلي وتقارير مخصصة وأدوات تصور البيانات.",
        category: "لوحات التحكم",
        image: projectDashboard,
        technologies: ["React", "D3.js", "Python", "PostgreSQL", "Docker"],
        duration: "3 أشهر",
        teamSize: "4 مطورين",
        results: [
          "اتخاذ قرارات أسرع بنسبة 60%",
          "رؤى البيانات في الوقت الفعلي",
          "نظام تقارير مخصص"
        ],
        features: [
          "تصور البيانات في الوقت الفعلي",
          "إنشاء تقارير مخصصة",
          "التحكم في الوصول متعدد المستخدمين",
          "وظيفة التصدير",
          "متجاوب للجوال"
        ],
        client: "شركة تقنية البيانات",
        year: "2024",
        status: "مكتمل"
      }
    ]
  }
}


function ScrollAnimationWrapper({ children, className = "", delay = 0 }) {
  const ref = React.useRef(null)
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


function ProjectCard({ project, language, index }) {
  const t = content[language]
  const [isHovered, setIsHovered] = useState(false)

  return (
    <ScrollAnimationWrapper delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -10 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="relative overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Project Category Badge */}
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black">
              {project.category}
            </Badge>
            
            {/* Project Status */}
            <Badge className="absolute top-4 right-4 bg-blue-800 text-white">
              {project.status}
            </Badge>
            
            {/* Hover Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
            >
              <Button size="sm" className="flex-1 bg-white/90 text-gray-900 hover:bg-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.liveDemo}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-white/90 border-white/90 text-gray-900 hover:bg-white">
                <Github className="w-4 h-4 mr-2" />
                {t.sourceCode}
              </Button>
            </motion.div>
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
              <span className="text-sm text-gray-500">{project.year}</span>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Technologies */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{t.technologies}:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">{t.duration}:</span>
                <p className="font-medium">{project.duration}</p>
              </div>
              <div>
                <span className="text-gray-500">{t.teamSize}:</span>
                <p className="font-medium">{project.teamSize}</p>
              </div>
            </div>
            
            {/* Results */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{t.results}:</h4>
              <ul className="space-y-1">
                {project.results.slice(0, 2).map((result, resultIndex) => (
                  <li key={resultIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <TrendingUp className="w-3 h-3 mr-2 text-blue-600" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* View Project Button */}
            <Button className="w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 hover:from-emerald-700 hover:to-blue-700">
              {t.viewProject}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollAnimationWrapper>
  )
}


function ProjectsPage({ language = 'en' }) {
  const t = content[language]
  const isRTL = language === 'ar'
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const categories = [
    { id: 'all', name: t.filterAll, icon: Filter },
    { id: 'web', name: t.filterWeb, icon: Globe },
    { id: 'mobile', name: t.filterMobile, icon: Smartphone },
    { id: 'ecommerce', name: t.filterEcommerce, icon: ShoppingCart },
    { id: 'dashboard', name: t.filterDashboard, icon: BarChart3 }
  ]
  
  const filteredProjects = t.projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || 
      project.category.toLowerCase().includes(selectedCategory) ||
      (selectedCategory === 'web' && project.category === 'Web Development') ||
      (selectedCategory === 'mobile' && project.category === 'Mobile Apps') ||
      (selectedCategory === 'ecommerce' && project.category === 'E-commerce') ||
      (selectedCategory === 'dashboard' && project.category === 'Dashboards')
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 ">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black mb-6">
                {t.title}
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                {t.subtitle.split(' ').map((word, index) => (
                  <span key={index} className={index === t.subtitle.split(' ').length - 1 ? 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 bg-clip-text text-transparent' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.description}
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? 
                        "bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 text-black" : 
                        "hover:bg-accent"
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  )
                })}
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  language={language}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <ScrollAnimationWrapper>
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            </ScrollAnimationWrapper>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black  to-gray-900">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center text-white">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss how we can help bring your vision to life.
              </p>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage


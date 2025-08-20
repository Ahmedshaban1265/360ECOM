// import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Linkedin, Twitter, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card } from '@/components/ui/card.jsx'
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits';

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
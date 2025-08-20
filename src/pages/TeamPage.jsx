import { Linkedin, Twitter, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'
import { Card } from '@/components/ui/card.jsx'
import useLivePublishedEdits from '@/hooks/useLivePublishedEdits'

// Team member photos
import teamMember1 from '../assets/team-member-1.png'
import teamMember2 from '../assets/team-member-2.png'
import teamMember3 from '../assets/team-member-3.png'
import teamMember4 from '../assets/team-member-4.png'
import teamMember5 from '../assets/team-member-5.png'

function TeamCard({ name, role, photo }) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img src={photo} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-muted-foreground text-sm">{role}</div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <a href="#" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
          <a href="#" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
          <a href="#" aria-label="Email"><Mail className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  )
}

export default function TeamPage({ language = 'en' }) {
  useLivePublishedEdits('team')

  const team = [
    { name: 'Ava Williams', role: 'CEO', photo: teamMember1 },
    { name: 'Noah Johnson', role: 'CTO', photo: teamMember2 },
    { name: 'Liam Brown', role: 'Lead Developer', photo: teamMember3 },
    { name: 'Emma Davis', role: 'Product Designer', photo: teamMember4 },
    { name: 'Olivia Miller', role: 'Marketing Lead', photo: teamMember5 }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Our Team</h1>
            <p className="text-muted-foreground mt-2">Meet the people behind our projects.</p>
          </div>
          <Badge>Open Roles</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, idx) => (
            <TeamCard key={idx} name={m.name} role={m.role} photo={m.photo} />
          ))}
        </div>
      </div>
    </section>
  )
}
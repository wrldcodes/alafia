'use client'
import { useState } from 'react'
import { Home, Calendar, FileText, Search, Shield, User, LogOut, Bell, Plus } from 'lucide-react'
import { usePatientDashboard, type PatientView } from '@/hooks/usePatientDashboard'
import { cn } from '@/lib/utils'
import { Button, Badge, StatCard } from '@/components/ui'

const NAV_ITEMS: { view: PatientView; label: string; icon: React.ReactNode; badge?: number }[] = [
  { view: 'home',         label: 'Home',          icon: <Home size={15}/> },
  { view: 'appointments', label: 'Appointments',  icon: <Calendar size={15}/>, badge: 1 },
  { view: 'records',      label: 'My records',    icon: <FileText size={15}/> },
  { view: 'clinics',      label: 'Find clinics',  icon: <Search size={15}/> },
  { view: 'tips',         label: 'Health tips',   icon: <Shield size={15}/> },
  { view: 'profile',      label: 'My profile',    icon: <User size={15}/> },
]

const VIEW_TITLES: Record<PatientView, string> = {
  home: 'Home', appointments: 'My Appointments', records: 'My Records',
  clinics: 'Find Clinics', tips: 'Health Tips', profile: 'My Profile',
}

/**
 * PatientDashboard — full patient portal shell with sidebar navigation
 * and view switching. Views: home, appointments, records, clinics, tips, profile.
 */
export function PatientDashboard() {
  const { activeView, setView } = usePatientDashboard()

  return (
    <div className="grid h-screen overflow-hidden" style={{ gridTemplateColumns: '220px 1fr' }}>
      {/* Sidebar */}
      <aside className="bg-teal-800 flex flex-col overflow-y-auto h-screen relative">
        <div className="flex items-center gap-2.5 px-4.5 py-5.5 font-display text-[18px] text-teal-100 border-b border-white/7">
          <div className="w-[30px] h-[30px] bg-white/10 rounded-[8px] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 21C12 21 4 15 4 9a8 8 0 0 1 16 0c0 6-8 12-8 12z"/>
              <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
            </svg>
          </div>
          Aláfíà
        </div>

        {/* Profile card */}
        <div className="mx-3 my-3.5 bg-white/7 border border-white/10 rounded-[14px] p-3.5">
          <div className="w-11 h-11 rounded-full bg-teal-600 flex items-center justify-center font-display text-[16px] text-white mb-2.5">AO</div>
          <p className="text-[14px] font-medium text-white">Amaka Obi</p>
          <p className="text-[11px] font-light text-white/40">ALF-002849</p>
          <p className="flex items-center gap-1 text-[11px] text-teal-200 mt-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Gbagada General Hospital
          </p>
        </div>

        <p className="px-3 pt-3.5 pb-1 text-[10px] font-semibold text-white/25 tracking-[0.1em] uppercase">My health</p>
        <nav className="px-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ view, label, icon, badge }) => (
            <button key={view} onClick={() => setView(view)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-light',
                'transition-all duration-200 cursor-pointer border-none w-full text-left',
                activeView === view
                  ? 'bg-white/12 text-white font-medium'
                  : 'text-white/50 bg-transparent hover:bg-white/6 hover:text-white/80'
              )}>
              {icon} {label}
              {badge && <span className="ml-auto bg-teal-400 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-3 py-3.5 border-t border-white/7">
          <button className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-light text-white/40 bg-transparent border-none w-full cursor-pointer transition-all hover:bg-white/6 hover:text-white/70">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-7 h-[62px] bg-white border-b border-sand-200 flex-shrink-0">
          <h1 className="font-display text-[19px] text-teal-900 tracking-[-0.2px]">{VIEW_TITLES[activeView]}</h1>
          <div className="flex items-center gap-2.5">
            <button className="w-[34px] h-[34px] rounded-[10px] border border-sand-200 bg-white flex items-center justify-center cursor-pointer relative hover:bg-sand-50">
              <Bell size={15} className="text-slate-600"/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-600 border-2 border-white"/>
            </button>
            <Button variant="primary" size="sm" onClick={() => setView('clinics')}>
              <Plus size={13} /> Book appointment
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-7">
          {activeView === 'home'         && <HomeView setView={setView} />}
          {activeView === 'appointments' && <AppointmentsView />}
          {activeView === 'records'      && <RecordsView />}
          {activeView === 'clinics'      && <ClinicsView />}
          {activeView === 'tips'         && <TipsView />}
          {activeView === 'profile'      && <ProfileView />}
        </div>
      </div>
    </div>
  )
}

// ── View components ──

function HomeView({ setView }: { setView: (v: PatientView) => void }) {
  return (
    <div>
      <div className="bg-teal-800 rounded-[24px] px-8 py-7 mb-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute right-[-60px] top-[-60px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(ellipse,rgba(58,171,138,0.2)_0%,transparent_70%)]"/>
        <div className="relative z-10">
          <p className="text-[13px] font-light text-white/50 mb-1">Good morning,</p>
          <h2 className="font-display text-[26px] text-white tracking-[-0.3px] mb-1.5">Amaka Obi</h2>
          <p className="text-[13px] font-light text-white/50">You have 1 upcoming appointment this week.</p>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-full px-4.5 py-2.5 text-center relative z-10">
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-wide mb-1">Patient ID</p>
          <p className="font-display text-[18px] text-white tracking-wide">ALF-002849</p>
        </div>
      </div>

      <div className="bg-white border-[1.5px] border-teal-100 rounded-[18px] p-4.5 mb-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-[12px] bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
          <Calendar size={20} className="text-teal-600"/>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-teal-600 tracking-wide uppercase mb-0.5">Next appointment</p>
          <p className="text-[15px] font-medium text-slate-800 mb-0.5">General consultation — Dr. Bello</p>
          <p className="text-[12px] font-light text-slate-400">Wednesday, 2 April 2025 · 9:00 AM · Gbagada General Hospital</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm">Reschedule</Button>
          <Button variant="primary" size="sm">Get directions</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <StatCard label="Total visits"   value={12} icon={<Calendar size={15}/>} iconColor="teal" />
        <StatCard label="Medical records" value={8}  icon={<FileText size={15}/>} iconColor="earth" />
        <StatCard label="Clinics visited" value={2}  icon={<Search size={15}/>}  iconColor="blue" />
      </div>

      <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
        <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-sand-100">
          <p className="text-[14px] font-semibold text-slate-800">Health tips for you</p>
          <button onClick={() => setView('tips')} className="text-[12px] font-medium text-teal-600 bg-none border-none cursor-pointer hover:underline">See all</button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 p-4">
          {[
            { title: 'Stay hydrated',       desc: 'Drink at least 8 glasses of water daily to keep your body functioning well.', color: 'teal' },
            { title: 'Malaria prevention',  desc: 'Use treated mosquito nets, especially for children and pregnant women.', color: 'amber' },
          ].map(({ title, desc, color }) => (
            <div key={title} className="bg-white border border-sand-200 rounded-[14px] p-4.5 flex gap-3.5 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all">
              <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${color === 'teal' ? 'bg-teal-50' : 'bg-amber-50'}`}>
                <Shield size={16} className={color === 'teal' ? 'text-teal-600' : 'text-amber-700'} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-800 mb-1">{title}</p>
                <p className="text-[12px] font-light text-slate-400 leading-[1.6]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AppointmentsView() {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm"><Plus size={13}/> Book new appointment</Button>
      </div>
      {[
        { heading: 'Upcoming', items: [
          { month:'APR', day:'2',  title:'General consultation', meta:'9:00 AM · Dr. Bello · Gbagada General Hospital', status:'confirmed' as const },
          { month:'APR', day:'15', title:'Follow-up visit',       meta:'10:00 AM · Dr. Adeyemi · Gbagada General Hospital', status:'pending' as const },
        ]},
        { heading: 'Past appointments', items: [
          { month:'MAR', day:'18', title:'Lab results review',    meta:'11:00 AM · Dr. Bello · Gbagada General Hospital', status:'completed' as const, past: true },
          { month:'FEB', day:'5',  title:'General consultation',  meta:'9:30 AM · Dr. Adeyemi · Gbagada General Hospital', status:'completed' as const, past: true },
        ]},
      ].map(({ heading, items }) => (
        <div key={heading} className="bg-white border border-sand-200 rounded-[18px] overflow-hidden mb-4">
          <div className="px-4.5 py-3.5 border-b border-sand-100"><p className="text-[14px] font-semibold text-slate-800">{heading}</p></div>
          {items.map((item) => {
            const past = 'past' in item && item.past

            return (
            <div key={item.title} className="flex items-center gap-3.5 px-4.5 py-3 border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
              <div className={`w-10.5 h-11.5 rounded-[10px] flex flex-col items-center justify-center flex-shrink-0 ${past ? 'bg-sand-100 border border-sand-200' : 'bg-teal-50 border border-teal-100'}`}>
                <p className={`text-[9px] font-semibold uppercase tracking-wide ${past ? 'text-slate-400' : 'text-teal-600'}`}>{item.month}</p>
                <p className={`font-display text-[18px] leading-none ${past ? 'text-slate-600' : 'text-teal-800'}`}>{item.day}</p>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-slate-800">{item.title}</p>
                <p className="text-[12px] font-light text-slate-400 mt-0.5">{item.meta}</p>
              </div>
              <Badge variant={item.status}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>
            </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function RecordsView() {
  const records = [
    { title: 'Full blood count',        meta: 'Lab results · Dr. Bello', date: '31 Mar 2025' },
    { title: 'General consultation notes', meta: 'Clinical notes · Dr. Adeyemi', date: '18 Mar 2025' },
    { title: 'Blood pressure history',  meta: 'Vitals log · Dr. Bello', date: '12 Jan 2025' },
    { title: 'Malaria test results',    meta: 'Lab results · Dr. Bello', date: '5 Feb 2025' },
  ]
  return (
    <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
      <div className="px-4.5 py-3.5 border-b border-sand-100"><p className="text-[14px] font-semibold text-slate-800">My medical records</p></div>
      {records.map(({ title, meta, date }) => (
        <div key={title} className="flex items-center gap-3.5 px-4.5 py-3 border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-[10px] bg-earth-50 border border-earth-200 flex items-center justify-center flex-shrink-0">
            <FileText size={15} className="text-earth-400"/>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-slate-800">{title}</p>
            <p className="text-[12px] font-light text-slate-400 mt-0.5">{meta}</p>
          </div>
          <p className="text-[12px] font-light text-slate-400 flex-shrink-0">{date}</p>
        </div>
      ))}
    </div>
  )
}

function ClinicsView() {
  const clinics = [
    { name: 'Gbagada General Hospital', loc: 'Gbagada, Lagos', dist: '1.2 km', hours: 'Mon–Sat, 8am–6pm', tags: ['General practice','Lab','Pharmacy'], isMine: true },
    { name: 'Community Health Centre Surulere', loc: 'Surulere, Lagos', dist: '4.8 km', hours: 'Mon–Fri, 7am–5pm', tags: ['Community health','Maternity','Immunisation'] },
    { name: 'Lagos Island General Hospital', loc: 'Lagos Island', dist: '9.3 km', hours: '24 hours', tags: ['Emergency','Surgery','General practice'] },
  ]
  return (
    <div>
      <div className="flex gap-2.5 mb-5">
        <div className="flex-1 flex items-center gap-2.5 bg-white border border-sand-200 rounded-full px-4.5 py-2.5">
          <Search size={15} className="text-slate-400 flex-shrink-0"/>
          <input placeholder="Search by clinic name, location or service…" className="border-none bg-transparent outline-none text-[14px] text-slate-800 placeholder-slate-300 w-full"/>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {clinics.map(({ name, loc, dist, hours, tags, isMine }) => (
          <div key={name} className="bg-white border border-sand-200 rounded-[18px] p-4.5 flex items-start gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-teal-200 cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-[12px] bg-earth-50 border border-earth-200 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a06e" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[15px] font-semibold text-slate-800">{name}</p>
                {isMine && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">Your clinic</span>}
              </div>
              <div className="flex gap-3 text-[12px] font-light text-slate-400 mb-2">
                <span>{loc}</span><span>·</span><span>{dist}</span><span>·</span><span>{hours}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {tags.map(t => <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{t}</span>)}
              </div>
            </div>
            <Button variant="primary" size="sm" className="flex-shrink-0">Book</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TipsView() {
  const tips = [
    { title: 'Stay hydrated',        desc: 'Drink at least 8 glasses of water daily.', color: 'teal' },
    { title: 'Malaria prevention',   desc: 'Sleep under treated mosquito nets. Empty stagnant water nearby.', color: 'amber' },
    { title: 'Know your blood pressure', desc: 'High BP often has no symptoms. Get checked regularly if over 35.', color: 'earth' },
    { title: 'Child immunisation',   desc: 'Keep your child\'s vaccination schedule up to date.', color: 'blue' },
    { title: 'Exercise regularly',   desc: '30 minutes of walking daily reduces risk of heart disease and diabetes.', color: 'teal' },
    { title: 'Wash your hands',      desc: 'Handwashing with soap prevents cholera, typhoid, and other infections.', color: 'amber' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3.5">
      {tips.map(({ title, desc, color }) => (
        <div key={title} className="bg-white border border-sand-200 rounded-[18px] p-4.5 flex gap-3.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 cursor-pointer transition-all">
          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${color==='teal'?'bg-teal-50':color==='amber'?'bg-amber-50':color==='earth'?'bg-earth-50':'bg-blue-50'}`}>
            <Shield size={16} className={color==='teal'?'text-teal-600':color==='amber'?'text-amber-700':color==='earth'?'text-earth-400':'text-blue-600'}/>
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-800 mb-1">{title}</p>
            <p className="text-[12px] font-light text-slate-400 leading-[1.6]">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileView() {
  return (
    <div>
      <div className="bg-white border border-sand-200 rounded-[24px] p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-teal-700 flex items-center justify-center font-display text-[24px] text-white flex-shrink-0">AO</div>
        <div className="flex-1">
          <p className="font-display text-[22px] text-teal-900 mb-0.5">Amaka Obi</p>
          <p className="text-[13px] font-light text-slate-400">Patient ID: ALF-002849 · Enrolled Jan 2024</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">Active patient</span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-earth-50 text-earth-600 border border-earth-200">Gbagada General Hospital</span>
          </div>
        </div>
        <button className="px-4 py-2 rounded-full border border-sand-200 bg-white text-[13px] font-medium text-slate-600 cursor-pointer hover:border-teal-200 hover:text-teal-700 transition-colors">Edit profile</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: 'Personal information', fields: [['Full name','Amaka Obi'],['Date of birth','14 March 1993'],['Gender','Female'],['Blood group','O+']] },
          { title: 'Contact details', fields: [['Phone','+234 801 234 5678'],['Email','amaka.obi@gmail.com'],['State','Lagos'],['LGA','Gbagada']] },
        ].map(({ title, fields }) => (
          <div key={title} className="bg-white border border-sand-200 rounded-[18px] p-5">
            <p className="text-[12px] font-semibold text-teal-600 tracking-wide uppercase mb-3.5 pb-2 border-b border-sand-200">{title}</p>
            {fields.map(([label, value]) => (
              <div key={label} className="mb-3 last:mb-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-[14px] text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

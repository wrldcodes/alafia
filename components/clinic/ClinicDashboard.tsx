'use client'
import { useState } from 'react'
import { LayoutDashboard, Users, Calendar, CreditCard, FileText, Settings, LogOut, Bell, Plus, Search, X } from 'lucide-react'
import { useClinicDashboard, type DashboardView } from '@/hooks/useClinicDashboard'
import { cn, getInitials } from '@/lib/utils'
import { Button, Badge, StatCard } from '@/components/ui'

const NAV = [
  { view: 'overview' as DashboardView,      label: 'Overview',      icon: <LayoutDashboard size={16}/> },
  { view: 'patients' as DashboardView,      label: 'Patients',      icon: <Users size={16}/>,    badge: 3 },
  { view: 'appointments' as DashboardView,  label: 'Appointments',  icon: <Calendar size={16}/> },
  { view: 'billing' as DashboardView,       label: 'Billing',       icon: <CreditCard size={16}/> },
  { view: 'records' as DashboardView,       label: 'Records',       icon: <FileText size={16}/> },
  { view: 'settings' as DashboardView,      label: 'Settings',      icon: <Settings size={16}/> },
]

const VIEW_TITLES: Record<DashboardView, string> = {
  overview: 'Overview', patients: 'Patients', appointments: 'Appointments',
  billing: 'Billing', records: 'Medical Records', settings: 'Settings',
}

const PATIENTS = [
  { id:'ALF-002849', name:'Amaka Obi',     gender:'Female', age:32, blood:'O+',  phone:'08012345678', state:'Lagos',  visits:3 },
  { id:'ALF-003102', name:'Tunde Fashola', gender:'Male',   age:45, blood:'A+',  phone:'08023456789', state:'Lagos',  visits:7 },
  { id:'ALF-003890', name:'Chioma Uzoka',  gender:'Female', age:28, blood:'B+',  phone:'08034567890', state:'Lagos',  visits:1 },
  { id:'ALF-001204', name:'Emeka Eze',     gender:'Male',   age:61, blood:'AB+', phone:'08045678901', state:'Lagos',  visits:12 },
  { id:'ALF-004201', name:'Fatima Bello',  gender:'Female', age:22, blood:'O-',  phone:'08056789012', state:'Kano',   visits:2 },
  { id:'ALF-002567', name:'Yusuf Musa',    gender:'Male',   age:38, blood:'A-',  phone:'08067890123', state:'Kano',   visits:5 },
]

/**
 * ClinicDashboard — full clinic management shell.
 * Views: overview, patients (with slide-over drawer), appointments, billing, records, settings.
 */
export function ClinicDashboard() {
  const { activeView, setView } = useClinicDashboard()
  const [drawerPatient, setDrawerPatient] = useState<typeof PATIENTS[0] | null>(null)

  return (
    <div className="grid h-screen overflow-hidden" style={{ gridTemplateColumns: '240px 1fr' }}>
      {/* Sidebar */}
      <aside className="bg-teal-900 flex flex-col overflow-y-auto h-screen relative">
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/7">
          <div className="w-[30px] h-[30px] bg-white/10 rounded-[8px] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 21C12 21 4 15 4 9a8 8 0 0 1 16 0c0 6-8 12-8 12z"/>
              <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-medium text-white/90">Gbagada Gen. Hospital</p>
            <p className="text-[11px] font-light text-white/35">CLN-482910</p>
          </div>
        </div>

        <p className="px-5 pt-4 pb-1 text-[10px] font-semibold text-white/25 tracking-[0.1em] uppercase">Main</p>
        <nav className="px-2.5 flex flex-col gap-0.5 pb-2">
          {NAV.map(({ view, label, icon, badge }) => (
            <button key={view} onClick={() => setView(view)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-light',
                'transition-all duration-200 cursor-pointer border-none w-full text-left',
                activeView === view
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 bg-transparent hover:bg-white/6 hover:text-white/80'
              )}>
              {icon} {label}
              {badge && <span className="ml-auto bg-teal-400 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-2.5 py-4 border-t border-white/7 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center font-display text-[12px] text-white flex-shrink-0">CA</div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white/90 truncate">Dr. Chidi A.</p>
            <p className="text-[11px] font-light text-white/35">Medical Director</p>
          </div>
          <button className="w-7 h-7 rounded-[8px] bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-white/8 transition-colors">
            <LogOut size={14} className="text-white/40"/>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-7 h-16 bg-white border-b border-sand-200 flex-shrink-0">
          <div>
            <h1 className="font-display text-[20px] text-teal-900 tracking-[-0.2px]">{VIEW_TITLES[activeView]}</h1>
            <p className="text-[12px] font-light text-slate-400">Wednesday, 2 April 2025</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-sand-50 border border-sand-200 rounded-full px-3.5 py-2 w-[220px]">
              <Search size={14} className="text-slate-400 flex-shrink-0"/>
              <input placeholder="Search patients, records…" className="border-none bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 w-full"/>
            </div>
            <button className="w-9 h-9 rounded-[10px] border border-sand-200 bg-white flex items-center justify-center cursor-pointer relative hover:bg-sand-50">
              <Bell size={16} className="text-slate-600"/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-600 border-2 border-white"/>
            </button>
            <Button variant="primary" size="sm" onClick={() => setView('appointments')}>
              <Plus size={13}/> New appointment
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-7">
          {activeView === 'overview'     && <OverviewView onPatientClick={setDrawerPatient} />}
          {activeView === 'patients'     && <PatientsView patients={PATIENTS} onPatientClick={setDrawerPatient} />}
          {activeView === 'appointments' && <AppointmentsView />}
          {activeView === 'billing'      && <BillingView />}
          {activeView === 'records'      && <RecordsView />}
          {activeView === 'settings'     && <SettingsView />}
        </div>
      </div>

      {/* Patient drawer */}
      {drawerPatient && (
        <PatientDrawer patient={drawerPatient} onClose={() => setDrawerPatient(null)} />
      )}
    </div>
  )
}

// ── Drawer ──
function PatientDrawer({ patient, onClose }: { patient: typeof PATIENTS[0]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-[100]" onClick={onClose}/>
      <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-[-4px_0_32px_rgba(0,0,0,0.1)] z-[101] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-200 flex-shrink-0">
          <h2 className="font-display text-[18px] text-teal-900">{patient.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-[8px] border border-sand-200 bg-white cursor-pointer flex items-center justify-center hover:bg-sand-50">
            <X size={14} className="text-slate-600"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Section title="Patient info">
            <div className="grid grid-cols-2 gap-2.5">
              {[['Gender',patient.gender],['Age',`${patient.age} years`],['Blood group',patient.blood],['Phone',patient.phone],['State',patient.state],['Total visits',`${patient.visits} visit${patient.visits!==1?'s':''}`]].map(([l,v])=>(
                <div key={l}><p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{l}</p><p className="text-[14px] text-slate-800">{v}</p></div>
              ))}
            </div>
          </Section>
          <Section title="Latest vitals">
            <div className="grid grid-cols-3 gap-2">
              {[['118/76','mmHg','Blood pressure'],['98.4','°F','Temperature'],['72','bpm','Pulse']].map(([val,unit,label])=>(
                <div key={label} className="bg-sand-50 border border-sand-200 rounded-xl p-2.5 text-center">
                  <p className="font-display text-[18px] text-teal-800 leading-none">{val}</p>
                  <p className="text-[10px] font-light text-slate-400 mt-0.5">{unit}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Doctor's notes">
            <div className="bg-sand-50 border border-sand-200 rounded-xl px-3.5 py-3 text-[13px] font-light text-slate-600 leading-[1.65]">
              Patient presents for routine check-up. No acute complaints. Blood pressure within normal range. Advised on diet and regular exercise. Return in 3 months.
            </div>
          </Section>
        </div>
        <div className="px-6 py-4 border-t border-sand-200 flex gap-2.5 flex-shrink-0">
          <button className="flex-1 py-2.5 rounded-full border border-sand-200 text-[13px] font-medium text-slate-600 bg-white cursor-pointer hover:border-teal-200 hover:text-teal-700 transition-all">View full record</button>
          <button className="flex-1 py-2.5 rounded-full bg-teal-700 text-[13px] font-medium text-white border-none cursor-pointer hover:bg-teal-800 transition-colors">Book appointment</button>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold text-teal-600 tracking-[0.07em] uppercase mb-3 pb-2 border-b border-sand-200">{title}</p>
      {children}
    </div>
  )
}

// ── Views ──
function OverviewView({ onPatientClick }: { onPatientClick: (p: typeof PATIENTS[number]) => void }) {
  const appts = [
    { name:'Amaka Obi',     time:'9:00 AM',  doctor:'Dr. Bello',   type:'General',   status:'confirmed' as const },
    { name:'Tunde Fashola', time:'10:30 AM', doctor:'Dr. Adeyemi', type:'Follow-up', status:'pending' as const },
    { name:'Chioma Uzoka',  time:'11:00 AM', doctor:'Dr. Bello',   type:'Antenatal', status:'confirmed' as const },
    { name:'Emeka Eze',     time:'2:00 PM',  doctor:'Dr. Adeyemi', type:'Diabetes',  status:'confirmed' as const },
    { name:'Fatima Bello',  time:'3:30 PM',  doctor:'Dr. Bello',   type:'General',   status:'cancelled' as const },
  ]
  const activity = [
    { dot:'teal', text:'Amaka Obi enrolled as a new patient', time:'8 mins ago' },
    { dot:'amber', text:'Invoice #INV-0042 marked as paid — ₦12,500', time:'22 mins ago' },
    { dot:'blue', text:'New appointment booked by Chioma Uzoka', time:'1 hr ago' },
    { dot:'red', text:'Fatima Bello cancelled her 3:30 PM appointment', time:'2 hrs ago' },
    { dot:'teal', text:'Medical record added for Emeka Eze', time:'3 hrs ago' },
  ]
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total patients"       value="1,284" delta="↑ 12"   deltaType="up"      icon={<Users size={16}/>}      iconColor="teal" />
        <StatCard label="Today's appointments" value={18}    delta="3 left" deltaType="neutral" icon={<Calendar size={16}/>}   iconColor="amber" />
        <StatCard label="Revenue this month"   value="₦420k" delta="↑ ₦80k" deltaType="up"      icon={<CreditCard size={16}/>} iconColor="earth" />
        <StatCard label="Records this week"    value={94}    delta="↑ 5"    deltaType="up"      icon={<FileText size={16}/>}   iconColor="blue" />
      </div>
      <div className="grid gap-4" style={{gridTemplateColumns:'1.6fr 1fr'}}>
        <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sand-100">
            <p className="text-[14px] font-semibold text-slate-800">{"Today's appointments"}</p>
            <button className="text-[12px] font-medium text-teal-600 bg-none border-none cursor-pointer hover:underline">View all</button>
          </div>
          <table className="w-full border-collapse">
            <thead><tr className="bg-sand-50 border-b border-sand-200">{['Patient','Time','Doctor','Type','Status'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody>
              {appts.map(({ name, time, doctor, type, status }) => (
                <tr key={name} onClick={() => { const patient = PATIENTS.find(p=>p.name===name); if (patient) onPatientClick(patient); }} className="border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-800"><div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">{getInitials(name)}</div>{name}</div></td>
                  <td className="px-4 py-2.5 text-[13px] text-slate-600">{time}</td>
                  <td className="px-4 py-2.5 text-[13px] text-slate-600">{doctor}</td>
                  <td className="px-4 py-2.5 text-[13px] text-slate-600">{type}</td>
                  <td className="px-4 py-2.5"><Badge variant={status}>{status.charAt(0).toUpperCase()+status.slice(1)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
          <div className="px-5 py-4 border-b border-sand-100"><p className="text-[14px] font-semibold text-slate-800">Recent activity</p></div>
          <div className="py-2">
            {activity.map(({ dot, text, time }) => (
              <div key={text} className="flex items-start gap-3 px-5 py-3 hover:bg-sand-50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot==='teal'?'bg-teal-400':dot==='amber'?'bg-amber-400':dot==='blue'?'bg-blue-600':'bg-red-400'}`}/>
                <div><p className="text-[13px] text-slate-600 leading-[1.5]" dangerouslySetInnerHTML={{__html:text.replace(/\*\*(.*?)\*\*/g,'<strong class="font-medium text-slate-800">$1</strong>')}}/>
                <p className="text-[11px] font-light text-slate-400 mt-0.5">{time}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PatientsView({ patients, onPatientClick }: { patients: typeof PATIENTS; onPatientClick: (p: typeof PATIENTS[number]) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <div className="flex gap-1 bg-sand-100 rounded-xl p-1">
          {['All (1,284)','Active','New this week'].map((t,i)=>(
            <button key={t} className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-all ${i===0?'bg-white text-teal-700 shadow-sm':'bg-transparent text-slate-400 hover:text-slate-600 border-none'}`}>{t}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2.5">
          <div className="flex items-center gap-2 bg-white border border-sand-200 rounded-full px-3.5 py-2 w-[220px]">
            <Search size={13} className="text-slate-400 flex-shrink-0"/><input placeholder="Search by name or ID…" className="border-none bg-transparent outline-none text-[13px] placeholder-slate-400 w-full"/>
          </div>
          <Button variant="primary" size="sm"><Plus size={13}/> Add patient</Button>
        </div>
      </div>
      <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr className="bg-sand-50 border-b border-sand-200">{['Patient','ID','Age','Phone','Last visit','Status'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} onClick={() => onPatientClick(p)} className="border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-800"><div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">{getInitials(p.name)}</div>{p.name}</div></td>
                <td className="px-4 py-3 text-[12px] text-slate-400">{p.id}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{p.age}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{p.phone}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">Today</td>
                <td className="px-4 py-3"><Badge variant="confirmed">Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AppointmentsView() {
  const days = [
    { day:'Mon', date:'31' }, { day:'Tue', date:'1' }, { day:'Wed', date:'2', today:true },
    { day:'Thu', date:'3' }, { day:'Fri', date:'4' }, { day:'Sat', date:'5' }, { day:'Sun', date:'6' },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <p className="font-display text-[20px] text-teal-900 flex-1">March 31 – April 6, 2025</p>
        <button className="w-8 h-8 rounded-[8px] border border-sand-200 bg-white cursor-pointer flex items-center justify-center hover:bg-sand-50"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4d55" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button className="px-3.5 py-1.5 rounded-full border border-sand-200 bg-white text-[12px] font-medium text-slate-600 cursor-pointer hover:border-teal-200 hover:text-teal-700 transition-all">Today</button>
        <button className="w-8 h-8 rounded-[8px] border border-sand-200 bg-white cursor-pointer flex items-center justify-center hover:bg-sand-50"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4d55" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg></button>
        <Button variant="primary" size="sm"><Plus size={13}/> Book</Button>
      </div>
      <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
        <div className="grid" style={{gridTemplateColumns:'60px repeat(7,1fr)'}}>
          <div className="bg-sand-50 border-b border-sand-200"/>
          {days.map(({ day, date, today }) => (
            <div key={day} className="bg-sand-50 border-b border-sand-200 p-2.5 text-center border-l border-sand-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{day}</p>
              {today
                ? <div className="w-8 h-8 bg-teal-700 text-white rounded-full flex items-center justify-center font-display text-[16px] mx-auto mt-0.5">{date}</div>
                : <p className="font-display text-[18px] text-slate-800 mt-0.5">{date}</p>
              }
            </div>
          ))}
          {[['8 AM',[null,null,{t:'Amaka O.—General',c:'teal'},null,{t:'Yusuf M.—Follow-up',c:'blue'},null,null]],
            ['9 AM',[{t:'Emeka E.—Diabetes',c:'amber'},null,{t:'Tunde F.—Follow-up Chioma U.—Antenatal',c:'teal'},null,null,{t:'Fatima B.—General',c:'teal'},null]],
            ['10 AM',[null,{t:'New patient',c:'blue'},{t:'Emeka E.—Check-up',c:'teal'},{t:'Amaka O.—Lab',c:'amber'},null,null,null]],
            ['2 PM',[null,null,{t:'Emeka E.—Diabetes',c:'teal'},null,null,{t:'Chioma U.—Antenatal',c:'amber'},null]],
          ].map(([time, cells]) => (
            <>
              <div key={`t-${time}`} className="h-[52px] border-r border-sand-200 px-2 text-[10px] text-slate-300 flex items-start pt-1 justify-end">{time as string}</div>
              {(cells as ({ t: string; c: string } | null)[]).map((cell, i) => (
                <div key={i} className="h-[52px] border-r border-sand-100 border-b border-sand-100 p-0.5 last:border-r-0">
                  {cell && (cell.t as string).split('\n').map((ev: string) => (
                    <div key={ev} className={`rounded-[5px] px-1.5 py-0.5 text-[10px] font-medium mb-0.5 cursor-pointer ${cell.c==='teal'?'bg-teal-100 text-teal-800':cell.c==='amber'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-600'}`}>{ev}</div>
                  ))}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

function BillingView() {
  const invoices = [
    { id:'#INV-0048', patient:'Amaka Obi',     service:'General consultation', amount:'₦8,000',  date:'Today',     status:'pending' as const },
    { id:'#INV-0047', patient:'Emeka Eze',      service:'Diabetes management',  amount:'₦15,000', date:'Yesterday', status:'confirmed' as const },
    { id:'#INV-0046', patient:'Chioma Uzoka',   service:'Antenatal visit',       amount:'₦12,500', date:'1 Apr',     status:'confirmed' as const },
    { id:'#INV-0045', patient:'Tunde Fashola',  service:'Lab + consultation',    amount:'₦22,000', date:'31 Mar',    status:'pending' as const },
    { id:'#INV-0044', patient:'Fatima Bello',   service:'General consultation',  amount:'₦6,000',  date:'31 Mar',    status:'confirmed' as const },
  ]
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['Total revenue this month','₦420,000','↑ ₦80,000 from last month','teal'],['Outstanding invoices','₦68,500','7 unpaid invoices','amber'],['Paid this week','₦94,000','12 invoices settled','teal']].map(([label,val,sub,color])=>(
          <div key={label as string} className="bg-white border border-sand-200 rounded-[18px] p-5">
            <p className="text-[12px] font-light text-slate-400 mb-2">{label as string}</p>
            <p className={`font-display text-[26px] leading-none mb-1 ${color==='amber'?'text-amber-700':'text-teal-900'}`}>{val as string}</p>
            <p className="text-[11px] font-light text-slate-400">{sub as string}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand-100">
          <p className="text-[14px] font-semibold text-slate-800">Recent invoices</p>
          <Button variant="primary" size="sm"><Plus size={13}/> New invoice</Button>
        </div>
        <table className="w-full border-collapse">
          <thead><tr className="bg-sand-50 border-b border-sand-200">{['Invoice','Patient','Service','Amount','Date','Status'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {invoices.map(({ id, patient, service, amount, date, status }) => (
              <tr key={id} className="border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
                <td className="px-4 py-3 text-[12px] text-slate-400">{id}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-2 text-[13px] font-medium text-slate-800"><div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">{getInitials(patient)}</div>{patient}</div></td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{service}</td>
                <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{amount}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{date}</td>
                <td className="px-4 py-3"><Badge variant={status}>{status==='confirmed'?'Paid':'Unpaid'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecordsView() {
  return (
    <div className="bg-white border border-sand-200 rounded-[18px] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-sand-100">
        <p className="text-[14px] font-semibold text-slate-800">Medical records</p>
        <Button variant="primary" size="sm"><Plus size={13}/> Add record</Button>
      </div>
      <table className="w-full border-collapse">
        <thead><tr className="bg-sand-50 border-b border-sand-200">{['Patient','Record type','Doctor','Date','Notes'].map(h=><th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
        <tbody>
          {[['Emeka Eze','Diabetes review','Dr. Adeyemi','Today','HbA1c improved. Continue metformin.'],
            ['Chioma Uzoka','Antenatal — 28wks','Dr. Bello','1 Apr','BP normal. Fetal heartbeat strong.'],
            ['Amaka Obi','Lab results','Dr. Bello','31 Mar','Full blood count — all within range.'],
            ['Tunde Fashola','General consultation','Dr. Adeyemi','30 Mar','Mild hypertension. Lifestyle changes advised.'],
          ].map(([name,type,doctor,date,note])=>(
            <tr key={name as string} className="border-b border-sand-50 last:border-0 hover:bg-sand-50 cursor-pointer transition-colors">
              <td className="px-4 py-3"><div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-800"><div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">{getInitials(name as string)}</div>{name as string}</div></td>
              <td className="px-4 py-3 text-[13px] text-slate-600">{type as string}</td>
              <td className="px-4 py-3 text-[13px] text-slate-600">{doctor as string}</td>
              <td className="px-4 py-3 text-[13px] text-slate-600">{date as string}</td>
              <td className="px-4 py-3 text-[12px] text-slate-400">{note as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="grid gap-5" style={{gridTemplateColumns:'200px 1fr'}}>
      <div className="flex flex-col gap-0.5">
        {['Clinic profile','Team members','Operating hours','Notifications','Billing setup'].map((item,i)=>(
          <div key={item} className={`px-3 py-2.5 rounded-xl text-[13px] cursor-pointer transition-colors ${i===0?'bg-teal-50 text-teal-700 font-medium':'text-slate-600 hover:bg-sand-100'}`}>{item}</div>
        ))}
      </div>
      <div className="bg-white border border-sand-200 rounded-[18px] p-7">
        <div className="mb-7">
          <p className="text-[14px] font-semibold text-slate-800 mb-4 pb-2.5 border-b border-sand-200">Clinic information</p>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div><label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Clinic name</label><input defaultValue="Gbagada General Hospital" className="w-full px-3.5 py-2.5 text-[13px] bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400"/></div>
            <div><label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Clinic type</label><input defaultValue="General practice / Primary care" className="w-full px-3.5 py-2.5 text-[13px] bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400"/></div>
          </div>
        </div>
        <div className="mb-7">
          <p className="text-[14px] font-semibold text-slate-800 mb-4 pb-2.5 border-b border-sand-200">Contact details</p>
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div><label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Phone</label><input defaultValue="+234 801 234 5678" className="w-full px-3.5 py-2.5 text-[13px] bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400"/></div>
            <div><label className="text-[12px] font-medium text-slate-600 mb-1.5 block">Email</label><input defaultValue="info@gbagadageneral.ng" className="w-full px-3.5 py-2.5 text-[13px] bg-sand-50 border border-sand-200 rounded-xl outline-none focus:border-teal-400"/></div>
          </div>
        </div>
        <button className="px-6 py-2.5 rounded-full bg-teal-700 text-white text-[13px] font-medium cursor-pointer hover:bg-teal-800 transition-colors border-none">Save changes</button>
      </div>
    </div>
  )
}

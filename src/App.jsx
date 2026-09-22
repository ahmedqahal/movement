import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import {
  IconHome,
  IconAnatomy,
  IconLearn,
  IconTools,
  IconGlossary,
  IconBook,
  IconLog,
  IconPlate,
  IconLayers,
  IconStethoscope,
  IconSearch,
  IconCalc,
  IconSun,
  IconMoon,
  IconPrint,
  IconBulb,
  IconGear,
  IconCamera,
  IconPulse,
  IconCart,
  IconCompass,
} from './components/Icons.jsx'
import SearchModal from './components/SearchModal.jsx'
import Home from './pages/Home.jsx'
import Anatomy from './pages/Anatomy.jsx'
import Learn from './pages/Learn.jsx'
import LessonPage from './pages/LessonPage.jsx'
import Tools from './pages/Tools.jsx'
import Glossary from './pages/Glossary.jsx'
import Reference from './pages/Reference.jsx'
import Plates from './pages/Plates.jsx'
import Assembly from './pages/Assembly.jsx'
import Diagnose from './pages/Diagnose.jsx'
import Calculators from './pages/Calculators.jsx'
import Cheatsheets from './pages/Cheatsheets.jsx'
import TestYourself from './pages/TestYourself.jsx'
import Movements from './pages/Movements.jsx'
import Illustrated from './pages/Illustrated.jsx'
import Timegrapher from './pages/Timegrapher.jsx'
import Sourcing from './pages/Sourcing.jsx'
import GuideMe from './pages/GuideMe.jsx'
import PracticeLog from './pages/PracticeLog.jsx'

const NAV = [
  {
    section: 'Explore',
    items: [
      { to: '/', label: 'Home', icon: IconHome, end: true },
      { to: '/guide', label: 'Guide me', icon: IconCompass },
      { to: '/anatomy', label: 'Anatomy Explorer', icon: IconAnatomy },
      { to: '/assembly', label: 'Assembly', icon: IconLayers },
      { to: '/plates', label: 'Technical Plates', icon: IconPlate },
      { to: '/illustrated', label: 'Illustrated Plates', icon: IconCamera },
      { to: '/movements', label: 'Movement Guides', icon: IconGear },
      { to: '/learn', label: 'Learn', icon: IconLearn },
      { to: '/test', label: 'Test Yourself', icon: IconBulb },
      { to: '/diagnose', label: 'Diagnose', icon: IconStethoscope },
      { to: '/reference', label: 'Reference', icon: IconBook },
      { to: '/tools', label: 'Toolkit', icon: IconTools },
      { to: '/sourcing', label: 'Sourcing & Parts', icon: IconCart },
      { to: '/calculators', label: 'Calculators', icon: IconCalc },
      { to: '/timegrapher', label: 'Timegrapher', icon: IconPulse },
      { to: '/cheatsheets', label: 'Cheat-sheets', icon: IconPrint },
      { to: '/glossary', label: 'Glossary', icon: IconGlossary },
    ],
  },
  {
    section: 'Your workshop',
    items: [{ to: '/log', label: 'Practice Log', icon: IconLog }],
  },
]

const ALL_ITEMS = NAV.flatMap((g) => g.items)

function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className="brand__mark" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke="#d0a84f" strokeWidth="1.6" />
      <circle cx="22" cy="22" r="14" fill="none" stroke="#d0a84f" strokeWidth="1" opacity="0.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x1 = 22 + 15 * Math.cos(a)
        const y1 = 22 + 15 * Math.sin(a)
        const x2 = 22 + 19 * Math.cos(a)
        const y2 = 22 + 19 * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d0a84f" strokeWidth={i % 3 === 0 ? 2 : 1} />
      })}
      <line x1="22" y1="22" x2="22" y2="12" stroke="#efe8dc" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="22" x2="30" y2="26" stroke="#efe8dc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="2.4" fill="#d0a84f" />
    </svg>
  )
}

function ThemeToggle({ theme, onToggle, compact }) {
  const light = theme === 'light'
  const label = light ? 'Switch to dark theme' : 'Switch to light theme'
  return (
    <button
      type="button"
      className={compact ? 'mobile-search-btn' : 'theme-toggle'}
      onClick={onToggle}
      title={label}
      aria-label={label}
    >
      {light ? <IconMoon size={compact ? 20 : 17} /> : <IconSun size={compact ? 20 : 17} />}
      {!compact && <span>{light ? 'Dark mode' : 'Light mode'}</span>}
    </button>
  )
}

function Sidebar({ onOpenSearch, theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <Logo />
        <span>
          <span className="brand__name">Movement</span>
          <span className="brand__sub">Watch craft</span>
        </span>
      </Link>
      <button type="button" className="search-trigger" onClick={onOpenSearch}>
        <IconSearch size={17} />
        <span>Search…</span>
        <kbd className="search-kbd">⌘K</kbd>
      </button>
      <nav className="nav">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="nav__label">{group.section}</div>
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav__item ${isActive ? 'active' : ''}`}>
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar__foot">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <div className="sidebar__footer">Learn at your own pace. Your progress is saved on this device.</div>
      </div>
    </aside>
  )
}

function MobileNav({ onOpenSearch, theme, onToggleTheme }) {
  return (
    <>
      <div className="mobile-topbar">
        <Link to="/" className="brand">
          <Logo size={28} />
          <span className="brand__name" style={{ fontSize: '1.15rem' }}>
            Movement
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
          <button type="button" className="mobile-search-btn" onClick={onOpenSearch} aria-label="Search">
            <IconSearch size={20} />
          </button>
        </div>
      </div>
      <nav className="mobile-nav">
        {ALL_ITEMS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    // Daylight is light-first: honour a saved choice, otherwise default to
    // light so we match the pre-paint default in index.html. (We don't follow
    // prefers-color-scheme here — that would flip us to dark on the first
    // visit and write it back, quietly overriding the light-first identity.)
    const saved = localStorage.getItem('movement.theme')
    return saved === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('movement.theme', theme)
  }, [theme])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openSearch = () => setSearchOpen(true)
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <div className="app">
      <ScrollToTop />
      <Sidebar onOpenSearch={openSearch} theme={theme} onToggleTheme={toggleTheme} />
      <div className="main">
        <MobileNav onOpenSearch={openSearch} theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<GuideMe />} />
          <Route path="/anatomy" element={<Anatomy />} />
          <Route path="/assembly" element={<Assembly />} />
          <Route path="/plates" element={<Plates />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<LessonPage />} />
          <Route path="/test" element={<TestYourself />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/illustrated" element={<Illustrated />} />
          <Route path="/timegrapher" element={<Timegrapher />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/diagnose" element={<Diagnose />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/cheatsheets" element={<Cheatsheets />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/log" element={<PracticeLog />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

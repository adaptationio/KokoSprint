import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TabBar from './components/layout/TabBar'
import PageTransition from './components/layout/PageTransition'
import Dashboard from './pages/Dashboard'
import Training from './pages/Training'
import Progress from './pages/Progress'
import Library from './pages/Library'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-bg text-text-primary font-sans pb-20">
        <AnimatedRoutes />
        <TabBar />
      </div>
    </HashRouter>
  )
}

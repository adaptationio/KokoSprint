import { Link, useLocation } from 'react-router-dom'

const tabs = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
      </svg>
    ),
  },
  {
    label: 'Training',
    path: '/training',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Progress',
    path: '/progress',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Library',
    path: '/library',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M6.5 6.5h11M6 12H4a2 2 0 01-2-2V8a2 2 0 012-2h2m12 6h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M6 6v12M18 6v12" />
      </svg>
    ),
  },
]

export default function TabBar() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around">
        {tabs.map(({ label, path, icon }) => {
          const isActive = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={[
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors duration-150',
                isActive ? 'text-neon' : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {icon}
              <span className="text-xs font-medium uppercase tracking-wider leading-none">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

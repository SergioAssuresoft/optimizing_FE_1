import { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const Home = lazy(() => import('./routes/Home'))
const Catalog = lazy(() => import('./routes/Catalog'))
const Dashboard = lazy(() => import('./routes/Dashboard'))
const Reports = lazy(() => import('./routes/Reports'))
const Support = lazy(() => import('./routes/Support'))
const Profile = lazy(() => import('./routes/Profile'))

const routePrefetchers: Record<string, () => Promise<unknown>> = {
  '/': () => import('./routes/Home'),
  '/catalog': () => import('./routes/Catalog'),
  '/dashboard': () => import('./routes/Dashboard'),
  '/reports': () => import('./routes/Reports'),
  '/support': () => import('./routes/Support'),
  '/profile': () => import('./routes/Profile')
}

const prefetchedRoutes = new Set<string>()

const prefetchRoute = (path: string) => {
  const loader = routePrefetchers[path]
  if (!loader || prefetchedRoutes.has(path)) return
  prefetchedRoutes.add(path)
  loader()
}

const links = [
  { to: '/', label: 'Home', description: 'Carga hero, fuentes y assets pesados.' },
  { to: '/catalog', label: 'Catalog', description: 'Gran dataset + filtros sin memo.' },
  { to: '/dashboard', label: 'Dashboard', description: 'Cálculos de chart más costosos.' },
  { to: '/reports', label: 'Reports', description: 'Filtros encadenados y tablas densas.' },
  { to: '/support', label: 'Support', description: 'Formularios y listas que recalculan todo.' },
  { to: '/profile', label: 'Profile', description: 'Contexto global dispara renders.' }
]

export default function App() {
  return (
    <div className="app-shell">
      <aside className="app-panel">
        <div className="app-brand">
          <div className="app-brand__mark">UI</div>
          <div>
            <p className="app-brand__title">Performance Lab</p>
            <small>Escenarios didácticos para detectar cuellos de botella.</small>
          </div>
        </div>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onMouseEnter={() => prefetchRoute(link.to)}
              onFocus={() => prefetchRoute(link.to)}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              <span className="nav-link__label">{link.label}</span>
              <span className="nav-link__desc">{link.description}</span>
            </NavLink>
          ))}
        </nav>
        <div className="app-panel__footer">
          <p className="panel-note">
            Mide el impacto de cada optimización con herramientas como Performance y React DevTools.
          </p>
        </div>
      </aside>

      <main className="app-content">
        <Suspense
          fallback={
            <div className="loading-panel">
              <div className="loading-panel__pulse" />
              <p>Cargando vista…</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/support" element={<Support />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

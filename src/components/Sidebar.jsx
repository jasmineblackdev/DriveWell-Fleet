import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Truck,
  LogOut,
  User,
  TrendingUp,
  BarChart2,
  Activity,
  RefreshCw,
  Plug,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'      },
  { path: '/roster',      icon: Users,           label: 'DOT Roster'     },
  { path: '/reports',     icon: FileText,        label: 'Reports'        },
  { path: '/trends',      icon: TrendingUp,      label: 'Wellness Trends'},
  { path: '/analytics',   icon: BarChart2,       label: 'Engagement'     },
  { path: '/activity',    icon: Activity,        label: 'Activity Feed'  },
  { path: '/renewals',    icon: RefreshCw,       label: 'DOT Renewals'   },
  { path: '/integrations',icon: Plug,            label: 'Integrations'   },
  { path: '/settings',    icon: Settings,        label: 'Settings'       },
]

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Truck size={20} color="white" />
        </div>
        <div>
          <p style={{ fontWeight: '700', fontSize: '15px', lineHeight: 1.2 }}>DriveWell</p>
          <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.2 }}>Fleet Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '2px',
              textDecoration: 'none',
              background: active ? '#eff6ff' : 'transparent',
              color: active ? '#2563eb' : '#374151',
              fontWeight: active ? '600' : '400',
              fontSize: '14px',
            }}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '8px',
          marginBottom: '4px',
          background: '#f9fafb',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="#2563eb" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.company}
            </p>
          </div>
        </div>
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', padding: '8px 12px',
          border: 'none', background: 'none', color: '#6b7280',
          borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
        }}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

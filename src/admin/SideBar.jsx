import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdDashboard,
  MdMailOutline,
  MdPeopleOutline,
  MdSettings,
  MdMenu,
  MdClose,
  MdLogout,
} from 'react-icons/md'
import { supabase } from '../utils/supabase'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: MdDashboard },
  { key: 'enquiry', label: 'Enquiry', icon: MdMailOutline },
  { key: 'users', label: 'Users', icon: MdPeopleOutline },
  { key: 'settings', label: 'Settings', icon: MdSettings },
]

const SideBar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = (key) => {
    setActiveTab(key)
    setIsOpen(false) // close on mobile after selecting
  }

  const handleLogout = async () => {
    setIsOpen(false)
    // Navigate first so Admin/ProtectedRoute unmount immediately — this avoids
    // a race where ProtectedRoute's own auth listener sees the session clear
    // and redirects to /admin/login before this navigate() call takes effect.
    navigate('/', { replace: true })
    await supabase.auth.signOut()
  }

  return (
    <>
      {/* Mobile top bar with hamburger + a standalone logout button, reachable without opening the menu */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <span className="text-lg font-semibold">Admin Panel</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <MdLogout size={22} />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle sidebar" className="p-2">
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          flex flex-col
        `}
      >
        <div className="hidden md:flex items-center px-6 py-5 text-xl font-bold border-b border-gray-800">
          Admin Panel
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${
                  activeTab === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <MdLogout size={20} />
            <span>Log out</span>
          </button>
        </div>

        <div className="px-3 py-4 border-t border-gray-800 text-xs text-gray-500">
          © {new Date().getFullYear()} Crew Aura
        </div>
      </aside>
    </>
  )
}

export default SideBar
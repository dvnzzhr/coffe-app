"use client"
import { signOut, useSession } from "next-auth/react"
import { Home, ListChecks, Store, Users, LogOut, Menu, PlusSquare, CheckSquare, Tag, Wifi, Globe, Moon, Sun, Languages } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { useTheme } from "next-themes"
import { useLanguage } from "./RootProvider"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  // Custom contexts
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { lang, toggleLanguage, t } = useLanguage()

  const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')

  const role = (session?.user as any)?.role || "user"
  const userName = session?.user?.name || "User"

  const adminMenu = [
    { icon: <Home size={20} />, label: t("dashboard"), href: "/dashboard" },
    { icon: <CheckSquare size={20} />, label: t("approvals"), href: "/dashboard/approvals" },
    { icon: <ListChecks size={20} />, label: t("submissionsList"), href: "/dashboard/submissions" },
    { icon: <Store size={20} />, label: t("cafeManagement"), href: "/dashboard/cafes" },
    { icon: <Users size={20} />, label: t("userManagement"), href: "/dashboard/users" },
    { icon: <Tag size={20} />, label: t("keywordManagement"), href: "/dashboard/keywords" },
    { icon: <Wifi size={20} />, label: t("facilityManagement"), href: "/dashboard/facilities" },
  ]

  const ownerMenu = [
    { icon: <Home size={20} />, label: t("dashboard"), href: "/dashboard/owners" },
    { icon: <PlusSquare size={20} />, label: t("newSubmission"), href: "/dashboard/submissions/new" },
    { icon: <ListChecks size={20} />, label: t("mySubmissions"), href: "/dashboard/submissions" },
  ]

  const userMenu = [
    { icon: <Home size={20} />, label: t("dashboard"), href: "/dashboard" },
  ]

  const menuItems = role === "admin" ? adminMenu : role === "owner_cafe" ? ownerMenu : userMenu

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1400] lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[1500] lg:relative lg:z-0
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"} 
        bg-slate-900 border-r border-slate-900 dark:border-slate-800 text-white transition-all duration-300 flex flex-col h-full shrink-0 shadow-2xl lg:shadow-none
      `}>
        <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-4 shrink-0 justify-between lg:justify-start">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-lg shadow-pink-500/15 ring-1 ring-white/10">
              <Image
                src="/logocafe.png"
                alt="Logo SIG Cafe"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </div>
            {(isOpen || typeof window !== 'undefined' && window.innerWidth < 1024) && <span className="truncate text-lg font-black tracking-tight">SIG CAFE</span>}
          </div>
          {/* Close button only on mobile */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center gap-4 p-3 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded-lg transition-colors text-slate-300 hover:text-white whitespace-nowrap">
              <div className="shrink-0">{item.icon}</div>
              {(isOpen || typeof window !== 'undefined' && window.innerWidth < 1024) && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-4 p-3 hover:bg-slate-800 dark:hover:bg-slate-800/80 rounded-lg transition-colors text-slate-300 hover:text-white whitespace-nowrap"
          >
            <Globe size={20} className="shrink-0" />
            {(isOpen || typeof window !== 'undefined' && window.innerWidth < 1024) && <span>{t("home")}</span>}
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-4 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white rounded-lg transition-all shrink-0"
          >
            <LogOut size={20} className="shrink-0" />
            {(isOpen || typeof window !== 'undefined' && window.innerWidth < 1024) && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-[1000] transition-colors duration-300">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Menu />
          </button>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* TOGGLES AREA */}
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4 sm:pr-6">
               <button 
                  onClick={toggleLanguage} 
                  className="px-3 py-1.5 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                  title="Switch Language"
               >
                  <Languages size={14} /> 
                  {lang === 'id' ? 'ID' : 'EN'}
               </button>
               
               <button 
                  onClick={toggleTheme} 
                  className="p-2 border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-all flex items-center justify-center w-9 h-9"
                  title="Toggle Dark Mode"
               >
                  {mounted && (resolvedTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />)}
               </button>
            </div>

            {/* AVATAR AREA */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{userName}</p>
                <p className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">{role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold shadow-sm border border-pink-200 dark:border-pink-800">
                {userName.charAt(0)}
              </div>
            </div>

          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50 dark:bg-slate-950 scroll-smooth transition-colors duration-300 custom-scrollbar">
          <div className="max-w-7xl mx-auto dark:text-slate-200">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  )
}

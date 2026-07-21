"use client"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { BarChart3, TrendingUp, AlertCircle, Coffee, Users, ClipboardCheck, ArrowUpRight, ArrowDownRight, Loader2, MapPin } from "lucide-react"
import { getDashboardStats } from "./actions"
import { useSession } from "next-auth/react"
import { useLanguage } from "@/components/RootProvider"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await getDashboardStats()
    setStats(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const statCards = [
    { label: t("statTotalSub"), value: stats?.totalSubmissions || 0, icon: <ClipboardCheck className="text-pink-600 dark:text-pink-400 w-8 h-8" />, color: "bg-pink-100 dark:bg-pink-900/40" },
    { label: t("statActiveCafes"), value: stats?.activeCafes || 0, icon: <Coffee className="text-orange-600 dark:text-orange-400 w-8 h-8" />, color: "bg-orange-100 dark:bg-orange-900/40" },
    { label: t("statTotalOwner"), value: stats?.totalOwners || 0, icon: <Users className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />, color: "bg-indigo-100 dark:bg-indigo-900/40" },
    { label: t("statRejected"), value: stats?.rejectedSubmissions || 0, icon: <AlertCircle className="text-red-600 dark:text-red-400 w-8 h-8" />, color: "bg-red-100 dark:bg-red-900/40" },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8 pl-1 transition-colors duration-300">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t("dashWelcome")}{session?.user?.name || "User"}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">{t("dashSub")}</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <Loader2 className="animate-spin text-pink-600 dark:text-pink-500 mb-4" size={40} />
          <p className="text-slate-400 dark:text-slate-500 font-medium">{t("dashLoading")}</p>
        </div>
      ) : (
        <>
          {/* Grid Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-colors duration-300">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-pink-500 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-40">
                
                {/* Watermark Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-[0.03] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">
                  {stat.icon}
                </div>

                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className={`p-3 ${stat.color} rounded-2xl`}>{stat.icon}</div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold px-3 py-1.5 rounded-xl text-slate-400 dark:text-slate-500 uppercase tracking-wider border border-slate-100 dark:border-slate-700 shadow-inner">Real-time</div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-colors duration-300">
            {/* Aktivitas Terbaru */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-3 text-lg">
                  <div className="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-xl"><BarChart3 size={20} className="text-pink-600 dark:text-pink-400" /></div> {t("recentActivity")}
                </h2>
              </div>
              <div className="space-y-4">
                {stats?.latestSubmissions?.length > 0 ? (
                  stats.latestSubmissions.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/60 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm text-slate-500 dark:text-slate-300 font-black text-xs tracking-wider">{sub.reqNumber}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{sub.cafeName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={12} /> {sub.address}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-sm border ${
                        sub.status === 'Disetujui' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 
                        sub.status === 'Ditolak' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 dark:text-slate-500 py-10 font-medium">{t("noActivity")}</p>
                )}
              </div>
            </div>

            {/* Insight Ringkas */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-fit">
              <h2 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 text-lg">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-xl"><TrendingUp size={20} className="text-green-600 dark:text-green-400" /></div> {t("systemSummary")}
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {t("systemDesc1")}<strong className="dark:text-white">{stats?.activeCafes}{t("systemDesc2")}</strong>
                    {t("systemDesc3")}
                  </p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">{t("conversionRate")}</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {stats?.totalSubmissions > 0 ? Math.round((stats.activeCafes / stats.totalSubmissions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 rounded-full" 
                      style={{ width: `${stats?.totalSubmissions > 0 ? (stats.activeCafes / stats.totalSubmissions) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
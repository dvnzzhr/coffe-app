"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { 
  Coffee, ShieldCheck, Navigation2, LogIn, LayoutDashboard, Store,
  Map, Server, Cpu, ChevronDown, MessageCircleQuestion, Link2, MapPin,
  Moon, Sun, Languages
} from "lucide-react"
import MapComponent from "@/components/MapComponent"
import { useLanguage } from "@/components/RootProvider"

const FAQ_DATA = [
  {
    id: 1,
    question: "Bagaimana cara merubah pusat pencarian peta ke area kota lain?",
    answer: "Secara asal (default), peta berbasis di sudut Surabaya Selatan sesuai zona verifikasi kami. Jika Anda menggeser peta ke wilayah baru, Anda dapat menggunakan tombol 'Cari di Area Ini' (jika masih aktif) atau cukup mengetik area tersebut di bilah pencarian cerdas kami."
  },
  {
    id: 2,
    question: "Kenapa lokasi saya selalu bermulai dari Wonokromo saat menekan 'Lokasi Terdekat'?",
    answer: "Aplikasi ini bergantung pada izin pembacaan koordinat GPS peranti/browser (Geolocation API). Jika Anda tidak sengaja mengklik 'Tolak/Block' pada sembulan izin lokasi Chrome/Safari, kami otomatis menggunakan kordinat jantung kota Surabaya (Stasiun Wonokromo) agar peta tidak menjadi kosong putih."
  },
  {
    id: 3,
    question: "Bagaimana cara mendaftarkan cafe saya sendiri ke sistem?",
    answer: "Prosesnya sangat mudah. Klik tautan 'Daftar Sebagai Owner' pada halaman utama. Setelah itu Anda bisa masuk ke Dashboard pengelolaan (Terkunci via NextAuth), dan di sana tersedia portal 'Data Cafe' di mana Anda bisa menginput menu, titik kordinat manual, beserta fasilitasnya secara mandiri."
  },
  {
    id: 4,
    question: "Mengapa ada PIN peta berwarna Oranye dan Pink?",
    answer: "Ini adalah wujud komitmen hibrida sistem kami. Pin Hitam/Oranye menunjukkan lokasi tersebut sudah tervalidasi sangat akurat oleh database kami sendiri. Sedangkan Pin Merah Muda (Pink) menyimbolkan data eksternal/rekomendatif yang baru saja dilempar dengan antarmuka Foursquare (bisa jadi kurang presisi)."
  },
  {
    id: 5,
    question: "Apa arti status 'Hasil Terbaik' (Best Match) berwarna hijau?",
    answer: "Itu adalah indikator algoritma pencarian. Jika cafe memiliki nama atau tag fasilitas yang persis dengan kata kunci yang Anda masukkan di kotak pencarian, kami meroketkannya ke urutan teratas (Poin Relevansi 100) dan menobatinya dengan Pin Hijau bersinar."
  }
]

export default function LandingPage() {
  const { data: session } = useSession()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { lang, toggleLanguage, t } = useLanguage()
  const [dbCafes, setDbCafes] = useState<any[]>([])
  const [keywordMapping, setKeywordMapping] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [openFaqId, setOpenFaqId] = useState<number | null>(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/public-map-data')
      .then((res) => res.json())
      .then((data) => {
        setDbCafes(data.cafes || [])
        setKeywordMapping(data.keywordMapping || {})
      })
      .catch((error) => console.error('Map data fetch error:', error))
      .finally(() => setLoading(false))

    // Smooth scroll handler for anchor links
    const handleHashChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (!link) return
      
      const href = link.getAttribute('href')
      if (href?.startsWith('#')) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    document.addEventListener('click', handleHashChange)
    return () => document.removeEventListener('click', handleHashChange)
  }, [])

  const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 h-20 transition-all">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-pink-500/20 ring-1 ring-pink-100 dark:ring-pink-900/50">
              <Image
                src="/logocafe.png"
                alt="Logo SIG Cafe"
                fill
                sizes="48px"
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">SIG Cafe</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
            <a href="#map" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("mapExplorer")}</a>
            <a href="#about" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("aboutSystem")}</a>
            <a href="#faq" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("helpCenter")}</a>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Context Switches */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
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

            {session ? (
              <Link 
                href={(session?.user as any)?.role === "owner_cafe" ? "/dashboard/owners" : "/dashboard"}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
              >
                <LayoutDashboard size={18} /> {t("dashboard")}
              </Link>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-pink-500/20"
              >
                <LogIn size={18} /> {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20 flex flex-col">
        
        {/* SECTION 1: Hero Section */}
        <section className="px-6 py-20 md:py-32 text-center max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-10 shadow-sm border border-pink-100 dark:border-pink-900/50 animate-fade-in-up">
            <ShieldCheck size={16} /> {t("heroBadge")}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            {t("heroTitle1")} <span className="text-pink-600 dark:text-pink-500">{t("heroTitleHighlight")}</span>{t("heroTitle2")}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
            {t("heroDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#map" className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 shadow-2xl shadow-slate-900/20 dark:shadow-white/10">
              {t("heroCta")} <Navigation2 size={18} className="rotate-45" />
            </a>
            {!session && (
              <Link href="/register" className="bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 border-2 border-pink-100 dark:border-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-pink-50 dark:hover:bg-slate-800 hover:border-pink-200 transition-all flex items-center gap-2 shadow-sm">
                <Store size={18} /> {t("heroDaftar")}
              </Link>
            )}
            <div className="hidden sm:flex bg-white dark:bg-slate-900 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold items-center gap-2 shadow-sm">
              <Coffee size={18} className="text-orange-500" /> {dbCafes.length}+ {t("heroLocation")}
            </div>
          </div>
        </section>

        {/* SECTION 2: Map Explorer Preview */}
        <section id="map" className="w-full flex-1 min-h-[700px] px-4 sm:px-8 md:px-12 pt-0 scroll-mt-24">
          <div className="w-full h-full max-w-[1600px] mx-auto">
            {loading ? (
              <div className="w-full h-[600px] bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="animate-spin text-pink-600 mb-4">
                  <Coffee size={40} />
                </div>
                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">{t("mapLoading")}</p>
              </div>
            ) : (
              <div className="w-full h-[850px] md:h-[800px] relative group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 dark:shadow-black/70 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-indigo-900/10 bg-white dark:bg-slate-950">
                <MapComponent dbCafes={dbCafes} keywordMapping={keywordMapping} />
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: About App (Tech Stack Bento Grid) */}
        <section id="about" className="py-24 px-6 scroll-mt-20 relative bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16 max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                 {t("aboutTitle1")} <span className="text-pink-600 dark:text-pink-500">{t("aboutTitleHighlight")}</span>
               </h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                 {t("aboutDesc")}
               </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 {
                   icon: <Map size={28} />,
                   title: t("aboutFeat1Title"),
                   desc: t("aboutFeat1Desc")
                 },
                 {
                   icon: <Server size={28} />,
                   title: t("aboutFeat2Title"),
                   desc: t("aboutFeat2Desc")
                 },
                 {
                   icon: <Cpu size={28} />,
                   title: t("aboutFeat3Title"),
                   desc: t("aboutFeat3Desc")
                 },
                 {
                   icon: <ShieldCheck size={28} />,
                   title: t("aboutFeat4Title"),
                   desc: t("aboutFeat4Desc")
                 }
               ].map((feature, idx) => (
                 <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-pink-100 dark:hover:border-pink-900/50 hover:-translate-y-2 transition-all duration-300 group">
                   <div className="w-14 h-14 bg-white dark:bg-slate-800 text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-pink-200 transition-colors">
                     {feature.icon}
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
                    {feature.desc}
                   </p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* SECTION 4: FAQ & Bantuan */}
        <section id="faq" className="py-24 px-6 scroll-mt-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
               <div className="w-16 h-16 bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-pink-100 dark:border-slate-700">
                 <MessageCircleQuestion size={32} />
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                 {t("faqTitle")}
               </h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                 {t("faqSub")}
               </p>
             </div>

             <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-4 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
               <div className="space-y-4">
                 {FAQ_DATA.map((faq) => {
                   const isOpen = openFaqId === faq.id
                   return (
                     <div 
                       key={faq.id} 
                       className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                         isOpen ? 'border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-pink-900/10 shadow-sm' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                       }`}
                     >
                       <button
                         onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                         className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                       >
                         <span className={`font-black pr-8 leading-snug ${isOpen ? 'text-pink-700 dark:text-pink-500' : 'text-slate-700 dark:text-slate-300'}`}>
                           {faq.question}
                         </span>
                         <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-pink-600 border-pink-600 text-white rotate-180' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                            <ChevronDown size={18} />
                         </div>
                       </button>
                       
                       <div 
                         className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                           isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                         }`}
                       >
                         <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed border-t border-pink-200/50 dark:border-pink-900/50 pt-4">
                           {faq.answer}
                         </p>
                       </div>
                     </div>
                   )
                 })}
               </div>
             </div>
          </div>
        </section>

        {/* SECTION 5: Final CTA */}
        <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-300">
           <div className="max-w-5xl mx-auto">
             <div className="bg-slate-900 dark:bg-slate-900 overflow-hidden relative rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-slate-900/20 dark:shadow-black/50 border dark:border-slate-800">
               <h2 className="relative z-10 text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                  {t("ctaTitle")}
               </h2>
               <p className="relative z-10 text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-10">
                  {t("ctaDesc")}
               </p>
               
               <div className="relative z-10 flex flex-wrap justify-center gap-4">
                  <a href="#map" className="bg-pink-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg border border-pink-500 hover:bg-pink-500 hover:scale-105 transition-all inline-flex items-center gap-2">
                    <MapPin size={18} /> {t("ctaBtn1")}
                  </a>
                  {!session && (
                    <Link href="/register" className="bg-white/10 backdrop-blur text-white font-bold px-10 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2">
                       <Link2 size={18} /> {t("ctaBtn2")}
                    </Link>
                  )}
               </div>
             </div>
           </div>
        </section>

      </main>

      {/* Footer Minimalist SaaS */}
      <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-pink-50 dark:bg-pink-900/20 ring-1 ring-pink-100 dark:ring-pink-900/50">
              <Image src="/logocafe.png" alt="Logo" fill sizes="32px" className="object-contain p-1" />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase leading-none">SIG Cafe</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
            © {new Date().getFullYear()} {t("footerCopyright")}
          </p>
          <div className="flex gap-6 text-slate-400 dark:text-slate-500 text-sm font-bold">
            <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("footerL1")}</a>
            <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("footerL2")}</a>
            <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">{t("footerL3")}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

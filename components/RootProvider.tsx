"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

// ------------- LANGUAGE LOGIC -------------
type Language = 'id' | 'en'

interface LanguageContextType {
  lang: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside RootProvider')
  return ctx
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  id: {
    dashboard: "Dashboard",
    approvals: "Persetujuan Lokasi",
    submissionsList: "Daftar Pengajuan",
    mySubmissions: "Status Pengajuan",
    newSubmission: "Pengajuan Lokasi Baru",
    cafeManagement: "Manajemen Cafe",
    userManagement: "Manajemen User",
    keywordManagement: "Manajemen Keyword",
    facilityManagement: "Manajemen Fasilitas",
    home: "Beranda Utama",
    logout: "Keluar Akun",
    // Dashboard Home
    dashWelcome: "Selamat Datang, ",
    dashSub: "Berikut adalah ringkasan performa operasional SIG Cafe hari ini.",
    dashLoading: "Menyiapkan dashboard Anda...",
    statTotalSub: "Total Pengajuan",
    statActiveCafes: "Cabang Aktif",
    statTotalOwner: "Total Owner",
    statRejected: "Pengajuan Ditolak",
    recentActivity: "Pengajuan Terbaru",
    noActivity: "Belum ada pengajuan masuk.",
    systemSummary: "Ringkasan Sistem",
    systemDesc1: "Sistem SIG Cafe saat ini memiliki ",
    systemDesc2: " cabang aktif",
    systemDesc3: " yang tersebar. Monitor terus setiap pengajuan lokasi baru untuk ekspansi bisnis yang lebih baik.",
    conversionRate: "Konversi Pengajuan",
    // Landing Page Nav
    mapExplorer: "Eksplorasi Peta",
    aboutSystem: "Tentang Sistem",
    helpCenter: "Pusat Bantuan",
    signIn: "Masuk Akun",
    // Landing Page Hero
    heroBadge: "Sistem Informasi Geografis Terverifikasi",
    heroTitle1: "Temukan Titik ",
    heroTitleHighlight: "Café Terbaik",
    heroTitle2: " di Sekitar Anda.",
    heroDesc: "SIG Cafe memudahkan Anda mencari lokasi nongkrong yang strategis dengan data geografis yang akurat dan terverifikasi oleh tim spasial kami.",
    heroCta: "Mulai Eksplorasi",
    heroDaftar: "Daftar Sebagai Owner",
    heroLocation: "Lokasi Terdaftar",
    mapLoading: "Menyiapkan Mesin Geospasial...",
    // Landing Page About
    aboutTitle1: "Mengapa ",
    aboutTitleHighlight: "SIG Cafe?",
    aboutDesc: "Sistem web spasial canggih yang dirancang murni untuk memecahkan masalah klasik para pemburu tempat nongkrong di Surabaya Selatan.",
    aboutFeat1Title: "Pemetaan Terbuka",
    aboutFeat1Desc: "Didukung pustaka Leaflet JS kustom dan arsitektur OpenStreetMap (OSM) tanpa membebani peramban Anda.",
    aboutFeat2Title: "Integrasi Hibrida",
    aboutFeat2Desc: "Pencarian cerdas gabungan (Federated) antara Database Prisma internal dan layanan API Publik mutakhir Foursquare.",
    aboutFeat3Title: "Infrastruktur Super",
    aboutFeat3Desc: "Dibangun dengan fondasi Next.js rute aplikasi baru, memastikan respons waktu seketika saat pencarian Peta.",
    aboutFeat4Title: "Validasi Owner",
    aboutFeat4Desc: "Titik kafe tidak sembarangan; Mitra Kafe mendaftar diamankan NextAuth dan ditinjau teliti oleh Admin.",
    // Landing Page FAQ
    faqTitle: "Pusat Bantuan",
    faqSub: "Jawaban atas keraguan Anda saat menyusuri antarmuka peta kami.",
    // Landing Page CTA
    ctaTitle: "Sudah Siap Membuka Peta?",
    ctaDesc: "Bergabung dengan jaringan eksplorasi dan daftarkan cafe milik Anda langsung ke dalam peta terpadu kami tanpa biaya seperak pun.",
    ctaBtn1: "Akses Area Peta Utama",
    ctaBtn2: "Daftar Kemitraan Ekstra",
    footerCopyright: "SIG Cafe App. Dibangun menggunakan Next.js & Foursquare API.",
    footerL1: "Privasi",
    footerL2: "Syarat API",
    footerL3: "Kontak Developer",
  },
  en: {
    dashboard: "Dashboard",
    approvals: "Location Approvals",
    submissionsList: "Submission List",
    mySubmissions: "Submission Status",
    newSubmission: "New Location Request",
    cafeManagement: "Cafe Management",
    userManagement: "User Management",
    keywordManagement: "Keyword Management",
    facilityManagement: "Facility Management",
    home: "Main Homepage",
    logout: "Sign Out",
    // Dashboard Home
    dashWelcome: "Welcome, ",
    dashSub: "Here is the summary of SIG Cafe's operational performance today.",
    dashLoading: "Preparing your dashboard...",
    statTotalSub: "Total Submissions",
    statActiveCafes: "Active Branches",
    statTotalOwner: "Total Owners",
    statRejected: "Rejected Submissions",
    recentActivity: "Latest Submissions",
    noActivity: "No incoming submissions yet.",
    systemSummary: "System Summary",
    systemDesc1: "SIG Cafe system currently has ",
    systemDesc2: " active branches",
    systemDesc3: " spread across the area. Keep monitoring every new location submission for better business expansion.",
    conversionRate: "Submission Conversion",
    // Landing Page Nav
    mapExplorer: "Map Explorer",
    aboutSystem: "About System",
    helpCenter: "Help Center",
    signIn: "Sign In",
    // Landing Page Hero
    heroBadge: "Verified Geographic Information System",
    heroTitle1: "Discover the Best ",
    heroTitleHighlight: "Cafés",
    heroTitle2: " Around You.",
    heroDesc: "SIG Cafe makes it easy to find strategic hangout spots with accurate geographic data verified by our spatial team.",
    heroCta: "Start Exploring",
    heroDaftar: "Register as Owner",
    heroLocation: "Registered Locations",
    mapLoading: "Preparing Geospatial Engine...",
    // Landing Page About
    aboutTitle1: "Why ",
    aboutTitleHighlight: "SIG Cafe?",
    aboutDesc: "An advanced spatial web system designed strictly to solve the classic problem of hangout hunters in South Surabaya.",
    aboutFeat1Title: "Open Mapping",
    aboutFeat1Desc: "Powered by custom Leaflet JS library and OpenStreetMap (OSM) architecture without overloading your browser.",
    aboutFeat2Title: "Hybrid Integration",
    aboutFeat2Desc: "Federated smart search combining internal Prisma Database and Foursquare's cutting-edge Public API services.",
    aboutFeat3Title: "Super Infrastructure",
    aboutFeat3Desc: "Built on top of Next.js app router foundations, ensuring instant response times during map searches.",
    aboutFeat4Title: "Owner Validation",
    aboutFeat4Desc: "Cafe locations aren't random; Cafe Partners register securely via NextAuth and are thoroughly reviewed by Admins.",
    // Landing Page FAQ
    faqTitle: "Help Center",
    faqSub: "Answers to your doubts while navigating our map interface.",
    // Landing Page CTA
    ctaTitle: "Ready to Open the Map?",
    ctaDesc: "Join the exploration network and register your own cafe directly into our integrated map at no cost whatsoever.",
    ctaBtn1: "Access Main Map Area",
    ctaBtn2: "Register Extra Partnership",
    footerCopyright: "SIG Cafe App. Built using Next.js & Foursquare API.",
    footerL1: "Privacy",
    footerL2: "API Terms",
    footerL3: "Developer Contact",
  }
}

// ------------- MAIN PROVIDER -------------
export default function RootProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('id')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language | null
    if (savedLang) setLang(savedLang)
    
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'id' ? 'en' : 'id'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || key
  }

  // Await mount purely for language to avoid mismatches
  if (!mounted) return <div className="min-h-screen bg-transparent" /> 

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    </ThemeProvider>
  )
}

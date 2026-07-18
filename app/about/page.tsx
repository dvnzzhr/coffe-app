import Image from "next/image"
import Link from "next/link"
import { Map, Server, ShieldCheck, Cpu, ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-white/70 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-4xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-slate-900 tracking-tight uppercase">Tentang SIG</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative mx-auto mb-6 h-28 w-28 overflow-hidden rounded-3xl bg-white shadow-xl shadow-pink-500/20 ring-1 ring-pink-100">
            <Image
              src="/logocafe.png"
              alt="Logo SIG Cafe"
              fill
              sizes="112px"
              className="object-contain p-2"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Mengapa <span className="text-pink-600">SIG Cafe?</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Sistem Informasi Geografis (SIG) Cafe dibangun untuk memecahkan masalah klasik para pemburu tempat nongkrong: mencari cafe yang estetik, dekat, dan berfasilitas lengkap secara visual di atas peta interaktif sungguhan.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Pemetaan Terbuka</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Kami menggunakan pustaka <strong>Leaflet JS</strong> dan data dasar dari <strong>OpenStreetMap (OSM)</strong> untuk merender lingkungan dunia nyata yang ringan & bebas biaya.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Server size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Integrasi Hibrida</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Database kami adalah kombinasi antara data eksklusif di server lokal (lewat <strong className="text-blue-500">Prisma</strong>) dan API publik berkekuatan masif milik <strong className="text-pink-500">Foursquare</strong>.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Infrastruktur Modern</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Sistem ini berjalan sepenuhnya di atas ekosistem eksekusi <strong className="text-slate-900 text-black border px-1.5 py-0.5 rounded mr-1">Next.js</strong> yang menjamin pemuatan instan (Server-Side Rendering) dan rute yang bersih.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Autentikasi Aman</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Sistem tata kelola dasbor kami dikunci menggunakan arsitektur <strong>NextAuth</strong>. Selipan hak akses yang memisahkan Admin dan mitra pemilik cafe terkelola ketat.
            </p>
          </div>
        </div>

        {/* Footer Area / CTA */}
        <div className="bg-pink-600 text-white p-10 rounded-[2.5rem] text-center shadow-xl shadow-pink-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
          <h2 className="relative z-10 text-2xl md:text-3xl font-black mb-4">Siap untuk Mulai Eksplorasi?</h2>
          <p className="relative z-10 text-pink-100 mb-8 max-w-lg mx-auto">Masuk ke ruang peta sekarang untuk mengakses ribuan direktori memukau kami secara instan tanpa hambatan.</p>
          <Link href="/map" className="relative z-10 bg-white text-pink-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
            Buka Peta Besar Sekarang
          </Link>
        </div>

      </main>
    </div>
  )
}

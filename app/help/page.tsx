"use client"
import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, MessageCircleQuestion, Link2, MapPin, ArrowLeft } from "lucide-react"

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

export default function HelpPage() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-[2000] bg-white/70 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-3xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> Beranda
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-slate-900 tracking-tight uppercase">Pusat Bantuan</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-white shadow-sm">
            <MessageCircleQuestion size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Bantuan & Panduan
          </h1>
          <p className="text-slate-500 text-lg">
            Temukan jawaban atas pelik dan kebingungan navigasi Anda di peta spasial kami.
          </p>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Tanya Jawab Populer (FAQ)</h2>
          
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => {
              const isOpen = openId === faq.id
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isOpen ? 'border-pink-200 bg-pink-50/30' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  >
                    <span className={`font-bold pr-8 leading-snug ${isOpen ? 'text-pink-700' : 'text-slate-700'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} 
                    />
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-200 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fast Links Area */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/register" className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-3xl flex items-center justify-between text-white transition-all shadow-xl shadow-slate-900/10">
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-1"><Link2 size={16} /> Daftar Mitra</h3>
              <p className="text-slate-400 text-xs">Jadilah pendaftar cafe verified pertama.</p>
            </div>
          </Link>

          <Link href="/map" className="group bg-pink-600 hover:bg-pink-700 p-6 rounded-3xl flex items-center justify-between text-white transition-all shadow-xl shadow-pink-600/20">
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-1"><MapPin size={16} /> Buka Peta Interaktif</h3>
              <p className="text-pink-200 text-xs">Akses UI utama (FullScreen Map).</p>
            </div>
          </Link>
        </div>

      </main>
    </div>
  )
}

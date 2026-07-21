"use client";

import dynamic from "next/dynamic";
import { 
  Coffee, 
  ImageIcon, 
  PhoneOff, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  X,
  MapPin
} from "lucide-react";

// Import map component without SSR to avoid hydration crashes
const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), { ssr: false });

type Props = {
  open: boolean;
  submission: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRevision: () => void;
};

export default function SubmissionDetailModal({
  open,
  submission,
  onClose,
  onApprove,
  onReject,
  onRevision,
}: Props) {
  if (!open || !submission) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="bg-white text-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-20">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Detail Pengajuan Cafe</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              No. Req: <span className="text-pink-600">{submission.reqNumber || submission.id}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          
          {/* Section 1: Spasial & Informasi Dasar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: General Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-pink-600" /> Informasi Utama
                </h3>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Café</p>
                    <p className="font-bold text-slate-800">{submission.cafeName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Lengkap</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{submission.address}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kapasitas</p>
                      <p className="font-bold text-slate-800">{submission.capacity} <span className="text-sm font-medium text-slate-500">Kursi</span></p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jam Buka</p>
                      <p className="font-bold text-slate-800">{submission.openingHours || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Telepon</p>
                    {submission.phone ? (
                      <p className="font-bold text-slate-800">{submission.phone}</p>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-500 rounded-lg text-xs font-bold">
                        <PhoneOff size={14} /> TIdak ada kontak
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Spasial Mapping */}
            <div>
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-pink-600" /> Titik Peta Koordinat
              </h3>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm h-64 group">
                <LocationPickerMap 
                  latitude={submission.latitude} 
                  longitude={submission.longitude} 
                  onChange={() => {}} // dummy function since it's read only
                />
                
                {/* Transparent Overlay to block pointer events (Read-Only Hack) */}
                <div className="absolute inset-0 z-[2000] cursor-default bg-transparent"></div>
                
                {/* Lat Lng Labels Floating */}
                <div className="absolute bottom-3 right-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm z-[2001] flex justify-between border border-white border-t-slate-100">
                  <span className="flex flex-col">
                    <span className="text-[10px] text-pink-600 uppercase tracking-wider">Lat</span>
                    {submission.latitude}
                  </span>
                  <span className="flex flex-col text-right">
                    <span className="text-[10px] text-pink-600 uppercase tracking-wider">Lng</span>
                    {submission.longitude}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Konten Deskriptif */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">Deskripsi & Suasana</h3>
                
                <p className="text-sm font-bold text-slate-500 mb-1">Atmosfer/Suasana:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(submission.ambiance || "").split(", ").filter(Boolean).length > 0 ? (
                    (submission.ambiance || "").split(", ").map((item: string) => (
                      <span key={item} className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-xs">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">Belum diatur</span>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-500 mb-1">Deskripsi Utama:</p>
                {submission.description ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium text-slate-700 leading-relaxed">
                    {submission.description}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 opacity-70">
                    <Coffee size={24} className="text-slate-400" />
                    <p className="text-xs font-bold text-slate-500">Pemilik belum menambahkan teks deskripsi.</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">Menu Unggulan</h3>
                <div className="space-y-2">
                  {submission.menuDescription && JSON.parse(submission.menuDescription).length > 0 ? (
                    JSON.parse(submission.menuDescription).map((menu: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                        <span className="font-bold text-slate-700 text-sm">{menu.name}</span>
                        <span className="font-black text-pink-600 text-sm bg-pink-50 px-2 py-1 rounded-lg">{menu.price}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center text-center gap-2 opacity-70">
                      <FileText size={24} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-500">Menu unggulan belum dicantumkan.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-3">Fasilitas Tersedia</h3>
                  <div className="flex flex-wrap gap-2">
                    {(submission.facilities || "").split(", ").filter(Boolean).length > 0 ? (
                      (submission.facilities || "").split(", ").map((item: string) => (
                        <span key={item} className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-full text-xs">
                          {item}
                        </span>
                      ))
                    ) : (
                       <span className="text-sm text-slate-400 italic">Tidak ada fasilitas</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-3">Foto Café</h3>
                  {submission.images && submission.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                      {submission.images.map((img: any, index: number) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                          <img
                            src={img.url}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt="Cafe foto"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300">
                          <ImageIcon size={24} />
                       </div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada foto</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
          
        </div>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap-reverse sm:flex-nowrap justify-between items-center gap-4 z-20">
          
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
          
          <div className="flex w-full sm:w-auto gap-3">
            <button 
               onClick={onReject}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all"
            >
               <XCircle size={16} /> Tolak
            </button>
            <button 
               onClick={onRevision}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-amber-100 text-amber-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-50 hover:border-amber-200 transition-all"
            >
               <AlertCircle size={16} /> Revisi
            </button>
            <button 
               onClick={onApprove}
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
            >
               <CheckCircle2 size={16} /> Setujui
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

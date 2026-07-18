"use client";

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
    <div className="fixed inset-0 bg-black/40 Z-50 flex items-center justify-center P-6">
      <div className="bg-white text-slate-800 rounded-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Detail Pengajuan Cafe</h2>

        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-lg mb-2">Informasi Umum</h3>
            <p>
              <b>Nama Café :</b> {submission.cafeName}
            </p>
            <p>
              <b>Alamat :</b> {submission.address}
            </p>
            <p>
              <b>Kapasitas :</b> {submission.capacity} Kursi{" "}
            </p>
            <p>
              <b>Latitude :</b> {submission.latitude}{" "}
            </p>
            <p>
              <b>Longitude :</b> {submission.longitude}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Detail Café</h3>
            <p>
              <b>No. Telepon :</b> {submission.phone || "-"}
            </p>
            <p>
              <b>Jam Operasional :</b> {submission.openingHours || "-"}
            </p>
            <p>
              <b>Suasana :</b> {submission.ambiance || "-"}
            </p>
            <p>
              <b>Deskripsi :</b>
            </p>
            <div className="bg-slate-50 rounded-xl p-3">
              {submission.description || "-"}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2"> Fasilitas</h3>
          <div className="flex flex-wrap gap-2">
            {(submission.facilities || "").split(", ").map((item: string) => (
              <span
                key={item}
                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2"> Menu Unggulan</h3>
          <div className="space-y-2">
            {submission.menuDescription ? (
              JSON.parse(submission.menuDescription).map(
                (menu: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between border rounded-lg p-2"
                  >
                    <span>{menu.name}</span>

                    <span>{menu.price}</span>
                  </div>
                )
              )
            ) : (
              <p>-</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Foto Café</h3>
          <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {submission.images?.map((img: any, index: number) => (
              <img
                key={index}
                src={img.url}
                className="w-full h-48 object-cover rounded-xl border"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onReject}
            className="bg-red-500 text-white px-5 py-2 rounded-xl"
          >
            Tolak
          </button>

          <button
            onClick={onRevision}
            className="bg-yellow-500 text-white px-5 py-2 rounded-xl"
          >
            Revisi
          </button>

          <button
            onClick={onApprove}
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            Setujui
          </button>

          <button
            onClick={onClose}
            className="bg-slate-700 text-white px-5 py-2 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

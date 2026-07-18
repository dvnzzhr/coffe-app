const fs = require('fs');

// 1. Update SubmissionDetailModal
const modalPath = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\components\\SubmissionDetailModal.tsx';
let modalContent = fs.readFileSync(modalPath, 'utf8');

modalContent = modalContent.replace('Z-50', 'z-[3000]');
modalContent = modalContent.replace('P-6', 'p-6');
modalContent = modalContent.replace('bg-green-600', 'bg-emerald-600');
modalContent = modalContent.replace('bg-yellow-500', 'bg-amber-500');

fs.writeFileSync(modalPath, modalContent, 'utf8');
console.log("Updated Modal");

// 2. Update ApprovalPage
const pagePath = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\app\\dashboard\\approvals\\page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

if (!pageContent.includes('import SubmissionDetailModal')) {
  pageContent = pageContent.replace(
    'import ConfirmModal from "@/components/ConfirmModal"',
    'import ConfirmModal from "@/components/ConfirmModal"\nimport SubmissionDetailModal from "@/components/SubmissionDetailModal"\nimport { Eye } from "lucide-react"'
  );
}

if (!pageContent.includes('const [detailSubmission, setDetailSubmission]')) {
  pageContent = pageContent.replace(
    'const [revisionNote, setRevisionNote] = useState("")',
    'const [revisionNote, setRevisionNote] = useState("")\n  const [detailSubmission, setDetailSubmission] = useState<any>(null)'
  );
}

const revisionBtn = `<button
                    disabled={processingId === item.id}
                    onClick={() => setConfirmAction({ isOpen: true, id: item.id, status: "Revisi" })}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Info size={18} />
                    Revisi
                  </button>`;

const newBtns = `<button
                    disabled={processingId === item.id}
                    onClick={() => setConfirmAction({ isOpen: true, id: item.id, status: "Revisi" })}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Info size={18} />
                    Revisi
                  </button>
                  <button
                    disabled={processingId === item.id}
                    onClick={() => setDetailSubmission(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Eye size={18} />
                    Detail
                  </button>`;
pageContent = pageContent.replace(revisionBtn, newBtns);

const modalInjection = `<SubmissionDetailModal
        open={!!detailSubmission}
        submission={detailSubmission}
        onClose={() => setDetailSubmission(null)}
        onApprove={() => { setConfirmAction({ isOpen: true, id: detailSubmission.id, status: "Disetujui" }); setDetailSubmission(null); }}
        onReject={() => { setConfirmAction({ isOpen: true, id: detailSubmission.id, status: "Ditolak" }); setDetailSubmission(null); }}
        onRevision={() => { setConfirmAction({ isOpen: true, id: detailSubmission.id, status: "Revisi" }); setDetailSubmission(null); }}
      />
    </DashboardLayout>`;
pageContent = pageContent.replace('</DashboardLayout>', modalInjection);

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("Updated ApprovalPage");

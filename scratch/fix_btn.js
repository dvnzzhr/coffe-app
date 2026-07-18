const fs = require('fs');
const path = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\app\\dashboard\\approvals\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /<Info size=\{18\} \/>\s*Revisi\s*<\/button>/;

const replacement = `<Info size={18} />
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

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully injected the detail button into JSX via RegExp");
} else {
  console.log("Could not find the target string! Something is wrong.");
  const index = content.indexOf('Revisi');
  if(index !== -1) {
      console.log('Found Revisi around:', content.substring(index - 50, index + 50));
  }
}

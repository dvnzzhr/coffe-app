const fs = require('fs');

const path = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\components\\MapComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove import
content = content.replace("const MapEventsHook = dynamic(() => import('./MapEventsHook'), { ssr: false })\n", "");
content = content.replace("const MapEventsHook = dynamic(() => import('./MapEventsHook'), { ssr: false })", "");

// 2. Remove states
content = content.replace("  const [showSearchArea, setShowSearchArea] = useState(false)\n", "");
content = content.replace("  const [areaCenter, setAreaCenter] = useState<[number, number] | null>(null)\n", "");

// 3. Remove MapEventsHook from map
const zoomHook = `<ZoomControl position="bottomleft" />
              <MapEventsHook onMoveEnd={(lat, lng) => {
                setAreaCenter([lat, lng])
                setShowSearchArea(true)
              }} />`;
content = content.replace(zoomHook, `<ZoomControl position="bottomleft" />`);

// 4. Remove button
const buttonUI = `{showSearchArea && areaCenter && (
            <button 
              onClick={() => {
                setShowSearchArea(false)
                handleSearch(query, 'area', areaCenter)
              }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 border border-slate-700 text-white rounded-full px-5 py-2.5 font-bold text-sm shadow-2xl shadow-slate-900/30 hover:scale-105 transition-transform"
            >
              Cari di Area Ini
            </button>
          )}
          `;
content = content.replace(buttonUI, "");

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully removed Search Area feature");

const fs = require('fs');
const path = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\components\\MapComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add dynamic import and new states
const markerImportLocation = "const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })";
content = content.replace(
  markerImportLocation,
  markerImportLocation + "\nconst MapEventsHook = dynamic(() => import('./MapEventsHook'), { ssr: false })"
);

// 2. Add states
const stateLocation = "const [searchMode, setSearchMode] = useState<'current' | 'surabaya'>('surabaya')";
content = content.replace(
  stateLocation,
  stateLocation + "\n  const [activeCafeId, setActiveCafeId] = useState<string | null>(null)\n  const [locationError, setLocationError] = useState<string | null>(null)\n  const [showSearchArea, setShowSearchArea] = useState(false)\n  const [areaCenter, setAreaCenter] = useState<[number, number] | null>(null)"
);

// 3. Update detect location error
const locationDetectLocation = `        (err) => {
          // fallback to Wonokromo if permission denied
          const fallback: [number, number] = [-7.2915, 112.7348]
          if (!userLocation) setUserLocation(fallback)
          setMapCenter(userLocation || fallback)
          resolve(userLocation || fallback)
        }`;

const locationDetectReplacement = `        (err) => {
          // fallback to Wonokromo if permission denied
          const fallback: [number, number] = [-7.2915, 112.7348]
          setLocationError("Akses lokasi ditolak/gagal. Menggunakan Wonokromo sebagai area referensi awal.")
          setTimeout(() => setLocationError(null), 5000)
          if (!userLocation) setUserLocation(fallback)
          setMapCenter(userLocation || fallback)
          resolve(userLocation || fallback)
        }`;
content = content.replace(locationDetectLocation, locationDetectReplacement);

// 4. pass activeCafeId to MapSidebar
const sidebarCall = "detailLoadingHref={detailLoadingHref}";
content = content.replace(sidebarCall, "detailLoadingHref={detailLoadingHref}\n          activeCafeId={activeCafeId}");

// 5. update handleSearch signature to accept area
const funcSig = "const handleSearch = async (overrideQuery?: string, overrideMode?: 'current' | 'surabaya') => {";
content = content.replace(
  funcSig,
  "const handleSearch = async (overrideQuery?: string, overrideMode?: 'current' | 'surabaya' | 'area', overrideCenter?: [number, number]) => {"
);

const centerLogic = `    if (currentMode === 'current') {
      if (locToUse) {
        searchCenters = [locToUse]
      } else {
        const loc = await getCurrentLocationPromise()
        searchCenters = [loc]
      }
    }`;

const centerReplacement = `    if (currentMode === 'current') {
      if (locToUse) {
        searchCenters = [locToUse]
      } else {
        const loc = await getCurrentLocationPromise()
        searchCenters = [loc]
      }
    } else if (currentMode === 'area' && overrideCenter) {
      searchCenters = [overrideCenter]
      setSearchMode('surabaya') // reset visual toggle
    }`;
content = content.replace(centerLogic, centerReplacement);

// 6. Update mapping area (UI for search this area + alerts)
const mapUI = `<div className="h-full w-full">`;
const mapUIReplacement = `{locationError && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl shadow-lg border border-yellow-200 text-xs font-bold animate-pulse text-center">
              {locationError}
            </div>
          )}
          {showSearchArea && areaCenter && (
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
          <div className="h-full w-full">`;
content = content.replace(mapUI, mapUIReplacement);

// 7. Update MapEventsHook and Markers inside MapContainer
const zoomControl = `<ZoomControl position="bottomleft" />`;
const zoomReplacement = `<ZoomControl position="bottomleft" />
              <MapEventsHook onMoveEnd={(lat, lng) => {
                setAreaCenter([lat, lng])
                setShowSearchArea(true)
              }} />`;
content = content.replace(zoomControl, zoomReplacement);

const markerClick = `click: () => {
                        openCafeDetail(cafe)
                      }`;
const markerClickReplacement = `click: () => {
                        setActiveCafeId(String(cafe.id || cafe.fsqPlaceId))
                        // Optional: You can still open detail or let them double click, but active sync is prioritized
                        // openCafeDetail(cafe)
                      }`;
content = content.replace(markerClick, markerClickReplacement);
content = content.replace(markerClick, markerClickReplacement); // Handle potential second replacement if any, though likely just loops once if string based. Wait, it's inside a map. Let's use regex or safe split.

const splitContent = content.split(`click: () => {
                        openCafeDetail(cafe)
                      }`);
content = splitContent.join(markerClickReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log("Success phase 2 map update");

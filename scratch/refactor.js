const fs = require('fs');

const path = 'c:\\Users\\ASUS\\Documents\\Cafe\\SIG-CAFE\\components\\MapComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  "import { fetchCafes } from '@/lib/foursquare'",
  "import { fetchCafes } from '@/lib/foursquare'\nimport MapSidebar from './MapSidebar'\nimport SearchBar from './SearchBar'"
);

// 2. Remove searchRef
content = content.replace(
  "  const [detailLoadingHref, setDetailLoadingHref] = useState<string | null>(null)\n  const searchRef = useRef<HTMLDivElement>(null)\n  const isDetailMapPage = pathname === '/map'",
  "  const [detailLoadingHref, setDetailLoadingHref] = useState<string | null>(null)\n  const isDetailMapPage = pathname === '/map'"
);

// 3. Remove useEffect
const useEffectStr = `  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])`;

content = content.replace(useEffectStr, "");

// 4. Extract sidebar block
// Finding the Start and End of the block.
// Start: {/* Sidebar */}
// End: {/* Map Area */}
const split1 = content.split('{/* Sidebar */}');
if(split1.length === 2) {
  const preSidebar = split1[0];
  const re = /{([^}]+)}/g; // Not safe for JSX nesting
  const split2 = split1[1].split('{/* Map Area */}');
  
  if (split2.length === 2) {
    const postSidebar = split2[1];
    
    // Now look into postSidebar for the floating search bar
    // It's under {!showSidebar && ( ... )}
    const split3 = postSidebar.split('{!showSidebar && (');
    if (split3.length === 2) {
      const remainingMap = split3[1].split('<div className="h-full w-full">');
      
      if (remainingMap.length === 2) {
        
        let newContent = preSidebar + `
        {/* Sidebar */}
        <MapSidebar
          showSidebar={showSidebar}
          isFullscreen={isFullscreen}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          filteredSuggestions={filteredSuggestions}
          keywordMapping={keywordMapping}
          isDetectingLocation={isDetectingLocation}
          detectLocation={detectLocation}
          searching={searching}
          keywordOptions={keywordOptions}
          allCafes={allCafes}
          setMapCenter={setMapCenter}
          openCafeDetail={openCafeDetail}
          detailLoadingHref={detailLoadingHref}
        />

        {/* Map Area */}
` + split3[0] + `{!showSidebar && (
            <div className="absolute top-4 left-16 z-[1000] right-16 lg:right-auto lg:w-96">
              <SearchBar 
                isFloating={true}
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                filteredSuggestions={filteredSuggestions}
                keywordMapping={keywordMapping}
                isDetectingLocation={isDetectingLocation}
                detectLocation={detectLocation}
                searching={searching}
              />
            </div>
          )}

          <div className="h-full w-full">` + remainingMap[1];

        fs.writeFileSync(path, newContent, 'utf8');
        console.log("Success replacing JSX UI");
      }
    }
  }
}

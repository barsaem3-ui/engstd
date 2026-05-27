import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import LevelSelector from './components/LevelSelector';
import PatternList from './components/PatternList';
import ExampleList from './components/ExampleList';
import Lightbox from './components/Lightbox';
import MemorizeView from './components/MemorizeView';
import { db, isSupabaseConfigured } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem('engstd_user_id') || null;
  });
  
  const [level, setLevel] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [clickCounts, setClickCounts] = useState({});
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxSlides, setLightboxSlides] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  // Scroll position retention state
  const [savedScrollPos, setSavedScrollPos] = useState(0);

  // 1. Fetch metadata on mount
  useEffect(() => {
    fetch('/metadata.json')
      .then(res => res.json())
      .then(data => {
        setMetadata(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load metadata:', err);
        setLoading(false);
      });
  }, []);

  // 2. Load click counts when user changes or on mount
  useEffect(() => {
    if (!user) return;

    async function loadClicks() {
      // Step A: Load from localStorage first (for instant local response)
      const localKey = `clicks_${user}`;
      const localDataStr = localStorage.getItem(localKey);
      let localClicks = {};
      if (localDataStr) {
        try {
          localClicks = JSON.parse(localDataStr);
        } catch (e) {
          console.error('Failed to parse local clicks:', e);
        }
      }
      
      setClickCounts(localClicks);

      // Step B: Load from Supabase (if configured)
      if (isSupabaseConfigured) {
        const remoteClicksArray = await db.getClicks(user);
        
        if (remoteClicksArray && remoteClicksArray.length > 0) {
          // Merge logic: take maximum click count between local and remote
          const mergedClicks = { ...localClicks };
          let hasDiff = false;
          
          remoteClicksArray.forEach(item => {
            const pNo = item.pattern_num;
            const remoteVal = item.clicks;
            const localVal = mergedClicks[pNo] || 0;
            
            if (remoteVal !== localVal) {
              mergedClicks[pNo] = Math.max(localVal, remoteVal);
              hasDiff = true;
            }
          });
          
          if (hasDiff) {
            setClickCounts(mergedClicks);
            localStorage.setItem(localKey, JSON.stringify(mergedClicks));
            
            // Sync differences back to Supabase (if local was higher)
            if (remoteClicksArray.length > 0) {
              remoteClicksArray.forEach(item => {
                const pNo = item.pattern_num;
                const localVal = localClicks[pNo] || 0;
                if (localVal > item.clicks) {
                  db.upsertClick(user, item.level, pNo, localVal);
                }
              });
            }
          }
        }
      }
    }

    loadClicks();
  }, [user]);

  // 2b. Scroll restoration hook
  useEffect(() => {
    if (selectedPattern === null && level !== null && savedScrollPos > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: savedScrollPos,
          behavior: 'instant'
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedPattern, level, savedScrollPos]);

  // 3. Handle Login Success
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('engstd_user_id', loggedInUser);
  };

  // 4. Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('engstd_user_id');
    setLevel(null);
    setSelectedPattern(null);
    setClickCounts({});
  };

  // 5. Handle Pattern Card click (increment count, upsert database, navigate to examples)
  const handlePatternClick = async (pattern) => {
    // Save current scroll position before unmounting the list
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    setSavedScrollPos(currentScroll);

    const pNo = pattern.pattern_num;
    const currentCount = clickCounts[pNo] || 0;
    const newCount = currentCount + 1;
    
    // A. Optimistic Update (Local State & Storage)
    const localKey = `clicks_${user}`;
    const updatedClicks = { ...clickCounts, [pNo]: newCount };
    setClickCounts(updatedClicks);
    localStorage.setItem(localKey, JSON.stringify(updatedClicks));
    
    // B. Background Supabase Upsert
    if (isSupabaseConfigured) {
      db.upsertClick(user, level, pNo, newCount);
    }
    
    // C. Navigate to example slide deck
    setSelectedPattern(pattern);
  };

  // 6. Open Lightbox
  const handleOpenLightbox = (slides, index) => {
    setLightboxSlides(slides);
    setLightboxIndex(index);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>슬라이드 데이터 로딩 중... 🚀</h2>
        </div>
      </div>
    );
  }

  // If no user is logged in, show the Login Screen
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Header username={user} onLogout={handleLogout} />
      
      <main className="main-content">
        {!level ? (
          // View 1: Level Selection Screen
          <LevelSelector onSelectLevel={setLevel} />
        ) : level === 4 ? (
          // View 4: 똑딱이암기 학습 전용 화면
          <MemorizeView
            user={user}
            patterns={metadata ? metadata.level1 : []}
            onBack={() => setLevel(null)}
          />
        ) : !selectedPattern ? (
          // View 2: List of patterns within selected level
          <PatternList
            level={level}
            patterns={metadata ? metadata[`level${level}`] : []}
            clickCounts={clickCounts}
            onBack={() => {
              setLevel(null);
              setSavedScrollPos(0);
            }}
            onSelectPattern={handlePatternClick}
          />
        ) : (
          // View 3: Example slides within selected pattern
          <ExampleList
            pattern={selectedPattern}
            onBack={() => setSelectedPattern(null)}
            onSelectSlide={handleOpenLightbox}
          />
        )}
      </main>

      {/* Lightbox for zooming in on slide cards */}
      {lightboxIndex !== null && (
        <Lightbox
          slides={lightboxSlides}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

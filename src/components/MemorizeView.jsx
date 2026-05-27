import React, { useState, useEffect } from 'react';

export default function MemorizeView({ user, metadata, onBack }) {
  const [subLevel, setSubLevel] = useState(null); // null (shows sub-selector), 1, 2, 3

  // Load memorized states based on user and active sub-level
  const [memorized, setMemorized] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'completed', 'incomplete'

  // Effect to load memorized state when subLevel changes
  useEffect(() => {
    if (subLevel === null) return;
    const saved = localStorage.getItem(`memorized_${user}_lvl${subLevel}`);
    setMemorized(saved ? JSON.parse(saved) : []);
    setRevealed({});
    setFilterMode('all');
  }, [subLevel, user]);

  // Effect to persist memorized state
  useEffect(() => {
    if (subLevel === null) return;
    localStorage.setItem(`memorized_${user}_lvl${subLevel}`, JSON.stringify(memorized));
  }, [memorized, subLevel, user]);

  // Toggle memorization status
  const handleToggleMemorized = (patternNum, e) => {
    e.stopPropagation(); // Prevent reveal toggle when clicking checkbox
    setMemorized((prev) => {
      if (prev.includes(patternNum)) {
        return prev.filter((num) => num !== patternNum);
      } else {
        return [...prev, patternNum];
      }
    });
  };

  // Toggle card reveal
  const handleToggleReveal = (patternNum) => {
    setRevealed((prev) => ({
      ...prev,
      [patternNum]: !prev[patternNum]
    }));
  };

  // Reset all memorized check states for this subLevel
  const handleResetAll = () => {
    const confirmReset = window.confirm('현재 단계의 모든 암기 완료 상태를 해제하시겠습니까? 📝');
    if (confirmReset) {
      setMemorized([]);
    }
  };

  const getSubLevelLabel = (lvl) => {
    if (lvl === 1) return { text: '초급 똑딱이', class: 'l1', range: 'Pattern 1 ~ 90' };
    if (lvl === 2) return { text: '중급 똑딱이', class: 'l2', range: 'Pattern 91 ~ 210' };
    if (lvl === 3) return { text: '고급 똑딱이', class: 'l3', range: 'Pattern 211 ~ 300' };
    return { text: '똑딱이암기', class: 'l1', range: '' };
  };

  // Render Sub-Level Selection Menu
  if (subLevel === null) {
    const subLevels = [
      { id: 1, title: '초급 똑딱이암기', subtitle: '초급 패턴(1~90) 가리고 외우기', emoji: '🌟', className: 'beginner' },
      { id: 2, title: '중급 똑딱이암기', subtitle: '중급 패턴(91~210) 가리고 외우기', emoji: '🚀', className: 'intermediate' },
      { id: 3, title: '고급 똑딱이암기', subtitle: '고급 패턴(211~300) 가리고 외우기', emoji: '🏆', className: 'advanced' }
    ];

    return (
      <div className="level-selector-view animate-fade-in">
        <div className="welcome-section">
          <h2 className="welcome-title">🧠 똑딱이암기 난이도 선택</h2>
          <p className="welcome-desc">가림막(?) 뒤에 숨겨진 핵심 영어 패턴을 머릿속으로 똑딱! 떠올려 암기해 보세요.</p>
        </div>

        <div className="levels-grid">
          {subLevels.map((lvl) => (
            <div
              key={lvl.id}
              className={`level-card ${lvl.className} animate-pop-in`}
              onClick={() => setSubLevel(lvl.id)}
            >
              <div className="level-emoji">{lvl.emoji}</div>
              <h2>{lvl.title}</h2>
              <div className="level-subtitle">{lvl.subtitle}</div>
              <div className="level-range">{lvl.id === 1 ? 'Pattern 1 ~ 90' : lvl.id === 2 ? 'Pattern 91 ~ 210' : 'Pattern 211 ~ 300'}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px' }} className="animate-pop-in">
          <button className="back-button" style={{ margin: '0 auto' }} onClick={onBack}>
            ← 메인 홈화면으로
          </button>
        </div>
      </div>
    );
  }

  // Load correct patterns for active sub-level
  const patterns = metadata ? metadata[`level${subLevel}`] || [] : [];
  const badge = getSubLevelLabel(subLevel);

  // Filter patterns based on active mode
  const filteredPatterns = patterns.filter((pattern) => {
    const isMem = memorized.includes(pattern.pattern_num);
    if (filterMode === 'completed') return isMem;
    if (filterMode === 'incomplete') return !isMem;
    return true; // 'all'
  });

  return (
    <div className="animate-fade-in">
      {/* Top Navigation */}
      <div className="view-header">
        <button className="back-button" onClick={() => setSubLevel(null)}>
          ← 똑딱이 난이도 선택
        </button>
        <div className={`level-badge ${badge.class}`}>
          🧠 {badge.text} ({patterns.length}개)
        </div>
      </div>

      {/* Filter and Control Buttons */}
      <div className="memorize-controls-card animate-pop-in">
        <div className="memorize-controls-title">
          <span>🧐</span> [{badge.text}] 외운 것과 외워야 할 것을 정리해 봐요!
        </div>
        <div className="memorize-filter-group">
          <button
            className={`memorize-filter-btn all ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            📋 전체보기 ({patterns.length})
          </button>
          <button
            className={`memorize-filter-btn completed ${filterMode === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterMode('completed')}
          >
            ✅ 완료만 ({memorized.length})
          </button>
          <button
            className={`memorize-filter-btn incomplete ${filterMode === 'incomplete' ? 'active' : ''}`}
            onClick={() => setFilterMode('incomplete')}
          >
            ✏️ 미완료만 ({patterns.length - memorized.length})
          </button>
          <button
            className="memorize-filter-btn reset"
            onClick={handleResetAll}
          >
            🔄 단계 초기화
          </button>
        </div>
      </div>

      {/* Grid of Memorize Cards */}
      {filteredPatterns.length === 0 ? (
        <div className="memorize-empty-state animate-fade-in">
          <div className="empty-emoji">🎈</div>
          <h3>해당하는 패턴 카드가 없어요!</h3>
          <p>{filterMode === 'completed' ? '아직 암기 완료한 카드가 없습니다. 열심히 외워볼까요?' : '우와! 모든 패턴 카드를 암기 완료하셨네요! 최고입니다! 🎉'}</p>
          <button className="memorize-empty-btn" onClick={() => setFilterMode('all')}>
            전체 카드 보기
          </button>
        </div>
      ) : (
        <div className="patterns-grid">
          {filteredPatterns.map((pattern) => {
            const isMem = memorized.includes(pattern.pattern_num);
            const isRev = !!revealed[pattern.pattern_num];
            
            return (
              <div
                key={pattern.pattern_num}
                className={`memorize-card animate-pop-in ${isMem ? 'is-memorized' : ''}`}
              >
                {/* Image Section with Mask */}
                <div 
                  className="memorize-image-container"
                  onClick={() => handleToggleReveal(pattern.pattern_num)}
                >
                  <img
                    src={pattern.intro_image}
                    alt={`Pattern ${pattern.pattern_num} Introduction`}
                    className="slide-image"
                    loading="lazy"
                  />
                  
                  {/* Absolute Overlay Mask */}
                  {!isRev && (
                    <div className="memorize-mask">
                      <span className="mask-q">?</span>
                      <span className="mask-hint">눌러서 확인하기 🖱️</span>
                    </div>
                  )}
                  
                  {isRev && (
                    <div className="memorize-reveal-tag">
                      👀 눌러서 다시 가리기
                    </div>
                  )}
                </div>

                {/* Footer Section with Checkbox */}
                <div className="memorize-card-footer">
                  <span className="memorize-pattern-num">Pattern {pattern.pattern_num}</span>
                  
                  <label className="memorize-checkbox-label" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isMem}
                      onChange={(e) => handleToggleMemorized(pattern.pattern_num, e)}
                      className="memorize-checkbox"
                    />
                    <span className="checkbox-custom-text">
                      {isMem ? '암기 완료 🎉' : '암기 완료'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bouncy Floating Back Button Container */}
      <div className="floating-btn-container">
        <span className="floating-tooltip">아빠 윤성 화이팅💖</span>
        <button className={`floating-back-btn ${badge.class}`} onClick={() => setSubLevel(null)} aria-label="Go Back">
          뒤로 🎈
        </button>
      </div>
    </div>
  );
}

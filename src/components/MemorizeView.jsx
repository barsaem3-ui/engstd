import React, { useState, useEffect } from 'react';

export default function MemorizeView({ user, patterns, onBack }) {
  const [memorized, setMemorized] = useState(() => {
    const saved = localStorage.getItem(`memorized_${user}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [revealed, setRevealed] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'completed', 'incomplete'

  // Persist memorized state
  useEffect(() => {
    localStorage.setItem(`memorized_${user}`, JSON.stringify(memorized));
  }, [memorized, user]);

  // Toggle memorization status
  const handleToggleMemorized = (patternNum, e) => {
    e.stopPropagation(); // Prevent card toggle reveal when clicking checkbox!
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

  // Reset all memorized check states
  const handleResetAll = () => {
    const confirmReset = window.confirm('모든 암기 완료 상태를 해제하시겠습니까? 📝');
    if (confirmReset) {
      setMemorized([]);
    }
  };

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
        <button className="back-button" onClick={onBack}>
          ← 홈화면으로
        </button>
        <div className="level-badge l1">
          🧠 똑딱이암기 학습 (초급)
        </div>
      </div>

      {/* Filter and Control Buttons */}
      <div className="memorize-controls-card animate-pop-in">
        <div className="memorize-controls-title">
          <span>🧐</span> 외운 것과 외워야 할 것을 정리해 봐요!
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
            🔄 전체 초기화
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
        <button className="floating-back-btn l1" onClick={onBack} aria-label="Go Back">
          뒤로 🎈
        </button>
      </div>
    </div>
  );
}

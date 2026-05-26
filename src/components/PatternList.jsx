import React from 'react';
import PatternCard from './PatternCard';

export default function PatternList({ level, patterns, clickCounts, onBack, onSelectPattern }) {
  const getLevelLabel = () => {
    if (level === 1) return { text: '초급 패턴', class: 'l1' };
    if (level === 2) return { text: '중급 패턴', class: 'l2' };
    if (level === 3) return { text: '고급 패턴', class: 'l3' };
    return { text: '패턴 리스트', class: 'l1' };
  };

  const badge = getLevelLabel();

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <button className="back-button" onClick={onBack}>
          ← 난이도 선택으로
        </button>
        <div className={`level-badge ${badge.class}`}>
          🚀 {badge.text} ({patterns.length}개)
        </div>
      </div>
      
      <div className="patterns-grid">
        {patterns.map((pattern) => {
          const clickCount = clickCounts[pattern.pattern_num] || 0;
          return (
            <PatternCard
              key={pattern.pattern_num}
              pattern={pattern}
              level={level}
              clickCount={clickCount}
              onClick={() => onSelectPattern(pattern)}
            />
          );
        })}
      </div>

      {/* Bouncy Floating Back Button Container */}
      <div className="floating-btn-container">
        <span className="floating-tooltip">아빠 윤성 화이팅💖</span>
        <button className={`floating-back-btn l${level}`} onClick={onBack} aria-label="Go Back">
          뒤로 🎈
        </button>
      </div>
    </div>
  );
}

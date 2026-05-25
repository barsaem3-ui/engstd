import React from 'react';

export default function LevelSelector({ onSelectLevel }) {
  const levels = [
    {
      id: 1,
      title: '초급 패턴 학습',
      subtitle: '100일의 기적 1 ~ 90일',
      range: 'Pattern 1 ~ 90',
      emoji: '🌟',
      className: 'beginner'
    },
    {
      id: 2,
      title: '중급 패턴 학습',
      subtitle: '100일의 기적 91 ~ 210일',
      range: 'Pattern 91 ~ 210',
      emoji: '🚀',
      className: 'intermediate'
    },
    {
      id: 3,
      title: '고급 패턴 학습',
      subtitle: '100일의 기적 211 ~ 300일',
      range: 'Pattern 211 ~ 300',
      emoji: '🏆',
      className: 'advanced'
    }
  ];

  return (
    <div className="level-selector-view animate-fade-in">
      <div className="welcome-section">
        <h2 className="welcome-title">안녕하세요! 👋</h2>
        <p className="welcome-desc">오늘도 신나게 핵심 영어 패턴을 마스터해 볼까요? 원하시는 난이도를 선택해 주세요!</p>
      </div>
      
      <div className="levels-grid">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-card ${level.className} animate-pop-in`}
            onClick={() => onSelectLevel(level.id)}
          >
            <div className="level-emoji">{level.emoji}</div>
            <h2>{level.title}</h2>
            <div className="level-subtitle">{level.subtitle}</div>
            <div className="level-range">{level.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

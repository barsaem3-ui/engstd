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
    },
    {
      id: 4,
      title: '똑딱이암기 학습',
      subtitle: '초급 패턴(1~90) 가리고 외우기',
      range: 'Pattern 1 ~ 90',
      emoji: '🧠',
      className: 'memorize'
    }
  ];

  return (
    <div className="level-selector-view animate-fade-in">
      <div className="welcome-section">
        <h2 className="welcome-title">아빠와 윤성이 영어 도전기! 👨‍👦✨</h2>
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

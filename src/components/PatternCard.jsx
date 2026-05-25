import React from 'react';

export default function PatternCard({ pattern, level, clickCount, onClick }) {
  // Get HSL color based on level and click count
  const getDynamicStyle = () => {
    let hue = 200; // default Level 1 sky blue
    let baseL = 97;
    let saturation = 100;
    
    if (level === 2) {
      hue = 150; // Level 2 mint green
      baseL = 96;
      saturation = 80;
    } else if (level === 3) {
      hue = 280; // Level 3 lavender purple
      baseL = 97;
      saturation = 90;
    }
    
    // As click count increases, make lightness darker (lower L value)
    const factor = Math.min(18, clickCount * 2.5); // darken up to 18% max
    const finalL = baseL - factor;
    const finalS = saturation + (clickCount > 0 ? Math.min(10, clickCount * 1.5) : 0); // slightly boost saturation
    
    return {
      backgroundColor: `hsl(${hue}, ${finalS}%, ${finalL}%)`,
      borderColor: clickCount > 0 ? `hsl(${hue}, ${finalS}%, ${finalL - 10}%)` : '#eeebe5'
    };
  };

  const dynamicStyle = getDynamicStyle();

  return (
    <div
      className="pattern-card animate-pop-in"
      style={dynamicStyle}
      onClick={onClick}
    >
      <div className="click-badge">
        🖱️ {clickCount}회
      </div>
      
      <div className="slide-image-container">
        {pattern.intro_image ? (
          <img
            src={pattern.intro_image}
            alt={`Pattern ${pattern.pattern_num} Introduction`}
            className="slide-image"
            loading="lazy"
          />
        ) : (
          <div style={{ color: '#aaa', fontWeight: 600 }}>이미지 없음</div>
        )}
      </div>
      
      <div className="pattern-card-info">
        <span className="pattern-number">Pattern {pattern.pattern_num}</span>
        <span className="pattern-click-action">공부하기</span>
      </div>
    </div>
  );
}

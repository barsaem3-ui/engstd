import React from 'react';

export default function ExampleList({ pattern, onBack, onSelectSlide }) {
  // Let's create an ordered array of slides. The intro slide goes first, then the examples.
  const slides = [];
  
  if (pattern.intro_image) {
    slides.push({
      id: 'intro',
      type: '패턴 소개',
      image: pattern.intro_image
    });
  }
  
  pattern.examples.forEach((ex, idx) => {
    slides.push({
      id: `ex_${idx}`,
      type: ex.type,
      image: ex.image
    });
  });

  const getLevelClass = () => {
    const num = pattern.pattern_num;
    if (num <= 90) return 'l1';
    if (num <= 210) return 'l2';
    return 'l3';
  };
  const levelClass = getLevelClass();

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <button className="back-button" onClick={onBack}>
          ← 패턴 목록으로
        </button>
        <div className="level-badge l2">
          📖 Pattern {pattern.pattern_num} 예문 리스트 ({slides.length}개 슬라이드)
        </div>
      </div>
      
      <div className="example-section-header">
        <h2>Pattern {pattern.pattern_num} 슬라이드 카드</h2>
      </div>
      
      <div className="examples-grid">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="example-card animate-pop-in"
            onClick={() => onSelectSlide(slides, index)}
          >
            <span className="example-type-badge">{slide.type}</span>
            <div className="slide-image-container">
              <img
                src={slide.image}
                alt={`${pattern.pattern_num} - ${slide.type}`}
                className="slide-image"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bouncy Floating Back Button */}
      <button className={`floating-back-btn ${levelClass}`} onClick={onBack} aria-label="Go Back">
        뒤로 🎈
      </button>
    </div>
  );
}

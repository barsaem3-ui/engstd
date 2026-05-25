import React, { useEffect } from 'react';

export default function Lightbox({ slides, activeIndex, onClose, onNavigate }) {
  // Add keyboard support for arrow keys and escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && activeIndex > 0) onNavigate(activeIndex - 1);
      if (e.key === 'ArrowRight' && activeIndex < slides.length - 1) onNavigate(activeIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slides.length, onClose, onNavigate]);

  if (activeIndex === null || !slides || slides.length === 0) return null;

  const currentSlide = slides[activeIndex];

  return (
    <div className="lightbox-overlay animate-fade-in" onClick={onClose}>
      <div
        className="lightbox-content animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        
        <div className="lightbox-image-wrapper">
          <img
            src={currentSlide.image}
            alt={currentSlide.type}
            className="lightbox-image"
          />
        </div>
        
        <div className="lightbox-footer">
          <span className="lightbox-title">{currentSlide.type}</span>
          
          <div className="lightbox-nav-buttons">
            <button
              className="lightbox-nav-button"
              disabled={activeIndex === 0}
              onClick={() => onNavigate(activeIndex - 1)}
            >
              ◀ 이전
            </button>
            <button
              className="lightbox-nav-button"
              disabled={activeIndex === slides.length - 1}
              onClick={() => onNavigate(activeIndex + 1)}
            >
              다음 ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

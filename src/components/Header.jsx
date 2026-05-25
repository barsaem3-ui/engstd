import React from 'react';
import { isSupabaseConfigured } from '../supabaseClient';

export default function Header({ username, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-logo-group">
        <h1>
          <span>✨</span> 100일의 기적 영어 패턴 <span>✨</span>
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span className="user-info-badge">
          👩‍🎓 {username.toUpperCase()}님 환영합니다!
        </span>
        
        {isSupabaseConfigured ? (
          <span className="sync-status-badge">
            ☁️ 실시간 동기화
          </span>
        ) : (
          <span className="sync-status-badge offline">
            💾 로컬 저장소
          </span>
        )}
        
        <button className="logout-button" onClick={onLogout}>
          로그아웃 🚪
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { isSupabaseConfigured } from '../supabaseClient';

export default function Header({ syncId, onSyncIdChange }) {
  const [localSyncId, setLocalSyncId] = useState(syncId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSyncIdChange(localSyncId.trim());
  };

  const handleBlur = () => {
    onSyncIdChange(localSyncId.trim());
  };

  return (
    <header className="app-header">
      <div className="header-logo-group">
        <h1>
          <span>✨</span> 100일의 기적 영어 패턴 <span>✨</span>
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="sync-panel">
        <span className="sync-label">
          🔑 동기화 ID:
        </span>
        <input
          type="text"
          value={localSyncId}
          onChange={(e) => setLocalSyncId(e.target.value)}
          onBlur={handleBlur}
          placeholder="이름이나 ID 입력"
          className="sync-input"
        />
        {isSupabaseConfigured ? (
          <span className="sync-status-badge">
            ☁️ 실시간 동기화
          </span>
        ) : (
          <span className="sync-status-badge offline">
            💾 로컬 저장소
          </span>
        )}
      </form>
    </header>
  );
}

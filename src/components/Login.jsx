import React, { useState } from 'react';

const VALID_USERS = {
  hhk: '1234',
  hys: '1234'
};

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    
    if (!cleanUser || !password) {
      setError('아이디와 비밀번호를 모두 입력해 주세요! ✏️');
      return;
    }
    
    if (VALID_USERS[cleanUser] && VALID_USERS[cleanUser] === password) {
      setError('');
      onLoginSuccess(cleanUser);
    } else {
      setError('아이디 또는 비밀번호가 틀렸어요! 😢');
    }
  };

  return (
    <div className="login-view-container animate-fade-in">
      <div className="login-card animate-pop-in">
        <div className="login-header">
          <span className="login-icon">✨</span>
          <h2>100일의 기적 영어 패턴</h2>
          <p>공부방에 오신 것을 환영합니다!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">아이디 (ID)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해 주세요"
              className="login-input"
              autoComplete="username"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">비밀번호 (Password)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              className="login-input"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="login-error-message">{error}</div>}
          
          <button type="submit" className="login-submit-btn">
            로그인 시작하기 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

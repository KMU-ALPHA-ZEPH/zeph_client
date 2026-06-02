import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// iOS Safari는 viewport 메타의 user-scalable=no를 무시하므로, 페이지 핀치줌은
// iOS 전용 gesture 이벤트를 막아 차단한다. (카카오 지도는 자체 touch 이벤트로
// 줌을 처리하므로 이 차단의 영향을 받지 않는다.)
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

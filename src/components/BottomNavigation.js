import React, { useState } from 'react';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: '👤',
      isActive: true
    },
    {
      id: 'explore',
      label: '탐색 탭',
      icon: '🔬'
    },
    {
      id: 'plan',
      label: '플랜',
      icon: null // 아이콘 없음
    },
    {
      id: 'ledger',
      label: '가계부',
      icon: '☰'
    },
    {
      id: 'mypage',
      label: '마이페이지',
      icon: '⚙️'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="bottom-navigation">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => handleTabClick(item.id)}
        >
          {item.icon && (
            <div className="nav-icon">
              {item.icon}
            </div>
          )}
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;

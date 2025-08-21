import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNavigation.css';
import homeIcon from '../assets/home.svg';
import pinIcon from '../assets/pin.svg';
import planIcon from '../assets/plan.svg';
import ledgerIcon from '../assets/ledger.svg';
import myIcon from '../assets/my.svg';


const BottomNavigation = ({ activeTab = 'home' }) => {
  const navigate = useNavigate();

  // 각 탭에 사용할 SVG 아이콘 매핑
  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: homeIcon
    },
    {
      id: 'explore',
      label: '탐색 탭',
      icon: pinIcon
    },
    {
      id: 'plan',
      label: '플랜',
      icon: planIcon
    },
    {
      id: 'ledger',
      label: '가계부',
      icon: ledgerIcon
    },
    {
      id: 'mypage',
      label: '마이페이지',
      icon: myIcon
    }
  ];

  const handleTabClick = (tabId) => {
    switch (tabId) {
      case 'home':
        navigate('/');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'plan':
        navigate('/plan');
        break;
      case 'ledger':
        navigate('/ledger');
        break;
      case 'mypage':
        navigate('/mypage');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="bottom-navigation">
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => handleTabClick(item.id)}
        >
          <div className="nav-icon">
            <img 
              src={item.icon} 
              alt={item.label}
            />
          </div>
          <span className="nav-label font-regular">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;

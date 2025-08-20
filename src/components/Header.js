import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">WorkRunThon</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Hello World
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                로그인
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className={`nav-link ${isActive('/signup')}`}>
                회원가입
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

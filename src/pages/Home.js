import React from 'react';
import NaverMap from '../components/NaverMap';
import KakaoMap from '../components/KakaoMap';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">이글루</h1>
      <p className="home-subtitle">Welcome to WorkRunThon</p>
      
      <div className="maps-container">
        <NaverMap />
        <KakaoMap />
      </div>
    </div>
  );
};

export default Home;

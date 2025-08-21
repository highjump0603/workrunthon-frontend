import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Plan from './pages/Plan';
import Explore from './pages/Explore';
import Ledger from './pages/Ledger';
import Mypage from './pages/Mypage';
import AllergySettings from './pages/AllergySettings';
import FoodPreferences from './pages/FoodPreferences';
import BudgetManagement from './pages/BudgetManagement';
import RecentlyViewed from './pages/RecentlyViewed';
import VisitHistory from './pages/VisitHistory';
import MyReviews from './pages/MyReviews';
import AddressManagement from './pages/AddressManagement';
import SavedRestaurants from './pages/SavedRestaurants';
import ProfileEdit from './pages/ProfileEdit';
import Settings from './pages/Settings';
import useScrollToTop from './hooks/useScrollToTop';
import './Font.css';
import './App.css';

// 스크롤 초기화를 위한 내부 컴포넌트
function AppContent() {
  // 페이지 이동 시 스크롤을 맨 위로 초기화
  useScrollToTop();
  
  return (
    <div className="App">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/allergy-settings" element={<AllergySettings />} />
          <Route path="/food-preferences" element={<FoodPreferences />} />
          <Route path="/budget-management" element={<BudgetManagement />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
          <Route path="/visit-history" element={<VisitHistory />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/address-management" element={<AddressManagement />} />
          <Route path="/saved-restaurants" element={<SavedRestaurants />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

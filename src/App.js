import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Plan from './pages/Plan';
import Explore from './pages/Explore';
import Ledger from './pages/Ledger';
import AddDetails from './pages/AddDetails';
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
import RestaurantSelection from './pages/RestaurantSelection';
import RestaurantDetail from './pages/RestaurantDetail';
import WelcomePage from './pages/WelcomePage';
import BudgetSetupPage from './pages/BudgetSetupPage';

import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PlannerDetail from './pages/PlannerDetail';
import CreateReview from './pages/CreateReview';
import ReviewDetail from './pages/ReviewDetail';
import EditReview from './pages/EditReview';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
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
                  <Route path="/" element={<WelcomePage />} />
        <Route path="/budget-setup" element={<BudgetSetupPage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
          <Route path="/add-details" element={<ProtectedRoute><AddDetails /></ProtectedRoute>} />
          <Route path="/mypage" element={<ProtectedRoute><Mypage /></ProtectedRoute>} />
          <Route path="/allergy-settings" element={<ProtectedRoute><AllergySettings /></ProtectedRoute>} />
          <Route path="/food-preferences" element={<ProtectedRoute><FoodPreferences /></ProtectedRoute>} />
          <Route path="/budget-management" element={<ProtectedRoute><BudgetManagement /></ProtectedRoute>} />
          <Route path="/recently-viewed" element={<ProtectedRoute><RecentlyViewed /></ProtectedRoute>} />
          <Route path="/visit-history" element={<ProtectedRoute><VisitHistory /></ProtectedRoute>} />
          <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path="/address-management" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
  
          <Route path="/saved-restaurants" element={<ProtectedRoute><SavedRestaurants /></ProtectedRoute>} />
          <Route path="/profile-edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/restaurant-selection" element={<ProtectedRoute><RestaurantSelection /></ProtectedRoute>} />
          <Route path="/restaurant-detail/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} />
          <Route path="/planner-detail/:plannerId" element={<ProtectedRoute><PlannerDetail /></ProtectedRoute>} />
          <Route path="/create-review" element={<ProtectedRoute><CreateReview /></ProtectedRoute>} />
          <Route path="/review-detail/:reviewId" element={<ProtectedRoute><ReviewDetail /></ProtectedRoute>} />
          <Route path="/edit-review/:reviewId" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

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
import './Font.css';
import './App.css';

function App() {
  return (
    <Router>
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
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

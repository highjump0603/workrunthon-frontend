import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ledger.css';
import BottomNavigation from '../components/BottomNavigation';

const Ledger = () => {
  const navigate = useNavigate();
  const [monthlyBudget] = useState(300000);
  const [remainingAmount] = useState(162500);
  const [spentAmount] = useState(137500);

  // 지출 내역 데이터
  const expenses = [
    {
      id: 1,
      date: '4월 18일',
      restaurant: '중식당',
      menu: '짜장면',
      amount: 7500
    },
    {
      id: 2,
      date: '4월 17일',
      restaurant: '삼겹살',
      menu: '삼겹살',
      amount: 11000
    },
    {
      id: 3,
      date: '4월 16일',
      restaurant: '한식당',
      menu: '비빕밥',
      amount: 10500
    },
    {
      id: 4,
      date: '4월 15일',
      restaurant: '한식당',
      menu: '김치찌개 백반',
      amount: 8500
    }
  ];

  const handleAddDetails = () => {
    navigate('/add-details');
  };



  return (
    <div className="ledger-page">
      {/* 예산 요약 섹션 */}
      <div className="ledger-budget-summary">
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">월 예산</span>
          <span className="ledger-budget-amount">₩{monthlyBudget.toLocaleString()}</span>
        </div>
        
        {/* 진행률 바 */}
        <div className="ledger-progress-bar">
          <div 
            className="ledger-progress-fill" 
            style={{ width: `${(spentAmount / monthlyBudget) * 100}%` }}
          ></div>
        </div>
        
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">남은 금액</span>
          <span className="ledger-budget-remaining">₩{remainingAmount.toLocaleString()}</span>
        </div>
        
        <div className="ledger-budget-row">
          <span className="ledger-budget-label">지출 금액</span>
          <span className="ledger-budget-spent">₩{spentAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* 내역 추가 버튼 */}
      <button className="ledger-add-details-btn font-bold" onClick={handleAddDetails}>
        내역 추가
      </button>

      {/* 지출 내역 섹션 */}
      <div className="ledger-expenses-section">
        <div className="ledger-section-title">내역</div>
        
        <div className="ledger-expenses-list">
          {expenses.map((expense, index) => (
            <div key={expense.id} className="ledger-expense-item">
              <div className="ledger-expense-info">
                <div className="ledger-expense-date">{expense.date}</div>
                <div className="ledger-expense-restaurant">{expense.restaurant}</div>
                <div className="ledger-expense-menu">{expense.menu}</div>
              </div>
                             <div className="ledger-expense-amount">₩{expense.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height: '100px'}}></div>
      <BottomNavigation activeTab="ledger" />
    </div>
  );
};

export default Ledger;

import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    console.log('회원가입 시도:', formData);
    alert('회원가입 기능은 아직 구현되지 않았습니다.');
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>회원가입</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            이름:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            이메일:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            비밀번호:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            비밀번호 확인:
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;

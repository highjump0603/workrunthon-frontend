# WorkRunThon Frontend

React 기반의 웹 애플리케이션입니다.

## 설치 및 실행

```bash
npm install
npm start
```

## 환경변수 설정

지도 API를 사용하기 위해 다음 환경변수를 설정해야 합니다.

### 1. .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id_here
REACT_APP_KAKAO_APP_KEY=your_kakao_app_key_here
```

### 2. API 키 발급

#### 네이버지도 API
1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 가입
2. Maps 서비스 신청
3. 애플리케이션 등록 후 클라이언트 ID 발급

#### 카카오지도 API
1. [카카오 개발자](https://developers.kakao.com/)에 가입
2. 애플리케이션 생성
3. JavaScript 키 발급

### 3. 보안 주의사항

- `.env` 파일은 절대 깃허브에 커밋하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요
- 프로덕션 환경에서는 환경변수를 서버 설정에서 관리하세요

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── NaverMap.js     # 네이버지도 컴포넌트
│   └── KakaoMap.js     # 카카오지도 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── Home.js         # 홈 페이지
│   └── Home.css        # 홈 페이지 스타일
└── App.js              # 메인 앱 컴포넌트
```

## 사용된 기술

- React 18
- React Router DOM
- 네이버지도 API
- 카카오지도 API

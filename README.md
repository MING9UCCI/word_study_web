<div align="center">

# 📚 MyVoca - 스마트 어휘 학습 앱

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14-ffca28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

**효율적인 어휘 학습을 위한 현대적인 플래시카드 앱**

[🚀 라이브 데모](#) | [📖 문서](#사용법) | [🐛 이슈 제보](../../issues)

![MyVoca Screenshot](https://via.placeholder.com/800x400/1e40af/ffffff?text=MyVoca+Screenshot)

</div>

---

## ✨ 주요 기능

### 📖 다국어 학습 지원
- **영어-한국어** TOEIC 필수 단어
- **중국어** 한자, 병음(성조), 한국어 뜻, 예문
- 각 단어별 예문 제공
- 음성 재생 (TTS) 지원

### 🧠 스마트 학습 시스템
- **SRS (Spaced Repetition System)** - 과학적 복습 시스템
- 5단계 숙련도 레벨 관리
- 학습 진행률 실시간 추적
- 맞춤형 복습 스케줄링

### ⌨️ 생산성 최적화
- **키보드 단축키** - 마우스 없이 빠른 학습
  - `Space`: 카드 뒤집기
  - `←` `→`: 카드 이동
  - `1` / `2`: Forgot / Got it
  - `F`: 필터 토글
  - `S`: 셔플
- 필터링 시스템 (미암기 단어만 보기)
- 랜덤 셔플 기능

### 📝 학습 관리
- **컬렉션 시스템** - 단어를 그룹으로 관리
- **메모 기능** - 학습 중 메모 작성 및 검색
- **통계 대시보드** - 학습 현황 시각화
- **학습 모드**:
  - 플래시카드 모드
  - 퀴즈 모드

### ☁️ 클라우드 동기화
- Firebase 실시간 동기화
- Google 로그인 연동
- 데이터 자동 백업
- 다중 기기 지원

### 🎨 현대적인 UI/UX
- 다크 모드 지원
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 부드러운 애니메이션
- 프리미엄 디자인

### 📱 PWA 지원
- 오프라인 사용 가능
- 홈 화면에 설치 가능
- 네이티브 앱과 유사한 경험

---

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘

### Backend & Services
- **Firebase Authentication** - 사용자 인증
- **Firebase Firestore** - NoSQL 데이터베이스
- **Netlify** - 배포 및 호스팅

### PWA
- **Vite PWA Plugin** - Progressive Web App 기능
- **Workbox** - 서비스 워커 관리

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/word_study_web.git

# 프로젝트 디렉토리로 이동
cd word_study_web

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

---

## 📖 사용법

### 1. 시작하기
- 앱 실행 시 기본 대시보드가 표시됩니다
- Google 계정으로 로그인하여 클라우드 동기화 활성화

### 2. 단어 추가
- **Manage** 탭 → **컬렉션 생성** → 단어 추가
- 또는 기본 제공 단어장 불러오기:
  - TOEIC 필수 단어 세트
  - 중국어 단어장 (6, 7, 9, 10과)

### 3. 학습하기
- **Study** 탭 → 학습할 컬렉션 선택
- 키보드 단축키로 빠른 학습:
  - `Space`: 카드 뒤집기
  - `1`: Forgot (다시 학습)
  - `2`: Got it (암기 완료)
  - `F`: 미암기 단어만 필터링

### 4. 진행 상황 확인
- **Stats** 탭에서 학습 현황 확인
- 컬렉션별 진행률 및 업적 확인

### 5. 메모 활용
- **Memo** 탭에서 학습 노트 작성
- 검색 기능으로 빠른 메모 찾기

---

## 📁 프로젝트 구조

```
word_study_web/
├── public/              # 정적 파일
│   ├── icons/          # PWA 아이콘
│   └── manifest.json   # PWA 매니페스트
├── src/
│   ├── components/     # React 컴포넌트
│   │   ├── Flashcard.jsx
│   │   ├── StudyMode.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Memo.jsx
│   │   └── ...
│   ├── hooks/          # 커스텀 훅
│   │   ├── useWords.js
│   │   ├── useAuth.js
│   │   └── useFirestore.js
│   ├── data/           # 기본 데이터
│   │   ├── defaultData.js
│   │   └── chineseData.js
│   ├── services/       # 외부 서비스
│   │   └── firebaseConfig.js
│   ├── App.jsx         # 메인 앱 컴포넌트
│   └── main.jsx        # 엔트리 포인트
├── .env                # 환경 변수 (git 제외)
├── vite.config.js      # Vite 설정
├── tailwind.config.js  # Tailwind CSS 설정
└── package.json        # 프로젝트 메타데이터
```

---

## ⌨️ 키보드 단축키

| 키 | 기능 |
|---|---|
| `Space` | 카드 뒤집기 |
| `←` | 이전 카드 |
| `→` | 다음 카드 |
| `1` 또는 `X` | Forgot (모르는 단어) |
| `2` 또는 `O` | Got it (아는 단어) |
| `S` | 셔플 |
| `F` | 필터 토글 |

---

## 🎯 개발 로드맵

- [x] TOEIC 단어 학습
- [x] 중국어 단어 지원
- [x] SRS 시스템
- [x] 키보드 단축키
- [x] 메모 기능
- [x] 클라우드 동기화
- [x] PWA 지원
- [ ] 모바일 스와이프 제스처
- [ ] 학습 완료 요약 화면
- [ ] 음성 녹음 기능
- [ ] 더 많은 언어 지원

---

## 🤝 기여하기

기여를 환영합니다! 다음 절차를 따라주세요:

1. 프로젝트 Fork
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

### 개발 가이드라인
- 코드 스타일: ESLint 설정 준수
- 커밋 메시지: [Conventional Commits](https://www.conventionalcommits.org/) 규칙 따르기
- 테스트: 새로운 기능 추가 시 테스트 작성 권장

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👨‍💻 개발자

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리를 사용합니다:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

Made with ❤️ by [Your Name]

</div>

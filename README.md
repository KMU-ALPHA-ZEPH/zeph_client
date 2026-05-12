# Zeph 🏃‍♂️

> AI가 사용자 맞춤 러닝 코스를 생성해주는 모바일 앱 서비스

거리, 경사도, 조명, 안전 등 사용자의 선호 조건을 반영해 최적의 러닝 코스를 추천하고, 실시간 트래킹과 코스 공유 기능을 제공합니다.

## 🔗 Links

- **Figma**: [디자인 파일](https://www.figma.com/design/gqtTV0PLz0MCDnL9NRsXVC/ZEPH)
- **Backend Repo**: TBD
- **Notion**: TBD

## 🛠 Tech Stack

| Category | Stack |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Lint / Format | ESLint + Prettier |

## 📁 Project Structure
```
zeph/
├── src/
│   ├── apis/              # API 함수
│   ├── assets/            # 이미지, 아이콘
│   ├── components/        # 재사용 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── pages/             # 라우트 단위 페이지
│   ├── styles/
│   │   ├── index.css      # @theme (디자인 토큰 SSOT)
│   │   └── tokens/        # JS에서 쓰는 토큰 래퍼
│   ├── types/             # 공통 타입
│   ├── utils/             # 헬퍼 함수
│   ├── App.tsx
│   └── main.tsx
├── public/
└── ...
```


## 🚀 Getting Started

### Install

```bash
npm install
```

### Run

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview

# 포맷
npm run format
```

## 🌿 Branch Strategy

작업은 항상 `develop`에서 분기, `develop`으로 PR 후 머지.

## 🎨 Design Tokens

모든 컬러/타이포그래피는 Figma의 디자인 시스템과 1:1 매핑됩니다.

### 사용법

```tsx
// 99%는 Tailwind 클래스로
<button className="bg-primary text-text-on-primary text-body-md">
  러닝 시작
</button>

// JS에서 색 직접 써야 할 때만
import { colors } from '@/styles/tokens/colors';
<motion.div animate={{ backgroundColor: colors.primary.DEFAULT }} />
```

### 주요 토큰

| Token | Class 예시 | 용도 |
|---|---|---|
| `--color-primary` | `bg-primary` | 메인 그린 |
| `--color-text-primary` | `text-text-primary` | 본문 메인 |
| `--color-text-secondary` | `text-text-secondary` | 본문 보조 |
| `--text-h1` | `text-h1` | 페이지 헤딩 |
| `--text-body-md` | `text-body-md` | 기본 본문 |

> **🚨 Hex 직접 사용 금지** — 토큰이 없을경우만 사용해주세요.

## 📝 Code Convention

- **들여쓰기**: 2 spaces
- **세미콜론**: 사용
- **따옴표**: single quote (`'`)
- **컴포넌트**: 함수형, PascalCase
- **파일명**: 컴포넌트는 PascalCase, 그 외 camelCase
- **저장 시 자동 포맷** 활성화 권장 (VS Code: Format on Save)

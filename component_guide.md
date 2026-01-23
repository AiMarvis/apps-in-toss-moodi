<!--
================================================================================
📋 Component Guide 한국어 요약 (Korean Summary)
================================================================================

[문서명] Moodi - UI/UX 컴포넌트 가이드

[개요]
Google Stitch 프로토타입을 기반으로 Moodi 미니앱의 UI/UX 컴포넌트를 정의합니다.
TDS(@toss/tds-mobile) 기반 컴포넌트와 커스텀 컴포넌트를 포함합니다.

[화면 구성 (5개)]
1. Home (감정 입력) - 키워드 칩 + 텍스트 입력
2. Loading (생성 중) - 리플/브리딩 애니메이션
3. Player (음악 재생) - 앨범 아트, 재생 컨트롤
4. Credit Store (크레딧 구매) - 패키지 리스트
5. Settings (설정) - 프로필, 토글, 메뉴

[TDS 컴포넌트 매핑]
- BottomCTA: 화면 하단 고정 CTA 버튼
- Button: 기본 버튼 (Primary, Secondary)
- Tabbar: 하단 네비게이션 (플로팅 형태 필수)
- ListRow: 설정 메뉴 아이템 (left/contents/right)
- Top: 페이지 상단 헤더
- Text: 토스 프로덕트 산스 적용 텍스트

[커스텀 컴포넌트]
1. EmotionChip - 감정 키워드 선택 칩 (6종)
2. LoadingAnimation - 리플 + 브리딩 효과
3. MusicPlayer - 앨범 아트, Play/Pause, 안내 배너
4. CreditCard - 현재 보유 크레딧 표시
5. CreditPackageItem - 구매 가능 크레딧 패키지

[디자인 토큰]
- Primary: #3183f6 (Toss Blue)
- Background: #f2f4f6
- Surface: #ffffff
- Text Main: #191f28
- Text Sub: #8b95a1
- Border Radius: Card 24px, Button 18px, Chip 9999px

[주요 애니메이션]
- Ripple: 로딩 화면 확산 효과 (2s infinite)
- Breathing: 아이콘 확대/축소 (3s ease-in-out)
- Press Feedback: active:scale-[0.98]

[UX Writing 원칙 (토스 Tone)]
- 해요체 사용
- 능동형 문장 ("만들었어요" vs "만들어졌어요")
- 긍정형 표현 ("할 수 있어요" vs "할 수 없어요")
- 캐주얼한 경어 ("~시겠어요?" 지양)

[접근성]
- 터치 타겟: 최소 44x44px
- 색상 대비: WCAG 2.1 AA 기준
- 키보드 접근성 지원

================================================================================
-->

# Moodi - Component Guide

**Project:** Moodi (AI Music Therapy Mini-App)  
**Platform:** AppsInToss WebView  
**Framework:** `@apps-in-toss/web-framework` (Granite)  
**Design System:** `@toss/tds-mobile`  
**Last Updated:** December 27, 2024  
**Status:** Draft

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design Tokens](#2-design-tokens)
3. [Screen Layouts](#3-screen-layouts)
4. [TDS Component Usage](#4-tds-component-usage)
5. [Custom Components](#5-custom-components)
6. [Animations & Interactions](#6-animations--interactions)
7. [UX Writing Guidelines](#7-ux-writing-guidelines)
8. [Accessibility](#8-accessibility)
9. [Appendix](#9-appendix)

---

## 1. Overview

### 1.1 Purpose

This Component Guide defines the UI/UX specifications for the Moodi mini-app based on:
- Google Stitch prototypes (5 screens)
- TDS (Toss Design System) components
- Custom components for Moodi-specific features

### 1.2 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Consistency** | Use TDS components wherever possible |
| **Simplicity** | Maximum 2-3 taps to complete any action |
| **Warmth** | Soft colors, rounded corners, empathetic copy |
| **Performance** | Optimize animations for 60fps |

### 1.3 Technology Stack

```typescript
// Package dependencies
{
  "@apps-in-toss/web-framework": "^1.0.0",
  "@toss/tds-mobile": "latest",
  "react": "^18.0.0",
  "typescript": "^5.0.0"
}
```

---

## 2. Design Tokens

### 2.1 Colors

```css
:root {
  /* Primary Colors */
  --color-primary: #3183f6;        /* Toss Blue */
  --color-primary-dark: #1b64da;   /* Primary hover/pressed */
  --color-primary-light: #e8f3ff;  /* Primary background */
  
  /* Background Colors */
  --color-background: #f2f4f6;     /* Page background */
  --color-surface: #ffffff;        /* Card/Surface background */
  
  /* Text Colors */
  --color-text-main: #191f28;      /* Primary text (grey900) */
  --color-text-sub: #4e5968;       /* Secondary text (grey700) */
  --color-text-hint: #8b95a1;      /* Hint/placeholder (grey500) */
  
  /* Semantic Colors */
  --color-success: #10b981;        /* Green for calm emotion */
  --color-warning: #f59e0b;        /* Orange for tired emotion */
  --color-error: #ef4444;          /* Red for angry emotion */
  --color-info: #8b5cf6;           /* Purple for anxious emotion */
  
  /* Border Colors */
  --color-border: #e5e8eb;         /* Default border */
  --color-border-light: #f2f4f6;   /* Light border */
  
  /* Emotion Colors (Album Art & Chips) */
  --color-emotion-sad: #4a90d9;
  --color-emotion-anxious: #8b5cf6;
  --color-emotion-angry: #ef4444;
  --color-emotion-depressed: #6b7280;
  --color-emotion-tired: #f59e0b;
  --color-emotion-calm: #10b981;
}
```

### 2.2 Typography

```css
:root {
  /* Font Family */
  --font-family: "Toss Product Sans", "Pretendard", -apple-system, 
                 BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", 
                 "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", 
                 "Malgun Gothic", sans-serif;
  
  /* Font Sizes */
  --font-size-title-1: 26px;       /* Page title */
  --font-size-title-2: 22px;       /* Section title */
  --font-size-title-3: 17px;       /* Card title, nav title */
  --font-size-body: 15px;          /* Body text */
  --font-size-caption: 13px;       /* Caption, helper text */
  --font-size-small: 11px;         /* Badge, label */
  --font-size-tiny: 10px;          /* Tab label */
  
  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;
}
```

**Typography Usage Table:**

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| Page Title | 26px | Bold | 1.3 | text-main |
| Section Title | 22px | Bold | 1.3 | text-main |
| Card Title | 17px | Bold | 1.4 | text-main |
| Body Text | 15px | Medium | 1.5 | text-sub |
| Button Label | 17px | Bold | 1.0 | white/primary |
| Caption | 13px | Medium | 1.4 | text-hint |
| Tab Label | 10px | Medium | 1.0 | text-hint |

### 2.3 Spacing

```css
:root {
  /* Base spacing unit: 4px */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-7: 28px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  
  /* Component-specific spacing */
  --spacing-page-horizontal: 20px;   /* Page padding left/right */
  --spacing-page-vertical: 16px;     /* Page padding top/bottom */
  --spacing-card-padding: 20px;      /* Card internal padding */
  --spacing-section-gap: 24px;       /* Gap between sections */
  --spacing-item-gap: 12px;          /* Gap between list items */
}
```

### 2.4 Border Radius

```css
:root {
  /* Border Radius */
  --radius-sm: 8px;                /* Small elements */
  --radius-md: 12px;               /* Buttons, inputs */
  --radius-lg: 16px;               /* Small cards */
  --radius-xl: 20px;               /* Medium cards */
  --radius-2xl: 24px;              /* Large cards */
  --radius-3xl: 28px;              /* Album art container */
  --radius-full: 9999px;           /* Pills, chips, avatars */
  
  /* Component-specific */
  --radius-card: 24px;
  --radius-button: 18px;
  --radius-button-sm: 12px;
  --radius-chip: 9999px;
  --radius-input: 20px;
  --radius-avatar: 9999px;
}
```

### 2.5 Shadows

```css
:root {
  /* Shadow Tokens */
  --shadow-soft: 0 2px 8px -2px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 2px 12px -2px rgba(0, 0, 0, 0.04), 
                 0 2px 6px -2px rgba(0, 0, 0, 0.02);
  --shadow-float: 0 12px 20px -8px rgba(0, 0, 0, 0.08);
  --shadow-button: 0 4px 12px rgba(49, 131, 246, 0.3);
  --shadow-elevated: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                     0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

---

## 3. Screen Layouts

### 3.1 Home Screen (Emotion Input)

**Purpose:** Users select emotion keyword and optionally add text detail.

```
┌────────────────────────────────────────┐
│  [Header]                              │
│   ← (back)        Moodi        (empty) │
├────────────────────────────────────────┤
│                                        │
│  오늘 기분은                  [🎵 img] │
│  어떠신가요?                           │
│  지금 느끼는 감정을 기록해보세요.        │
│                                        │
│  ─────────────────────────────         │
│  감정 키워드                           │
│                                        │
│  [스트레스●] [평온함] [우울함]          │
│  [신남] [피곤함] [외로움] [불안함]       │
│                                        │
│  ─────────────────────────────         │
│  상세 기록                             │
│  ┌─────────────────────────────────┐   │
│  │ 오늘 하루는 어땠나요?            │   │
│  │ 머릿속에 맴도는 생각이나 감정을   │   │
│  │ 자유롭게 적어주세요.             │   │
│  └─────────────────────────────────┘   │
│                                        │
├────────────────────────────────────────┤
│  [BottomCTA: 음악으로 위로받기]         │
├────────────────────────────────────────┤
│  [Tabbar: 홈● | 플레이어 | 크레딧 | 설정]│
└────────────────────────────────────────┘
```

**Component Breakdown:**

| Area | Component | TDS/Custom |
|------|-----------|------------|
| Header | `Navigation` | TDS |
| Title Section | `Top` | TDS |
| Emotion Chips | `EmotionChip` | Custom |
| Text Input | `TextArea` | Custom |
| CTA Button | `BottomCTA` | TDS |
| Navigation | `Tabbar` | TDS |

### 3.2 Loading Screen (Generating)

**Purpose:** Display engaging animation while music is being generated.

```
┌────────────────────────────────────────┐
│  [Header]                              │
│   ← (back)                      닫기   │
├────────────────────────────────────────┤
│                                        │
│                                        │
│                                        │
│            ○ ○ ○                       │
│           ○ 🎵 ○   (Ripple Animation)  │
│            ○ ○ ○                       │
│                                        │
│                                        │
│      김토스님을 위한                    │
│      곡을 만들고 있어요...              │
│                                        │
│      잠시만 기다려주세요                │
│                                        │
│                                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

**Component Breakdown:**

| Area | Component | TDS/Custom |
|------|-----------|------------|
| Header | Minimal header | Custom |
| Animation | `LoadingAnimation` | Custom |
| Message | `Text` | TDS |

### 3.3 Player Screen (Result)

**Purpose:** Play generated music with minimal controls.

```
┌────────────────────────────────────────┐
│  [Header]                              │
│   ← (back)     무디 플레이어            │
├────────────────────────────────────────┤
│                                        │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │                                 │   │
│  │       [Album Art Image]        │   │
│  │       (Emotion-matched)        │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                        │
│         비 오는 날의 멜로디             │
│       당신의 슬픔을 위로하는 곡         │
│                                        │
│  ═══════════════░░░░░░░  1:12 / 3:45   │
│                                        │
│              [ ▶️ ]                     │
│           (Play Button)                │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ 💡 화면을 켜 둔 상태에서 감상해주세요│
│  │    (화면이 꺼지면 음악이 멈춥니다)  │
│  └─────────────────────────────────┘   │
│                                        │
│  [다른 감정 이야기하기]                 │
│                                        │
└────────────────────────────────────────┘
```

**Component Breakdown:**

| Area | Component | TDS/Custom |
|------|-----------|------------|
| Header | `Navigation` | TDS |
| Album Art | `AlbumArtContainer` | Custom |
| Track Info | `Text` | TDS |
| Progress | `ProgressBar` | Custom |
| Play Button | `PlayButton` | Custom |
| Warning Banner | `InfoBanner` | Custom |
| Secondary CTA | `Button` | TDS |

### 3.4 Credit Store Screen

**Purpose:** Display current credits and purchase options.

```
┌────────────────────────────────────────┐
│  [Header]                              │
│                크레딧 스토어            │
├────────────────────────────────────────┤
│                                        │
│  나에게 맞는                           │
│  이용권을 골라보세요                    │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │     현재 보유 크레딧              │   │
│  │      🪙  0                       │   │
│  └─────────────────────────────────┘   │
│                                        │
│  충전하기                      이용안내 │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ 🎵 10 크레딧              1,100원 │   │
│  │    가볍게 시작하기                │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ [인기] ❤️ 55 크레딧         5,500원│   │
│  │       +10% 보너스                │   │
│  └─────────────────────────────────┘   │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ 💎 120 크레딧            11,000원 │   │
│  │    +20% 보너스                   │   │
│  └─────────────────────────────────┘   │
│                                        │
├────────────────────────────────────────┤
│  [Tabbar: 홈 | 플레이어 | 크레딧● | 설정]│
└────────────────────────────────────────┘
```

**Component Breakdown:**

| Area | Component | TDS/Custom |
|------|-----------|------------|
| Header | `Navigation` | TDS |
| Title | `Top` | TDS |
| Credit Display | `CreditCard` | Custom |
| Package List | `CreditPackageItem` | Custom |
| Navigation | `Tabbar` | TDS |

### 3.5 Settings Screen

**Purpose:** User profile, preferences, and support.

```
┌────────────────────────────────────────┐
│  [Header]                              │
│  설정                            🔔    │
├────────────────────────────────────────┤
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ 👤 김토스 [Premium]        →    │   │
│  │    내 정보 수정하기              │   │
│  └─────────────────────────────────┘   │
│                                        │
│  알림                                  │
│  ┌─────────────────────────────────┐   │
│  │ 푸시 알림                 [●═══]│   │
│  │ 마케팅 정보 수신          [═══○]│   │
│  └─────────────────────────────────┘   │
│                                        │
│  고객 지원                             │
│  ┌─────────────────────────────────┐   │
│  │ 공지사항                     →  │   │
│  │ 자주 묻는 질문               →  │   │
│  │ 문의하기                     →  │   │
│  └─────────────────────────────────┘   │
│                                        │
│  약관 및 정책                          │
│  ┌─────────────────────────────────┐   │
│  │ 서비스 이용약관              →  │   │
│  │ 개인정보 처리방침            →  │   │
│  │ 버전 정보                v2.4.0 │   │
│  └─────────────────────────────────┘   │
│                                        │
│           로그아웃                      │
│                                        │
├────────────────────────────────────────┤
│  [Tabbar: 홈 | 플레이어 | 크레딧 | 설정●]│
└────────────────────────────────────────┘
```

**Component Breakdown:**

| Area | Component | TDS/Custom |
|------|-----------|------------|
| Header | `Navigation` | TDS |
| Profile Card | Custom Card | Custom |
| Toggle Items | `ListRow` + Toggle | TDS + Custom |
| Menu Items | `ListRow` | TDS |
| Navigation | `Tabbar` | TDS |

---

## 4. TDS Component Usage

### 4.1 Button

TDS Button for primary and secondary actions.

```typescript
import { Button } from '@toss/tds-mobile';

// Primary Button (filled)
<Button
  variant="filled"
  color="primary"
  size="large"
  onClick={handleClick}
>
  음악 만들기
</Button>

// Secondary Button (outlined)
<Button
  variant="outlined"
  color="secondary"
  size="medium"
  onClick={handleClick}
>
  다시 만들기
</Button>

// Ghost Button
<Button
  variant="ghost"
  color="secondary"
  size="small"
>
  취소
</Button>
```

**Button Variants in Moodi:**

| Context | Variant | Color | Size |
|---------|---------|-------|------|
| Main CTA | `filled` | `primary` | `large` |
| Secondary Action | `outlined` | `secondary` | `medium` |
| Tertiary Action | `ghost` | `secondary` | `medium` |
| Credit Package | `filled` / `outlined` | `primary` | `small` |

### 4.2 BottomCTA

Fixed bottom CTA button for primary page actions.

```typescript
import { BottomCTA } from '@toss/tds-mobile';

// Single Button CTA
<BottomCTA>
  <BottomCTA.Button
    onClick={handleGenerateMusic}
    disabled={!selectedEmotion}
  >
    음악으로 위로받기
  </BottomCTA.Button>
</BottomCTA>

// With Sub Text
<BottomCTA>
  <BottomCTA.SubText>
    1 크레딧이 사용돼요
  </BottomCTA.SubText>
  <BottomCTA.Button onClick={handleGenerateMusic}>
    음악 만들기
  </BottomCTA.Button>
</BottomCTA>
```

**BottomCTA Usage Guidelines:**

- Always place at the bottom of scrollable content
- Include sub-text for credit consumption notice
- Disable when required input is missing
- Use gradient fade at top edge for scroll indication

### 4.3 Tabbar

Bottom navigation with 4 tabs.

```typescript
import { Tabbar } from '@toss/tds-mobile';

const tabs = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'player', label: '플레이어', icon: 'play_circle' },
  { id: 'credit', label: '크레딧', icon: 'account_balance_wallet' },
  { id: 'settings', label: '설정', icon: 'settings' },
];

<Tabbar
  items={tabs}
  activeTab={currentTab}
  onTabChange={handleTabChange}
  variant="floating"  // Required: floating style
/>
```

**Tabbar Configuration:**

| Tab | Icon (Material Symbols) | Label |
|-----|------------------------|-------|
| Home | `home` | 홈 |
| Player | `play_circle` | 플레이어 |
| Credit | `account_balance_wallet` | 크레딧 |
| Settings | `settings` | 설정 |

**Important:** AppsInToss requires the floating variant for Tabbar, even when not using TDS.

### 4.4 ListRow

List items for settings menu.

```typescript
import { ListRow } from '@toss/tds-mobile';

// Navigation Item (with arrow)
<ListRow
  left={<ListRow.Icon name="notifications" />}
  contents={<ListRow.Text title="공지사항" />}
  right={<ListRow.Arrow />}
  onClick={handleNavigate}
  withArrow
/>

// Toggle Item
<ListRow
  contents={<ListRow.Text title="푸시 알림" />}
  right={
    <Toggle
      checked={pushEnabled}
      onChange={handleToggle}
    />
  }
/>

// Info Item (with badge)
<ListRow
  contents={<ListRow.Text title="버전 정보" />}
  right={<Badge variant="info">v2.4.0</Badge>}
/>
```

**ListRow Structure:**

```
┌─────────────────────────────────────────────┐
│  [left]     [contents]           [right]    │
│  Icon/Img   Title + Description   Arrow/    │
│                                   Toggle/   │
│                                   Badge     │
└─────────────────────────────────────────────┘
```

### 4.5 Top

Page header with title and description.

```typescript
import { Top } from '@toss/tds-mobile';

<Top>
  <Top.Title>
    오늘 기분은{'\n'}어떠신가요?
  </Top.Title>
  <Top.Description>
    지금 느끼는 감정을 기록해보세요.
  </Top.Description>
</Top>
```

### 4.6 Text

Typography with Toss Product Sans.

```typescript
import { Text } from '@toss/tds-mobile';

// Title
<Text typography="title1" color="grey900">
  오늘 기분은 어떠신가요?
</Text>

// Body
<Text typography="body1" color="grey700">
  지금 느끼는 감정을 기록해보세요.
</Text>

// Caption
<Text typography="caption1" color="grey500">
  남은 크레딧: 5회
</Text>
```

**Typography Tokens:**

| Token | Size | Weight | Use Case |
|-------|------|--------|----------|
| `title1` | 26px | Bold | Page title |
| `title2` | 22px | Bold | Section title |
| `title3` | 17px | Bold | Card title |
| `body1` | 15px | Medium | Body text |
| `body2` | 13px | Regular | Secondary text |
| `caption1` | 11px | Medium | Labels, hints |

---

## 5. Custom Components

### 5.1 EmotionChip

Selectable chip for emotion keywords.

```typescript
// components/EmotionChip.tsx
import React from 'react';
import styled from '@emotion/styled';

interface EmotionChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const EmotionChip: React.FC<EmotionChipProps> = ({
  label,
  emoji,
  selected = false,
  onClick,
}) => {
  return (
    <ChipButton selected={selected} onClick={onClick}>
      {emoji && <span className="emoji">{emoji}</span>}
      <span className="label">{label}</span>
    </ChipButton>
  );
};

const ChipButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Default State */
  background-color: ${({ selected }) => 
    selected ? 'var(--color-primary)' : 'var(--color-surface)'};
  box-shadow: ${({ selected }) => 
    selected ? 'var(--shadow-button)' : 'var(--shadow-soft)'};
  
  .label {
    font-size: 15px;
    font-weight: 600;
    color: ${({ selected }) => 
      selected ? '#ffffff' : 'var(--color-text-sub)'};
  }
  
  .emoji {
    font-size: 16px;
  }
  
  /* Hover State */
  &:hover {
    background-color: ${({ selected }) => 
      selected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.8)'};
  }
  
  /* Active/Pressed State */
  &:active {
    transform: scale(0.95);
  }
  
  /* Focus State */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;
```

**EmotionChip Usage:**

```typescript
const emotions = [
  { id: 'stress', label: '스트레스', emoji: '😤' },
  { id: 'calm', label: '평온함', emoji: '😌' },
  { id: 'depressed', label: '우울함', emoji: '😔' },
  { id: 'excited', label: '신남', emoji: '🎉' },
  { id: 'tired', label: '피곤함', emoji: '🥱' },
  { id: 'lonely', label: '외로움', emoji: '😢' },
  { id: 'anxious', label: '불안함', emoji: '😰' },
];

<EmotionChipGroup>
  {emotions.map((emotion) => (
    <EmotionChip
      key={emotion.id}
      label={emotion.label}
      emoji={emotion.emoji}
      selected={selectedEmotion === emotion.id}
      onClick={() => setSelectedEmotion(emotion.id)}
    />
  ))}
</EmotionChipGroup>
```

### 5.2 LoadingAnimation

Ripple and breathing animation for loading screen.

```typescript
// components/LoadingAnimation.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

export const LoadingAnimation: React.FC = () => {
  return (
    <Container>
      {/* Ripple Effects */}
      <RippleCircle delay={0} />
      <RippleCircle delay={1} />
      
      {/* Center Icon with Breathing */}
      <CenterIcon>
        <span className="material-symbols-outlined">music_note</span>
      </CenterIcon>
    </Container>
  );
};

// Keyframes
const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const breathing = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 256px;
  height: 256px;
`;

const RippleCircle = styled.div<{ delay: number }>`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(49, 131, 246, 0.2);
  animation: ${ripple} 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const CenterIcon = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-primary);
  box-shadow: 0 8px 30px rgba(49, 131, 246, 0.3);
  animation: ${breathing} 3s ease-in-out infinite;
  
  .material-symbols-outlined {
    font-size: 36px;
    color: #ffffff;
  }
`;
```

**CSS-only Alternative:**

```css
/* styles/loading-animation.css */
.loading-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 256px;
  height: 256px;
}

.ripple-circle {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(49, 131, 246, 0.2);
  animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.ripple-circle:nth-child(2) {
  animation-delay: 1s;
}

.center-icon {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #3183f6;
  box-shadow: 0 8px 30px rgba(49, 131, 246, 0.3);
  animation: breathing 3s ease-in-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

### 5.3 MusicPlayer

Complete music player component with album art and controls.

```typescript
// components/MusicPlayer.tsx
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@toss/tds-mobile';

interface MusicPlayerProps {
  trackTitle: string;
  trackDescription: string;
  albumArtUrl: string;
  audioUrl: string;
  onRegenerate?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  trackTitle,
  trackDescription,
  albumArtUrl,
  audioUrl,
  onRegenerate,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PlayerContainer>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Album Art */}
      <AlbumArtContainer>
        <AlbumArt src={albumArtUrl} alt="Album Art" />
        <AlbumArtOverlay />
      </AlbumArtContainer>

      {/* Track Info */}
      <TrackInfo>
        <TrackTitle>{trackTitle}</TrackTitle>
        <TrackDescription>{trackDescription}</TrackDescription>
      </TrackInfo>

      {/* Progress Display (No Seek) */}
      <ProgressContainer>
        <ProgressBar>
          <ProgressFill 
            style={{ width: `${(currentTime / duration) * 100}%` }} 
          />
        </ProgressBar>
        <TimeDisplay>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </TimeDisplay>
      </ProgressContainer>

      {/* Play/Pause Button */}
      <PlayButton onClick={handlePlayPause}>
        <span className="material-symbols-outlined">
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </PlayButton>

      {/* Restart Button */}
      <RestartButton onClick={handleRestart}>
        🔄 처음부터 다시 듣기
      </RestartButton>

      {/* Warning Banner */}
      <WarningBanner>
        <span className="icon">💡</span>
        <span className="text">
          화면을 켜 둔 상태에서 감상해주세요
          <br />
          <small>(화면이 꺼지면 음악이 멈춥니다)</small>
        </span>
      </WarningBanner>

      {/* Secondary Action */}
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={onRegenerate}
        fullWidth
      >
        다른 감정 이야기하기
      </Button>
    </PlayerContainer>
  );
};

// Styled Components
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  background-color: var(--color-surface);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-card);
`;

const AlbumArtContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  margin-bottom: 24px;
`;

const AlbumArt = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AlbumArtOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top right,
    rgba(0, 0, 0, 0.05),
    rgba(255, 255, 255, 0.1)
  );
  pointer-events: none;
  mix-blend-mode: overlay;
`;

const TrackInfo = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const TrackTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0 0 8px 0;
`;

const TrackDescription = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-hint);
  margin: 0;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 9999px;
  transition: width 0.1s linear;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-hint);
  font-variant-numeric: tabular-nums;
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  background-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(49, 131, 246, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  .material-symbols-outlined {
    font-size: 36px;
    color: #ffffff;
    margin-left: 4px; /* Optical alignment for play icon */
  }

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RestartButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-sub);
  cursor: pointer;
  margin-bottom: 24px;

  &:active {
    opacity: 0.7;
  }
`;

const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background-color: var(--color-background);
  border-radius: var(--radius-md);
  margin-bottom: 24px;

  .icon {
    font-size: 16px;
  }

  .text {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-sub);
    line-height: 1.5;

    small {
      font-size: 12px;
      color: var(--color-text-hint);
    }
  }
`;
```

### 5.4 CreditCard

Display current credit balance.

```typescript
// components/CreditCard.tsx
import React from 'react';
import styled from '@emotion/styled';

interface CreditCardProps {
  credits: number;
}

export const CreditCard: React.FC<CreditCardProps> = ({ credits }) => {
  return (
    <CardContainer>
      {/* Decorative Blurs */}
      <BlurCircle position="top-right" color="blue" />
      <BlurCircle position="bottom-left" color="indigo" />
      
      {/* Content */}
      <Label>현재 보유 크레딧</Label>
      <CreditDisplay>
        <CreditIcon>
          <span className="material-symbols-outlined filled">token</span>
        </CreditIcon>
        <CreditValue>{credits}</CreditValue>
      </CreditDisplay>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: var(--color-surface);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-card);
  overflow: hidden;
`;

const BlurCircle = styled.div<{ position: string; color: string }>`
  position: absolute;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(24px);
  
  ${({ position }) => position === 'top-right' && `
    right: -20px;
    top: -20px;
  `}
  
  ${({ position }) => position === 'bottom-left' && `
    left: -10px;
    bottom: -10px;
  `}
  
  background-color: ${({ color }) => 
    color === 'blue' ? '#dbeafe' : '#e0e7ff'};
`;

const Label = styled.p`
  position: relative;
  z-index: 10;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-hint);
  margin: 0 0 4px 0;
`;

const CreditDisplay = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CreditIcon = styled.div`
  .material-symbols-outlined {
    font-size: 32px;
    color: var(--color-primary);
    font-variation-settings: 'FILL' 1;
  }
`;

const CreditValue = styled.span`
  font-size: 40px;
  font-weight: 800;
  color: var(--color-text-main);
  letter-spacing: -0.02em;
`;
```

### 5.5 CreditPackageItem

Purchasable credit package item.

```typescript
// components/CreditPackageItem.tsx
import React from 'react';
import styled from '@emotion/styled';
import { Button } from '@toss/tds-mobile';

interface CreditPackageItemProps {
  credits: number;
  price: string;
  bonus?: string;
  description?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  isPopular?: boolean;
  isPrimary?: boolean;
  onClick?: () => void;
}

export const CreditPackageItem: React.FC<CreditPackageItemProps> = ({
  credits,
  price,
  bonus,
  description,
  icon,
  iconBgColor = '#f8fafc',
  isPopular = false,
  isPrimary = false,
  onClick,
}) => {
  return (
    <ItemContainer isPopular={isPopular}>
      {isPopular && <PopularBadge>인기</PopularBadge>}
      
      <ItemContent>
        <IconWrapper bgColor={iconBgColor}>
          {icon}
        </IconWrapper>
        
        <ItemInfo>
          <CreditAmount>{credits} 크레딧</CreditAmount>
          {bonus ? (
            <BonusText isPrimary={isPrimary}>{bonus}</BonusText>
          ) : (
            <DescriptionText>{description}</DescriptionText>
          )}
        </ItemInfo>
      </ItemContent>
      
      <PriceButton isPrimary={isPrimary} onClick={onClick}>
        {price}
      </PriceButton>
    </ItemContainer>
  );
};

const ItemContainer = styled.div<{ isPopular: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: var(--color-surface);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  ${({ isPopular }) => isPopular && `
    box-shadow: 0 0 0 1px rgba(49, 131, 246, 0.1) inset, var(--shadow-card);
  `}
  
  &:active {
    transform: scale(0.98);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 24px;
  padding: 4px 10px;
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div<{ bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background-color: ${({ bgColor }) => bgColor};
  
  .material-symbols-outlined {
    font-size: 28px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreditAmount = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-main);
`;

const BonusText = styled.span<{ isPrimary: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ isPrimary }) => 
    isPrimary ? 'var(--color-primary)' : '#8b5cf6'};
  margin-top: 2px;
`;

const DescriptionText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-hint);
  margin-top: 2px;
`;

const PriceButton = styled.button<{ isPrimary: boolean }>`
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ isPrimary }) => isPrimary ? `
    background-color: var(--color-primary);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(49, 131, 246, 0.2);
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
  ` : `
    background-color: #eff6ff;
    color: var(--color-primary);
    
    &:hover {
      background-color: #dbeafe;
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
`;
```

---

## 6. Animations & Interactions

### 6.1 Ripple Effect

Used in loading screen for expanding circles.

```css
/* animations/ripple.css */
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.ripple-animation {
  animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.ripple-animation:nth-child(2) {
  animation-delay: 1s;
}
```

### 6.2 Breathing Animation

Subtle scale animation for center icon.

```css
/* animations/breathing.css */
@keyframes breathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.breathing-animation {
  animation: breathing 3s ease-in-out infinite;
}
```

### 6.3 Press Feedback

Immediate visual feedback on touch.

```css
/* interactions/press.css */
.pressable {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.pressable:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* For larger touch targets */
.pressable-card:active {
  transform: scale(0.98);
}

/* For buttons */
.pressable-button:active {
  transform: scale(0.95);
}
```

### 6.4 Fade Transitions

Page and component transitions.

```css
/* animations/fade.css */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-enter {
  animation: fadeIn 0.3s ease-out forwards;
}

.fade-exit {
  animation: fadeOut 0.2s ease-in forwards;
}
```

### 6.5 Scroll Title Animation

Header title appears on scroll.

```typescript
// hooks/useScrollTitle.ts
import { useState, useEffect } from 'react';

export const useScrollTitle = (threshold = 40) => {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowTitle(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return showTitle;
};
```

```css
/* Header title transition */
.scroll-title {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-title.visible {
  opacity: 1;
}
```

### 6.6 Toggle Switch Animation

Smooth toggle state change.

```css
/* components/toggle.css */
.toggle {
  position: relative;
  width: 50px;
  height: 30px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle.active {
  background-color: var(--color-primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.toggle.active .toggle-thumb {
  transform: translateX(20px);
}
```

---

## 7. UX Writing Guidelines

### 7.1 Toss Tone Principles

Following the official [UX Writing Guide](https://developers-apps-in-toss.toss.im/design/ux-writing.md):

| Principle | Description | Example |
|-----------|-------------|---------|
| **해요체** | Use casual polite speech | "만들었어요" ✓ / "만들었습니다" ✗ |
| **능동형** | Use active voice | "음악을 만들었어요" ✓ / "음악이 만들어졌어요" ✗ |
| **긍정형** | Frame positively | "화면을 켜두면 들을 수 있어요" ✓ / "화면을 끄면 못 들어요" ✗ |
| **캐주얼** | Avoid overly formal | "들을래요?" ✓ / "들으시겠어요?" ✗ |

### 7.2 Screen-by-Screen Copy

#### Home Screen

| Element | Copy |
|---------|------|
| Title | 오늘 기분은 어떠신가요? |
| Subtitle | 지금 느끼는 감정을 기록해보세요. |
| Section Label | 감정 키워드 |
| Text Input Label | 상세 기록 |
| Text Input Placeholder | 오늘 하루는 어땠나요? 머릿속에 맴도는 생각이나 감정을 자유롭게 적어주세요. |
| CTA Button | 음악으로 위로받기 |

#### Loading Screen

| Element | Copy |
|---------|------|
| Title | {userName}님을 위한 곡을 만들고 있어요... |
| Subtitle | 잠시만 기다려주세요 |

#### Player Screen

| Element | Copy |
|---------|------|
| Track Title | {emotion}의 멜로디 (e.g., 비 오는 날의 멜로디) |
| Track Description | 당신의 {emotion}을 위로하는 곡 |
| Restart Button | 🔄 처음부터 다시 듣기 |
| Warning Banner | 💡 화면을 켜 둔 상태에서 감상해주세요 (화면이 꺼지면 음악이 멈춥니다) |
| Secondary CTA | 다른 감정 이야기하기 |

#### Credit Store Screen

| Element | Copy |
|---------|------|
| Title | 나에게 맞는 이용권을 골라보세요 |
| Current Credits Label | 현재 보유 크레딧 |
| Section Label | 충전하기 |
| Package Description | 가볍게 시작하기 |
| Bonus Text | +10% 보너스 |
| Popular Badge | 인기 |
| Footer | Moodi 서비스 내에서 발생하는 결제는 Toss Pay를 통해 안전하게 처리됩니다. |

#### Settings Screen

| Element | Copy |
|---------|------|
| Title | 설정 |
| Profile Edit | 내 정보 수정하기 |
| Push Toggle | 푸시 알림 |
| Marketing Toggle | 마케팅 정보 수신 |
| Announcements | 공지사항 |
| FAQ | 자주 묻는 질문 |
| Contact | 문의하기 |
| Terms | 서비스 이용약관 |
| Privacy | 개인정보 처리방침 |
| Version | 버전 정보 |
| Logout | 로그아웃 |

### 7.3 Error Messages

| Scenario | Bad Example | Good Example |
|----------|-------------|--------------|
| No credits | 크레딧이 없어요 | 크레딧을 충전하면 음악을 만들 수 있어요 |
| Network error | 네트워크 오류 | 인터넷 연결을 확인하고 다시 시도해 주세요 |
| Generation failed | 생성 실패 | 잠시 문제가 생겼어요. 다시 시도해 볼까요? |
| Timeout | 시간 초과 | 조금 오래 걸리고 있어요. 다시 만들어 볼까요? |

### 7.4 Button Labels

| Action | Label |
|--------|-------|
| Primary CTA | 음악으로 위로받기 |
| Generate Music | 음악 만들기 |
| Regenerate | 다시 만들기 |
| Share | 공유하기 |
| Purchase | {price}원 |
| Retry | 다시 시도하기 |
| Cancel | 취소 |
| Confirm | 확인 |

---

## 8. Accessibility

### 8.1 Touch Targets

All interactive elements must have a minimum touch target of **44x44px**.

```css
/* Minimum touch target */
.touchable {
  min-width: 44px;
  min-height: 44px;
}

/* For inline buttons, use padding */
.inline-button {
  padding: 12px 16px;
  min-height: 44px;
}
```

### 8.2 Color Contrast

Ensure WCAG 2.1 AA compliance:

| Element | Foreground | Background | Ratio | Pass |
|---------|------------|------------|-------|------|
| Body Text | #191f28 | #ffffff | 16.5:1 | ✓ |
| Sub Text | #4e5968 | #ffffff | 7.4:1 | ✓ |
| Hint Text | #8b95a1 | #ffffff | 4.1:1 | ✓ (Large) |
| Primary Button | #ffffff | #3183f6 | 4.5:1 | ✓ |

### 8.3 Focus States

All focusable elements must have visible focus indicators.

```css
/* Focus visible state */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 8.4 Screen Reader Support

```typescript
// Provide meaningful labels
<button aria-label="음악 재생">
  <span className="material-symbols-outlined">play_arrow</span>
</button>

// Announce dynamic content
<div role="status" aria-live="polite">
  {isLoading && "음악을 만들고 있어요..."}
</div>

// Hide decorative elements
<img src={decorativeImage} alt="" aria-hidden="true" />
```

### 8.5 Motion Preferences

Respect user's reduced motion preference.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Appendix

### 9.1 Icon Reference

Using [Material Symbols Outlined](https://fonts.google.com/icons):

| Icon Name | Usage |
|-----------|-------|
| `home` | Tab: Home |
| `play_circle` | Tab: Player |
| `account_balance_wallet` | Tab: Credit |
| `settings` | Tab: Settings |
| `arrow_back_ios_new` | Back button |
| `music_note` | Loading icon |
| `play_arrow` | Play button |
| `pause` | Pause button |
| `token` | Credit icon |
| `chevron_right` | List arrow |
| `notifications` | Notification bell |
| `favorite` | Popular package |
| `diamond` | Premium package |

### 9.2 File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── EmotionChip.tsx
│   │   ├── LoadingAnimation.tsx
│   │   └── Toggle.tsx
│   ├── player/
│   │   ├── MusicPlayer.tsx
│   │   ├── AlbumArt.tsx
│   │   └── WarningBanner.tsx
│   ├── credit/
│   │   ├── CreditCard.tsx
│   │   └── CreditPackageItem.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Tabbar.tsx
├── styles/
│   ├── tokens.css
│   ├── animations.css
│   └── global.css
├── hooks/
│   ├── useScrollTitle.ts
│   └── useAudioPlayer.ts
└── pages/
    ├── Home.tsx
    ├── Loading.tsx
    ├── Player.tsx
    ├── CreditStore.tsx
    └── Settings.tsx
```

### 9.3 Reference Links

- [TDS Mobile Documentation](https://tossmini-docs.toss.im/tds-mobile/)
- [AppsInToss Developer Center](https://developers-apps-in-toss.toss.im/)
- [UX Writing Guide](https://developers-apps-in-toss.toss.im/design/ux-writing.md)
- [Mini-App Branding Guide](https://developers-apps-in-toss.toss.im/design/miniapp-branding-guide.md)
- [Dark Pattern Prevention Policy](https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.md)
- [PRD_Moodi.md](PRD_Moodi.md) - Product Requirements Document

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2024-12-27 | Design Team | Initial draft based on Stitch prototypes |

---

*This Component Guide follows TDS (Toss Design System) guidelines and Toss Product Principles.*





















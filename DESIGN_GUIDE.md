# 🎨 CampusHive - Visual Design Guide

## Color Palette

### Light Mode
- **Primary**: `#FFC107` (Amber/Gold) - Nectar
- **Secondary**: `#00CED1` (Turquoise) - Hive
- **Background**: `#FFFFFF` (White)
- **Text**: `#212529` (Dark Gray)
- **Border**: `#DEE2E6` (Light Gray)

### Dark Mode
- **Primary**: `#FFD54F` (Light Amber)
- **Secondary**: `#4DD0E1` (Light Turquoise)
- **Background**: `#1A1A1A` (Dark)
- **Text**: `#E0E0E0` (Light Gray)
- **Border**: `#404040` (Dark Gray)

## Page Layouts

### 1. Login Page
```
┌─────────────────────────────────┐
│         [Logo - Centered]       │
│                                 │
│   Welcome to CampusHive         │
│   Login to your account         │
│                                 │
│   ┌──────────────────────┐     │
│   │ Email                │     │
│   └──────────────────────┘     │
│   ┌──────────────────────┐     │
│   │ Password             │     │
│   └──────────────────────┘     │
│                                 │
│   [Login Button - Warning]     │
│                                 │
│   Don't have account? Register │
└─────────────────────────────────┘
```

### 2. Dashboard (Enhanced)
```
┌────────────────────────────────────────────────┐
│ Navbar: [Logo] CampusHive    [🌙/☀️] [Logout] │
├────────┬───────────────────────────────────────┤
│        │                                       │
│ SIDEBAR│  GRADIENT HERO BANNER                │
│        │  "Good Morning, User! 👋"            │
│ • Home │  Welcome to CampusHive               │
│ • Cal  │                                       │
│ • Att  │  [Stat 1] [Stat 2] [Stat 3] [Stat 4]│
│ • Clubs│                                       │
│ • Noti │  AI ASSISTANT                         │
│ • ...  │  [Chat Interface]                     │
│ (20+)  │                                       │
│        │  UPCOMING EVENTS                      │
│        │  ┌─────┐ ┌─────┐ ┌─────┐             │
│        │  │Event│ │Event│ │Event│             │
│        │  └─────┘ └─────┘ └─────┘             │
│        │                                       │
│        │  QUICK LINKS (Gradient Cards)        │
│        │  [StudySnap] [Timer] [Chatbot]       │
└────────┴───────────────────────────────────────┘
```

### 3. Attendance Page
```
┌────────────────────────────────────────────────┐
│  📋 Attendance Tracker                  [Logo] │
│  Monitor your class attendance                 │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │    NET ATTENDANCE (Gradient Card)        │ │
│  │           75.5%                          │ │
│  │    ✓ Above 75% threshold                │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Subject Cards (Grid):                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │Math     │ │Physics  │ │CS       │         │
│  │85% ✓    │ │72% ⚠    │ │90% ✓    │         │
│  │Skip: 3  │ │Attend!  │ │Skip: 5  │         │
│  └─────────┘ └─────────┘ └─────────┘         │
└────────────────────────────────────────────────┘
```

### 4. Study Timer
```
┌────────────────────────────────────────────────┐
│  ⏱️ Study Timer                         [Logo] │
│  Track your focused study sessions             │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │                                          │ │
│  │         ⭕ Circular Progress             │ │
│  │            25:00                         │ │
│  │                                          │ │
│  │  [15min] [25min] [45min] [60min]        │ │
│  │  [Custom: 30] [Start]                   │ │
│  │                                          │ │
│  │  [Pause] [Stop & Save] [Cancel]         │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  Total Study Time Today: 120 min        │ │
│  │  Recent Sessions:                       │ │
│  │  ✓ 25 min - 2:30 PM                    │ │
│  │  ✓ 45 min - 1:00 PM                    │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### 5. Event Chatbot
```
┌────────────────────────────────────────────────┐
│  🤖 Event Chatbot                      [Logo]  │
│  Ask about events, timings, locations          │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │                                          │ │
│  │  🤖 Bot: Hi! Ask about any event...     │ │
│  │                                          │ │
│  │  👤 You: When is the Tech Fest?         │ │
│  │                                          │ │
│  │  🤖 Bot: Tech Fest is on March 15...    │ │
│  │         📍 [View on Google Maps]        │ │
│  │                                          │ │
│  │  💭 Thinking...                         │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │ [Type your message...] [Send 📤]        │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### 6. Library
```
┌────────────────────────────────────────────────┐
│  📚 Library Management                 [Logo]  │
│  Browse, issue, and track books                │
│                                                │
│  MY ISSUED BOOKS:                              │
│  ┌─────────┐ ┌─────────┐                      │
│  │Book 1   │ │Book 2   │                      │
│  │Due: 5d  │ │Due: 2d⚠ │                      │
│  │[Return] │ │[Return] │                      │
│  └─────────┘ └─────────┘                      │
│                                                │
│  [🔍 Search books...]                         │
│                                                │
│  AVAILABLE BOOKS:                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │Book A│ │Book B│ │Book C│ │Book D│         │
│  │✓ Avl │ │✓ Avl │ │✗ Out │ │✓ Avl │         │
│  │[Issue│ │[Issue│ │ ----- │ │[Issue│         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
└────────────────────────────────────────────────┘
```

### 7. Google Calendar Integration
```
┌────────────────────────────────────────────────┐
│  📅 Academic Calendar                  [Logo]  │
│  Events, exams, and important dates            │
│                                                │
│  [< Previous]  March 2024    [Next >]         │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ Sun Mon Tue Wed Thu Fri Sat             │ │
│  │                  1   2   3               │ │
│  │  4   5   6   7   8   9  10              │ │
│  │ [E] [E]     [X] [E]                     │ │
│  │ 11  12  13  14  15  16  17              │ │
│  │                                         │ │
│  │ E = Event (Blue)  X = Exam (Red)        │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  UPCOMING EVENTS        UPCOMING EXAMS         │
│  • Tech Fest (Mar 15)   • Midterm (Mar 8)     │
│    [Add to Google 📅]     [Add to Google 📅]  │
└────────────────────────────────────────────────┘
```

## Component Styles

### Cards
- **Border Radius**: 16px for modern look
- **Shadow**: 
  - Hover: `0 8px 24px rgba(0,0,0,0.12)`
  - Default: `0 2px 8px rgba(0,0,0,0.08)`
- **Padding**: 1.5rem (24px)
- **Transitions**: 0.3s ease for smooth animations

### Buttons
- **Primary (Warning)**: Amber background, white text
- **Border Radius**: 12px
- **Padding**: 0.75rem 1.5rem
- **Hover Effect**: Slight scale (1.02) and shadow

### Gradient Cards
```css
/* Dashboard Hero */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* StudySnap Card */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Timer Card */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)

/* Chatbot Card */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

/* Net Attendance */
background: linear-gradient(135deg, #FFC107 0%, #00CED1 100%)
```

### Icons
- **Size**: 1.2rem - 2rem depending on context
- **Color**: Contextual (primary, success, danger, warning)
- **Bootstrap Icons**: Used throughout

### Animations
```css
/* Hover Lift Effect */
hover: transform: translateY(-8px)

/* Scale Effect */
hover: transform: scale(1.02)

/* Smooth Transition */
transition: all 0.3s ease
```

## Typography

### Headings
- **H1**: Display-4 (2.5rem) - Hero sections
- **H2**: 2rem - Page titles
- **H3**: 1.5rem - Section headings
- **H4**: 1.25rem - Card titles
- **H5**: 1rem - Sub-headings

### Body Text
- **Default**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Muted**: text-muted class for secondary info

## Spacing

### Margins
- **Section Spacing**: mb-4 (1.5rem), mb-5 (3rem)
- **Card Spacing**: mb-3 (1rem), mb-4 (1.5rem)
- **Element Spacing**: mb-2 (0.5rem)

### Padding
- **Cards**: p-4 (1.5rem)
- **Hero Sections**: p-5 (3rem)
- **Buttons**: py-2 px-3 (0.5rem 1rem)

## Responsive Breakpoints

- **Mobile**: < 576px (col-12)
- **Tablet**: 576px - 768px (col-md-6)
- **Desktop**: 768px - 992px (col-lg-4)
- **Large Desktop**: > 992px (col-lg-3)

## Accessibility

### Colors
- **Contrast Ratio**: WCAG AA compliant
- **Focus States**: Visible outlines on interactive elements
- **Color Blindness**: Icons and text labels, not just color

### Navigation
- **Keyboard**: Full keyboard navigation support
- **Screen Readers**: Semantic HTML, ARIA labels
- **Touch Targets**: Minimum 44px × 44px

## Best Practices

1. **Consistency**: Same padding/spacing across similar elements
2. **Hierarchy**: Clear visual distinction between levels
3. **Whitespace**: Generous spacing for readability
4. **Feedback**: Loading states, hover effects, animations
5. **Mobile-First**: Responsive design from smallest screen up

## Theme Implementation

### Light Mode
```css
[data-theme="light"] {
  --nectar-primary: #FFC107;
  --nectar-secondary: #00CED1;
  --hive-bg: #FFFFFF;
  --hive-text: #212529;
  --hive-border: #DEE2E6;
}
```

### Dark Mode
```css
[data-theme="dark"] {
  --nectar-primary: #FFD54F;
  --nectar-secondary: #4DD0E1;
  --hive-bg: #1A1A1A;
  --hive-text: #E0E0E0;
  --hive-border: #404040;
}
```

### Toggle Implementation
- Location: Top-right navbar
- Icon: 🌙 (moon) for light mode, ☀️ (sun) for dark mode
- Persistence: localStorage
- Smooth transition: 0.3s ease on body

---

**Design Philosophy**: Clean, modern, professional, and user-friendly with smooth animations and clear visual hierarchy.

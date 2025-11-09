# Replas - Recycle To E-Money

[![Frontend Progress](https://img.shields.io/badge/Frontend-70%25-green.svg)](https://github.com/your-repo/replas)
[![Backend Progress](https://img.shields.io/badge/Backend-5%25-red.svg)](https://github.com/your-repo/replas)

A modern web platform that revolutionizes recycling by connecting users with smart recycling machines and rewarding them with e-money for their environmental contributions.

## 🌟 Features

### ✅ Completed Features (Frontend - 70%)

#### 🏠 Landing Page
- Hero section with compelling messaging
- What is Replas section with feature cards
- Use cases (Business & Personal)
- Replas Bank machine overview
- How it works step-by-step guide
- Call-to-action sections

#### 📱 Responsive Navigation
- Fixed navbar with logo and branding
- Responsive hamburger menu for mobile
- Multi-language support (Indonesian/English)
- Dark/Light theme toggle
- Authentication buttons (Login/Register)

#### 📄 Static Pages
- **About**: Company mission, vision, history, team, impact
- **Services**: How-to guides for machine and web platform usage
- **Contact**: Contact information, FAQ, locations, partnership inquiry
- **Login/Register**: Full authentication forms with validation

#### 🎨 UI/UX Features
- Modern design with Tailwind CSS
- Shadcn/ui component library
- Responsive design (mobile-first)
- Dark/Light theme support
- Internationalization (i18n) with React i18next
- Smooth animations and transitions

#### 🛠 Technical Stack (Frontend)
- **Framework**: React Router v7 (SPA mode in dev)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Internationalization**: React i18next
- **Build Tool**: Vite
- **Package Manager**: npm/bun

### 🚧 In Progress / Planned (Backend - 5%)

#### 🔐 Authentication System
- User registration and login (currently mock)
- Session management
- Password hashing and security

#### 💾 Database Integration
- User profiles and accounts
- Transaction history
- Recycling machine data
- Points/e-money system

#### 🔗 API Integration
- Machine connectivity (IoT)
- Payment gateway integration
- Real-time data synchronization

#### 📊 Dashboard Features
- User dashboard for points tracking
- Admin panel for machine management
- Analytics and reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/replas.git
   cd replas
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
replas/
├── app/
│   ├── components/
│   │   ├── ui/           # Shadcn/ui components
│   │   └── footer.tsx    # Footer component
│   ├── locales/          # Translation files
│   │   ├── en.json       # English translations
│   │   └── id.json       # Indonesian translations
│   ├── page/             # Main page components
│   ├── routes/           # Route components
│   │   ├── app.tsx       # Home page wrapper
│   │   ├── about.tsx     # About page
│   │   ├── services.tsx  # Services/How-to page
│   │   ├── contact.tsx   # Contact page
│   │   ├── login.tsx     # Login page
│   │   └── register.tsx  # Register page
│   ├── root.tsx          # Root layout with navbar
│   ├── routes.ts         # Route configuration
│   ├── i18n.ts           # i18n configuration
│   └── app.css           # Global styles
├── public/               # Static assets
├── package.json
├── vite.config.ts
├── react-router.config.ts
└── README.md
```

## 🎯 Key Components

### Navigation System
- **Responsive Navbar**: Adapts from desktop horizontal to mobile hamburger menu
- **Theme Toggle**: Dark/light mode with localStorage persistence
- **Language Switcher**: Indonesian/English with full translation coverage

### Page Components
- **Home Page**: Comprehensive landing with multiple sections
- **Authentication**: Login/Register forms with validation
- **Static Pages**: About, Services, Contact with rich content

### UI Components
- **Shadcn/ui**: Professional component library
- **Custom Styling**: Tailwind with custom color scheme
- **Responsive Design**: Mobile-first approach

## 🌐 Internationalization

The app supports two languages:
- **Indonesian (id)**: Default language
- **English (en)**: Full translation coverage

All user-facing text is internationalized using React i18next.

## 🎨 Design System

### Color Scheme
- **Primary**: Green (#008064) - Environmental theme
- **Background**: Light/Dark mode support
- **Accent**: Subtle grays and greens

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scaling
- **Weights**: Various weights for hierarchy

## 🔄 Development Workflow

1. **Development**: `npm run dev` - Hot reload development server
2. **Type Checking**: `npm run typecheck` - TypeScript validation
3. **Building**: `npm run build` - Production build
4. **Preview**: `npm start` - Production preview

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

## 🚀 Deployment

The app is configured for deployment with:
- **SSR enabled** in production
- **SPA mode** in development (for stability)
- **Static asset optimization**
- **Docker support** (Dockerfile included)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions or support:
- Email: info@replas.com
- Website: Contact page in the app

---

**Note**: This is a frontend-focused project. Backend integration and API development are planned for future phases. The current implementation includes mock data and form handling for demonstration purposes.

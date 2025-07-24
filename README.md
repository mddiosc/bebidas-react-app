# 🍹 Cocktail Explorer

A modern React application for searching cocktail and drink recipes, completely refactored with cutting-edge technologies and best practices.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-6.3-007FFF?style=for-the-badge&logo=mui)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

- 🔍 **Smart Search**: Search cocktails by name, ingredient, or category
- 🏷️ **Category Filtering**: Browse drinks by type (Cocktail, Shot, etc.)
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful Material-UI components with smooth animations
- 📊 **Featured Drinks**: Daily specials and popular cocktail recommendations
- 🔄 **Real-time Updates**: Instant search results with loading states
- 🎯 **TypeScript**: Full type safety throughout the application
- 🚀 **Performance**: Optimized with React Query caching and lazy loading

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern React with concurrent features
- **TypeScript 5.0** - Static type checking
- **Material-UI v6** - Component library with theming
- **Emotion** - CSS-in-JS styling solution

### State Management & Data Fetching
- **React Query (TanStack)** - Server state management and caching
- **Zustand** - Lightweight client state management
- **Custom Hooks** - Encapsulated business logic

### Build Tools & Development
- **Vite 6.3** - Ultra-fast build tool and dev server
- **ESLint 9** - Code linting with modern configuration
- **Vitest** - Testing framework
- **pnpm** - Fast package manager

### Code Quality
- **Strict TypeScript** - No implicit any, strict null checks
- **Component Architecture** - Reusable and composable components  
- **Error Boundaries** - Graceful error handling
- **Accessibility** - WCAG compliant components

## � Getting Started

### Prerequisites
- Node.js 20+ (managed with Volta)
- pnpm 9+ (managed with Volta)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bebidas-react-app

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with HMR
pnpm build        # Build for production
pnpm preview      # Preview production build locally

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check
pnpm test         # Run unit tests with Vitest

# Package Management
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── DrinkCard.tsx       # Individual drink card with modal
│   ├── DrinksList.tsx      # Search results grid
│   ├── FeaturedDrinks.tsx  # Daily specials and popular drinks
│   ├── Header.tsx          # Application header
│   └── SearchForm.tsx      # Search and filter form
├── hooks/                  # Custom React hooks
│   ├── useQueries.ts       # Main data fetching hooks
│   └── useExtraQueries.ts  # Featured content hooks
├── services/               # API layer
│   └── cocktailApi.ts      # TheCocktailDB API client
├── stores/                 # State management
│   └── modalStore.ts       # Modal state with Zustand
├── types/                  # TypeScript definitions
│   └── index.ts            # Global type definitions
├── __tests__/              # Test files
│   └── App.test.tsx        # Main app tests
├── App.tsx                 # Root application component
└── main.tsx                # Application entry point
```

## 🏗️ Architecture Patterns

### Component Design
- **Separation of Concerns**: UI, business logic, and data fetching are separated
- **Custom Hooks**: Encapsulate data fetching and state management logic
- **Compound Components**: Complex components broken into smaller, focused pieces
- **Render Props & Children**: Flexible component composition patterns

### State Management
- **Server State**: React Query for API data, caching, and synchronization
- **Client State**: Zustand for UI state (modals, forms)
- **Local State**: React useState for component-specific state
- **Derived State**: Computed values from existing state

### Data Flow
```
API (TheCocktailDB) → React Query → Custom Hooks → Components
                                 ↓
                              Zustand Store (UI State)
```

## � API Integration

The application consumes [TheCocktailDB](https://www.thecocktaildb.com/) public API:

### Endpoints Used
- **Categories**: `/api/json/v1/1/list.php?c=list`
- **Search by Name**: `/api/json/v1/1/search.php?s={name}`
- **Search by Ingredient**: `/api/json/v1/1/filter.php?i={ingredient}`
- **Filter by Category**: `/api/json/v1/1/filter.php?c={category}`
- **Drink Details**: `/api/json/v1/1/lookup.php?i={id}`
- **Random Drink**: `/api/json/v1/1/random.php`

### Caching Strategy
- **Stale Time**: 5 minutes for search results
- **Garbage Collection**: 10 minutes for unused queries
- **Background Refetch**: Disabled for better UX
- **Retry Policy**: 3 attempts with exponential backoff

## 🎨 UI/UX Features

### Design System
- **Material Design 3**: Modern Google design language
- **Custom Theme**: Consistent colors, typography, and spacing
- **Responsive Breakpoints**: Mobile-first approach
- **Dark Mode Ready**: Theme structure supports dark mode

### Animations & Interactions
- **Smooth Transitions**: Fade-in animations for content loading
- **Hover Effects**: Interactive feedback on cards and buttons
- **Loading States**: Skeleton loaders and progress indicators
- **Error States**: User-friendly error messages and recovery

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Logical tab order and focus indicators

## 🧪 Testing Strategy

### Unit Tests
- **Component Testing**: React Testing Library
- **Hook Testing**: Custom hooks isolated testing
- **Utility Functions**: Pure function testing
- **Mocking**: API calls and external dependencies

### Test Categories
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## 🚀 Performance Optimizations

### Build Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Asset Optimization**: Image compression and lazy loading

### Runtime Optimizations
- **React Query Caching**: Intelligent data caching and deduplication
- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy Loading**: Components and images loaded on demand
- **Debounced Search**: Reduced API calls during user input

## 🔧 Development Tools

### Volta Configuration
```json
{
  "volta": {
    "node": "20.19.4",
    "pnpm": "9.15.9"
  }
}
```

### TypeScript Configuration
- **Strict Mode**: Maximum type safety
- **Path Mapping**: Clean import paths
- **Incremental Compilation**: Faster development builds

### ESLint Rules
- **React Hooks**: Proper hooks usage
- **TypeScript**: Type-specific linting
- **Import/Export**: Module organization
- **Accessibility**: a11y rule enforcement

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 📱 Mobile Support

- **Progressive Web App**: PWA ready configuration
- **Touch Optimization**: Touch-friendly interactions
- **Viewport Handling**: Proper mobile viewport setup
- **Performance**: Optimized for mobile networks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Run linting and tests (`pnpm lint && pnpm test`)
6. Commit with conventional commits (`feat: add amazing feature`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- **TypeScript**: All code must be properly typed
- **ESLint**: No linting errors allowed
- **Testing**: New features require tests
- **Documentation**: Update README for significant changes

## 📋 Roadmap

### Planned Features
- [ ] **User Authentication**: Save favorite cocktails
- [ ] **Offline Support**: PWA with offline capabilities
- [ ] **Dark Mode**: Complete dark theme implementation
- [ ] **Advanced Filters**: More filtering options (ABV, difficulty)
- [ ] **Shopping List**: Generate ingredient shopping lists
- [ ] **Social Features**: Share cocktails and reviews

### Technical Improvements
- [ ] **Storybook**: Component documentation
- [ ] **E2E Testing**: Playwright integration
- [ ] **Performance Monitoring**: Bundle size tracking
- [ ] **Internationalization**: Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TheCocktailDB](https://www.thecocktaildb.com/) for the comprehensive cocktail API
- [Material-UI](https://mui.com/) for the excellent component library
- [React Query](https://tanstack.com/query) for powerful data fetching
- [Vite](https://vitejs.dev/) for the incredible build experience

---

**🎉 Completely refactored in 2025** - From Create React App to Vite + TypeScript + Modern Architecture

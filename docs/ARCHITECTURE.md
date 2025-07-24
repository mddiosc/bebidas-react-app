# Architecture Documentation

## Overview

Cocktail Explorer follows modern React architectural patterns with a focus on maintainability, performance, and developer experience. This document outlines the key architectural decisions and patterns used throughout the application.

## Architectural Principles

### 1. Separation of Concerns

**Data Layer**: API calls and data transformation
**Business Logic**: Custom hooks and utility functions  
**Presentation Layer**: React components focused on UI
**State Management**: Centralized with React Query + Zustand

### 2. Component Composition

Components are designed to be:
- **Single Responsibility**: Each component has one clear purpose
- **Composable**: Can be combined to create complex UIs
- **Reusable**: Work in different contexts with props
- **Predictable**: Same props always produce same output

### 3. Type Safety

- **Strict TypeScript**: No implicit any, complete type coverage
- **Interface-Driven**: All component props and data structures typed
- **Runtime Safety**: Validation at boundaries where data enters the system

## Project Structure

```
src/
├── components/           # UI Components
│   ├── DrinkCard/       # Feature components
│   ├── SearchForm/      
│   ├── DrinksList/      
│   ├── FeaturedDrinks/  
│   └── Header/          
├── hooks/               # Custom Hooks
│   ├── useQueries.ts    # Data fetching hooks
│   └── useExtraQueries.ts # Extended functionality
├── services/            # External Services
│   └── cocktailApi.ts   # API client
├── stores/              # State Management
│   └── modalStore.ts    # Client state (Zustand)
├── types/               # TypeScript Definitions
│   └── index.ts         # Global interfaces
└── utils/               # Utility Functions
    └── helpers.ts       # Pure functions
```

## Component Architecture

### Component Types

#### 1. Page Components
Top-level components that compose entire pages/views:

```typescript
// App.tsx - Root application component
const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchFormData | null>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Header />
        <SearchForm onSearch={setSearchParams} />
        {searchParams ? (
          <DrinksList searchParams={searchParams} />
        ) : (
          <FeaturedDrinks />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
```

#### 2. Feature Components
Components that encapsulate complete features:

```typescript
// DrinkCard.tsx - Complete drink card with modal
interface DrinkCardProps {
  drink: Drink;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  // Encapsulates all drink card functionality:
  // - Display logic
  // - Modal management
  // - User interactions (favorite, share)
  // - Data fetching for details
};
```

#### 3. Layout Components
Components responsible for layout and structure:

```typescript
// Header.tsx - Application header
const Header: React.FC = () => {
  return (
    <AppBar position="static">
      {/* Navigation and branding */}
    </AppBar>
  );
};
```

### Component Patterns

#### Compound Components

Complex components broken into focused sub-components:

```typescript
// SearchForm compound pattern
const SearchForm = {
  Root: SearchFormRoot,
  Input: SearchInput,
  CategorySelect: CategorySelect,
  Actions: SearchActions,
};

// Usage
<SearchForm.Root onSubmit={handleSubmit}>
  <SearchForm.Input name="query" />
  <SearchForm.CategorySelect options={categories} />
  <SearchForm.Actions>
    <SubmitButton />
    <ClearButton />
  </SearchForm.Actions>
</SearchForm.Root>
```

#### Render Props

For flexible component composition:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactElement;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallback = (error) => <DefaultErrorUI error={error} />
}) => {
  // Error boundary implementation
};
```

#### Higher-Order Components (HOCs)

For cross-cutting concerns:

```typescript
const withErrorHandling = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};
```

## State Management Architecture

### Server State (React Query)

Handles all API-related state:

```typescript
// Query configuration
const queryConfig = {
  // Caching strategies
  staleTime: 5 * 60 * 1000,        // 5 minutes
  gcTime: 10 * 60 * 1000,          // 10 minutes
  
  // Error handling
  retry: 3,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  
  // Performance
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};
```

### Client State (Zustand)

Lightweight state for UI concerns:

```typescript
interface ModalState {
  isOpen: boolean;
  selectedDrinkId: string | null;
  openModal: (drinkId: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedDrinkId: null,
  openModal: (drinkId) => set({ isOpen: true, selectedDrinkId: drinkId }),
  closeModal: () => set({ isOpen: false, selectedDrinkId: null }),
}));
```

### Local State (useState)

Component-specific state:

```typescript
const SearchForm: React.FC = () => {
  // Form state - local to component
  const [formData, setFormData] = useState<SearchFormData>({
    name: '',
    category: '',
  });
  
  // UI state - local to component
  const [isExpanded, setIsExpanded] = useState(false);
};
```

## Custom Hooks Architecture

### Data Fetching Hooks

Encapsulate API interactions:

```typescript
// useSearchDrinks.ts
export const useSearchDrinks = (
  searchParams: SearchFormData,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['drinks', searchParams],
    queryFn: () => cocktailApi.searchDrinks(searchParams),
    enabled: enabled && hasValidSearchParams(searchParams),
    ...queryConfig,
  });
};
```

### Business Logic Hooks

Encapsulate complex business rules:

```typescript
// useIngredientParser.ts
export const useIngredientParser = (drink: Drink) => {
  return useMemo(() => {
    const ingredients: Ingredient[] = [];
    
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}` as keyof Drink];
      const measure = drink[`strMeasure${i}` as keyof Drink];
      
      if (ingredient?.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || 'To taste',
        });
      }
    }
    
    return ingredients;
  }, [drink]);
};
```

### UI State Hooks

Manage component UI state:

```typescript
// useToggle.ts
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse }] as const;
};
```

## Performance Architecture

### React.memo Strategy

Memoize components with expensive renders or frequent re-renders:

```typescript
const DrinkCard = React.memo<DrinkCardProps>(({ drink }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.drink.idDrink === nextProps.drink.idDrink;
});
```

### useMemo for Expensive Calculations

```typescript
const ExpensiveComponent: React.FC<Props> = ({ items }) => {
  const processedItems = useMemo(() => {
    return items
      .filter(item => item.isVisible)
      .sort((a, b) => a.priority - b.priority)
      .map(item => ({
        ...item,
        computedValue: expensiveCalculation(item),
      }));
  }, [items]);
  
  return <div>{/* Render processed items */}</div>;
};
```

### useCallback for Event Handlers

```typescript
const ParentComponent: React.FC = () => {
  const [state, setState] = useState(initialState);
  
  const handleItemClick = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedId: id,
    }));
  }, []);
  
  return (
    <div>
      {items.map(item => (
        <ChildComponent 
          key={item.id}
          item={item}
          onClick={handleItemClick} // Stable reference
        />
      ))}
    </div>
  );
};
```

## Error Handling Architecture

### Error Boundaries

Catch and handle React errors:

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Error:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### API Error Handling

Centralized error handling for API calls:

```typescript
const apiErrorHandler = (error: AxiosError) => {
  if (error.response?.status === 404) {
    // Handle not found - return empty result
    return { drinks: null };
  }
  
  if (error.response?.status === 429) {
    // Handle rate limiting - retry with backoff
    throw new ApiError('Rate limited', error.response.status);
  }
  
  if (error.code === 'ECONNABORTED') {
    // Handle timeout
    throw new ApiError('Request timeout', 408);
  }
  
  // Generic error
  throw new ApiError('Network error', error.response?.status);
};
```

## Testing Architecture

### Component Testing Strategy

```typescript
// DrinkCard.test.tsx
describe('DrinkCard', () => {
  const mockDrink = createMockDrink();
  
  it('should render drink information', () => {
    render(<DrinkCard drink={mockDrink} />);
    
    expect(screen.getByText(mockDrink.strDrink)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockDrink.strDrink);
  });
  
  it('should open modal when view recipe is clicked', async () => {
    const user = userEvent.setup();
    render(<DrinkCard drink={mockDrink} />);
    
    await user.click(screen.getByText('View Recipe'));
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
// useSearchDrinks.test.ts
describe('useSearchDrinks', () => {
  it('should fetch drinks when search params are provided', async () => {
    const { result } = renderHook(() => 
      useSearchDrinks({ name: 'margarita', category: '' }, true)
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].strDrink).toBe('Margarita');
  });
});
```

## Build Architecture

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    // Performance settings
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  // Development settings
  server: {
    port: 3000,
    open: true,
  },
});
```

### Bundle Analysis

Monitor bundle size and composition:

```bash
# Analyze bundle composition
npm run build:analyze

# Performance audit
npm run lighthouse

# Bundle size check
npm run size-limit
```

## Deployment Architecture

### Environment Configuration

```typescript
// Environment variables
interface Config {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  version: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://www.thecocktaildb.com/api/json/v1/1',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
};
```

### Progressive Web App

```typescript
// PWA configuration
const swConfig = {
  onSuccess: (registration: ServiceWorkerRegistration) => {
    console.log('SW registered: ', registration);
  },
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log('SW updated: ', registration);
    // Show update notification to user
  },
};
```

## Future Architecture Considerations

### Micro-Frontends

Plan for potential micro-frontend architecture:

```typescript
// Module federation setup for future scaling
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'cocktail_explorer',
      exposes: {
        './DrinkCard': './src/components/DrinkCard',
        './SearchForm': './src/components/SearchForm',
      },
    }),
  ],
};
```

### State Management Evolution

Preparation for complex state requirements:

```typescript
// Redux Toolkit Query as alternative to React Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cocktailApi = createApi({
  reducerPath: 'cocktailApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.thecocktaildb.com/api/json/v1/1/',
  }),
  endpoints: (builder) => ({
    searchDrinks: builder.query<Drink[], SearchFormData>({
      query: (params) => `search.php?s=${params.name}`,
    }),
  }),
});
```

### Internationalization (i18n)

Structure for multi-language support:

```typescript
// i18n preparation
import { useTranslation } from 'react-i18next';

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <Button>{t('viewRecipe')}</Button>
    </Card>
  );
};
```

This architecture provides a solid foundation for current needs while maintaining flexibility for future enhancements and scaling requirements.

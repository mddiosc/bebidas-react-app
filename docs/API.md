# API Documentation

## Overview

Cocktail Explorer integrates with [TheCocktailDB](https://www.thecocktaildb.com/) public API to provide comprehensive cocktail and drink information. This document outlines the API integration, data structures, and usage patterns.

## Base Configuration

```typescript
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// API Client Configuration
const cocktailApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Endpoints

### 1. Search Drinks

**Endpoint**: Multiple endpoints combined for comprehensive search

**Implementation**:
```typescript
async searchDrinks(params: SearchFormData): Promise<Drink[]>
```

**Search Strategy**:
- **By Name**: `/search.php?s={name}`
- **By Ingredient**: `/filter.php?i={ingredient}`  
- **By Category**: `/filter.php?c={category}`
- **Combined Search**: Merges ingredient and name results, deduplicates

**Parameters**:
```typescript
interface SearchFormData {
  name: string;
  category: string;
}
```

**Response**:
```typescript
interface DrinkApiResponse {
  drinks: Drink[] | null;
}
```

### 2. Get Drink Details

**Endpoint**: `/lookup.php?i={id}`

**Implementation**:
```typescript
async getDrinkDetails(id: string): Promise<Drink>
```

**Use Case**: Fetch complete drink information for modal display

### 3. Get Categories

**Endpoint**: `/list.php?c=list`

**Implementation**:
```typescript
async getCategories(): Promise<Category[]>
```

**Response**:
```typescript
interface Category {
  strCategory: string;
}
```

### 4. Get Random Drink

**Endpoint**: `/random.php`

**Implementation**:
```typescript
async getRandomDrink(): Promise<Drink>
```

**Use Case**: Daily special feature

## Data Models

### Drink Interface

Complete drink object with all possible fields from the API:

```typescript
interface Drink {
  // Basic Information
  idDrink: string;
  strDrink: string;
  strDrinkAlternate?: string | null;
  strTags?: string | null;
  strVideo?: string | null;
  strCategory: string;
  strIBA?: string | null;
  strAlcoholic: string;
  strGlass: string;
  
  // Instructions (Multiple Languages)
  strInstructions?: string;
  strInstructionsES?: string | null;
  strInstructionsDE?: string | null;
  strInstructionsFR?: string | null;
  strInstructionsIT?: string | null;
  'strInstructionsZH-HANS'?: string | null;
  'strInstructionsZH-HANT'?: string | null;
  
  // Media
  strDrinkThumb: string;
  
  // Ingredients (1-15)
  strIngredient1?: string | null;
  strIngredient2?: string | null;
  // ... up to strIngredient15
  
  // Measurements (1-15)
  strMeasure1?: string | null;
  strMeasure2?: string | null;
  // ... up to strMeasure15
  
  // Metadata
  strImageSource?: string | null;
  strImageAttribution?: string | null;
  strCreativeCommonsConfirmed?: string | null;
  dateModified?: string | null;
}
```

### API Response Interfaces

```typescript
interface DrinkApiResponse {
  drinks: Drink[] | null;
}

interface CategoryApiResponse {
  drinks: Category[];
}
```

## React Query Integration

### Query Keys

Consistent query key structure for caching:

```typescript
// Search queries
['drinks', searchParams] // Search results
['drinkDetails', id]     // Individual drink details
['categories']           // Categories list
['randomDrink']          // Random drink
['popularDrinks']        // Popular drinks simulation
```

### Custom Hooks

#### useSearchDrinks

```typescript
export const useSearchDrinks = (
  searchParams: SearchFormData,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['drinks', searchParams],
    queryFn: () => cocktailApi.searchDrinks(searchParams),
    enabled: enabled && (!!searchParams.name.trim() || !!searchParams.category.trim()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

#### useDrinkDetails

```typescript
export const useDrinkDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['drinkDetails', id],
    queryFn: () => cocktailApi.getDrinkDetails(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60,    // 1 hour
  });
};
```

#### useCategories

```typescript
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: cocktailApi.getCategories,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48,    // 48 hours
  });
};
```

## Caching Strategy

### Cache Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,     // 5 minutes default
      gcTime: 10 * 60 * 1000,       // 10 minutes default
      refetchOnWindowFocus: false,   // Prevent unnecessary refetches
      refetchOnReconnect: true,      // Refetch when reconnecting
    },
  },
});
```

### Cache Lifetimes

| Query Type | Stale Time | GC Time | Reasoning |
|------------|------------|---------|-----------|
| Search Results | 5 minutes | 10 minutes | Search results change frequently |
| Drink Details | 30 minutes | 1 hour | Drink details rarely change |
| Categories | 24 hours | 48 hours | Categories are very stable |
| Random Drink | 0 (always fresh) | 5 minutes | Should always be fresh |

## Error Handling

### API Error Types

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
```

### Error Handling Strategy

1. **Network Errors**: Automatic retry with exponential backoff
2. **404 Errors**: Return empty arrays/null for graceful handling
3. **Timeout Errors**: 10-second timeout with retry
4. **Rate Limiting**: Exponential backoff on 429 responses

### Error Boundaries

```typescript
// Global error boundary catches API errors
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundaryProvider
      onError={(error, errorInfo) => {
        console.error('API Error:', error, errorInfo);
        // Log to error reporting service
      }}
    >
      {children}
    </ErrorBoundaryProvider>
  );
};
```

## Performance Optimizations

### Request Deduplication

React Query automatically deduplicates identical requests made within a short time window.

### Background Updates

```typescript
// Background refetch for stale data
queryClient.prefetchQuery({
  queryKey: ['categories'],
  queryFn: cocktailApi.getCategories,
});
```

### Optimistic Updates

For future features like favorites:

```typescript
const addToFavorites = useMutation({
  mutationFn: (drinkId: string) => api.addFavorite(drinkId),
  onMutate: async (drinkId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['favorites']);
    
    // Snapshot previous value
    const previousFavorites = queryClient.getQueryData(['favorites']);
    
    // Optimistically update
    queryClient.setQueryData(['favorites'], (old: string[]) => [...old, drinkId]);
    
    return { previousFavorites };
  },
  onError: (err, drinkId, context) => {
    // Rollback on error
    queryClient.setQueryData(['favorites'], context?.previousFavorites);
  },
});
```

## Rate Limiting

### Current Limits

TheCocktailDB doesn't specify rate limits, but we implement conservative patterns:

- Maximum 1 request per 100ms per endpoint
- Debounced search input (300ms delay)
- Request deduplication
- Intelligent caching

### Implementation

```typescript
// Debounced search hook
export const useDebouncedSearch = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
```

## Future API Enhancements

### Planned Features

1. **User Authentication**: Premium TheCocktailDB features
2. **Favorites Sync**: Cloud storage for user preferences
3. **Recipe Ratings**: Community-driven rating system
4. **Ingredient Substitutions**: Smart ingredient alternatives
5. **Nutritional Information**: Calorie and nutritional data

### API Extensions

```typescript
// Planned interfaces for future features
interface UserPreferences {
  favoriteIds: string[];
  dietaryRestrictions: string[];
  preferredUnits: 'metric' | 'imperial';
}

interface DrinkRating {
  drinkId: string;
  rating: number;
  userId: string;
  comment?: string;
}
```

## Testing

### API Testing Strategy

```typescript
// Mock API responses for testing
export const mockDrinkResponse: DrinkApiResponse = {
  drinks: [
    {
      idDrink: '11007',
      strDrink: 'Margarita',
      strCategory: 'Ordinary Drink',
      // ... other properties
    }
  ]
};

// Test API integration
describe('cocktailApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should search drinks by name', async () => {
    const mockAxios = jest.spyOn(axios, 'get').mockResolvedValue({
      data: mockDrinkResponse
    });
    
    const result = await cocktailApi.searchDrinks({ name: 'margarita', category: '' });
    
    expect(mockAxios).toHaveBeenCalledWith('/search.php?s=margarita');
    expect(result).toEqual(mockDrinkResponse.drinks);
  });
});
```

## Monitoring and Analytics

### API Metrics

Track the following metrics:

- Request success/failure rates
- Response times by endpoint
- Cache hit/miss ratios
- Error types and frequencies
- User search patterns

### Implementation

```typescript
// API monitoring wrapper
const withMetrics = (apiCall: Function, endpoint: string) => {
  return async (...args: any[]) => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall(...args);
      
      // Log success metrics
      analytics.track('api_request_success', {
        endpoint,
        duration: performance.now() - startTime,
      });
      
      return result;
    } catch (error) {
      // Log error metrics
      analytics.track('api_request_error', {
        endpoint,
        error: error.message,
        duration: performance.now() - startTime,
      });
      
      throw error;
    }
  };
};
```

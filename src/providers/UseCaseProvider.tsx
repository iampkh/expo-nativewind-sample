import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAppDispatch } from '../store';
import { store } from '../store';
import { UseCaseContext, UseCaseFactory, BaseUseCase } from '../useCases/types';
import { HttpRemoteDataStore } from '../remoteDataStores';

// Use case context
const UseCaseContextProvider = createContext<UseCaseContext | undefined>(undefined);

interface UseCaseProviderProps {
  children: ReactNode;
  baseURL?: string;
}

export function UseCaseProvider({ 
  children, 
  baseURL = 'https://api.example.com' 
}: UseCaseProviderProps) {
  const dispatch = useAppDispatch();
  
  const context = useMemo((): UseCaseContext => {
    // Initialize remote data store
    const remoteDataStore = new HttpRemoteDataStore(baseURL);

    // Initialize repositories
    const repositories = {
      // Add repositories here as they are created
      // notes: new NotesRepository(remoteDataStore),
    };

    return {
      dispatch,
      getState: () => {
        // Return the current Redux state using the store directly
        return store.getState();
      },
      repositories,
    };
  }, [dispatch, baseURL]);

  return (
    <UseCaseContextProvider.Provider value={context}>
      {children}
    </UseCaseContextProvider.Provider>
  );
}

// Hook to get use case context
export function useUseCaseContext(): UseCaseContext {
  const context = useContext(UseCaseContextProvider);
  if (!context) {
    throw new Error('useUseCaseContext must be used within a UseCaseProvider');
  }
  return context;
}

// Hook to create and memoize use cases
export function useUseCase<T extends BaseUseCase>(
  factory: UseCaseFactory<T>,
  deps: any[] = []
): T {
  const context = useUseCaseContext();
  
  return useMemo(() => {
    return factory(context);
  }, [context, ...deps]);
}

// Hook for screen use cases with lifecycle management
export function useScreenUseCase<T extends BaseUseCase>(
  factory: UseCaseFactory<T>,
  deps: any[] = []
): T {
  const useCase = useUseCase(factory, deps);

  // Handle screen lifecycle
  React.useEffect(() => {
    if ('initialize' in useCase && typeof useCase.initialize === 'function') {
      useCase.initialize();
    }

    return () => {
      if ('cleanup' in useCase && typeof useCase.cleanup === 'function') {
        useCase.cleanup();
      }
    };
  }, [useCase]);

  // Handle focus/blur if using React Navigation
  // This would need to be implemented based on your navigation library
  // React.useEffect(() => {
  //   const unsubscribeFocus = navigation.addListener('focus', () => {
  //     if ('onFocus' in useCase && typeof useCase.onFocus === 'function') {
  //       useCase.onFocus();
  //     }
  //   });

  //   const unsubscribeBlur = navigation.addListener('blur', () => {
  //     if ('onBlur' in useCase && typeof useCase.onBlur === 'function') {
  //       useCase.onBlur();
  //     }
  //   });

  //   return () => {
  //     unsubscribeFocus();
  //     unsubscribeBlur();
  //   };
  // }, [useCase, navigation]);

  return useCase;
}
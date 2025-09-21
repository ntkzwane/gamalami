import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Language, UserProgress, Achievement } from '../types/ditema';
import { supportedLanguages } from '../data/ditemaData';

interface AppState {
  selectedLanguage: Language | null;
  userProgress: UserProgress | null;
  currentModule: string | null;
  isAuthenticated: boolean;
  darkMode: boolean;
}

type AppAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_MODULE'; payload: string }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOGIN'; payload: UserProgress }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  selectedLanguage: null,
  userProgress: null,
  currentModule: null,
  isAuthenticated: false,
  darkMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        selectedLanguage: action.payload,
      };
    case 'SET_MODULE':
      return {
        ...state,
        currentModule: action.payload,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: state.userProgress ? { ...state.userProgress, ...action.payload } : null,
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        userProgress: state.userProgress ? {
          ...state.userProgress,
          achievements: [...state.userProgress.achievements, action.payload],
        } : null,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'LOGIN':
      return {
        ...state,
        userProgress: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        userProgress: null,
        isAuthenticated: false,
        selectedLanguage: null,
        currentModule: null,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  availableLanguages: Language[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value: AppContextType = {
    state,
    dispatch,
    availableLanguages: supportedLanguages,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Custom hooks for specific actions
export function useLanguage() {
  const { state, dispatch, availableLanguages } = useApp();
  
  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  return {
    selectedLanguage: state.selectedLanguage,
    availableLanguages,
    setLanguage,
  };
}

export function useProgress() {
  const { state, dispatch } = useApp();
  
  const updateProgress = (progress: Partial<UserProgress>) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  };

  const addAchievement = (achievement: Achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  return {
    userProgress: state.userProgress,
    updateProgress,
    addAchievement,
  };
}

export function useModule() {
  const { state, dispatch } = useApp();
  
  const setModule = (module: string) => {
    dispatch({ type: 'SET_MODULE', payload: module });
  };

  return {
    currentModule: state.currentModule,
    setModule,
  };
}

export function useTheme() {
  const { state, dispatch } = useApp();
  
  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return {
    darkMode: state.darkMode,
    toggleDarkMode,
  };
}
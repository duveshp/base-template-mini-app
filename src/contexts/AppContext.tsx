'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Types
export interface User {
  id: number;
  fid: number;
  address: string;
  name: string;
  avatar?: string;
  role: 'User' | 'Organization';
  interests?: string;
  created_at: string;
  updated_at: string;
}

export interface Collab {
  id: number;
  title: string;
  emoji: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  host_id: number;
  host_name: string;
  host_avatar?: string;
  media_url?: string;
  participant_count: number;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: number;
  collab_id: number;
  user_id: number;
  name: string;
  avatar?: string;
  proof_text?: string;
  proof_image_url?: string;
  joined_at: string;
}

export interface UserStats {
  collabs_hosted: number;
  collabs_joined: number;
  proofs_submitted: number;
}

export interface Badge {
  badge_type: string;
  earned_at: string;
}

// State interface
interface AppState {
  user: User | null;
  collabs: Collab[];
  userCollabs: Collab[];
  userJoinedCollabs: Collab[];
  userStats: UserStats | null;
  userBadges: Badge[];
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_COLLABS'; payload: Collab[] }
  | { type: 'SET_USER_COLLABS'; payload: Collab[] }
  | { type: 'SET_USER_JOINED_COLLABS'; payload: Collab[] }
  | { type: 'SET_USER_STATS'; payload: UserStats | null }
  | { type: 'SET_USER_BADGES'; payload: Badge[] }
  | { type: 'ADD_COLLAB'; payload: Collab }
  | { type: 'UPDATE_COLLAB'; payload: Collab }
  | { type: 'JOIN_COLLAB'; payload: { collabId: number; participant: Participant } }
  | { type: 'UPDATE_PARTICIPANT_PROOF'; payload: { collabId: number; proofText?: string; proofImageUrl?: string } }
  | { type: 'ADD_BADGE'; payload: Badge };

// Initial state
const initialState: AppState = {
  user: null,
  collabs: [],
  userCollabs: [],
  userJoinedCollabs: [],
  userStats: null,
  userBadges: [],
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_COLLABS':
      return { ...state, collabs: action.payload };
    case 'SET_USER_COLLABS':
      return { ...state, userCollabs: action.payload };
    case 'SET_USER_JOINED_COLLABS':
      return { ...state, userJoinedCollabs: action.payload };
    case 'SET_USER_STATS':
      return { ...state, userStats: action.payload };
    case 'SET_USER_BADGES':
      return { ...state, userBadges: action.payload };
    case 'ADD_COLLAB':
      return { ...state, collabs: [action.payload, ...state.collabs] };
    case 'UPDATE_COLLAB':
      return {
        ...state,
        collabs: state.collabs.map(collab =>
          collab.id === action.payload.id ? action.payload : collab
        ),
      };
    case 'JOIN_COLLAB':
      return {
        ...state,
        collabs: state.collabs.map(collab =>
          collab.id === action.payload.collabId
            ? { ...collab, participant_count: collab.participant_count + 1 }
            : collab
        ),
      };
    case 'UPDATE_PARTICIPANT_PROOF':
      return {
        ...state,
        userJoinedCollabs: state.userJoinedCollabs.map(collab =>
          collab.id === action.payload.collabId
            ? {
                ...collab,
                // Update the participant's proof in the joined collabs
              }
            : collab
        ),
      };
    case 'ADD_BADGE':
      return {
        ...state,
        userBadges: [...state.userBadges, action.payload],
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions
  login: (user: User) => void;
  logout: () => void;
  fetchCollabs: () => Promise<void>;
  fetchUserCollabs: () => Promise<void>;
  fetchUserJoinedCollabs: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchUserBadges: () => Promise<void>;
  createCollab: (collabData: Omit<Collab, 'id' | 'host_name' | 'host_avatar' | 'participant_count' | 'created_at' | 'updated_at'>) => Promise<void>;
  joinCollab: (collabId: number, proofText?: string, proofImageUrl?: string) => Promise<void>;
  updateParticipantProof: (collabId: number, proofText?: string, proofImageUrl?: string) => Promise<void>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const login = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_USER_COLLABS', payload: [] });
    dispatch({ type: 'SET_USER_JOINED_COLLABS', payload: [] });
    dispatch({ type: 'SET_USER_STATS', payload: null });
    dispatch({ type: 'SET_USER_BADGES', payload: [] });
  };

  const fetchCollabs = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/api/collabs');
      if (!response.ok) throw new Error('Failed to fetch collabs');
      const collabs = await response.json();
      dispatch({ type: 'SET_COLLABS', payload: collabs });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchUserCollabs = useCallback(async () => {
    if (!state.user) return;
    try {
      const response = await fetch('/api/user/collabs-demo');
      if (!response.ok) throw new Error('Failed to fetch user collabs');
      const collabs = await response.json();
      dispatch({ type: 'SET_USER_COLLABS', payload: collabs });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.user]);

  const fetchUserJoinedCollabs = useCallback(async () => {
    if (!state.user) return;
    try {
      const response = await fetch('/api/user/joined-collabs-demo');
      if (!response.ok) throw new Error('Failed to fetch joined collabs');
      const collabs = await response.json();
      dispatch({ type: 'SET_USER_JOINED_COLLABS', payload: collabs });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.user]);

  const fetchUserStats = useCallback(async () => {
    if (!state.user) return;
    try {
      const response = await fetch('/api/user/stats-demo');
      if (!response.ok) throw new Error('Failed to fetch user stats');
      const stats = await response.json();
      dispatch({ type: 'SET_USER_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.user]);

  const fetchUserBadges = useCallback(async () => {
    if (!state.user) return;
    try {
      const response = await fetch('/api/user/badges-demo');
      if (!response.ok) throw new Error('Failed to fetch user badges');
      const badges = await response.json();
      dispatch({ type: 'SET_USER_BADGES', payload: badges });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [state.user]);

  const createCollab = async (collabData: Omit<Collab, 'id' | 'host_name' | 'host_avatar' | 'participant_count' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/collabs/create-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collabData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collab');
      }
      const newCollab = await response.json();
      dispatch({ type: 'ADD_COLLAB', payload: newCollab });
    } catch (error) {
      console.error('Create collab error:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error; // Re-throw so the UI can handle it
    }
  };

  const joinCollab = async (collabId: number, proofText?: string, proofImageUrl?: string) => {
    try {
      const response = await fetch('/api/collabs/join-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collabId, proofText, proofImageUrl }),
      });
      if (!response.ok) throw new Error('Failed to join collab');
      const participant = await response.json();
      dispatch({ type: 'JOIN_COLLAB', payload: { collabId, participant } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const updateParticipantProof = async (collabId: number, proofText?: string, proofImageUrl?: string) => {
    try {
      const response = await fetch('/api/collabs/update-proof-demo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collabId, proofText, proofImageUrl }),
      });
      if (!response.ok) throw new Error('Failed to update proof');
      dispatch({ type: 'UPDATE_PARTICIPANT_PROOF', payload: { collabId, proofText, proofImageUrl } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  // Fetch collabs on mount
  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs]);

  // Fetch user data when user changes
  useEffect(() => {
    if (state.user) {
      fetchUserCollabs();
      fetchUserJoinedCollabs();
      fetchUserStats();
      fetchUserBadges();
    }
  }, [state.user, fetchUserCollabs, fetchUserJoinedCollabs, fetchUserStats, fetchUserBadges]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        fetchCollabs,
        fetchUserCollabs,
        fetchUserJoinedCollabs,
        fetchUserStats,
        fetchUserBadges,
        createCollab,
        joinCollab,
        updateParticipantProof,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper function for authenticated requests
async function fetchWithAuth(url: string, options?: any) {
  try {
    const { sdk } = await import('@farcaster/frame-sdk');
    if (!sdk.quickAuth) {
      throw new Error('QuickAuth SDK not initialized');
    }
    return await sdk.quickAuth.fetch(url, options);
  } catch (error) {
    console.error('fetchWithAuth error:', error);
    throw error;
  }
}

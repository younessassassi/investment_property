export interface User {
  email: string;
  id: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface SavedProperty {
  id: string;
  name: string;
  inputs: any; // InputState
  createdAt: string;
  updatedAt: string;
  userId: string;
}

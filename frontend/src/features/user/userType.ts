export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'moderator' | 'seller';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserState {
  users: IUser[];
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'moderator' | 'seller';
  status?: 'active' | 'inactive';
}
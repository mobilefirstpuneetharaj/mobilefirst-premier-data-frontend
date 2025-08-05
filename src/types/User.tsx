export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'user';
  token?: string;
  isVerified?: boolean;
}

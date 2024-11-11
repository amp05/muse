export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
}
export interface RegisterDTO {
    email: string;
    username: string;
    password: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface JWTPayload {
    userId: string;
    email: string;
  }
export interface Token {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  }
  
export interface Account {
    provider: string;
    type: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    [key: string]: unknown; // Other provider-specific fields
  }
  
export interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  }
  
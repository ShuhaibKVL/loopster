export interface IToken_Next_Auth {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  }
  
export interface IAccount_Next_Auth {
    provider: string;
    type: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    [key: string]: unknown; // Other provider-specific fields
  }
  
export interface User_Next_Auht {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
}
  
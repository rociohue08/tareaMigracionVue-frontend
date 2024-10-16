
export interface Sesion {
    payload: string; // token payload
    createdAt: Date; // creation time
    expiresAt: Date; // expiration time
    refreshAt: Date; // refresh time
  }




export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    remember?: boolean,
    isAdmin: boolean,
    // ?=optional
    JwtToken?: string,
    //va a ser un array donde vamos a ir almacenando los tokens
    //array where tokens are stored
    refreshTokens: string []
  }
  
export interface IUserCredential {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    genre: string;
  };
}

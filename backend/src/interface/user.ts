export type TUser = {
  id: number;
  username: string;
  about: string;
  avatar: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  password: string;
};

export type TSignInUser = Pick<
  TUser,
  'username' | 'about' | 'avatar' | 'email' | 'password'
>;
export type TUpdateUser = Partial<TUser>;

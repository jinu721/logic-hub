export interface LoginIF {
  identifier: string;
  password: string;
}


export interface RegisterIF {
  username: string;
  email: string;
  password: string;
}

export interface GetOTPIF {
  email: string;
}
export interface CheckUserIF {
  type: string;
  value: string;
}
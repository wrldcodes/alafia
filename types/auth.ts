export interface CookieResponse {
  cookie: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "strict" | "lax" | "none";
      maxAge: number;
    },
  ) => void;
}

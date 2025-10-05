import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

declare global {
  interface Window {
    snap: {
      pay: (
        token ,
      options? : {
        onSuccess?  : (result: any) => void,
        onPending?: (result: any) => void,
        onError?: (result: any) => void,
        onClose?: (result: any) => void,
      }
    ) => void;
  }
}
}
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      userName: string;
      profileImage: string;
    };
    accessToken: string;
    totalUnReadMessages: number;
  }

  interface User {
    id: string;
    email: string;
    fullName: string;
    userName: string;
    profileImage: string;
  }

  interface JWT {
    session?: {
      user: User;
      accessToken: string;
      totalUnReadMessages: number;
    };
  }
}

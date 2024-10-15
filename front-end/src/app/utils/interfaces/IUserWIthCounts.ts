import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { ICounts } from "./ICounts";

export interface IUserWithCounts extends ISignUp_user {
    counts : ICounts
}
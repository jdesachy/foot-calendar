import { Document } from "mongoose";
import { IUser } from "../interfaces/user";

export interface IUserModel extends IUser, Document {
  email?: string;
  firstName?: string;
  lastName?: string;
}
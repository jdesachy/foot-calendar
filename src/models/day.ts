import { Document } from "mongoose";
import { IDay } from "../interfaces/day";

export interface IDayModel extends IDay, Document {
    id: string;
    user: string;
    participate: boolean;
}
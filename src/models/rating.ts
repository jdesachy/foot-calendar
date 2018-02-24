import { Document } from "mongoose";
import { Rating } from "../interfaces/rating";

export interface IRatingModel extends Rating, Document {
    day: string;
    user: string;
    rating: number;
    from: string;
}
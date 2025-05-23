import { Document, Schema, model, models, Model } from "mongoose";

export interface IDoner extends Document {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role: "donor" | "recipient";
  bloodGroup: string;
  organ: string;
  urgency?: number;
  location: {
    lat: number;
    lng: number;
  };

  matchedUsers?: Schema.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IDoner>(
  {
 
   
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },

    role: {
      type: String,
      enum: ["donor", "recipient"],
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    organ: {
      type: String,
      required: true,
    },
    urgency: {
      type: Number,
      min: 1,
      max: 5,
      
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    matchedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Doner: Model<IDoner> = models.Doner || model<IDoner>("Doner", userSchema);

export default Doner;

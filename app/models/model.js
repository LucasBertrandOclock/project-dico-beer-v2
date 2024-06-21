import mongoose, { Schema, model } from "mongoose";

const typeSchema = new Schema(
  {
    name: {
      type: String,
      required: "Type's name is required",
    },
    description: {
      type: String,
      required: "Type's description is required",
    }
  },
);

const colorSchema = new Schema(
  {
    name: {
      type: String,
      required: "Color's name is required",
    },
    description: {
      type: String,
      required: "Color's description is required",
    }
  },
);

const beerSchema = new Schema(
  {
    name: {
      type: String,
      required: "Beer's name is required",
    },
    description: {
      type: String,
      required: "Beer's description is required",
    },
    url: {
      type: String,
      required: "photo's url is required",
      default: "/default_img.png",
    },
    degree: {
      type: Number,
      required: "Beer's degree is required",
    },
    id_type: {
      type: mongoose.Types.ObjectId,
      ref: "Type"
    },
    id_color: {
      type: mongoose.Types.ObjectId,
      ref: "Color"
    },
    lists: [{
      type: mongoose.Types.ObjectId,
      ref: "List"
    }]
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    pseudo: {
      type: String,
      required: "Your pseudo is required",
      max: 25,
    },
    email: {
      type: String,
      required: "Your email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      select: false,
    },
    birthdate: {
      type: Date,
      required: "Your birthdate is required",
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    id_user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    beers: [{
      type: mongoose.Types.ObjectId,
      ref: "Beer"
    }]
  },
  { timestamps: true }
);

const reviewSchema = new Schema(
  {
    rate: {
      type: Number,
      required: "Rate is required",
    },
    comment: {
      type: String,
      required: "Comment is required",
    },
    id_beer: {
      type: mongoose.Types.ObjectId,
      ref: "Beer"
    },
    id_user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const User = model("User", userSchema, "users");
export const Type = model("Type", typeSchema, "types");
export const Color = model("Color", colorSchema, "colors");
export const Beer = model("Beer", beerSchema, "beers");
export const List = model("List", listSchema, "lists");
export const Review = model("Review", reviewSchema, "reviews");

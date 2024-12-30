import mongoose from "mongoose";
import { Schema } from "mongoose";

// Declare the Schema for the Brand model
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    logo: [
      {
        public_id: {
          type: String,
          required: [true, "Logo public ID is required"],
        },
        url: {
          type: String,
          required: [true, "Logo URL is required"],
        },
      },
    ],
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Brand creator is required"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug
brandSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-");
  next();
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;

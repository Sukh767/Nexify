import mongoose from "mongoose";

// Declare the Schema of the Mongo model for the product category
var categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "name must be unique"],
      // index:true,
    },
    url: {
      type: String,
      required: [true, "name is url"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    metaTitle: {
      type: String,
      required: [true, "title is required"],
    },
    metaDescription: {
      type: String,
      required: [true, "meta description is required"],
    },
    metaKeywords: {
      type: String,
      required: [true, "meta Keywords is required"],
    },
    parentCategory: {
      //type: mongoose.Schema.Types.ObjectId,
      type: Array,
      default: [],
    },
    attribute: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "Active",
    },
    banner: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      }
    ],
  },
  { timestamps: true }
);

//Export the model
const Category = mongoose.model("Category", categorySchema);
export default Category;

import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productUrl: {
      type: String,
      required: false,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    brand: {
      type: String,
      default: null,
    },
    sizes: [
      {
        size: { type: String, required: true }, // e.g., S, M, L, XL
        stock: { type: Number, required: true, default: 0 }, // Stock count per size
      },
    ],
    colors: [
      {
        colorName: { type: String, required: true }, // e.g., Red, Blue
        colorCode: { type: String, default: null }, // Optional hex code
      },
    ],
    parentCategory: {
      //type: mongoose.Schema.Types.ObjectId,
      //ref: "Category",
      type: Array,
      required: true,
    },
    child_category: {
      //type: mongoose.Schema.Types.ObjectId,
      //ref: "Category",
      type: Array,
      default: [],
    },
    short_description: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meta_title: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: true,
    },
    meta_keywords: {
      type: String,
      required: true,
    },
    skucode: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
      },
    ], // For search and filters
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      default: 0,
    },
    weight_unit: {
      type: String,
      default: "kg",
      enum: ["kg", "g", "lb", "ml", "l"],
    },
    dimensions: {
      length: { type: Number, default: 0 }, // cm
      width: { type: Number, default: 0 }, // cm
      height: { type: Number, default: 0 }, // cm
    },
    mrp_price: {
      type: Number,
      required: true,
      default: 0,
    },
    selling_price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number, // Percentage discount
      default: 0,
    },
    price_history: [
      {
        date: { type: Date, default: Date.now },
        price: { type: Number, required: false },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot exceed 5"],
          },
          comment: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    dynamicAttributes: {
      type: Schema.Types.Mixed, // e.g., { Material: "Cotton", Warranty: "1 Year" }
      default: {},
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

import mongoose from 'mongoose';
import { Schema } from 'mongoose';

// Declare the Schema of the Mongo model
var bannerSchema = new Schema(
  {
    bannerName: {
      type: String,
      required: [true, "Banner name is required"],
    },
    bannerAlt: {
      type: String,
      required: [true, "Banner alt text is required"],
    },
    bannerImages: [
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
    bannerType: {
      type: String,
      required: [true, "Banner type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Export the model
const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;

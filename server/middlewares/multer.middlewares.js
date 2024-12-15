import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp'); // Save files here
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
    },
  });
  
export const upload = multer({ storage });
  
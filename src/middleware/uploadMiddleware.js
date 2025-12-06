import multer from 'multer';

// We will store the file in memory as a 'buffer' before
// we send it to Cloudinary. This is fast and efficient.
const storage = multer.memoryStorage();

// This function checks to make sure the file is an allowed type
const fileFilter = (req, file, cb) => {
  // We can add more file types here later (e.g., 'image/jpeg', 'image/png')
  const allowedTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/zip', 
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, or ZIP are allowed.'), false); // Reject the file
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 15 // 15MB file size limit
  }
});

// We export the middleware to be used on a single file field named 'file'
// This MUST match the name in your frontend's FormData: formData.append('file', selectedFile)
export const uploadFile = upload.single('file');
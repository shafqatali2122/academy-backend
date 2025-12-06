import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    studentName: { 
      type: String,
      required: true 
    },
    studentEmail: { 
      type: String,
      required: true 
    },
    studentPhone: { 
      type: String,
      required: true 
    },
    studentCategory: { 
      type: String 
    }, // e.g., 'O-Level', 'A-Level', 'Online'
    courseOfInterest: { 
      type: String,
      required: true 
    },
    message: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Accepted', 'Rejected'], 
      default: 'Pending' 
    },
    isProcessed: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
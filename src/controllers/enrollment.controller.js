import Enrollment from '../models/enrollment.model.js';
import { sendEnrollmentConfirmation } from '../utils/email.js';

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Public
export const createEnrollment = async (req, res) => {
  try {
    const { 
      studentName, 
      studentEmail, 
      studentPhone, 
      studentCategory, 
      courseOfInterest, 
      message 
    } = req.body;

    if (!studentName || !studentEmail || !studentPhone || !courseOfInterest) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doc = await Enrollment.create({
      studentName,
      studentEmail,
      studentPhone,
      studentCategory,
      courseOfInterest,
      message,
    });

    // Send confirmation email (we don't wait for it to finish)
    sendEnrollmentConfirmation(doc.studentEmail, {
      studentName: doc.studentName,
      courseOfInterest: doc.courseOfInterest,
      status: doc.status,
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    List all enrollments
// @route   GET /api/enrollments
// @access  Private/Admin/Admissions
export const listEnrollments = async (req, res) => {
  try {
    const q = {};
    // Allow filtering by status, e.g., /api/enrollments?status=Pending
    if (req.query.status) {
      q.status = req.query.status;
    }
    
    const docs = await Enrollment.find(q).sort({ createdAt: -1 }); // Newest first
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Set enrollment status (Accept/Reject)
// @route   PUT /api/enrollments/:id/status
// @access  Private/Admin/Admissions
export const setStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expects 'Accepted' or 'Rejected'

  try {
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const doc = await Enrollment.findByIdAndUpdate(
      id, 
      { status, isProcessed: true }, 
      { new: true } // Return the updated document
    );

    if (!doc) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Send update email
    sendEnrollmentConfirmation(doc.studentEmail, {
      studentName: doc.studentName,
      courseOfInterest: doc.courseOfInterest,
      status: doc.status,
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin/Admissions
export const removeEnrollment = async (req, res) => {
  try {
    const doc = await Enrollment.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
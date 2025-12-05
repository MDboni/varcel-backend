import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String }, 
  content: { type: String }, 
  isCompleted: { type: Boolean, default: false } 
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true }, 
  category: { type: String, required: true },
  price: { type: Number, required: true },
  syllabus: [LessonSchema],
  batch: { type: String }, 
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], 
  assignments: [
    {
      title: { type: String },
      description: { type: String },
      submissions: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          answer: { type: String }, 
          submittedAt: { type: Date, default: Date.now },
          score: { type: Number } 
        }
      ]
    }
  ],
  quizzes: [
    {
      title: { type: String },
      questions: [
        {
          question: { type: String },
          options: [String],
          answer: { type: String }
        }
      ]
    }
  ],
  createDate: { type: Date, default: Date.now }
});

const CourseModel = mongoose.model("courses", CourseSchema);

export default CourseModel;

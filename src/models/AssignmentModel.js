
const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answer: String,
  submitDate: { type: Date, default: Date.now }
});
  


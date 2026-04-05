import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema)

export default Feedback

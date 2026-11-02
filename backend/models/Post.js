import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "/images/John Doe.avif" },
    location: { type: String, default: "Jos Central" },
    postText: { type: String, default: "" },
    postImage: { type: String, default: null },
    likes: { type: String, default: "0" },
    comments: { type: String, default: "0" },
    likedBy: { type: [String], default: [] },
    commentItems: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userAvatar: { type: String, default: "/images/John Doe.avif" },
        text: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
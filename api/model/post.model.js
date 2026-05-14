import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      default:
        "https://darrelwilson.com/storage/2021/03/high-quality-blog-posts.png",
    },
    category: {
      type: String,
      default: "uncategorized",
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "published",
        "rejected",
        "pending_edit",
        "pending_delete",
      ],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    submittedForApprovalAt: {
      type: Date,
      default: null,
    },
    editRequestData: {
      type: Object,
      default: null,
    },
    editRequestedAt: {
      type: Date,
      default: null,
    },
    deleteRequestedAt: {
      type: Date,
      default: null,
    },
    autoApproveAt: {
      type: Date,
      default: null,
      index: true,
    },
    // 🔥 Likes fields
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      index: true,
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    // 🔥 NEW: Share fields
    shares: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      index: true,
    },
    numberOfShares: {
      type: Number,
      default: 0,
    },
    // 🔥 NEW: Save/Bookmark fields
    savedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      index: true,
    },
    numberOfSaves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Compound indexes
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ autoApproveAt: 1, status: 1 });
postSchema.index({ likes: 1 });
postSchema.index({ savedBy: 1 });
postSchema.index({ shares: 1 });

// Auto-set publishedAt and auto-approve timer
postSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.status === "published" && !this.approvedAt) {
    this.approvedAt = new Date();
    this.approvedBy = this.userId;
  }
  if (
    (this.status === "pending_edit" || this.status === "pending_delete") &&
    !this.autoApproveAt
  ) {
    this.autoApproveAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

const createIndexes = async () => {
  try {
    await Post.createIndexes();
    console.log("✅ Post indexes created successfully");
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
  }
};

createIndexes();

export default Post;

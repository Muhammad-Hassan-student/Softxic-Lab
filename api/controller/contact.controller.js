import Contact from "../model/contact.model.js";
import { errorHandler } from "../utils/error.js";

// ==================== SEND CONTACT MESSAGE ====================
export const sendContactMessage = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return next(errorHandler(400, "Invalid email address"));
  }

  if (message.length < 10) {
    return next(errorHandler(400, "Message must be at least 10 characters"));
  }

  try {
    const newMessage = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    await newMessage.save();

    // Here you can add email notification logic
    // await sendEmailNotification({ name, email, subject, message });

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET ALL CONTACT MESSAGES (ADMIN ONLY) ====================
export const getAllContactMessages = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can view contact messages"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const { status, search } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const messages = await Contact.find(query)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalMessages = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ status: "unread" });
    const readCount = await Contact.countDocuments({ status: "read" });
    const repliedCount = await Contact.countDocuments({ status: "replied" });

    res.status(200).json({
      success: true,
      messages,
      totalMessages,
      unreadCount,
      readCount,
      repliedCount,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET SINGLE CONTACT MESSAGE ====================
export const getContactMessage = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can view contact messages"));
  }

  try {
    const message = await Contact.findById(req.params.messageId);
    if (!message) {
      return next(errorHandler(404, "Message not found"));
    }

    // Mark as read if not already
    if (message.status === "unread") {
      message.status = "read";
      await message.save();
    }

    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

// ==================== MARK MESSAGE AS REPLIED ====================
export const markAsReplied = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can update messages"));
  }

  try {
    const message = await Contact.findById(req.params.messageId);
    if (!message) {
      return next(errorHandler(404, "Message not found"));
    }

    message.status = "replied";
    message.repliedAt = new Date();
    await message.save();

    res
      .status(200)
      .json({ success: true, message: "Message marked as replied" });
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE CONTACT MESSAGE ====================
export const deleteContactMessage = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can delete messages"));
  }

  try {
    const message = await Contact.findById(req.params.messageId);
    if (!message) {
      return next(errorHandler(404, "Message not found"));
    }

    await Contact.findByIdAndDelete(req.params.messageId);
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ==================== GET CONTACT STATS ====================
export const getContactStats = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(errorHandler(403, "Only admins can view stats"));
  }

  try {
    const totalMessages = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ status: "unread" });
    const readCount = await Contact.countDocuments({ status: "read" });
    const repliedCount = await Contact.countDocuments({ status: "replied" });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const messagesLast30Days = await Contact.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalMessages,
        unreadCount,
        readCount,
        repliedCount,
        messagesLast30Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

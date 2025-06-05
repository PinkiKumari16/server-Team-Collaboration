import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: "teamId is required." });
    }

    const messages = await Message.find({ teamId })
      .populate("senderId", "name _id")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully.",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error while fetching messages." });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { content, senderId, teamId } = req.body;

    if (!content || !senderId || !teamId) {
      return res
        .status(400)
        .json({ message: "Content, senderId, and teamId are required." });
    }

    const newMessage = new Message({ content, senderId, teamId });
    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully.",
      data: {
        _id: savedMessage._id,
        content: savedMessage.content,
        senderId: savedMessage.senderId,
        teamId: savedMessage.teamId,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Server error while sending message." });
  }
};

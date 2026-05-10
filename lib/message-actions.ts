"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function sendMessage(receiverId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await connectDB();
    
    await Message.create({
      sender: session.user.id,
      receiver: receiverId,
      content,
    });

    revalidatePath("/admin/messages");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message || "Failed to send message" };
  }
}

export async function getConversation(otherUserId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await connectDB();

    // If no otherUserId, we assume employee talking to an Admin
    let targetUserId = otherUserId;
    if (!targetUserId) {
      const admin = await User.findOne({ role: "Admin" });
      if (!admin) return { success: false, error: "No admin found" };
      targetUserId = admin._id.toString();
    }

    const messages = await Message.find({
      $or: [
        { sender: session.user.id, receiver: targetUserId },
        { sender: targetUserId, receiver: session.user.id }
      ]
    })
    .sort({ createdAt: 1 })
    .lean();

    return { success: true, data: JSON.parse(JSON.stringify(messages)) };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { success: false, data: [] };
  }
}

export async function getAdminConversations() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await connectDB();
    const adminId = new mongoose.Types.ObjectId(session.user.id);

    const conversations = await Message.aggregate([
      { 
        $match: { 
          $or: [
            { sender: adminId },
            { receiver: adminId }
          ] 
        } 
      },
      { $sort: { createdAt: -1 } },
      { 
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", adminId] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$content" },
          lastDate: { $first: "$createdAt" },
          unreadCount: { 
            $sum: { 
              $cond: [
                { $and: [
                  { $eq: ["$receiver", adminId] },
                  { $eq: ["$isRead", false] }
                ]},
                1,
                0
              ] 
            } 
          }
        }
      },
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
      }},
      { $unwind: "$userDetails" }
    ]);

    return { success: true, data: JSON.parse(JSON.stringify(conversations)) };
  } catch (error) {
    console.error("Error fetching admin conversations:", error);
    return { success: false, data: [] };
  }
}

export async function markAsRead(senderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await connectDB();
    await Message.updateMany(
      { sender: senderId, receiver: session.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getUnreadCount() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, count: 0 };

    await connectDB();
    const count = await Message.countDocuments({ 
      receiver: session.user.id, 
      isRead: false 
    });

    return { success: true, count };
  } catch (error) {
    return { success: false, count: 0 };
  }
}

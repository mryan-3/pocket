import Notification from '../models/Notification.js';

// 1. Get My Notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Mark All as Read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

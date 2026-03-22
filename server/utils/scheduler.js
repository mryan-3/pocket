import cron from 'node-cron';
import ScheduledVisit from '../models/ScheduledVisit.js';
import Notification from '../models/Notification.js';
import { Logger } from 'borgen';

export const initScheduler = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    Logger.info({ message: "Running scheduler for feedback reminders..." });
    try {
      const now = new Date();
      
      // Find visits that are past their date, still 'upcoming', and no notification sent
      const visits = await ScheduledVisit.find({
        visitDate: { $lt: now },
        status: 'upcoming',
        notificationSent: false
      });

      for (const visit of visits) {
        // Update visit status
        visit.status = 'pending_feedback';
        visit.notificationSent = true;
        await visit.save();

        // Create notification
        await Notification.create({
          user: visit.user,
          type: 'feedback_reminder',
          title: 'How was your visit?',
          message: 'Your scheduled visit has passed. We would love to hear your feedback!',
          relatedVisit: visit._id,
          relatedRestaurant: visit.restaurant
        });
      }

      if (visits.length > 0) {
        Logger.info({ message: `Sent ${visits.length} feedback reminders.` });
      }
    } catch (error) {
      Logger.error({ message: `Scheduler error: ${error.message}` });
    }
  });
};

const { Expo } = require("expo-server-sdk");
const admin = require("../config/firebase");
const expo = new Expo();

exports.sendEventNotification = async (pushTokens, event) => {
  const expoTokens = [];
  const fcmTokens = [];

  for (const token of pushTokens) {
    if (Expo.isExpoPushToken(token)) {
      expoTokens.push(token);
    } else {
      fcmTokens.push(token);
    }
  }

  // --- Send Expo Notifications ---
  if (expoTokens.length > 0) {
    const messages = expoTokens.map((token) => ({
      to: token,
      sound: "default",
      title: event.title,
      body: "Registrations are now open! Tap to register. 📅",
      data: {
        eventId: event._id.toString(),
      },
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error("Expo push error:", error);
      }
    }
  }

  // --- Send FCM Notifications (Firebase) ---
  if (fcmTokens.length > 0) {
    // Note: sendMulticast supports up to 500 tokens per batch
    const message = {
      notification: {
        title: event.title,
        body: "Registrations are now open! Tap to register. 📅",
      },
      data: {
        eventId: event._id.toString(),
      },
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `FCM: ${response.successCount} sent, ${response.failureCount} failed.`,
      );

      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error("FCM error for token:", fcmTokens[idx], resp.error);
          }
        });
      }
    } catch (error) {
      console.error("FCM push global error:", error);
    }
  }
};

exports.sendAchieverNotification = async (pushTokens, achiever) => {
  const expoTokens = [];
  const fcmTokens = [];

  for (const token of pushTokens) {
    if (Expo.isExpoPushToken(token)) {
      expoTokens.push(token);
    } else {
      fcmTokens.push(token);
    }
  }

  // Simple & Professional Message
  const notificationTitle = `New Achievement: ${achiever.name}`;
  const notificationBody = `Let's congratulate them on this great success! 🏆`;

  // --- Send Expo Notifications ---
  if (expoTokens.length > 0) {
    const messages = expoTokens.map((token) => ({
      to: token,
      sound: "default",
      title: notificationTitle,
      body: notificationBody,
      data: {
        achieverId: achiever._id.toString(),
        type: "achiever", // To handle navigation in frontend
      },
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error("Expo push error (Achiever):", error);
      }
    }
  }

  // --- Send FCM Notifications (Firebase) ---
  if (fcmTokens.length > 0) {
    const message = {
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      data: {
        achieverId: achiever._id.toString(),
        type: "achiever",
      },
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `FCM (Achiever): ${response.successCount} sent, ${response.failureCount} failed.`,
      );

      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error("FCM error for token:", fcmTokens[idx], resp.error);
          }
        });
      }
    } catch (error) {
      console.error("FCM push global error (Achiever):", error);
    }
  }
};

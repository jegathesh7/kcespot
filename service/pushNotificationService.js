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
      title: "New Event Added 🎉",
      body: event.title,
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
        title: "New Event Added 🎉",
        body: event.title,
      },
      data: {
        eventId: event._id.toString(),
      },
      tokens: fcmTokens,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
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

const { Expo } = require("expo-server-sdk");
const expo = new Expo();

exports.sendEventNotification = async (pushTokens, event) => {
  const messages = [];

  for (const token of pushTokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.warn("Invalid Expo token:", token);
      continue;
    }

    messages.push({
      to: token,
      sound: "default",
      title: "New Event Added 🎉",
      body: event.title,
      data: {
        eventId: event._id.toString(),
      },
    });
  }

  if (messages.length === 0) return;

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Expo push error:", error);
    }
  }
};

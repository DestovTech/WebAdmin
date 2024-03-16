export async function sendNotificationToTopic(title: string, body: string) {
  const message = {
    to: `/topics/Users`,
    notification: {
      title: title,
      body: body,
    },
  };

  await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Authorization:
        "key=AAAAHRoPWdY:APA91bEnEuB9iV6w7QgIQQCd3AOGz7rDZ5c0goQI1fb9aJGMkeSE-ESF4ccpK7Cv-0yua-8eO1wC2uXV3DpjKveLPz0cimnc3dbe93GgJMXKZegedUNHb8o_Q-MLLyhEYacT4zYfuPai",

      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

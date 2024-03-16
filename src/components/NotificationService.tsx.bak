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
        "key=AAAARNiDo34:APA91bGhxD2nWXPp6RmWkVcqi3pNw0cEfbqrKfDFbmZYCBZKeD002Z7PmhE2uXg3VNGGjK4FmcxlY2Pk0HkagVkSWgPu16WpHSOES9BqHHpbJJ0SpYt3jfVFmncX9b62a1uplMw7VjM3",

      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

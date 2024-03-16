importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA1KXF69VSb0iJUmR2JlZfiBZ6fggCyUEc",
  authDomain: "mahadev-cb556.firebaseapp.com",
  databaseURL:
    "https://mahadev-cb556-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mahadev-cb556",
  storageBucket: "mahadev-cb556.appspot.com",
  messagingSenderId: "295690281854",
  appId: "1:295690281854:web:c8a7750acc4c3905f4c92f",
  measurementId: "G-H3K1LHPX5T",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       firebase.messaging.useServiceWorker(registration);
//       console.log("Service is registered", registration);
//     });
// }

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const { notification } = payload;
  const { body, title } = notification;

  // Customize notification here
  const notificationOptions = {
    body,
    icon: notification.icon,
    // Add any additional properties as needed
  };

  self.registration.showNotification(title, notificationOptions);
});

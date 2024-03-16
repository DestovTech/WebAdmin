importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDAk-I6YSOBwOpnt3NWln88XDxWdUeeb_0",
  authDomain: "ravi-872c7.firebaseapp.com",
  databaseURL: "https://ravi-872c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ravi-872c7",
  storageBucket: "ravi-872c7.appspot.com",
  messagingSenderId: "124991265238",
  appId: "1:124991265238:web:3b2468620db6dc04c46c77",
  measurementId: "G-KCZ4D9FQM5"
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

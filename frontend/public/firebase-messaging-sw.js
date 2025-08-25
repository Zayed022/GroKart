// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAc12jr9Gq90G6-3lCf2QiPESBBSDNPLyQ",
  authDomain: "grokart-2002.firebaseapp.com",
  projectId: "grokart-2002",
  storageBucket: "grokart-2002.firebasestorage.app",
  messagingSenderId: "285629310516",
  appId: "1:285629310516:web:b170777c6127d52e010c61",
  measurementId: "G-MX2BNWN3K5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});

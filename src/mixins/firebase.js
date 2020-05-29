import * as firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export function getFromFirebase(key) {
  return new Promise((resolve) => {
    database.ref(`${key}`).on('value', (snapshot) => {
      const returnArr = [];
      if (snapshot) {
        snapshot.forEach((item) => {
          const itemData = item.val();
          itemData.fireKey = item.key;
          returnArr.push(itemData);
        });
        resolve(returnArr);
      }
    });
  });
}

export function pushToFirebase(key, data) {
  return new Promise((resolve) => {
    if (key) {
      database.ref(`${key}`).push(data).then(() => {
        resolve();
      });
    } else {
      console.log('key must be exist');
    }
  });
}

export function setToFirebase(key, data) {
  return new Promise((resolve) => {
    if (key) {
      database.ref(`${key}`).set(data).then(() => {
        resolve();
      });
    } else {
      console.log('key must be exist');
    }
  });
}

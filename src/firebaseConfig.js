import firebase from 'firebase';
import 'firebase/firestore';

// firebase init goes here
const config = {
  apiKey: 'AIzaSyD525aPXf6jFkTi-0xBbt9gKgqZ-wSgkmQ',
  authDomain: 'social-app-backend.firebaseapp.com',
  databaseURL: 'https://social-app-backend.firebaseio.com',
  projectId: 'social-app-backend',
  storageBucket: 'social-app-backend.appspot.com',
  messagingSenderId: '115583458457',
  appId: '1:115583458457:web:f608a670f4311a782cac08',
  measurementId: 'G-4ZHNMHWHVJ',
};
firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true,
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
};

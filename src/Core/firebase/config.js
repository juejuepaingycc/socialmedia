import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

//Hintha
// const firebaseConfig = {
//   apiKey: 'AIzaSyAfN2rw5EV7ye_6dyGuk17NDUmJh0hykxc',
//   authDomain: 'hintha-e9233.firebaseapp.com',
//   databaseURL: 'https://hintha-e9233.firebaseio.com',
//   projectId: 'hintha-e9233',
//   storageBucket: 'hintha-e9233-us-multi',
//   messagingSenderId: '678682126785',
//   appId: '1:678682126785:android:2b6fb18e8ae22969e06740',
// };

//Social Network2
//   const firebaseConfig = {
//   apiKey: 'AIzaSyCSfTJ22QmIrW-11ArYJ2AFqLHE_U9UHdI',
//   authDomain: 'socialnetwork2-28067.firebaseapp.com',
//   databaseURL: 'https://socialnetwork2-28067.firebaseio.com',
//   projectId: 'socialnetwork2-28067',
//   storageBucket: 'socialnetwork2-28067.appspot.com',
//   messagingSenderId: '540018452048',
//   appId: '1:540018452048:android:d43ea0e9551f3ec2cc1355',
// };  

//Nine Chat
const firebaseConfig = {
  apiKey: 'AIzaSyBDU8e4C855ZJPaBC9JDBc9wDUacuqYdM8',
  authDomain: 'ninechat-e0b12.firebaseapp.com',
  databaseURL: 'https://ninechat-e0b12.firebaseio.com',
  projectId: 'ninechat-e0b12',
  storageBucket: 'ninechat-e0b12.appspot.com',
  messagingSenderId: '1070316237675',
  appId: '1:1070316237675:android:565d5b8b9bb2f1c6c0122e',
  
};  

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };

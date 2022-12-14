import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { ErrorCode } from '../onboarding/utils/ErrorCode';
import { firebase } from './config';
import VoipPushNotification from 'react-native-voip-push-notification';

const usersRef = firebase.firestore().collection('users');

export const retrievePersistedAuthUser = () => {
  return new Promise((resolve) => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            resolve({ ...userData, id: user.uid, userID: user.uid });
          })
          .catch((error) => {
            resolve(null);
          });
      } else {
        resolve(null);
      }
    });
  });
};


const signInWithCredential = (credential, appIdentifier) => {
  return new Promise((resolve, _reject) => {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        //console.log("signInWithCredential response>>"+ JSON.stringify(response))
        const isNewUser = response.additionalUserInfo.isNewUser;
        //const { first_name, last_name } = response.additionalUserInfo.profile;
        let middlename = response.additionalUserInfo.profile.middle_name;
        if(middlename == undefined || middlename == null)
          middlename = '';
        const first_name = response.additionalUserInfo.profile.first_name + " " + middlename;
        const last_name = response.additionalUserInfo.profile.last_name;

        const uid = response.user.uid;
        let email = response.additionalUserInfo.profile.email;
        const phoneNumber = response.user.phoneNumber;
        const photoURL = response.user.photoURL;
        if(email == undefined)
          email = null;

        if (isNewUser) {
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          const userData = {
            id: uid,
            email: email,
            firstName: first_name,
            lastName: last_name,
            phone: phoneNumber,
            profilePictureURL: photoURL,
            userID: uid,
            appIdentifier: 'rn-social-network-android',
            created_at: timestamp,
            createdAt: timestamp,
            location: '',
            signUpLocation: '',
          };
          usersRef
            .doc(uid)
            .set(userData)
            .then((res) => {
              resolve({
                user: { ...userData, id: uid, userID: uid },
                accountCreated: true,
              });
            }).catch((error) => {
             resolve({ error: errorCode });
            });
        }
        usersRef
          .doc(uid)
          .get()
          .then((document) => {
            const userData = document.data();
            resolve({
              user: { ...userData, id: uid, userID: uid },
              accountCreated: false,
            });
          }).catch((error) => {
            resolve({ error: errorCode });
          });
      })
      .catch((_error) => {
        resolve({ error: ErrorCode.serverError });
      });
  });
};

export const register = (userDetails, appIdentifier) => {
  const {
    email,
    firstName,
    lastName,
    password,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails;
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const uid = response.user.uid;

        const data = {
          id: uid,
          userID: uid, // legacy reasons
          email,
          firstName,
          lastName,
          phone: phone || '',
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          createdAt: timestamp,
          created_at: timestamp,
          activate: true,
          push_notifications_enabled: true
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({ user: data });
          })
          .catch((error) => {
            alert(error);
            resolve({ error: ErrorCode.serverError });
          });
      })
      .catch((error) => {
        var errorCode = ErrorCode.serverError;
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse;
        }
        resolve({ error: errorCode });
      });
  });
};

export const loginWithEmailAndPassword = async (email, password) => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;

        const userData = {
          email,
          password,
          id: uid,
        };
        usersRef
          .doc(uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({ errorCode: ErrorCode.noUser });
              return;
            }
            const user = firestoreDocument.data();
            const newUserData = {
              ...userData,
              ...user,
            };
            resolve({ user: newUserData });
          })
          .catch(function (_error) {
            console.log('_error:', _error);
            resolve({ error: ErrorCode.serverError });
          });
      })
      .catch((error) => {
        console.log('error:', error);
        var errorCode = ErrorCode.serverError;
        switch (error.code) {
          case 'auth/wrong-password':
            errorCode = ErrorCode.invalidPassword;
            break;
          case 'auth/network-request-failed':
            errorCode = ErrorCode.serverError;
            break;
          case 'auth/user-not-found':
            errorCode = ErrorCode.noUser;
            break;
          default:
            errorCode = ErrorCode.serverError;
        }
        resolve({ error: errorCode });
      });
  });
};

export const loginWithFacebook = (accessToken, appIdentifier) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
  console.log("facebook credential>>"+ JSON.stringify(credential))

  return new Promise((resolve, _reject) => {
    signInWithCredential(credential, appIdentifier).then((response) => {
      resolve(response);
    }).catch(error => {
      console.log("loginWithFacebook error>>", error)
      resolve(error)
    });
  });
};

export const logout = () => {
  firebase.auth().signOut();
};

export const onVerificationChanged = (phone) => {
  auth()
    .verifyPhoneNumber(phone)
    .on(
      'state_changed',
      (phoneAuthSnapshot) => {
        console.log('State: ', phoneAuthSnapshot.state);
      },
      (error) => {
        console.error(error);
      },
      (phoneAuthSnapshot) => {
        console.log(phoneAuthSnapshot);
      },
    );
};

export const retrieveUserByPhone = (phone) => {
  return new Promise((resolve) => {
    usersRef.where('phone', '==', phone).onSnapshot((querySnapshot) => {
      if (querySnapshot.docs.length <= 0) {
        resolve({ error: true });
      } else {
        resolve({ success: true });
      }
    });
  });
};

export const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, captchaVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        resolve({ confirmationResult });
      })
      .catch(function (_error) {
        console.log(_error);
        console.warn(_error);
        resolve({ error: ErrorCode.smsNotSent });
      });
  });
};

export const loginWithSMSCode = (smsCode, verificationID) => {
  console.log("Auth loginWithSMSCode...")
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  );
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        console.log("11111")
        const { user } = result;
        usersRef
          .doc(user.uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({ errorCode: ErrorCode.noUser });
              return;
            }
            const userData = firestoreDocument.data();
            resolve({ user: userData });
          })
          .catch(function (_error) {
            resolve({ error: ErrorCode.serverError });
          });
      })
      .catch((_error) => {
        resolve({ error: ErrorCode.invalidSMSCode });
      });
  });
};

export const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const {
    firstName,
    lastName,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails;
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  );
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const uid = response.user.uid;
        const data = {
          id: uid,
          userID: uid, // legacy reasons
          firstName,
          lastName,
          phone,
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          created_at: timestamp,
          createdAt: timestamp,
          activate: true,
          push_notifications_enabled: true
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({ user: data });
          });
      })
      .catch((error) => {
        console.log(error);
        var errorCode = ErrorCode.serverError;
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse;
        }
        resolve({ error: errorCode });
      });
  });
};

export const updateProfilePhoto = (userID, profilePictureURL) => {
  return new Promise((resolve, _reject) => {
    usersRef
      .doc(userID)
      .update({ profilePictureURL: profilePictureURL })
      .then(() => {
        resolve({ success: true });
      })
      .catch((error) => {
        resolve({ error: error });
      });
  });
};

export const fetchAndStorePushTokenIfPossible = async (user) => {
  try {
    const settings = await messaging().requestPermission();
    if (settings) {
      const token = await messaging().getToken();
     // console.log("NineChat Token Update>>"+ token);
      updateUser(user.id || user.userID, { pushToken: token });
    }

    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();

      VoipPushNotification.addEventListener('register', (token) => {
        console.log('push kit token from ios', token);
        updateUser(user.id || user.userID, { pushKitToken: token });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (userID, newData) => {
  const dataWithOnlineStatus = {
    ...newData,
    lastOnlineTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  return await usersRef
    .doc(userID)
    .set({ ...dataWithOnlineStatus }, { merge: true });
};

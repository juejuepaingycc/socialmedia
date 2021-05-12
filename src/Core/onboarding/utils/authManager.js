import { firebaseAuth } from '../../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { ErrorCode } from './ErrorCode';
import Geolocation from '@react-native-community/geolocation';
import * as Facebook from 'expo-facebook';
import * as Permissions from 'expo-permissions';

const defaultProfilePhotoURL =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

const loginWithEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithEmailAndPassword(email, password).then((response) => {
      if (!response.error) {
        handleSuccessfulLogin({ ...response.user }, false).then((res) => {
          // Login successful, push token stored, login credential persisted, so we log the user in.
          resolve({ user: res.user, stripeCustomer: '' });
        });
      } else {
        resolve({ error: response.error });
      }
    });
  });
};

const onVerification = (phone) => {
  firebaseAuth.onVerificationChanged(phone);
};

const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
  const { photoURI } = userDetails;
  const accountCreationTask = (userData) => {
    return new Promise((resolve, _reject) => {
      firebaseAuth
        .register(userData, 'rn-social-network-android')
        .then(async (response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user;
            if (photoURI) {
              firebaseStorage.uploadImage(photoURI).then((response) => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: defaultProfilePhotoURL,
                    },
                  });
                } else {
                  firebaseAuth
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then((_result) => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      });
                    });
                }
              });
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: defaultProfilePhotoURL,
                },
              });
            }
          }
        });
    });
  };

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: defaultProfilePhotoURL,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve({
            ...response,
            stripeCustomer: '',
          });
        });
      }
    });
  });
};

const retrievePersistedAuthUser = () => {
  return new Promise((resolve) => {
    firebaseAuth.retrievePersistedAuthUser().then((user) => {
      if (user) {
        handleSuccessfulLogin(user, false).then((res) => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          resolve({
            user: res.user,
            stripeCustomer: '',
          });
        });
      } else {
        resolve(null);
      }
    });
  });
};

const logout = (user) => {
  const userData = {
    ...user,
    isOnline: false,
    pushToken: ''
  };
  firebaseAuth.updateUser(user.id || user.userID, userData);
  firebaseAuth.logout();
};

const loginOrSignUpWithFacebook = (appConfig) => {
  Facebook.initializeAsync('1750469558440102');
  console.log("FACEBOOK 1")
  return new Promise(async (resolve, _reject) => {
    try {
      const {
        type,
        token,
        email,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync(
        '1750469558440102', {
        permissions: ['public_profile, email'] 
      });

      console.log("FB type>>" + type);
      console.log("permissions>>" + permissions + ' ' + declinedPermissions)

      if (type === 'success') {
        console.log("FacebookAuth Success>>" + token);
        firebaseAuth
          .loginWithFacebook(token, 'rn-social-network-android')
          .then(async (response) => {
            console.log("login response>>"+ JSON.stringify(response))
            if (response.user) {
              const newResponse = {
                user: { ...response.user },
                accountCreated: response.accountCreated,
              };
              handleSuccessfulLogin(
                newResponse.user,
                response.accountCreated,
              ).then((response) => {
                // resolve(response);
                resolve({
                  ...response,
                  stripeCustomer: '',
                });
              });
            } else {
              resolve({ error: ErrorCode.fbAuthFailed });
            }
          });
      } else {
        console.log("FacebookAuth Fail...");
        resolve({ error: ErrorCode.fbAuthCancelled });
      }
    } catch (error) {
      console.log("[AuthManager] loginOrSignUpWithFacebook>>"+ JSON.stringify(error));
      resolve({ error: ErrorCode.fbAuthFailed });
    }
  });
};

const retrieveUserByPhone = (phone) => {
  return firebaseAuth.retrieveUserByPhone(phone);
};

const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  return firebaseAuth.sendSMSToPhoneNumber(phoneNumber, captchaVerifier);
};

const loginWithSMSCode = (smsCode, verificationID) => {
  console.log("AuthManager loginWithSMSCode...")
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithSMSCode(smsCode, verificationID).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // successful phone number login, we fetch the push token
        handleSuccessfulLogin(response.user, false).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const { photoURI } = userDetails;
  const accountCreationTask = (userData) => {
    return new Promise(function (resolve, _reject) {
      firebaseAuth
        .registerWithPhoneNumber(
          userData,
          smsCode,
          verificationID,
          'rn-social-network-android',
        )
        .then((response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user;
            if (photoURI) {
              firebaseStorage.uploadImage(photoURI).then((response) => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: defaultProfilePhotoURL,
                    },
                  });
                } else {
                  firebaseAuth
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then((_res) => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      });
                    });
                }
              });
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: defaultProfilePhotoURL,
                },
              });
            }
          }
        });
    });
  };

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: defaultProfilePhotoURL,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const handleSuccessfulLogin = (user, accountCreated) => {
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  fetchAndStoreExtraInfoUponLogin(user, accountCreated);
  return new Promise((resolve) => {
    resolve({ user: { ...user } });
  });
};

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  firebaseAuth.fetchAndStorePushTokenIfPossible(user);

  /* getCurrentLocation(Geolocation).then(async (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    var locationData = {};
    if (location) {
      locationData = {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      };
      if (accountCreated) {
        locationData = {
          ...locationData,
          signUpLocation: {
            latitude: latitude,
            longitude: longitude,
          },
        };
      }
    }

    const userData = {
      //...locationData,
      isOnline: true,
    };

    firebaseAuth.updateUser(user.id || user.userID, userData);
  }); */
  const userData = {
    //...locationData,
    isOnline: true,
  };

  firebaseAuth.updateUser(user.id || user.userID, userData);
};

const getCurrentLocation = (geolocation) => {
  return new Promise(async (resolve) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } });
      return;
    }

    geolocation.getCurrentPosition(
      (location) => {
        console.log(location);
        resolve(location);
      },
      (error) => {
        console.log(error);
      },
    );

    // setRegion(location.coords);
    // onLocationChange(location.coords);

    // geolocation.getCurrentPosition(
    //     resolve,
    //     () => resolve({ coords: { latitude: "", longitude: "" } }),
    //     { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    // );
  });
};

const authManager = {
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  logout,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithFacebook,
  sendSMSToPhoneNumber,
  loginWithSMSCode,
  registerWithPhoneNumber,
  retrieveUserByPhone,
  onVerification,
};

export default authManager;

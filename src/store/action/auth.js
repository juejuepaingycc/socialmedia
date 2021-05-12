import AsyncStorage from '@react-native-community/async-storage';

export const SIGN_IN = 'SIGN_IN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const SIGN_OUT = 'SIGN_OUT';
export const ADD_KYC = 'ADD_KYC';

export const sendOtp = (phone) => {
  return;
};

export const signUp = (fullName, phone, password, otp) => {
  return;
};

export const signIn = (phone, password) => {
  return;
};

export const authenticate = (token_type, access_token) => {
  return;
};

export const signOut = () => {
  AsyncStorage.removeItem('userId');
  AsyncStorage.removeItem('userToken');
  return {type: SIGN_OUT};
};
const saveIdToStorage = (contact, name) => {
  AsyncStorage.setItem(
    'userId',
    JSON.stringify({
      contact: contact,
      name: name,
    }),
  );
};
const saveTokenToStorage = (access_token, token_type, expires_at) => {
  AsyncStorage.setItem(
    'userToken',
    JSON.stringify({
      access_token: access_token,
      token_type: token_type,
      expires_at: expires_at,
    }),
  );
};

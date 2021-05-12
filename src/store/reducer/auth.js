import {AUTHENTICATE, SIGN_OUT, SIGN_IN} from '../action/auth';

const initialState = {
  token: null,
  userData: null,
  kycData: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        token: action.token,
      };
    case AUTHENTICATE:
      return {
        userData: action.userData,
        kycData: action.kycData,
      };
    case SIGN_OUT:
      return initialState;
  }

  return state;
};

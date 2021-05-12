import React, { useState, useEffect } from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import SlideImageReducer from './src/store/reducer/slideImage';
import AuthReducer from './src/store/reducer/auth';
import HomeDataReducer from './src/store/reducer/homeData';
import { fcmService } from './src/FCMService';
import RootNavigator from './src/router/router';
import { localNotificationService } from './src/LocalNotificationService';
import { setPayNotiCount } from './src/store/action/homeData';

const rootReducer = combineReducers({
  SlideImages: SlideImageReducer,
  Auth: AuthReducer,
  HomeData: HomeDataReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {

  //const payNotiCount = useSelector((state) => state.notifications.payNotiCount);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("payNotiCount in App2>>" + payNotiCount);
  },[])

  

useEffect(() => {
    SplashScreen.hide();
  }, []);

  
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

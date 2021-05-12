import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SmoothPinCodeInput from '../../components/otpInput/otpInput';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector, useDispatch } from 'react-redux';
import * as authActions from '../../store/action/auth';
import Card from '../../components/ui/Card';

import { Colors, Scales } from '@common';
import styles from './authCheck.styles';

const AuthCheckScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState('');
  const token = useSelector((state) => state.Auth.token);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem('userId');
      if (!userData) {
        props.navigation.navigate('Auth');

        return;
      } else {
        const transformedData = JSON.parse(userData);
        const { contact, name } = transformedData;

        setPhone(contact);
        setName(name);

        return;
      }
    };

    getUserData();
  });

  const dispatch = useDispatch();

  const signInHandler = async () => {
    if (phone.length < 10) {
      Alert.alert('Error', IMLocalized('enter valid 10 digit phone number'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    } else if (password.length < 4) {
      Alert.alert('Error', 'Enter Valid 4 Digit Password', [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    } else {
      setError(null);
      setLoading(true);
      try {
        await dispatch(authActions.signIn(phone, password));
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    }
  };

  const authenticateHandler = async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(
        authActions.authenticate(token.token_type, token.access_token),
      );
    } catch (err) {
      setLoading(false);
      setError(err.message);
      props.navigation.navigate('App');
    }
  };

  async function signOutHandler() {
    setLoading(true);
    try {
      await dispatch(authActions.signOut());
      setLoading(false);
      props.navigation.navigate('Auth');
    } catch (e) {
      console.error(e.message);
      Alert.alert('Error', e.message, [{ text: 'Close', style: 'default' }]);
    }
  }

  useEffect(() => {
    if (error === 'Success') {
      setError(null);
      authenticateHandler();
      // ToastAndroid.show('Success', ToastAndroid.SHORT);
    } else if (error === 'Network request failed') {
      Alert.alert(IMLocalized('No Connection'), IMLocalized('Please Check Your Internet Connection'), [
        { text: IMLocalized('OK') },
      ]);
    } else if (error === 'Authorized') {
      ToastAndroid.show('Authorized', ToastAndroid.SHORT);
    } else if (error) {
      Alert.alert('Message!', error, [{ text: 'Okay' }]);
    }
    setError(null);
  }, [error]);

  let userName = 'User';
  if (name != null) {
    userName = name;
  }

  return (
    <View style={styles.container}>
      {/* <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
        animated={true}
      /> */}
      <View style={styles.container}>
        <View style={styles.midContainer}>
          <View style={styles.topContainer}>
            <View style={styles.loginTextContainer}>
              <Text style={styles.loginText}>Login</Text>
            </View>
            <View>
              <Image
                style={styles.topImage}
                resizeMode={'contain'}
                source={require('../../assets/img/rightDot.png')}
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.welcomeText}>{userName}</Text>
            {/* <Text style={styles.loginLineText}>
              Please Enter Your 4 Digit Password
            </Text> */}
          </View>
          <Card style={styles.card}>
            <Text style={styles.passLineText}>
              Please Enter Your 4 Digit Password
            </Text>
            <View style={styles.phoneNumberContainer}>
              <Text style={styles.placeholderText}>Your mobile number is</Text>
              <Text style={styles.phoneText}>{phone}</Text>
            </View>
            <View style={styles.passInputWraper}>
              <View style={styles.inputIconWraper}>
                <IconFeather name={'key'} size={24} color={'#3494c7'} />
              </View>
              <View style={styles.passInputContainer}>
                {/* <Text style={styles.placeholderText}>
                  Enter 4 digit password
                </Text> */}
                <SmoothPinCodeInput
                  password
                  mask="﹡"
                  animated={false}
                  cellStyle={{
                    marginTop: 3,
                    width: 70,
                    height: 50,
                    borderBottomWidth: 1,
                    borderColor: 'gray',
                  }}
                  cellStyleFocused={{
                    borderColor: '#3494c7',
                  }}
                  value={password}
                  onTextChange={(text) => {
                    setPassword(text);
                  }}
                />
              </View>
            </View>
          </Card>
          <View style={styles.loginBtnSection}>
            <View style={styles.forgotContainer}>
             <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.navigate('Forgot');
                }}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity> 
            </View>
            <View style={styles.loginBtnContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.WHITE} />
              ) : (
                  <TouchableOpacity
                    style={styles.loginBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      signInHandler();
                    }}>
                    <IconFeather
                      name={'lock'}
                      size={Scales.moderateScale(25)}
                      color={Colors.WHITE}
                    />
                    <Text style={styles.loginBtnText}>LOGIN</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Image
            style={styles.bottomImage}
            resizeMode={'contain'}
            source={require('../../assets/img/leftDot.png')}
          />

          <View>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Login To Another account?
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  signOutHandler();
                }}>
                <Text style={styles.forgotText}>LogOut</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AuthCheckScreen;

import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import { Scales, Colors } from '@common';
import Button from 'react-native-button';
import { connect, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized, setI18nConfig } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import { firebase } from '../../firebase/config';
import { firebaseNotification } from '../../notifications';
import SocialNetworkConfig from '../../../SocialNetworkConfig';
import LoginManager from '../../../manager/LoginManager';
import { firebaseUser } from '../../../Core/firebase';
import IconFeather from 'react-native-vector-icons/Feather';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import billManager from '../../../screens/billManager';
import moment from 'moment';
import AppStyles from '../../../AppStyles';

const LoginScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetScreen, setShowResetScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const appStyles = AppStyles;
    // props.navigation.state.params.appStyles ||
    // props.navigation.getParam('appStyles');
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig = SocialNetworkConfig;
    // props.navigation.state.params.appConfig ||
    // props.navigation.getParam('appConfig');

    const navMenuRef = useRef();
    const [selectedValue, setSelectedValue] = useState({
      img: require('../../../../assets/icons/en.png'),
      name: 'English',
      label: 'EN',
      key: 'EN'
    });
  
    const languages = [
      {
        img: require('../../../../assets/icons/mm.png'),
        name: 'Myanmar',
        label: 'MM',
        key: 'MM'
      },
      {
        img: require('../../../../assets/icons/cn.png'),
        name: 'Mainland China',
        label: 'CN',
        key: 'CN'
      },
      {
        img: require('../../../../assets/icons/en.png'),
        name: 'English',
        label: 'EN',
        key: 'EN'
      },
      {
        img: require('../../../../assets/icons/th.png'),
        name: 'Thailand',
        label: 'TH',
        key: 'TH'
      },
      {
        img: require('../../../../assets/icons/kh.png'),
        name: 'Cambodia',
        label: 'KH',
        key: 'KH'
      }
    ]
  
    const setLanguage = (item) => {
      setI18nConfig(item.label);
      AsyncStorage.setItem('languageAsync', item.label);
    }

    useEffect(() => {
      console.log("Welcome to LoginScreen *********")
      AsyncStorage.getItem("languageAsync").then((value) => {
        languages.forEach((lan) => {
          if(lan.label == value){
            setSelectedValue(lan)
          }
        });
      })
    }, []);

  const onPressLogin = () => {
    setLoading(true);
    authManager
      .loginWithEmailAndPassword(email, password, appConfig)
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
            if(firebase.auth().currentUser.emailVerified){ //This will return true or false
              insertUserLog(user);
            }
            else{
              firebase.auth().currentUser.sendEmailVerification().then(function() {
                setLoading(false);
                props.navigation.navigate('Verify', { 
                  user: user,
                  appStyles,
                  appConfig
                });
              })        
            }  
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      }); 
  };

  const resetPassword = async () => {
    setShowResetScreen(false);
    if(resetEmail.length == 0){
      Alert.alert(
        '',
        IMLocalized("Enter Email"),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
    }
    else{
      setLoading(true);
      let userData = await firebaseUser.getUserWithEmail(resetEmail);
      if(userData == null){
        Alert.alert(
          '',
          IMLocalized("There is no user record corresponding to this identifier"),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
        setLoading(false);
        setResetEmail('');
      }
      else if(userData.error != null){
        Alert.alert(
          '',
          IMLocalized("Something went wrong. Try again!"),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
        setLoading(false);
        setResetEmail('');
      }
      else{
        firebase.auth().sendPasswordResetEmail(resetEmail).then(function() {
          // Email sent.
          setLoading(false);
          setResetEmail('');
          ToastAndroid.show(IMLocalized("Please check your email"), ToastAndroid.SHORT);
        }).catch(function(error) {
          // An error happened.
          setLoading(false);
          setResetEmail('');
          ToastAndroid.show(IMLocalized("Something went wrong. Try again!"), ToastAndroid.SHORT);
        });
      }
    }
  }

  const onFBButtonPress = () => {
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response.user) {
        console.log("FB Login success")
        const user = response.user;
        props.setUserData({
          user: response.user,
        });
        registerVoxImplant(user)
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
    }); 
  };

  const insertUserLog = (user) => {
    //console.log("Insert User Log>>"+ JSON.stringify(user));
        let data = {
          "user_id": user.id,
          "user_name": user.firstName +
            (user.lastName ? ' ' + user.lastName : ''),
          "login_time": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
          "logout_time": null
        }
        //console.log("insertUserLog Data>>" + JSON.stringify(data));
        billManager.insertUserLog(data, 'ninechat_users_log').then((response) => {
          setLoading(false);
          //console.log("insertUserLog...");
        })
        AsyncStorage.setItem('ninepayPhNo', '');
        props.navigation.navigate('MainStack', { user });
  }

  const registerVoxImplant = (user) => {
 //   console.log("user>>"+ JSON.stringify(user));

    let account_id = SocialNetworkConfig.voxImplantAccountId;
    let appID = SocialNetworkConfig.voxImplantAppId;
    let apiKey = SocialNetworkConfig.voxImplantApiKey;
    let userName = user.userID;
    let displayUsername = user.firstName;
    let userPassword = '111111';

    const url = "https://api.voximplant.com/platform_api/AddUser/?account_id=" + account_id + "&api_key=" + apiKey + "&user_name=" + userName + "&user_display_name=" + displayUsername + "&user_password=" + userPassword + "&application_id=" + appID;
    fetch(url, { 
      method: "POST", 
      headers: { 
          "Content-type": "application/json; charset=UTF-8"
      } 
    }) 
    .then((resp) => resp.json())
    .then(function(response) {
      console.log("registerVoxImplant response>>"+ JSON.stringify(response));
      insertUserLog(user);
    })
    .catch(error => {
      console.log("registerVoxImplant error>>"+ JSON.stringify(error));
      insertUserLog(user);
    });

  }

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">

        <Modal
          transparent={true}
          visible={showResetScreen}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setShowModal(false)
           }}>
          <View style={styles.modalBackground}>
           <View style={styles.modalView}>

              <Text style={styles.title2}>{IMLocalized('Change Password')}</Text>
                <TextInput
                style={styles.InputContainer}
                placeholder={IMLocalized('email address')}
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setResetEmail(text)}
                value={resetEmail}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              {/* <Text style={{ color: 'gray', fontSize: 16, width: '80%', paddingLeft: 12,
            paddingTop: 8 }}>
                {IMLocalized("We'll send an email with a link where you can easily create a new password")}
              </Text> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-around',
            width: '80%' }}>
                <Button
                      containerStyle={styles.cancelContainer}
                      style={[styles.loginText, { color: '#3494c7' }]}
                      onPress={() => setShowResetScreen(false)}>
                      {IMLocalized('Cancel')}
                    </Button>
                  <Button
                    containerStyle={styles.resetContainer}
                    style={styles.loginText}
                    onPress={() => resetPassword()}>
                    {IMLocalized('Send')}
                  </Button>
              </View>
           </View>
          </View>
      </Modal>

        <View style={styles.pickerView}>     
          <Menu ref={navMenuRef} style={{ }}>
              <MenuTrigger>
                <View style={styles.selectView}>
                  <Image source={selectedValue.img} style={styles.selectImg} />
                  <Icon name='chevron-down' size={23} color='gray' style={{ alignSelf: 'center', paddingLeft: 4 }} />
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    ...styles.navIconMenuOptions,
                    backgroundColor: 'white',
                  },
                }}>


              {languages.map((option) => (
                <MenuOption onSelect={() => {
                  setSelectedValue(option)
                  setLanguage(option)
                }}>
                  <Image source={option.img} style={styles.selectImg} />
                </MenuOption>
              ))} 
              </MenuOptions>
            </Menu>
        </View>

            <View style={styles.doubleNavIcon}>
              <Image source={require('../../../assets/img/logo_only.png')} style={{ width: 40, height: 40, marginLeft: 20 }} />
              <Text style={{ color:'#3494c7', fontSize:25 , paddingLeft: 6, fontFamily: appStyles.customFonts.klavikaMedium }}>Nine Chat</Text>
            </View>
      {/*     <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => props.navigation.goBack()}>
            <Image
              style={appStyles.styleSet.backArrowStyle}
              source={appStyles.iconSet.backArrow}
            />
          </TouchableOpacity> */}
          <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
          <TextInput
            style={styles.InputContainer}
            placeholder={IMLocalized('E-mail')}
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <View style={styles.row}>
            {
              showPassword ?
              <TextInput
              style={styles.InputContainer}
              placeholderTextColor="#aaaaaa"
              placeholder={IMLocalized('Password')}
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
              :
            <TextInput
              style={styles.InputContainer}
              placeholderTextColor="#aaaaaa"
              secureTextEntry
              placeholder={IMLocalized('Password')}
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            }
            {
                showPassword ?
                      <TouchableOpacity onPress={()=> setShowPassword(false)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
                :
                      <TouchableOpacity onPress={()=> setShowPassword(true)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
              }
          </View>
          
          <Button
            containerStyle={styles.loginContainer}
            style={styles.loginText}
            onPress={() => onPressLogin()}>
            {IMLocalized('Log In')}
          </Button>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: 'gray', paddingTop: 22 }}>{IMLocalized("forgot password")}?&nbsp;&nbsp;</Text>
                <Button
                containerStyle={styles.phoneNumberContainer}
                onPress={() =>
                  setShowResetScreen(true)
                }>
                {IMLocalized('change password')}
              </Button>
          </View>

          <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
          <Button
            containerStyle={styles.facebookContainer}
            style={styles.facebookText}
            onPress={() => onFBButtonPress()}>
            {IMLocalized('Login With Facebook')}
          </Button>
          {appConfig.isSMSAuthEnabled && (
          /*  <Button
              containerStyle={styles.phoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: false,
                  appStyles,
                  appConfig,
                })
              }>
              {IMLocalized('Login with phone number')}
            </Button> */
            <Button
            containerStyle={styles.facebookContainer}
            style={styles.facebookText}
            onPress={() =>
              props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            }>
            {IMLocalized('Login with phone number')}
          </Button>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: 'gray', paddingTop: 22 }}>{IMLocalized("Don't have an account")}?&nbsp;&nbsp;</Text>
              <Button
              containerStyle={styles.phoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Signup', { appStyles, appConfig })
              }>
              {IMLocalized('Sign Up')}
            </Button>
          </View>
  {/* 
          <Button
            containerStyle={styles.paymentContainer}
            style={styles.paymentText}
            onPress={() => props.navigation.navigate('SPayment')}>
            Nine Pay
          </Button> */}

          {loading && <TNActivityIndicator appStyles={appStyles} />}
        </KeyboardAwareScrollView>
      </View>
    );
};

export default connect(null, {
  setUserData,
})(LoginScreen);

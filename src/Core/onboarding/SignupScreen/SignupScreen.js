import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized, setI18nConfig } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import SocialNetworkConfig from '../../../SocialNetworkConfig';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Feather'
import IconFeather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
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
    AsyncStorage.getItem("languageAsync").then((value) => {
      languages.forEach((lan) => {
        if(lan.label == value){
          setSelectedValue(lan)
        }
      });
    })
  }, []);
  
  const onRegister = () => {
    setLoading(true);

    const userDetails = {
      firstName,
      lastName,
      email,
      password,
      photoURI: profilePictureURL,
      appIdentifier: appConfig.appIdentifier,
    };
    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig)
      .then((response) => {
        console.log("Response>>" + JSON.stringify(response))
        const user = response.user;
        if (user) {
          props.setUserData({
            user: response.user,
          });
          console.log("user in emailSignup>>"+ JSON.stringify(user));
          registerVoxImplant(user)

          firebase.auth().currentUser.sendEmailVerification().then(function() {
            console.log("Sent verification email..");
            setLoading(false);
            props.navigation.navigate('Verify', { 
              user: user,
              appStyles,
              appConfig
            });
          })    

          props.navigation.navigate('Verify', { 
            user: user,
            appStyles,
            appConfig
          });
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
        setLoading(false);
      });
  };

  const registerVoxImplant = (user) => {
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
    })
    .catch(error => {
      console.log("registerVoxImplant error>>"+ JSON.stringify(error));
    });

  }

  const renderSignupWithEmail = () => {
    return (
      <>
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('First Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Last Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('E-mail Address')}
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
                placeholder={IMLocalized('Password')}
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              :
              <TextInput
                style={styles.InputContainer}
                placeholder={IMLocalized('Password')}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
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
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {IMLocalized('Sign Up')}
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.keyView}
        keyboardShouldPersistTaps="always">
        
        <View style={styles.pickerView}>     
          <Menu ref={navMenuRef}>
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
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
           {/*  <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }>
              {IMLocalized('Sign up with phone number')}
            </Button> */}
                 <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() =>
            props.navigation.navigate('Sms', {
              isSigningUp: true,
              appStyles,
              appConfig,
            })
          }>
          {IMLocalized('Sign up with phone number')}
        </Button>
          </>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: 'gray', paddingTop: 22 }}>{IMLocalized('already have an account')}?&nbsp;&nbsp;</Text>
            <Button
            containerStyle={styles.phoneNumberContainer}
            onPress={() =>
              props.navigation.navigate('Login', { appStyles, appConfig })
            }>
            {IMLocalized('login')}
          </Button>
        </View>
{/* 
<Button
          containerStyle={styles.paymentContainer}
          style={styles.paymentText}
          onPress={() => props.navigation.navigate('SPayment')}>
          Nine Pay
        </Button> */}
        
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SignupScreen);

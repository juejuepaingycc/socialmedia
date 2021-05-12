import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';
import 'react-native-get-random-values';
import Button from 'react-native-button';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import CodeField from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized, setI18nConfig } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import { firebase } from '../../firebase/config';
import dynamicStyles from './styles';
import SocialNetworkConfig from '../../../SocialNetworkConfig';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import billManager from '../../../screens/billManager';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';

const SmsAuthenticationScreen = (props) => {
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');

  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [phNo, setPhNo] = useState('')
  const myCodeInput = useRef(null);
  const phoneRef = useRef(null);
  const recaptchaVerifier = React.useRef(null);
  const firebaseConfig = firebase.app().options;
  const { isSigningUp } = props.navigation.state.params;

  const navMenuRef = useRef();
  const [selectedValue, setSelectedValue] = useState({
    img: require('../../../../assets/icons/en.png'),
    name: 'English',
    label: 'EN',
    key: 'EN'
  });

  const countriesMyanmar =
[
  {name:'မြန်မာ', code: '+95', img: require('../../../../assets/icons/mm.png')},
  {name:'တရုတ်', code: '+86', img: require('../../../../assets/icons/cn.png')},
	{name:'ထိုင်း', code: '+66', img: require('../../../../assets/icons/th.png')},
	{name:'ကမ္ဘောဒီးယား', code: '+855', img: require('../../../../assets/icons/kh.png')},
]

const countriesEnglish =
[
  {name:'Myanmar', code: '+95', img: require('../../../../assets/icons/mm.png')},
  {name:'China', code: '+86', img: require('../../../../assets/icons/cn.png')},
	{name:'Thailand', code: '+66', img: require('../../../../assets/icons/th.png')},
	{name:'Cambodia', code: '+855', img: require('../../../../assets/icons/kh.png')},
]

const countriesThailand =
[
  { name: 'เมียนมาร์',  code: '+95', img: require('../../../../assets/icons/mm.png')},
  {name: 'จีน',  code: '+86', img: require('../../../../assets/icons/cn.png')},
	{ name: 'ประเทศไทย',  code: '+66', img: require('../../../../assets/icons/th.png')},
	{ name: 'กัมพูชา',  code: '+855', img: require('../../../../assets/icons/kh.png')}
]

const countriesChina =
[
  {name: '缅甸',code: '+95', img: require('../../../../assets/icons/mm.png')},
  {name: '中国',code: '+86', img: require('../../../../assets/icons/cn.png')},
	{name: '泰国',code: '+66', img: require('../../../../assets/icons/th.png')},
	{name: '柬埔寨',code: '+855', img: require('../../../../assets/icons/kh.png')}
]

const countriesCambodia =
[
  {	name: 'មីយ៉ាន់ម៉ា',	 code: '+95', img: require('../../../../assets/icons/mm.png')},
  {	name: 'ចិន', 	code: '+86', img: require('../../../../assets/icons/cn.png')},
	{	name: 'ថៃ', 	code: '+66', img: require('../../../../assets/icons/th.png')},
	{	name: 'កម្ពុជា', 	code: '+855', img: require('../../../../assets/icons/kh.png')}
]



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
    // {
    //   img: require('../../../../assets/icons/tw.png'),
    //   name: 'Taiwan',
    //   label: 'TW',
    //   key: 'TW'
    // },
  ]

  const setLanguage = (item) => {
    setI18nConfig(item.label);
    AsyncStorage.setItem('languageAsync', item.label);
  }

  useEffect(() => {
    AsyncStorage.getItem("languageAsync").then((value) => {
     // console.log("Language>>"+ value)
      if(value == 'EN' || value == null || value == undefined){
        setSelectedCountry(countriesEnglish[0]);
        setCountries(countriesEnglish);
      }
      else if(value == 'MM'){
        setSelectedCountry(countriesMyanmar[0]);
        setCountries(countriesMyanmar);
      }
      else if(value == 'TH'){
        setSelectedCountry(countriesThailand[0]);
        setCountries(countriesThailand);
      }
      else if(value == 'KH'){
        setSelectedCountry(countriesCambodia[0]);
        setCountries(countriesCambodia);
      }
      else if(value == 'CN'){
        setSelectedCountry(countriesChina[0]);
        setCountries(countriesChina);
      }
      languages.forEach((lan) => {
        if(lan.label == value){
          setSelectedValue(lan)
        }
      });
    })
  }, []);

  const onFBButtonPress = () => {
    //ToastAndroid.show('Login With Facebook', ToastAndroid.SHORT);
    setLoading(true);
     authManager
      .loginOrSignUpWithFacebook(appConfig.appIdentifier)
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({ user });
          console.log("user>>"+ JSON.stringify(user));
          registerVoxImplant(user);
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
      }).catch(error => {
        setLoading(false);
        console.log("loginOrSignUpWithFacebook error>>"+ JSON.stringify(error));
      });
  };

  const registerVoxImplant = (user) => {
    //console.log("user>>"+ JSON.stringify(user));
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
      setLoading(false);
      console.log("registerVoxImplant response>>"+ JSON.stringify(response));
      insertUserLog(user)
    })
    .catch(error => {
      setLoading(false);
      console.log("registerVoxImplant error>>"+ JSON.stringify(error));
      insertUserLog(user)
    });
  }

  const signInWithPhoneNumber = (userValidPhoneNumber) => {
    setLoading(true);
    console.log('userValidPhoneNumber>' + userValidPhoneNumber);
    //authManager.onVerification(userValidPhoneNumber);
    authManager
      .sendSMSToPhoneNumber(userValidPhoneNumber, recaptchaVerifier.current)
      .then((response) => {
        const confirmationResult = response.confirmationResult;
        if (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setVerificationId(confirmationResult.verificationId);
          setIsPhoneVisible(false);
          setLoading(false);
        } else {
          // Error; SMS not sent
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        }
      });
  };

  const signUpWithPhoneNumber = (smsCode) => {
    const userDetails = {
      firstName,
      lastName,
      phone: phoneNumber,
      photoURI: profilePictureURL,
    };
    setLoading(true);
    authManager
      .registerWithPhoneNumber(
        userDetails,
        smsCode,
        verificationId,
        appConfig.appIdentifier,
      )
      .then((response) => {
        if (response.error) {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } else {
          const user = response.user;
          props.setUserData({ user });
          registerVoxImplant(user);
        }
        setLoading(false);
      });
  };

  const onPressSend = () => {
      //if (phoneRef.current.isValidNumber()) {
      //const userValidPhoneNumber = phoneRef.current.getValue();
      console.log("phNo>>" + phNo);
      let phone;
      let first = phNo.substring(0, 2);
      if(first == '09'){
        phone = phNo.substring(1, phNo.length)
      }
      else{
        phone = phNo;
      }

      const userValidPhoneNumber = selectedCountry.code + phone;
      console.log("Phone noo>>" + userValidPhoneNumber)
      setLoading(true);
      setPhoneNumber(userValidPhoneNumber);
      if (!isSigningUp) {
        // If this is a login attempt, we first need to check that the user associated to this phone number exists
        authManager
          .retrieveUserByPhone(userValidPhoneNumber)
          .then((response) => {
            console.log("Retrieved User>>" , response)
            if (response.success) {
              signInWithPhoneNumber(userValidPhoneNumber);
            } else {
              setPhoneNumber(null);
              setLoading(false);
              Alert.alert(
                '',
                IMLocalized('There is no account with this phone number!'),
                [{ text: IMLocalized('OK') }],
                {
                  cancelable: false,
                },
              );
            }
          });
      } else {
        signInWithPhoneNumber(userValidPhoneNumber);
      }
  };

  const insertUserLog = (user) => {
    if(user.phone && user.phone.length > 0){
      let phone = user.phone;
      let ph='';
      if(phone.substring(0,2) == '09')
        ph = phone.substring(1, phone.length);
      else if(phone.substring(0,3) == '959')
        ph = phone.substring(2, phone.length);
      else if(phone.substring(0,4) == '+959')
        ph = phone.substring(3, phone.length);
      AsyncStorage.setItem('ninepayPhNo', ph);
    }
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
          console.log("insertUserLog...");
        })
        props.navigation.navigate('MainStack', { user });
  }

  const onFinishCheckingCode = (newCode) => {
    setLoading(true);
    if (isSigningUp) {
      signUpWithPhoneNumber(newCode);
    } else {
      authManager.loginWithSMSCode(newCode, verificationId).then((response) => {
        if (response.error) {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } 
        else {
          const user = response.user;
          props.setUserData({ user });
          console.log("Login user>>"+ JSON.stringify(user));
          insertUserLog(user);
        }
        setLoading(false);
      });
    }
  };

  const phoneInputRender = () => {
    return (
      <>

        <View style={styles.input1}>
          <TouchableOpacity style={styles.imgcontainer} onPress={()=> setCountryModalVisible(true)}>
            <Image source={selectedCountry.img} style={styles.countryImg} />
            <Text style={styles.code}>{selectedCountry.code}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.InputContainer2}
            placeholder={IMLocalized('Phone number')}
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setPhNo(text)}
            value={phNo}
            underlineColorAndroid="transparent"
          />
        </View>

        <Modal
          transparent={true}
          visible={countryModalVisible}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setCountryModalVisible(false)
           }}>
            <View style={styles.modalBackground2}>
              <View style={styles.modalView}>
                {
                  countries.map((country)=> {
                    return (
                      <TouchableOpacity style={styles.countries} onPress={()=> chooseCountry(country)}>
                        <Text style={{ color:'black' }}>{country.name}</Text>
                        <Text style={{ color:'black' }}>{country.code}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
                <TouchableOpacity style={[styles.countries, styles.cancel]} onPress={()=> setCountryModalVisible(false)}>
                  <Text style={styles.cancelText}>{IMLocalized('CancelLanguage')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onPressSend()}>
          {IMLocalized('Send code')}
        </Button>
      </>
    );
  };

  const codeInputRender = () => {
    return (
      <>
        <CodeField
          ref={myCodeInput}
          inputPosition="full-width"
          variant="border-b"
          codeLength={6}
          size={50}
          space={8}
          keyboardType="numeric"
          cellProps={{ style: styles.input }}
          containerProps={{ style: styles.codeFieldContainer }}
          onFulfill={onFinishCheckingCode}
        />
      </>
    );
  };
  
  const chooseCountry = (country) => {
    setCountryModalVisible(false)
    setSelectedCountry(country);
    console.log("Selected Country>>"+ JSON.stringify(country));
  };

  const selectCountry = (country) => {
    phoneRef.current.selectCountry(country.iso2);
  };

  const renderAsSignUpState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />

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
        {isPhoneVisible ? phoneInputRender() : codeInputRender()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
    {/*     <Button
          containerStyle={styles.signWithEmailContainer}
          onPress={() =>
            props.navigation.navigate('Signup', { appStyles, appConfig })
          }>
          {IMLocalized('Sign up with E-mail')}
        </Button> */}
         <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() =>
            props.navigation.navigate('Signup', { appStyles, appConfig })
          }>
           {IMLocalized('Sign up with E-mail')}
        </Button>

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

        {/* <Button
          containerStyle={styles.paymentContainer}
          style={styles.paymentText}
          onPress={() => props.navigation.navigate('SPayment')}>
          Nine Pay
        </Button> */}
      </>
    );
  };

  const renderAsLoginState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
        {isPhoneVisible ? phoneInputRender() : codeInputRender()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => onFBButtonPress()}>
          {IMLocalized('Login With Facebook')}
        </Button>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() =>
            props.navigation.navigate('Login', { appStyles, appConfig })
          }>
          {IMLocalized('Sign in with E-mail')}
        </Button>
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

        {/* <Button
          containerStyle={styles.paymentContainer}
          style={styles.paymentText}
          onPress={() => props.navigation.navigate('SPayment')}>
          Nine Pay
        </Button> */}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">

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
                setLanguage(option);
                if(option.label == 'EN' || option.label == null || option.label == undefined){
                  //setSelectedCountry(countriesEnglish[2]);
                  setCountries(countriesEnglish);
                }
                else if(option.label == 'MM'){
                  //setSelectedCountry(countriesMyanmar[0]);
                  setCountries(countriesMyanmar);
                }
                else if(option.label == 'TH'){
                  //setSelectedCountry(countriesThailand[3]);
                  setCountries(countriesThailand);
                }
                else if(option.label == 'KH'){
                  //setSelectedCountry(countriesCambodia[4]);
                  setCountries(countriesCambodia);
                }
                else if(option.label == 'CN'){
                  //setSelectedCountry(countriesChina[1]);
                  setCountries(countriesChina);
                }
              }}>
                <Image source={option.img} style={styles.selectImg} />
              </MenuOption>
            ))} 
            </MenuOptions>
          </Menu>
      </View>


         <View style={styles.doubleNavIcon}>
            <Image source={require('../../../assets/img/logo_only.png')} style={{ width: 40, height: 40, marginLeft: 20 }} />
            <Text style={{ color:'#3494c7', fontSize: 25 , paddingLeft: 6, fontFamily: appStyles.customFonts.klavikaMedium }}>Nine Chat</Text>
          </View>
        {isSigningUp ? renderAsSignUpState() : renderAsLoginState()}
        {isSigningUp && (
          <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
        )}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SmsAuthenticationScreen);

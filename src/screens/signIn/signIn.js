import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  BackHandler,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import CodeField from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-community/async-storage';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import IconFeather from 'react-native-vector-icons/Feather';
import deviceStorage from '../../Core/onboarding/utils/AuthDeviceStorage';
import Card from '../../components/ui/Card';
import { links } from '../../../StaticData/paymentData';
import { Colors, Scales } from '@common';
import styles from './signIn.styles';
import AppStyles from '../../AppStyles';
import { TNActivityIndicator, PayActivityIndicator } from '../../Core/truly-native';
import billManager from '../billManager';
import moment from "moment";
import BcryptReactNative from 'bcrypt-react-native';
import { fcmService } from '../../FCMService';
import { localNotificationService } from '../../LocalNotificationService';

const SignInScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [wrongCount, setWrongCount] = useState(0);
  const [banned, setBanned] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [signInData, setSignInData] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const countries = [
    {name:'Myanmar', code: '+95', img: require('../../../assets/icons/mm.png')},
    {name:'China', code: '+86', img: require('../../../assets/icons/cn.png')},
    {name:'Thailand', code: '+66', img: require('../../../assets/icons/th.png')}
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const myCodeInput = useRef(null);

  const ban = props.navigation.getParam('banned');
  var CryptoJS = require("crypto-js");

  useEffect(()=> {
    AsyncStorage.getItem("ninepayPhNo").then((value) => {
      if(value != null && value != undefined &&value != ''){
        setPhone(value);
      }
    })
  },[])

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token){
      //console.log("[App] onRegister: ", token);
    }

    function onNotification(notify){
      //console.log("[Signin] onNotification: ", notify);
      let desc = notify.body;
      if(desc.includes(' Unblocked')){
        //Unblocked User
        setBanned(false);
        AsyncStorage.setItem("banned", "0");
      }

      const options = {
        soundName: 'default',
        playSound: true
      }
      console.log("[SignIn] NOTI...")
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify){
      //console.log("[Signin] onOpenNotification: ", notify);
    }
  }, []);

  useEffect(()=> {
    AsyncStorage.getItem("banned").then((value) => {
      if(value == '1'){
        setBanned(true);
      }
    })
  }, [])

  useEffect(()=> {
    if(ban){
      setBanned(true);
    }
  },[ban])

  useEffect(() => {
    AsyncStorage.getItem("agentInfo").then((value) => {
      if(value){ //Check if userInfo exists in local storage
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        //console.log('Local Info>>'+ JSON.stringify(decryptedData));

        //get userInfo from API and check if local informatin is correct
        billManager.getAgentWithPhoneNo(decryptedData.Contact_Phone).then((response) => {
          //console.log("API Info>>"+ JSON.stringify(response[0]));
          if(response && response.length > 0){
            if(response[0].ban == 0){
              AsyncStorage.setItem('banned', '0');
              setBanned(false);
            }
            if(decryptedData.User_Name == response[0].User_Name && 
              decryptedData.Password == response[0].Password && 
              decryptedData.AName == response[0].AName){
                //Check last_login time is less than 25 hrs, 1 day
                console.log("Agent Info matched..");
                let a= moment(response[0].last_login);
                let b = moment();
                let date1 = moment(a).utc().format("DD/MM/YYYY HH:mm:ss");
                let date2 = moment(b).format("DD/MM/YYYY HH:mm:ss");
  
                let fff = moment(date2,"DD/MM/YYYY HH:mm:ss").diff(moment(date1,"DD/MM/YYYY HH:mm:ss"))
                let hours = parseInt((fff/(1000*60*60))%24)
  
                console.log("Diff hours>>" + hours) // 745
                if(hours < 24){
                  //Login success   
                  setLoading(false); 
                  setChecking(false);
                  props.navigation.navigate('RequestOTP', {
                    goHome: true
                  });
                }
                else{
                  setLoading(false); 
                  setChecking(false);
                  props.navigation.navigate('RequestOTP', {
                    phoneNo: response[0].Contact_Phone,
                    agentID: response[0].ID
                  });
                }
              }
              else{
                //User Info is different from online, Logout
                console.log("Agent Info don't match..")
                setChecking(false);
                AsyncStorage.setItem("agentInfo", null);
                AsyncStorage.setItem("banned", "0");
                setBanned(false);
              }
          }
          else{
            setChecking(false);
            setBanned(false);
            AsyncStorage.setItem("banned", "0");
          }
         });
      }
      else{
        setChecking(false);
        setBanned(false);
        AsyncStorage.setItem("banned", "0");
      }
    })
  },[]);

  function backButtonHandler() {
    console.log("Backkkk")
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    deviceStorage.setShouldShowOnboardingFlow2('false');
  });

  const showAlert = (msg) => {
    return (
      Alert.alert('', msg, [
        { text: IMLocalized('OK'), style: 'default' },
      ])
    )
  }

  const signInHandlerTest = async () => {
      // let pw = CryptoJS.MD5("9000036").toString();

      let obj = 
      {
        "AgentID": "9000012",
        "AName": "Kyaw",
        "Other_Name": "",
        "NRC_No": "",
        "Contact_Phone": "959880345476",
        "Other_Phone_1": "",
        "Other_Phone_2": "",
        "Contact_Person_Name": "",
        "Address": "",
        "Township": "",
        "City": "",
        "Regional_Code": "",
        "Register_Date": "2021-02-02T18:49:49.000Z",
        "Profile_Picture": "",
        "NRC_Pic_Front": "",
        "NRC_Pic_Back": "",
        "Contract_ID": "",
        "User_Name": "",
        "Password": "$2a$10$xgDsfGmbbwNuSglf109MBuhA52g6UdXKpsRfe/2Yeo554CeoPRUoq",
        "ID": 17,
        "registered": 1,
        "push_token": "",
        "noti_count": 0,
        "last_login": "2021-02-03T15:12:00.000Z",
        "ban": 0,
        "ban_date": "2021-02-02T18:49:49.000Z",
        "agent_level_id": null,
        "Category": "P"
      }
        var cipherData = CryptoJS.AES.encrypt(JSON.stringify(obj), '1284839994').toString();
        AsyncStorage.setItem('agentInfo', cipherData);
        ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        setLoading(false); 
        props.navigation.navigate('Home'); 
  }

  const signInHandler = async () => {
    if(banned){
      showAlert(IMLocalized("You are blocked from Nine Pay"));
    }
    else{
    //  if(userName == ''){
    //   showAlert(IMLocalized('Enter Valid User Name'))
    // }
    if (phone.length == 0) {
      showAlert(IMLocalized('Enter Phone Number'))
    }
    else if (password.length < 6) {
      showAlert(IMLocalized('Enter valid 6 digit password'))
    } 
    else {
      setLoading(true);
      try{
        let userValidPhoneNumber = selectedCountry.code + phone;
        let ph = userValidPhoneNumber.substring(1, userValidPhoneNumber.length)
        const url = links.apilink + "agentprofile?_where=(Contact_Phone,eq,"+ ph +")";
        const response = await fetch(url);
        const responseData = await response.json();
        if(responseData.length > 0){
          if(responseData[0].registered == 0){
            showAlert("Your account is not verified.");
            setLoading(false);
          }
          else{    
            //Check password    
            const isSame = await BcryptReactNative.compareSync(password, responseData[0].Password);
            if(isSame){
              if(responseData[0].ban == 1){
                showAlert(IMLocalized("You are blocked from Nine Pay"));
                setLoading(false);
              }
              else{ 
                setSignInData(responseData[0]);
                signInWithPhoneNumber(userValidPhoneNumber);
              }
            }
            else{  
              setLoading(false);   
              showAlert(IMLocalized("Please check password"));     
            }
          }
        }
        else{
          showAlert(IMLocalized("Login fail! Please check username, phone and password"));
          setLoading(false);
        }

        } catch(e) {
          setLoading(false);
          console.log("err>>"+ JSON.stringify(e))
          if(e.message == 'Invalid salt version'){
            showAlert(IMLocalized("Please check password"));
          }
        }
    }  
    }
  };

  const onFinishCheckingCode = async (newCode) => {
      setLoading(true);
      try{
        let validPhno = selectedCountry.code + phone;
        console.log("Check>>", validPhno)
        billManager.confirmOTP(validPhno, newCode).then((response) => {
          setLoading(false);
          if(response == null){
            showAlert(IMLocalized("Oops! An error has occured. Please try again."))
          }
          else{
            if(response.data.status == 200){
              let data = signInData;
              data['Contact_Phone'] = validPhno.substring(1, validPhno.length);
              var cipherData = CryptoJS.AES.encrypt(JSON.stringify(data), '1284839994').toString();
              AsyncStorage.setItem('agentInfo', cipherData);
              insertUserLog(data)
            }
            else{
              showAlert(response.data.message)
            }
          }
        })
      } catch (error) {
          setLoading(false);
          if(wrongCount == 3){
            showAlert(IMLocalized("You are blocked from Nine Pay"));
            setBanned(true);
            let time = moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");
            billManager.updateAgentProfile(signInData.ID, null, null, null, 1, time).then((response) => {
                console.log("Banned user...");
            })
            AsyncStorage.setItem('banned', '1');
          }
          else{
            setWrongCount(wrongCount+1);
            Alert.alert(
              '',
              IMLocalized('Invalid code.'),
              [{ text: IMLocalized('OK') }],
              { cancelable: false },
            );
          }
      }
  };

  const insertUserLog = (user) => {
    //console.log("Insert User Log>>"+ JSON.stringify(user));
        let data = {
          "user_id": user.ID,
          "user_name": user.AName,
          "login_time": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
          "logout_time": null
        }
        //console.log("insertUserLog Data>>" + JSON.stringify(data));
        billManager.insertUserLog(data, 'ninepay_users_log').then((response) => {
          setLoading(false);
          console.log("insertUserLog...");
        })
        props.navigation.navigate('Home');
  }
  
  const signInWithPhoneNumber = async (userValidPhoneNumber) => {
    if(selectedCountry.code == '+95'){
      sendPhoneOTP(links.sendOTPLink, userValidPhoneNumber);
    }
    else{
      sendPhoneOTP(links.sendForeignOTPLink, userValidPhoneNumber); 
    }
  }

  const sendPhoneOTP = (link, phone) => {
    billManager.sendOTP(link, phone).then((response) => {        
      setLoading(false);
      if(response == null){
        showAlert('Send OTP fail');
      }
      else if(response.status != 200 || response.data.status != 200){
        showAlert('Send OTP fail')
      }
      else{
        ToastAndroid.show(IMLocalized('Sent OTP'), ToastAndroid.SHORT);
        setShowOTPInput(true);
      }
    })
  }

  const infoInputRender = () => {
    return(
      <>
    <Card style={styles.card}>
              {/* <View
                  style={{
                    ...styles.phoneInputContainer
                    }}>
                  <IconMaterialIcons name={'person-outline'} size={24} color={'#3494c7'} />
                  <TextInput
                    style={styles.body}
                    autoCompleteType={'name'}
                    placeholder={IMLocalized('User Name')}
                    onChangeText={(text) => setUserName(text)}
                    value={userName}
                  />
                </View> */}
                <View
                  style={{
                    ...styles.phoneInputContainer,
                    borderColor: phone ? '#3494c7' : 'gray',
                  }}>
                  {/* <IconFeather name={'phone-call'} size={24} color={'#3494c7'} /> */}
                  <TouchableOpacity style={styles.imgcontainer} onPress={()=> setCountryModalVisible(true)}>
                    <Image source={selectedCountry.img} style={styles.countryImg} />
                    <Text style={styles.code}>{selectedCountry.code}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.body}
                    placeholder={IMLocalized("Phone Number")}
                    autoCompleteType={'off'}
                    keyboardType={'phone-pad'}
                    maxLength={11}
                    onChangeText={(text) => {
                      if(selectedCountry.code == '+95' && phone.length == 0 && text == '0'){

                      }
                      else
                        setPhone(text)
                    }}
                    value={phone}
                  />
                </View>
    
                <View
                  style={{
                    ...styles.phoneInputContainer,
                    borderColor: phone ? '#3494c7' : 'gray',
                    marginTop: Scales.deviceHeight * 0.03,
                    marginBottom: 18,
                  }}>
                  <IconFeather name={'key'} size={24} color={'#3494c7'} />
                  {
                    showPassword ?
                    <TextInput
                    style={[ styles.body, { flex: 0.95 } ]}
                    placeholder={IMLocalized("Password")}
                    autoCompleteType={'off'}
                    //secureTextEntry
                    maxLength={6}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                    :
                    <TextInput
                    style={[ styles.body, { flex: 0.95 } ]}
                    placeholder={IMLocalized("Password")}
                    autoCompleteType={'off'}
                    secureTextEntry
                    maxLength={6}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                  }
                  {
                    showPassword ?
                    <TouchableOpacity onPress={()=> setShowPassword(false)}>
                      {
                        <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                      }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=> setShowPassword(true)}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                      }
                    </TouchableOpacity>
                  }
                </View>
            </Card>
            <View style={styles.loginBtnSection}>
                <View style={styles.loginBtnContainer}>
                  {/* {loading ? (
                    <ActivityIndicator size="small" color={Colors.WHITE} />
                  ) : ( */}
                      <TouchableOpacity
                        style={styles.loginBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                          signInHandler();
                        }}>
                        <IconFeather
                          name={'lock'}
                          size={Scales.moderateScale(20)}
                          color={Colors.WHITE}
                        />
                        <Text style={styles.loginBtnText}>{IMLocalized('login')}</Text>
                      </TouchableOpacity>
                </View>
              </View>
      
            
  
            <View style={[styles.loginBtnSection, { marginTop: Scales.deviceHeight * 0.03 }]}>
              <Text style={styles.loginText}>{IMLocalized('dont have an account')}?</Text>
            </View>
  
            <View style={styles.loginBtnSection}>
              <View style={styles.loginBtnContainer}>
                    <TouchableOpacity
                      style={styles.loginBtn}
                      activeOpacity={0.7}
                      onPress={() => {
                        setLoading(false); 
                        props.navigation.navigate('SignUp');
                      }}>
                      <IconFeather
                        name={'lock'}
                        size={Scales.moderateScale(20)}
                        color={Colors.WHITE}
                      />
                      <Text style={styles.loginBtnText}>{IMLocalized('Sign Up')}</Text>
                    </TouchableOpacity>
              </View>
            </View>

          {
            !banned && (
              <View style={styles.loginBtnSection}>
                <View style={styles.loginBtnContainer}>
                      <TouchableOpacity
                        style={styles.loginBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                          setLoading(false); 
                          props.navigation.navigate('Forgot');
                        }}>
                        <IconFeather
                          name={'lock'}
                          size={Scales.moderateScale(20)}
                          color={Colors.WHITE}
                        />
                        <Text style={styles.loginBtnText}>{IMLocalized('forgot password')}</Text>
                      </TouchableOpacity>
                </View>
              </View>
            )
          }
          </>
    )
  }

  const chooseCountry = (country) => {
    setCountryModalVisible(false)
    setSelectedCountry(country);
    console.log("Selected Country>>"+ JSON.stringify(country));
  };

  const onResend = () => {
    //let validPhno = '+959' + phone.substring(2, phone.length);
    const userValidPhoneNumber = selectedCountry.code + phone;
    console.log("Phone noo>>" + userValidPhoneNumber)
    signInWithPhoneNumber(userValidPhoneNumber);
  }

  const otpInputRender = () => {
    return (
      <>
        <View style={styles.otpdescView}>
          <Text style={styles.otpdesc}>{IMLocalized('Enter the code that was sent to')}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
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
        <View style={styles.resendView}>
          <Text style={styles.resenddesc}>{IMLocalized("Didn't receive code?")}&nbsp;&nbsp;</Text>
          <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => {
                onResend()
              }}>
              <Text style={styles.resend}>{IMLocalized('Resend')}</Text>
						</TouchableOpacity>
        </View>
        <View style={styles.loginBtnSection}>
                <View style={styles.loginBtnContainer}>
                      <TouchableOpacity
                        style={styles.loginBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                          setShowOTPInput(false);
                        }}>
                        <IconIonicon
                          name={'arrow-back-sharp'}
                          size={Scales.moderateScale(25)}
                          color={Colors.WHITE}
                        />
                        <Text style={styles.loginBtnText}>{IMLocalized('Back')}</Text>
                      </TouchableOpacity>
                </View>
              </View>
      </>
    );
  };

  if(checking){
    return (
      <TNActivityIndicator appStyles={AppStyles} />
    )
  }
  else{
    return (
      <View style={{ flex: 1 }}>
  
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        {
          loading && (          
            <PayActivityIndicator />
          )
        }

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

          <View style={styles.midContainer}>
            <View style={styles.topContainer}>
                <Image
                  style={styles.topImage}
                  resizeMode={'contain'}
                  source={require('../../assets/img/logo_only.png')}
                />
                <Text style={styles.welcomeText2}>Nine Pay</Text>
            </View>
            {
              showOTPInput ?
                otpInputRender()
              :
                infoInputRender()
            }
          </View>

        </KeyboardAvoidingView>
      </View>
    );
   }
};

export default SignInScreen;

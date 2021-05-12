import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import { Colors, Scales } from '@common';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
// import RNOtpVerify from 'react-native-otp-verify';
import { extractSourceFromFile } from '../../Core/helpers/retrieveSource';
import { TNActivityIndicator, PayActivityIndicator } from '../../Core/truly-native';
import styles from './signUp.styles';
import Card from '../../components/ui/Card';
import { links } from '../../../StaticData/paymentData';
import BcryptReactNative from 'bcrypt-react-native';
import CodeField from 'react-native-confirmation-code-field';
import billManager from '../billManager';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";

const SignUpScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =  useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [nrcNo, setNrcNo] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [otherPhone1, setOtherPhone1] = useState('');
  const [otherPhone2, setOtherPhone2] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [address, setAddress] = useState('');
  const [township, setTownship] = useState('');
  const [ctiy, setCity] = useState('');
  const [regionalCode, setRegionalCode] = useState('');
  const [regionalDate, setRegionalDate] = useState('');
  const [pictureIndex, setPictureIndex] = useState(0);
  const [profilePicture, setProfilePicture] = useState('');
  const [nrcFrontPic, setNrcFrontPic] = useState('');
  const [nrcBackPic, setNrcBackPic] = useState('');
  const [contractId, setContractId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [showResend, setShowResend] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [chooseProfile, setChooseProfile] = useState(false);
  const [chooseNrcFront, setChooseNrcFront] = useState(false);
  const [chooseNrcBack, setChooseNrcBack] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [signUpData, setSignUpData] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [banned, setBanned] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const countries = [
    {name:'Myanmar', code: '+95', img: require('../../../assets/icons/mm.png')},
    {name:'China', code: '+86', img: require('../../../assets/icons/cn.png')},
    {name:'Thailand', code: '+66', img: require('../../../assets/icons/th.png')}
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);


  var CryptoJS = require("crypto-js");
  const myCodeInput = useRef(null);
  const photoUploadDialogRef = useRef();
   //const nrcFrontPhotoUploadDialogRef = useRef();
   //const nrcBackPhotoUploadDialogRef = useRef();
  const removePhotoDialogRef = useRef();

  const addPhotoCancelButtonIndex = {
    ios: 2,
    android: 2,
  };
  const androidAddPhotoOptions = [
    IMLocalized('Import from Library'),
    IMLocalized('Take Photo'),
    IMLocalized('Cancel'),
  ];

  const onPhotoUploadDialogDone = (index) => {
    const onPhotoUploadDialogDoneSetter = {
      android: () => onPhotoUploadDialogDoneAndroid(index),
    };
    onPhotoUploadDialogDoneSetter[Platform.OS]();
  };

  const onProfilePicturePress = () => {
    setPictureIndex(0);
      photoUploadDialogRef.current.show();
  };
  const onNrcFrontPicturePress = () => {
    setPictureIndex(1);
    photoUploadDialogRef.current.show();
  };
  const onNrcBackPicturePress = () => {
    setPictureIndex(2);
    photoUploadDialogRef.current.show();
  };

  useEffect(()=> {
    AsyncStorage.getItem("ninepayPhNo").then((value) => {
      if(value != null && value != undefined &&value != ''){
        setContactPhone(value);
      }
    })
  },[])

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      const { source, mime, filename, uploadUri } = extractSourceFromFile(image);
        if(pictureIndex == 0){
          setChooseProfile(true)
          setProfilePicture(source);
        }
        else if(pictureIndex == 1){
          setChooseNrcFront(true)
          setNrcFrontPic(source);
        }
        else if(pictureIndex == 2){
          setChooseNrcBack(true)
          setNrcBackPic(source);
        }
    });
  };

  
  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    }).then((image) => {
      if(pictureIndex == 0){
        setChooseProfile(true)
        setProfilePicture(image.path);
      }
      else if(pictureIndex == 1){
        setChooseNrcFront(true)
        setNrcFrontPic(image.path);
      }
      else if(pictureIndex == 2){
        setChooseNrcBack(true)
        setNrcBackPic(image.path);
      } 
    });
  };

  const onPhotoUploadDialogDoneAndroid = (index) => {
    if (index == 1) {
      onLaunchCamera();
    }

    if (index == 0) {
      onOpenPhotos();
    }
  };

  const showAlert = (msg) => {
    return (
      Alert.alert('', msg, [
        { text: IMLocalized('OK'), style: 'default' },
      ])
    )
  }
  const signInWithPhoneNumber = async (userValidPhoneNumber) => {
    console.log('userValidPhoneNumber>' + userValidPhoneNumber);
    if(selectedCountry.code == '+95')
      sendPhoneOTP(links.sendOTPLink, userValidPhoneNumber)
    else
      sendPhoneOTP(links.sendForeignOTPLink, userValidPhoneNumber);
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

  const signUpHandler = async () => {
    let newUserName = userName.split(/\s/).join('');
   // console.log("new Agent name>>"+ newAgentName);
    if(newUserName.length == 0){
      showAlert(IMLocalized('Enter User Name'))
    }
    else if(password.length == 0){
      showAlert(IMLocalized('Enter Password'))
    }
    else if(password.length < 6){
      showAlert(IMLocalized('Password must be 6 digit'))
    }
    else if(contactPhone.length == 0){
      showAlert(IMLocalized('Enter phone number'))
    }
    else{
      setLoading(true);
      let userValidPhoneNumber = selectedCountry.code + contactPhone;
      billManager.getAgentWithPhoneNo(userValidPhoneNumber).then((response) => {
        //console.log("All Agents>>"+ JSON.stringify(response));
        if(response && response.length > 0){
          showAlert(IMLocalized('You already have an account with this phone number'))
          setLoading(false);
        }
        else{
          const url = links.apilink + 'agentprofile?_size=1&_sort=-ID';
          fetch(url) 
          .then((resp) => resp.json())
          .then(async function(data) {
            let finalID;
            if(data && data.length > 0){
              let aID = data[0].AgentID;
              let tempID = aID.substring(5, aID.length) 
              let id = parseInt(tempID) + 1;
              finalID = '90000' + id;
              console.log("latest ID>>"+ finalID);
            }
            else{
              finalID = '900001';
            }
            try{
              const salt = await BcryptReactNative.getSalt(10);
              const hash = await BcryptReactNative.hash(salt, password);
                      
                  console.log('Hash>>' + hash);
                  let obj =
                  { 
                        "AgentID": finalID,
                        "AName": newUserName,
                        "Other_Name": '',
                        "NRC_No": '',
                        "Contact_Phone": userValidPhoneNumber,
                        "Other_Phone_1": '',
                        "Other_Phone_2": '',
                        "Contact_Person_Name": '',
                        "Address": '',
                        "Township": "",
                        "City": "",
                        "Regional_Code": "",
                        "Profile_Picture": '',
                        "NRC_Pic_Front": '',
                        "NRC_Pic_Back": '',
                        "Contract_ID": "",
                        "User_Name": '',
                        "Password": hash,
                        "registered": 1
                      }
                  console.log("SignUpData>>"+ JSON.stringify(obj));
                  //Send OTP with phone Number and go to CheckOTP page
                  //props.navigation.navigate('CheckOTP', { signUpData: obj, phoneNo: contactPhone });
                  setSignUpData(obj);
                  signInWithPhoneNumber(userValidPhoneNumber);
                }
                catch(e) {
                  setLoading(false);
                  console.log({ e })
                } 
          });
        }
      })

      
    } 
  };

  const infoInputRender = () => {
    return (
      <>
      <Card style={styles.card}>
          <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconMaterialIcons name={'person-outline'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'name'}
                placeholder={IMLocalized('User Name')}
                onChangeText={(text) => setUserName(text)}
                value={userName}
              />
          </View>
          <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: 'gray',
              //  marginBottom: 18
              }}>
              <IconFeather name={'key'} size={24} color={'#3494c7'} />
              {/* <TextInput
                style={styles.body}
                placeholder={IMLocalized("Password")}
                autoCompleteType={'name'}
                secureTextEntry
                maxLength={6}
                onChangeText={(text) => setPassword(text)}
                value={password}
              /> */}
              {
                    showPassword ?
                    <TextInput
                    style={[ styles.body, { flex: 0.95 } ]}
                    placeholder={IMLocalized("Password")}
                    autoCompleteType={'off'}
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
          <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              {/* <IconFeather name={'phone-call'} size={24} color={'#3494c7'} /> */}
              <TouchableOpacity style={styles.imgcontainer} onPress={()=> setCountryModalVisible(true)}>
                    <Image source={selectedCountry.img} style={styles.countryImg} />
                    <Text style={styles.code}>{selectedCountry.code}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.body}
                autoCompleteType={'tel'}
                keyboardType={'phone-pad'}
                placeholder={IMLocalized('Phone Number')}
                onChangeText={(text) => {
                  if(selectedCountry.code == '+95' && contactPhone.length == 0 && text == '0'){

                  }
                  else
                    setContactPhone(text)
                }}
                value={contactPhone}
              />
            </View>
          
           {/*
              <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconMaterialIcons name={'credit-card'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'name'}
                placeholder={IMLocalized('NRC No')}
                onChangeText={(text) => setNrcNo(text)}
                value={nrcNo}
              />
            </View>

            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconFeather name={'phone-call'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'tel'}
                keyboardType={'phone-pad'}
                placeholder={IMLocalized('Contact Phone')}
                onChangeText={(text) => setContactPhone(text)}
                value={contactPhone}
              />
            </View>

            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconFeather name={'phone-call'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'tel'}
                keyboardType={'phone-pad'}
                placeholder={IMLocalized('Other Phone1')}
                onChangeText={(text) => setOtherPhone1(text)}
                value={otherPhone1}
              />
            </View>

            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconFeather name={'phone-call'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'tel'}
                keyboardType={'phone-pad'}
                placeholder={IMLocalized('Other Phone2')}
                onChangeText={(text) => setOtherPhone2(text)}
                value={otherPhone2}
              />
            </View>

            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconMaterialIcons name={'person-outline'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'name'}
                placeholder={IMLocalized('Contact Person Name')} 
                onChangeText={(text) => setContactPersonName(text)}
                value={contactPersonName}
              />
            </View>


            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconMaterialIcons name={'person-pin-circle'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'name'}
                placeholder={IMLocalized('Address')}
                multiline={true}
                onChangeText={(text) => setAddress(text)}
                value={address}
              />
            </View>

            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: fullName ? '#3494c7' : 'gray',
              }}>
              <IconMaterialIcons name={'person-outline'} size={24} color={'#3494c7'} />
              <TextInput
                style={styles.body}
                autoCompleteType={'name'}
                placeholder={IMLocalized('User Name')}
                //keyboardType={'phone-pad'}
                onChangeText={(text) => setFullName(text)}
                value={fullName}
              />
            </View>
            {/* <View style={styles.passInputWraper}>
              <View style={styles.inputIconWraper}>
                <IconFeather name={'key'} size={24} color={'#3494c7'} />
              </View>
              <View style={styles.passInputContainer}>
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

         
            */}

          </Card>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
             {IMLocalized('By proceeding, you agree')} {' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { }}>
                <Text style={styles.termsBtnText}>
                  {IMLocalized('Terms & Conditions')}</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> & </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { }}>
              <Text style={styles.termsBtnText}>{IMLocalized('Privacy Policy')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginBtnSection}>
            <View style={styles.loginBtnContainer}>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      signUpHandler();
                    }}>
                    <Text style={styles.loginBtnText}>{IMLocalized('Sign Up')}</Text>
                  </TouchableOpacity>
            </View>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{IMLocalized('already have an account')}?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.goBack();
              }}>
              <Text style={styles.loginText}>{IMLocalized('login')}</Text>
            </TouchableOpacity>
          </View>
        </>
    )
  }

  const onResend = () => {
    let userValidPhoneNumber = selectedCountry.code + contactPhone;
    signInWithPhoneNumber(userValidPhoneNumber);
  }

  const otpInputRender = () => {
    return (
      <>
        <View style={styles.otpdescView}>
          <Text style={styles.otpdesc}>{IMLocalized('Enter the code that was sent to')}</Text>
          <Text style={styles.phone}>{contactPhone}</Text>
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
          //console.log("insertUserLog...");
        })
        props.navigation.navigate('Home');
  }

  const onFinishCheckingCode = async (newCode) => {
    setLoading(true);
    let phone = signUpData.Contact_Phone;
    let data = signUpData;
    data['Contact_Phone'] = phone.substring(1, phone.length);
    try {
      console.log("Check>>", data)
      billManager.confirmOTP(phone, newCode).then((response) => {
        if(response.data.status == 200){
          const url = links.apilink + 'agentprofile/';
          fetch(url, { 
              method: "POST", 
              body: JSON.stringify(data),  
              headers: { 
                  "Content-type": "application/json; charset=UTF-8"
              } 
          }) 
          .then(response => response.json()) 
          .then(function(res) {
            console.log("onFinishCheckingCode Response>>"+ JSON.stringify(res));
            var cipherData = CryptoJS.AES.encrypt(JSON.stringify(data), '1284839994').toString();
            AsyncStorage.setItem('agentInfo', cipherData);
            ToastAndroid.show('Signup successful', ToastAndroid.SHORT);
            insertUserLog(data);
          })
          .catch(error => {
            console.log("onFinishCheckingCode Error>>"+ JSON.stringify(error));
            setLoading(false)
          }); 
        }
        else{
          setLoading(false);
          showAlert(response.data.message);
        }
      })
    } catch (error) {
        setLoading(false);
        if(wrongCount == 3){
          showAlert(IMLocalized("You are blocked from Nine Pay"));
          setBanned(true);
          let time = moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");
          billManager.updateAgentProfile(signUpData.ID, null, null, null, 1, time).then((response) => {
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

const chooseCountry = (country) => {
  setCountryModalVisible(false)
  setSelectedCountry(country);
  console.log("Selected Country>>"+ JSON.stringify(country));
};

  return (
    // <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
  
      <ScrollView style={styles.container}>
      {/* <Modal
          transparent={true}
          animationType={'none'}
          visible={loading}
          onRequestClose={() => { console.log('close modal') }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color="#3494c7"
                animating={loading} />
              <Text style={styles.text}>Please wait...</Text>
            </View>
          </View>
        </Modal> */}
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
          {/* <View style={styles.topContainer}>
            <Image
              style={styles.topImage}
              resizeMode={'contain'}
              source={require('../../assets/img/leftDot.png')}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.loginText}>{IMLocalized('Sign Up')}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>{IMLocalized('welcome')}</Text>
            <Text style={styles.loginLineText}>{IMLocalized('create account')}</Text>
          </View> */}

          <View style={styles.topContainer}>
              <Image
                style={styles.topImage}
                resizeMode={'contain'}
                source={require('../../assets/img/logo_only.png')}
              />
              <Text style={styles.welcomeText2}>Nine Pay</Text>
          </View>
          {/* <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>{IMLocalized('Sign Up')}</Text>
          </View> */}

          {
              showOTPInput ?
                otpInputRender()
              :
                infoInputRender()
            }

        </View>
      </ScrollView>
    // </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

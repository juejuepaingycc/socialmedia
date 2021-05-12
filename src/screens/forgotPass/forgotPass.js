import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import billManager from '../billManager';
import { Colors, Scales } from '@common';
import styles from './forgotPass.styles';
import Card from '../../components/ui/Card';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import { PayActivityIndicator } from '../../Core/truly-native';
import CodeField from 'react-native-confirmation-code-field';
import { links } from '../../../StaticData/paymentData';

const ForgotPassScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [userName ,setUserName] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [agentData, setAgentData] = useState(null);
  const myCodeInput = useRef(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [banned, setBanned] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const countries = [
    {name:'Myanmar', code: '+95', img: require('../../../assets/icons/mm.png')},
    {name:'China', code: '+86', img: require('../../../assets/icons/cn.png')},
    {name:'Thailand', code: '+66', img: require('../../../assets/icons/th.png')}
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const signInWithPhoneNumber = async (userValidPhoneNumber) => {
    console.log('userValidPhoneNumber>' + userValidPhoneNumber);
    if(selectedCountry.code == '+95')
      sendPhoneOTP(links.sendOTPLink, userValidPhoneNumber)
    else
      sendPhoneOTP(links.sendForeignOTPLink, userValidPhoneNumber)
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

  useEffect(()=> {
    AsyncStorage.getItem("ninepayPhNo").then((value) => {
      if(value != null && value != undefined &&value != ''){
        setPhone(value);
      }
    })
  },[])

  const goSubmit = async () => {
    if (phone.length == 0) {
      Alert.alert('Error', IMLocalized('Enter Phone Number'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    } else {
      setLoading(true);
      checkUserExists();
    }
  };

  const showAlert = (msg) => {
    return (
      Alert.alert('', msg, [
        { text: IMLocalized('OK'), style: 'default' },
      ])
    )
  }

  const checkUserExists = () => {
    let userValidPhoneNumber = selectedCountry.code + phone;
    let ph = userValidPhoneNumber.substring(1, userValidPhoneNumber.length)
    console.log("Phone>>" + ph)
    billManager.getAgentWithPhoneNo(ph).then((response) => {
      if(response && response.length > 0){
          setAgentData(response[0]);
          signInWithPhoneNumber(userValidPhoneNumber);
      }
      else{
        setLoading(false);
        Alert.alert('Error', IMLocalized('There is no account with this phone number!'), [
          { text: IMLocalized('OK'), style: 'default' },
        ]);
      }
    })
  }

  const chooseCountry = (country) => {
    setCountryModalVisible(false)
    setSelectedCountry(country);
    console.log("Selected Country>>"+ JSON.stringify(country));
  };

  const onFinishCheckingCode = async (newCode) => {
    setLoading(true);
    try {
      let validPhno = selectedCountry.code + phone;
      billManager.confirmOTP(validPhno, newCode).then((response) => {
        setLoading(false);
        if(response.data.status == 200){
          props.navigation.navigate('CheckOTP', 
          { 
            phoneNo: phone,
            fromPage: 'ForgotPassword', 
            agentID: agentData.ID,
            agentInfo: agentData
          });
        }
        else{
          showAlert(response.data.message);
        }
      })
    } catch (error) {
        setLoading(false);
        if(wrongCount == 3){
          showAlert(IMLocalized("You are blocked from Nine Pay"));
          setBanned(true);
          let time = moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");
          billManager.updateAgentProfile(agentData.ID, null, null, null, 1, time).then((response) => {
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

  const onResend = () => {
    let userValidPhoneNumber = selectedCountry.code + phone;
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

  const infoInputRender = () => {
    return (
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
         <TouchableOpacity style={styles.imgcontainer} onPress={()=> setCountryModalVisible(true)}>
                    <Image source={selectedCountry.img} style={styles.countryImg} />
                    <Text style={styles.code}>{selectedCountry.code}</Text>
                  </TouchableOpacity>
          <TextInput
            style={styles.body}
            placeholder={IMLocalized('Phone Number')}
            autoCompleteType={'off'}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              if(selectedCountry.code == '+95' && phone.length == 0 && text == '0'){

              }
              else
                setPhone(text)
            }}
            value={phone}
          />
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
                  goSubmit();
                }}>
                <Text style={styles.loginBtnText}>{IMLocalized('submit')}</Text>
              </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
                activeOpacity={0.7}
                style={{ marginTop: 10 }}
                onPress={() => {
                  props.navigation.goBack();
                }}>
          <Text style={styles.loginText}>{IMLocalized('Go back')}?</Text>
      </TouchableOpacity>
      {/* <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{IMLocalized('Go back')}?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.goBack();
                }}>
                <Text style={styles.loginText}>{IMLocalized('login')}</Text>
              </TouchableOpacity>
      </View>  */}
    </>
    )
  }

  return (
    <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
      <View style={styles.container}>
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
            {/* <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>{IMLocalized('forgot password')}</Text>
            </View> */}
        </View>

        {
          showOTPInput ?
            otpInputRender()
          :
            infoInputRender()
        }  
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassScreen;

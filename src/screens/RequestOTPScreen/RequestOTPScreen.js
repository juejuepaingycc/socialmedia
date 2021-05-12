import React, { useState, useRef } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Icon from 'react-native-vector-icons/AntDesign';
import AppStyles from '../../AppStyles';
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import { PayActivityIndicator } from '../../Core/truly-native';
import CodeField from 'react-native-confirmation-code-field';
import { Colors, Scales } from '@common';
import moment from "moment";
import billManager from '../billManager';
import AsyncStorage from '@react-native-community/async-storage';
import { links } from '../../../StaticData/paymentData';

const RequestOTPScreen = (props) => {

    const [showOTPInput, setShowOTPInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const recaptchaVerifier = React.useRef(null);
    const myCodeInput = useRef(null);
    const phone = props.navigation.getParam('phoneNo');    
    const agentID = props.navigation.getParam('agentID');
    const goHome = props.navigation.getParam('goHome');
    const [wrongCount, setWrongCount] = useState(0);
    const [banned, setBanned] = useState(false);

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

      
  const showAlert = (msg) => {
    return (
      Alert.alert('', msg, [
        { text: IMLocalized('OK'), style: 'default' },
      ])
    )
  }

  const onFinishCheckingCode = async (newCode) => {
    setLoading(true);
    try {
      //let validPhno = '+959' + phone.substring(2, phone.length);
      let ph = '+' + phone;
      billManager.confirmOTP(ph, newCode).then((response) => {
        setLoading(false);
        if(response.data.status == 200){
          props.navigation.navigate('Home');
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
            billManager.updateAgentProfile(agentID, null, null, null, 1, time).then((response) => {
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
  
      const sendOTP = () => {
        if(goHome){
          props.navigation.navigate('App');
        }
        else{
          setLoading(true);
          //let validPhno = '+959' + phone.substring(2, phone.length);
          signInWithPhoneNumber(phone);
        }
      }

      const onResend = () => {
        //let validPhno = '+959' + phone.substring(2, phone.length);
        signInWithPhoneNumber(phone);
      }

      const signInWithPhoneNumber = async (userValidPhoneNumber) => {
        let phno = '+' + userValidPhoneNumber;
          if(phno.substring(0,3) == '+95'){
            sendPhoneOTP(links.sendOTPLink, phno)
          }
          else{
            sendPhoneOTP(links.sendForeignOTPLink, phno)
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
    

    return (
        <View style={styles.container}>
            {
                showOTPInput ?
                    otpInputRender()
                :
                <TouchableOpacity style={styles.btn} onPress={()=> sendOTP()} >
                    <Text style={styles.text}>{IMLocalized('Continue')}</Text>
                    <Icon name='arrowright' size={25} color='white' />
                </TouchableOpacity>
            }

            {
            loading && (          
                <PayActivityIndicator />
            )
            }
        </View>
    )

        
}

const styles = StyleSheet.create({
    loginBtnSection: {
        width: Scales.deviceWidth,
        marginTop: Scales.deviceHeight * 0.02,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginBtnContainer: {
        width: Scales.deviceWidth * 0.6,
        height: Scales.deviceHeight * 0.06,
        backgroundColor: '#3494c7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Scales.deviceHeight * 0.06,
      //  borderBottomLeftRadius: Scales.deviceHeight * 0.06,
        overflow: 'hidden',
        alignSelf: 'center',
      },
      loginBtn: {
        flexDirection: 'row',
        width: Scales.deviceWidth * 0.45,
        height: Scales.deviceHeight * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
      }, 
      loginBtnText: {
        color: Colors.WHITE,
        fontSize: Scales.moderateScale(22),
        fontWeight: '700',
        paddingLeft: Scales.moderateScale(8),
      },       
    input: {
        flex: 1,
        borderLeftWidth: 1,
        borderRadius: 3,
        borderColor: AppStyles.colorSet['light'].grey3,
        color: AppStyles.colorSet['light'].mainTextColor,
        fontSize: 17,
        fontWeight: '700',
        backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
      },
      codeFieldContainer: {
        borderWidth: 1,
        borderColor: AppStyles.colorSet['light'].grey3,
        width: '80%',
        height: 42,
        marginTop: 30,
        alignSelf: 'center',
        borderRadius: 25,
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
        marginBottom: 20
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#3494c7',
        borderRadius: 8,
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.5,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
        paddingRight: 9
    },
    otpdescView: {
      paddingTop: 16,
      width: '90%',
      alignItems: 'center',
      paddingBottom: 5
    },
    resendView: {
      paddingVertical: 5,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    phone: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#3f484d'
    },
    otpdesc: {
      fontSize: 17,
      color: '#3f484d',
    },
    resenddesc: {
      fontSize: 16,
      color: '#545e63',
    },
    resend: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#3494c7'
    },
})

export default RequestOTPScreen;
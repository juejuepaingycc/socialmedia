import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import billManager from '../billManager';
import CountDown from '../../components/timer/timer';
import SmoothPinCodeInput from '../../components/otpInput/otpInput';
import { Colors, Scales } from '@common';
import styles from './changePassword.styles';
import * as authActions from '../../store/action/auth';
import axios from 'axios';
import Card from '../../components/ui/Card';
import InnerHeader from '../../components/ui/innerHeader';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import IconFeather from 'react-native-vector-icons/Feather';
import BcryptReactNative from 'bcrypt-react-native';

const ForgotPassScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [recentPassword, setRecentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agentInfo, setAgentInfo] = useState('')
  const [showRecentPassword, setShowRecentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  var CryptoJS = require("crypto-js");

  // function backButtonHandler() {
  //   console.log("Backkkkkk")
  //   props.navigation.goBack();
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
  //   };
  // }, [backButtonHandler]);

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        //const data = JSON.parse(value);
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
       
        billManager.getAgentWithPhoneNo(decryptedData.Contact_Phone).then((response) => {
          setAgentInfo(response[0]);  
        });
      });
    })(); 
    
  }, []);

  const showAlert = (msg) => {
    return (
      Alert.alert('', msg, [
        { text: IMLocalized('OK'), style: 'default' },
      ])
    )
  }

  const onSubmit = async () => {
    setLoading(true);
    if(recentPassword == ''){
      showAlert(IMLocalized('Enter Recent Password'))
      setLoading(false);
    }
    else if(newPassword == ''){
      showAlert(IMLocalized('Enter New Password'))
      setLoading(false);
    }
    else if(confirmPassword == ''){
      showAlert(IMLocalized('Enter Confirm Password'))
      setLoading(false);
    }
    else if (recentPassword.length < 6 || newPassword.length < 6 || confirmPassword.length < 6) {
      showAlert(IMLocalized('Enter Valid Password'))
      setLoading(false);
    } 
    else{
      const isSame = await BcryptReactNative.compareSync(recentPassword, agentInfo.Password);
            
      if(isSame != true){
        showAlert(IMLocalized("Recent password doesn't match"))
        setLoading(false);
      }
      else if(newPassword != confirmPassword){
        showAlert(IMLocalized("Confirm password doesn't match with new password"))
        setLoading(false);
      }
      else{
        changePassword();
      }
    }
  }
  
  const changePassword = async () => {
    const salt = await BcryptReactNative.getSalt(10);
    const hash = await BcryptReactNative.hash(salt, newPassword);
         
    billManager.changePassword(agentInfo.ID, hash).then((response) => {
      if(response == null || response.affectedRows == 0 || response.error != null){
        showAlert(IMLocalized("Change password fail. Please try again!"))
      }
      else{
        ToastAndroid.show(IMLocalized('Change password successful'), ToastAndroid.SHORT);
        setRecentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        props.navigation.goBack();
      }
      setLoading(false);
    });
  }

  return (
    <View behavior={'padding'} style={styles.container}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('change password')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.container}>
        <View style={styles.midContainer}>

          <Card style={styles.card}>

            <View
                style={{
                  ...styles.phoneInputContainer,
                  borderColor: 'gray',
                  marginBottom: 18
                }}>
              {
                showRecentPassword ?
                <TextInput
                      style={styles.body}
                      placeholder={IMLocalized('Recent Password')}
                      autoCompleteType={'off'}
                      maxLength={6}
                      onChangeText={(text) => setRecentPassword(text)}
                      value={recentPassword}
                    />
                  :
                  <TextInput
                    style={styles.body}
                    placeholder={IMLocalized('Recent Password')}
                    autoCompleteType={'off'}
                    secureTextEntry
                    maxLength={6}
                    onChangeText={(text) => setRecentPassword(text)}
                    value={recentPassword}
                  />
              }
              {
                showRecentPassword ?
                      <TouchableOpacity onPress={()=> setShowRecentPassword(false)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
                :
                      <TouchableOpacity onPress={()=> setShowRecentPassword(true)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
              }
              </View>
              <View
                style={{
                  ...styles.phoneInputContainer,
                  borderColor: 'gray',
                  marginBottom: 18
                }}>
                {
                showNewPassword ?
                  <TextInput
                    style={styles.body}
                    placeholder={IMLocalized('New Password')}
                    autoCompleteType={'off'}
                    maxLength={6}
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                  />
                    :
                    <TextInput
                    style={styles.body}
                    placeholder={IMLocalized('New Password')}
                    autoCompleteType={'off'}
                    secureTextEntry
                    maxLength={6}
                    onChangeText={(text) => setNewPassword(text)}
                    value={newPassword}
                  />
              }
              {
                showNewPassword ?
                      <TouchableOpacity onPress={()=> setShowNewPassword(false)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
                :
                      <TouchableOpacity onPress={()=> setShowNewPassword(true)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
              }
              </View>
              <View
                style={{
                  ...styles.phoneInputContainer,
                  borderColor: 'gray',
                  marginBottom: 18
                }}>
                {
                showConfirmPassword ?
                    <TextInput
                    style={styles.body}
                    placeholder={IMLocalized('Confirm Password')}
                    autoCompleteType={'off'}
                    maxLength={6}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                  />
                    :
                    <TextInput
                    style={styles.body}
                    placeholder={IMLocalized('Confirm Password')}
                    autoCompleteType={'off'}
                    secureTextEntry
                    maxLength={6}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                  />
              }
              {
                showConfirmPassword ?
                      <TouchableOpacity onPress={()=> setShowConfirmPassword(false)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
                :
                      <TouchableOpacity onPress={()=> setShowConfirmPassword(true)} style={styles.eyeView}>
                            {
                              <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                            }
                      </TouchableOpacity>
              }
              </View>
           
          </Card>

          <View style={styles.loginBtnSection}>
            <View style={styles.loginBtnContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.WHITE} />
              ) : (
                  <TouchableOpacity
                    style={styles.loginBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSubmit();
                    }}>
                    <Text style={styles.loginBtnText}>{IMLocalized('submit')}</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassScreen;

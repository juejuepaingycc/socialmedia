import React, { useState } from 'react';
import { Text, Alert, ToastAndroid,
     View, Dimensions, Image, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import AppStyles from '../../AppStyles';
import billManager from '../billManager';
import BcryptReactNative from 'bcrypt-react-native';
import { PayActivityIndicator } from '../../Core/truly-native';
import { Colors, Scales } from '@common';
import IconFeather from 'react-native-vector-icons/Feather';

const CheckOTPScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fromPage = props.navigation.getParam('fromPage');
    const agentID = props.navigation.getParam('agentID');

    const changePassword = async () => {
        setLoading(true);
        if(newPassword.length < 6){
            Alert.alert('', IMLocalized('Enter valid 6 digit password'), [
                { text: IMLocalized('OK'), style: 'default' },
              ])
            setLoading(false);
        }
        else if(confirmPassword.length < 6){
            Alert.alert('', IMLocalized('Enter valid 6 digit confirm password'), [
                { text: IMLocalized('OK'), style: 'default' },
              ])
            setLoading(false);
        }
        else if(newPassword != confirmPassword){
            Alert.alert('', IMLocalized("Confirm password doesn't match with new password"), [
                { text: IMLocalized('OK'), style: 'default' },
              ])
            setLoading(false);
        }
        else{
            const salt = await BcryptReactNative.getSalt(10);
            const hash = await BcryptReactNative.hash(salt, newPassword);
                
            billManager.changePassword(agentID, hash).then((response) => {
            if(response == null || response.affectedRows == 0 || response.error != null){
                Alert.alert('', IMLocalized('Change password fail. Please try again!'), [
                    { text: IMLocalized('OK'), style: 'default' },
                  ])
                setLoading(false);
            }
            else{
                ToastAndroid.show(IMLocalized('Change password successful'), ToastAndroid.SHORT);
                //set new AgentInfo and go to App
                //console.log("AgentInfo now>>" + JSON.stringify(agentInfo));
                    setLoading(false);
                    // let temp = agentInfo;
                    // temp.Password = hash;
                    // var cipherData = CryptoJS.AES.encrypt(JSON.stringify(temp), '1284839994').toString();
                    // AsyncStorage.setItem('agentInfo', cipherData);
                    props.navigation.navigate('SignIn');
            }
            });
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
             {
                loading && (          
                    <PayActivityIndicator />
                )
            }
                {
                    fromPage == 'ForgotPassword' ?
                        <View>
                            {/* <View style={styles.title}>
                                <Text style={styles.desc}>{IMLocalized('Change Password')}</Text>
                            </View> */}
                            <View style={styles.topContainer}>
           
           <Image
             style={styles.topImage}
             resizeMode={'contain'}
             source={require('../../assets/img/logo_only.png')}
           />
           <Text style={styles.welcomeText2}>Nine Pay</Text>
       </View>
       {
           showNewPassword ?
            <View style={styles.row}>
                <TextInput
                            style={styles.postInput}
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            maxLength={6}
                            placeholder={IMLocalized('New Password')}
                />
                <TouchableOpacity onPress={()=> setShowNewPassword(false)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                      }
                </TouchableOpacity>
            </View>
           :
            <View style={styles.row}>
                <TextInput
                            style={styles.postInput}
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword}
                            maxLength={6}
                            secureTextEntry
                            placeholder={IMLocalized('New Password')}
                />
                <TouchableOpacity onPress={()=> setShowNewPassword(true)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                      }
                </TouchableOpacity>
            </View>
       }
           {
           showConfirmPassword ?
            <View style={styles.row}>
               <TextInput
                            style={styles.postInput}
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                            maxLength={6}
                            placeholder={IMLocalized('Confirm Password')}
                            />
                <TouchableOpacity onPress={()=> setShowConfirmPassword(false)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                      }
                </TouchableOpacity>
            </View>
           :
            <View style={styles.row}>
               <TextInput
                            style={styles.postInput}
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                            maxLength={6}
                            secureTextEntry
                            placeholder={IMLocalized('Confirm Password')}
                            />
                <TouchableOpacity onPress={()=> setShowConfirmPassword(true)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye}/>
                      }
                </TouchableOpacity>
            </View>
       }
                            
                            
                <View style={styles.loginBtnSection}>
                <View style={styles.loginBtnContainer}>
                        <TouchableOpacity
                        style={styles.loginBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                            changePassword();
                        }}>
                            <IconFeather
                            name={'edit-2'}
                            size={Scales.moderateScale(20)}
                            color={Colors.WHITE}
                            />
                            <Text style={styles.loginBtnText}>{IMLocalized('Change Password')}</Text>
                        </TouchableOpacity> 
                        </View>
                        </View>                                                                
                        </View>
                        :
                        null
                }
            </KeyboardAvoidingView>
                        // <View>
                        //     <View style={styles.title}>
                        //         <Text style={styles.desc}>{IMLocalized('Enter the code that was sent to ')}</Text>
                        //         <Text style={styles.phno}>{phoneNo}</Text>
                        //     </View>
                        //     <TextInput
                        //     style={styles.postInput}
                        //     onChangeText={(text) => setOtp(text)}
                        //     value={otp}
                        //     />
                        //     <View style={styles.btnView}>
                        //         <TouchableOpacity style={styles.btn} onPress={() => props.navigation.goBack()}>
                        //             <Text style={styles.text}>{IMLocalized('Cancel')}</Text>
                        //         </TouchableOpacity>
                        //         <TouchableOpacity style={styles.btn} onPress={() => goCheckOTP()}>
                        //             <Text style={styles.text}>{IMLocalized('Check OTP')}</Text>
                        //         </TouchableOpacity>
                        //     </View>                                                                 
                        // </View>
             

    )
}

const styles = StyleSheet.create({
    title: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        marginBottom: 25
    },
    topContainer: {
        justifyContent: 'center',
        width: Scales.deviceWidth,
        alignItems: 'center',
        marginBottom: 30
      //  marginTop: 20
      },
    desc: {
        fontSize: 20
    },
    phno: {
        fontSize: 19,
        color: '#404142',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        padding: 10,
        backgroundColor: '#3494c7',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width * 0.39
    },
    text: {
        color: 'white',
        fontSize: 18,
        paddingRight: 9
    },
    postInput: {
        //paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'lightgray',
        borderRadius: 8,
        width: Dimensions.get('window').width * 0.8,
        marginBottom: 10,
        alignSelf: 'center'
    },
    btnView: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 10
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
    fontSize: Scales.moderateScale(17),
   // fontWeight: '700',
    paddingLeft: Scales.moderateScale(8),
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  eye: {

  },
  loginBtnSection: {
    width: Scales.deviceWidth,
    marginTop: Scales.deviceHeight * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: Scales.deviceHeight * 0.14,
    height: Scales.deviceHeight * 0.1,
  },
  welcomeText2: {
    fontSize: 30,
    color: '#3494c7',
    fontFamily: AppStyles.customFonts.klavikaMedium,
    textAlign: 'center',
    paddingTop: 0
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
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: Dimensions.get('window').width * 0.9,
      alignSelf: 'center',
      alignItems: 'center'
  },
  eyeView: {
    //justifyContent: 'center',
    //alignItems: 'center'
  }
})

export default CheckOTPScreen;
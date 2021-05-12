
import React, { useState, useEffect } from 'react';
import { Text, Alert, ToastAndroid, BackHandler,
     View, Dimensions, Image, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { links } from '../../../StaticData/paymentData';
import AsyncStorage from '@react-native-community/async-storage';
import AppStyles from '../../AppStyles';
import billManager from '../billManager';
import moment from 'moment';
import { firebase } from '../../Core/firebase/config';
import { useSelector } from 'react-redux';
import { TNActivityIndicator } from '../../Core/truly-native';
import { Colors, Scales } from '@common';
import IconFeather from 'react-native-vector-icons/Feather';
import styles from './styles';
import authManager from '../../Core/onboarding/utils/authManager';
import SocialNetworkConfig from '../../SocialNetworkConfig';

const ChangePasswordScreen = (props) => {

    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showRecentPassword, setShowRecentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);

    const changePassword = () => {

        if(oldPassword.length == 0){
            showAlert('Enter Recent Password')
        }
        else if(newPassword.length == 0){
            showAlert('Enter New Password')
        }
        else if(confirmPassword.length == 0){
            showAlert('Enter Confirm Password')
        }
        else if(newPassword.length < 6){
            showAlert('Enter valid 6 digit password')
        }
        else if(confirmPassword.length < 6){
            showAlert('Enter valid 6 digit confirm password')
        }
        else{
            //check recent password
            console.log("Current User>>"+ firebase.auth().currentUser);
            setLoading(true);
            authManager
            .loginWithEmailAndPassword(currentUser.email, oldPassword, SocialNetworkConfig)
            .then((response) => {
                    if (response.user) {
                        console.log("Old Password correct...");
                        if(newPassword != confirmPassword){
                            setLoading(false);
                            showAlert("Confirm password doesn't match with new password");
                        }
                        else{
                            //change password
                            firebase.auth().currentUser.updatePassword(newPassword).then(function() {
                                // Update successful.
                                setLoading(false);
                                ToastAndroid.show(IMLocalized("Change password successful"), ToastAndroid.SHORT)
                                props.navigation.goBack();
                            }).catch(function(error) {
                                // An error happened.
                                setLoading(false);
                                ToastAndroid.show(IMLocalized("Change password fail. Please try again!"), ToastAndroid.SHORT)
                              });
                        }
                    }
                    else{
                        showAlert("Recent password doesn't match");
                        setLoading(false);
                    }
                })


        }
    }

    const showAlert = (msg) => {
        Alert.alert(
            '',
            IMLocalized(msg),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <View>
            {
                loading && (          
                    <TNActivityIndicator appStyles={AppStyles} />
                )
            }
            {
           showRecentPassword ?
            <View style={styles.row}>
                 <TextInput
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        maxLength={8}
                        placeholder={IMLocalized('Recent Password')}
                        onChangeText={(text) => setOldPassword(text)}
                        value={oldPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        />
                <TouchableOpacity onPress={()=> setShowRecentPassword(false)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                      }
                </TouchableOpacity>
            </View>
           :
            <View style={styles.row}>
                <TextInput
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        maxLength={8}
                        placeholder={IMLocalized('Recent Password')}
                        onChangeText={(text) => setOldPassword(text)}
                        value={oldPassword}
                        secureTextEntry
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        />
                <TouchableOpacity onPress={()=> setShowRecentPassword(true)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                      }
                </TouchableOpacity>
            </View>
       }
        {
           showNewPassword ?
            <View style={styles.row}>
                    <TextInput
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        maxLength={8}
                        placeholder={IMLocalized('New Password')}
                        onChangeText={(text) => setNewPassword(text)}
                        value={newPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
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
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        maxLength={8}
                        placeholder={IMLocalized('New Password')}
                        onChangeText={(text) => setNewPassword(text)}
                        value={newPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
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
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        maxLength={8}
                        placeholder={IMLocalized('Confirm Password')}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
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
                        style={styles.InputContainer}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        maxLength={8}
                        placeholder={IMLocalized('Confirm Password')}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        />
                <TouchableOpacity onPress={()=> setShowConfirmPassword(true)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
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
            </KeyboardAvoidingView>
        )}

export default ChangePasswordScreen;
          
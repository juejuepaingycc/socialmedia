import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ToastAndroid
} from 'react-native';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import Button from 'react-native-button';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import { localizedErrorMessage } from '../utils/ErrorCode';
import { firebase } from '../../firebase/config';
import authManager from '../utils/authManager';
import SocialNetworkConfig from '../../../SocialNetworkConfig';
import RNRestart from 'react-native-restart';

const VerifyScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);
  const currentUser = useSelector((state) => state.auth.user);
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

    useEffect(() => {
      setTimeout(() => {
        setDisableBtn(false);
      }, 10000);
  
      return;
    });
 
  const tryToLoginFirst = () => {
    RNRestart.Restart();
  };

  const onSendVerification = () => {
    setLoading(true);
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      console.log("Sent verification email in Verify..");
      setLoading(false);
      ToastAndroid.show('Sent verification email. Please check.', ToastAndroid.SHORT);
    })
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
          <View style={styles.doubleNavIcon}>
            <Image source={require('../../../assets/img/logo_only.png')} style={{ width: 40, height: 40, marginLeft: 20 }} />
            <Text style={{ color:'#3494c7', fontSize:35 , paddingLeft: 6, fontFamily: appStyles.customFonts.klavikaMedium }}>NINE CHAT</Text>
          </View>
        <Text style={styles.title}>
          {IMLocalized("Verify Email")}
          </Text>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => tryToLoginFirst()}>
          {IMLocalized('Check Verification')}
        </Button>
        {
          disableBtn?
      <Button
          containerStyle={styles.disableContainer}
          style={styles.loginText}
          disabled={true}
          onPress={() => onSendVerification()}>
          {IMLocalized('Send Verification')}
        </Button>
          :
<Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onSendVerification()}>
          {IMLocalized('Send Verification')}
        </Button>
        }
        

        
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  <Text style={{ color: 'gray', paddingTop: 22 }}>{IMLocalized('Change Account')}?&nbsp;&nbsp;</Text>
            <Button
            containerStyle={styles.phoneNumberContainer}
            onPress={() =>
              props.navigation.navigate('Login', { appStyles, appConfig })
            }>
            {IMLocalized('Log In')}
          </Button>
        </View>

        {loading && <TNActivityIndicator appStyles={appStyles} />}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VerifyScreen;

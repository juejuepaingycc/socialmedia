import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-native-button';
import { Text, View, Image } from 'react-native';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized, setI18nConfig } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { firebase } from '../../firebase/config';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';

const WelcomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState({
    img: require('../../../../assets/icons/en.png'),
    name: 'English',
    label: 'EN',
    key: 'EN'
  });
  const navMenuRef = useRef();

  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

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

  useEffect(() => {
    tryToLoginFirst();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("languageAsync").then((value) => {
      languages.forEach((lan) => {
        if(lan.label == value){
          setSelectedValue(lan)
        }
      });
    })
  }, []);

  const setLanguage = (item) => {
    setI18nConfig(item.label);
    AsyncStorage.setItem('languageAsync', item.label);
  }

  const tryToLoginFirst = async () => {
    setIsLoading(true);
    authManager
      .retrievePersistedAuthUser(appConfig)
      .then((response) => {
        if (response.user) {
          const user = response.user;
          //console.log("Currentttt User>>"+ JSON.stringify(user));

          // console.log("Redux User>>"+ JSON.stringify(this.props.user))
         
          if(user.firstName){
            AsyncStorage.setItem('currentUser', JSON.stringify(user));
            props.setUserData({
              user: response.user,
            });
            if(user.phone == null || user.phone == undefined || user.phone == ''){
              AsyncStorage.setItem('ninepayPhNo', '');
            }
            if(user.email == null || user.email == undefined || user.email == ''){
              setIsLoading(false);
              props.navigation.navigate('MainStack', { user });
            }
            else{
              if(firebase.auth().currentUser.emailVerified){ //This will return true or false
                props.navigation.navigate('MainStack', { user });
              }else{
                setIsLoading(false);      
              }
            }
          }
          else{
            console.log("Active user changed...");
            AsyncStorage.getItem("currentUser").then((value) => {
              let user = JSON.parse(value);
              console.log("Storage User>>"+ JSON.stringify(user));
              props.setUserData({
                user,
              });
              if(user.phone == null || user.phone == undefined || user.phone == ''){
                AsyncStorage.setItem('ninepayPhNo', '');
              }
              if(user.email == null || user.email == undefined || user.email == ''){
                setIsLoading(false);    
                props.navigation.navigate('MainStack', { user });
              }
              else{
                if(firebase.auth().currentUser.emailVerified){ //This will return true or false
                  props.navigation.navigate('MainStack', { user });
                }else{
                  setIsLoading(false);      
                }
              }
            })
          }   
        }
        else{
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (isLoading == true) {
    return <TNActivityIndicator appStyles={appStyles} />;
  }

  if (isLoading == false) {
  return (
    <View style={styles.container}>
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
                setLanguage(option)
              }}>
                <Image source={option.img} style={styles.selectImg} />
              </MenuOption>
            ))} 
            </MenuOptions>
          </Menu>
      </View>

      <View style={styles.logo}>
        <Image style={styles.logoImage} source={require('../../../assets/img/logo_only.png')} />
      </View>
      <Text style={styles.title}>
      Nine Chat
      </Text>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            : props.navigation.navigate('Login', { appStyles, appConfig });
        }}>
        {IMLocalized('login')}
      </Button>
      <Button
        containerStyle={styles.signupContainer}
        style={styles.signupText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: true,
                appStyles,
                appConfig,
              })
            : props.navigation.navigate('Signup', { appStyles, appConfig });
        }}>
        {IMLocalized('Sign Up')}
      </Button>
    </View>
  );
      }
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {
  setUserData,
})(WelcomeScreen);

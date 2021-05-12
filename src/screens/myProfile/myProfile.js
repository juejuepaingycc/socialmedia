import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import { IMLocalized } from '../../Core/localization/IMLocalization'
import { Scales } from '@common';
import AsyncStorage from '@react-native-community/async-storage';
import { links } from '../../../StaticData/paymentData';
import AppStyles from '../../AppStyles';
import IconFeather from 'react-native-vector-icons/Feather'
import billManager from '../billManager';
import { setPayNotiCount } from '../../store/action/homeData';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';

const MyProfileScreen = (props) => {

  const [balance, setBalance] = useState(0);
  const [agentInfo, setAgentInfo] = useState('')
  const [profile, setProfile] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [showAmount, setShowAmount]= useState(false);
  var CryptoJS = require("crypto-js");
  const dispatch = useDispatch();
  
  function backButtonHandler() {
    props.navigation.navigate('Home');
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(()=> {
    AsyncStorage.getItem("showAmount").then((value) => {
      if(value == null || value == undefined || value == ''){
          setShowAmount(false)
      }
      else{
        setShowAmount(value);
      }
    })
  },[])

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
       // const data = JSON.parse(value);
       var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
       var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     
        if(decryptedData.Profile_Picture != '' && decryptedData.Profile_Picture != null && decryptedData.Profile_Picture != undefined){
          setProfile(decryptedData.Profile_Picture);
          setHasProfile(true);
        }
        setAgentInfo(decryptedData)
        const url = links.apilink + 'ledger?_size=1&_sort=-LedgerID&_where=(from_account,eq,'+ decryptedData.AgentID +')';
        fetch(url)
          .then((resp) => resp.json())
          .then(function (data) {
            if(data.length == 0){
              setBalance(0)
            }
            else{
              setBalance(data[0].Balance);
            }
          })
      });
    })();
  }, []);
  
  const goLogout = () => {
    Alert.alert("", IMLocalized("Are you sure you want to logout?"), [
      {
        text: IMLocalized('No'),
        onPress: () => null,
        style: "cancel"
      },
      { text: IMLocalized('YesLogout'), onPress: () => {
          billManager.updateAgentProfile(agentInfo.ID, '', null, null, null, null).then((response) => {
            console.log("");
          });
          AsyncStorage.removeItem('agentInfo');
          AsyncStorage.removeItem('banned');
          AsyncStorage.removeItem('payNotiCount');
          dispatch(setPayNotiCount(0));
          billManager.getLatestLogIDOfUser(agentInfo.ID, 'ninepay_users_log').then((response) => {
            if(response && response.length > 0){
              let time = moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");
              billManager.updateUserLog(response[0].id, time, 'ninepay_users_log').then((response) => {
                props.navigation.navigate('AuthHome');
              })
            }
          })
      } }
    ]);
  }

  const Setting = ({iconname, name, pressMenu}) => {
    return(
      <TouchableOpacity onPress={pressMenu} style={styles.settingrow}>
        <IconFeather name={iconname} size={26} color='#686c6e' style={styles.icon} />
        <Text style={styles.text}>{name}</Text>
        <IconFeather name='chevron-right' size={26} color='#4c6c7d' style={styles.detailicon} />
      </TouchableOpacity>
    )
  }

    return(
      <View style={{flex: 1}}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('my profile')}
        onLeftIconPress={() => {
          props.navigation.navigate('Home');
        }}
      />

      <View style={styles.card}>
        {
          hasProfile ?
            <Image source={{uri: profile}} style={styles.btnIcon} />
          :
            <Image source={require('../../assets/img/contact.png')} style={styles.btnIcon} />
        }
          <View style={{ paddingTop: 0, paddingLeft: 6 }}>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('name')}:&nbsp;&nbsp;&nbsp;&nbsp;</Text>
            <Text style={styles.name}>{agentInfo.AName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('Account')}:&nbsp;</Text>
            <Text style={styles.name}>{agentInfo.AgentID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('amount')}:&nbsp;</Text>
            {
              showAmount ?
              <Text style={styles.name}>{balance}&nbsp;Ks</Text>
              :
              <Text style={styles.star}>******</Text>
            }
            {
              showAmount ?
              <TouchableOpacity onPress={()=> setShowAmount(false)}>
                {
                  <IconFeather name='eye' size={20} color='white' style={{ paddingLeft: 10 }} />
                }
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={()=> setShowAmount(true)}>
                {
                  <IconFeather name='eye-off' size={20} color='white' style={{ paddingLeft: 10 }} />
                }
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <Setting iconname='refresh-ccw' name={IMLocalized('change password')} pressMenu={()=> props.navigation.navigate('ChangePassword')} />
        <Setting iconname='file-text' name={IMLocalized('Terms and Conditions')} pressMenu={()=> props.navigation.navigate('CustomWebView', { title: IMLocalized('Terms and Conditions'), url: 'http://139.59.245.189/termlist?fbclid=IwAR2JaKn0BBNA5IyM3hgOraUGu1LTD3QNqM1tkID3qQM4mdH7QhTjgP4fs4E' })} />
        <Setting iconname='message-square' name={IMLocalized('Help')} pressMenu={()=> props.navigation.navigate('CustomWebView', { title: IMLocalized('Help'), url: 'http://139.59.245.189/helplist?fbclid=IwAR1iCwqP9H0KJwPyZHvllvFmGhNpDuhqcOY15it-Db4FhttuH6FF5Zw9V1E' })} />
        <Setting iconname='info' name={IMLocalized('Information')} pressMenu={()=> props.navigation.navigate('CustomWebView', { title: IMLocalized('Information'), url: 'http://139.59.245.189/feelist?fbclid=IwAR37p89Q0WjyGPtLWcWcuAOSK8Gdo6yp9NC4indoUiHcaUMw_mFj2Oiogak' })} />
        <Setting iconname='log-out' name={IMLocalized('Logout')} pressMenu={()=> goLogout()} />
      </View>

      </View>
    );
}

const styles = StyleSheet.create({
  menu: {
    marginHorizontal: 16,
    marginTop: 40
  },
  icon: {

  },
  text: {
    fontSize: 17,
    color: '#686c6e',
    paddingLeft: 15
  },
  detailicon: {
    position: 'absolute',
    right: 10,
    alignSelf: 'center'
  },
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#3494c7',
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  btnIcon: {
    width: Scales.deviceWidth * 0.2,
    height: Scales.deviceWidth * 0.2,
    marginHorizontal: 10,
    borderRadius: 100
  },
  settingrow: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: '#87898a'
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center'
  },
  label: {
    fontSize: 17,
    color:'white',
    fontFamily: AppStyles.customFonts.klavikaMedium,
   // flex: 3
  },
  name: {
   // flex: 6,
    fontSize: 17,
    color:'white',
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  star: {
     fontSize: 19,
     color:'white',
     fontFamily: AppStyles.customFonts.klavikaMedium
   },
   code: {
    fontSize: 16,
    color:'white',
    paddingBottom: 3,
    fontFamily: AppStyles.customFonts.klavikaMedium
  },
  ks: {
    fontSize: 16,
    color:'white',
    fontFamily: AppStyles.customFonts.klavikaMedium
  } 

});

MyProfileScreen.navigationOptions = () => {
  return {
      headerTitle: 'jjjjj',
      headerTitleStyle: {
        color:'red',
        fontSize: 20
      },
      headerStyle: {
        backgroundColor: 'blue',
      },
  }
}

export default MyProfileScreen;
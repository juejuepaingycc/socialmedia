import React, { useState, useEffect, useRef, Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StatusBar,
  Modal,ToastAndroid,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import Card from '../../components/ui/Card';
import moment from 'moment';
import Card2 from '../../components/ui/Card2';
import InnerHeader from '../../components/ui/innerHeader';
import { Colors, Scales } from '@common';
import styles from './dataPack.styles';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { links } from '../../../StaticData/paymentData';
import eloadManager from '../eloadManager';
import ePINerrorCodes from '../ePINerrorCodes';
import AsyncStorage from '@react-native-community/async-storage';
import eLOADerrorCodes from '../eLOADerrorCodes';
import { notificationManager } from '../../Core/notifications';
import { setPayNotiCount } from '../../store/action/homeData';
import { useDispatch } from 'react-redux';
import billManager from '../billManager';
import { IMFriendItem } from '../../Core/socialgraph/friendships';
import BcryptReactNative from 'bcrypt-react-native';

const DataPackScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [showPackages, setShowPackages] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [token, setToken] = useState('');
  const [packageList, setPackageList] = useState(null);
  const [telenorPackageList, setTelenorPackageList] = useState(null);
  const [mptPackageList, setMPTPackageList] = useState(null);
  const [mytelPackageList, setMytelPackageList] = useState(null);
  const [MectelPackageList, setMectelPackageList] = useState(null);
  const [ooredooPackageList, setOoredooPackageList] = useState(null);
  const [agentInfo, setAgentInfo] = useState({})
  const [serviceCode, setServiceCode] = useState('');
  const [tempItem, setTempItem] = useState();

  const [password, setPassword] = useState('')
  const [wrongCount, setWrongCount] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  var CryptoJS = require("crypto-js");
  const dispatch = useDispatch();

  function backButtonHandler() {
    props.navigation.goBack();
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        //const data = JSON.parse(value);
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setAgentInfo(decryptedData)
      });
    })();
  }, []);

  const changeOperator = (operator) => {
    setLoading(true);
    setShowPackages(true);
    setSelectedOperator(operator);
    console.log("Operator>>"+ operator);
    if(operator == 'TELENOR')
    {
      setServiceCode('9990103')
      setPackageList(telenorPackageList);
      setLoading(false);
    }
    else if(operator == 'MYTEL')
    {
      setServiceCode('9990104')
      setPackageList(mytelPackageList);
      setLoading(false);
    }
    else if(operator == 'MPT')
    {
      setServiceCode('9990101')
      setPackageList(mptPackageList);
      setLoading(false);
    }
    else if(operator == 'OOREDOO')
    {
      setServiceCode('9990102')
      setPackageList(ooredooPackageList);
      setLoading(false);
    }
    else if(operator == 'MECTEL')
    {
      setServiceCode('9990105')
      setPackageList(MectelPackageList);
      setLoading(false);
    }
  }

  const getToken = () => {
    eloadManager.getToken().then((response) => {
      if(response == null){
          setLoading(false)
        }
        else{
          setToken(response.access_token);
          getPackageList(response.access_token);
        }
    });
  }

  const getToken2 = (item) => {
    eloadManager.getToken().then((response) => {
      if(response == null){
          setLoading(false)
        }
        else{
          setToken(response.access_token);
          buyPackage(item, response.access_token);
        }
    });
  }

  const getPackageList = (token1) => {
    eloadManager.getPackageList(token1).then((response) => {
      if(response == null){
          setLoading(false)
        }
        else{
          let mpt = response.PackageList.filter((package1) => package1.OperatorCode == 100)
          let ooredoo = response.PackageList.filter((package1) => package1.OperatorCode == 101)
          let telenor = response.PackageList.filter((package1) => package1.OperatorCode == 102)
          let mectel = response.PackageList.filter((package1) => package1.OperatorCode == 103)
          let mytel = response.PackageList.filter((package1) => package1.OperatorCode == 104)
          setMPTPackageList(mpt);
          setOoredooPackageList(ooredoo);
          setTelenorPackageList(telenor);
          setMectelPackageList(mectel);
          setMytelPackageList(mytel);
          //setPackageList(telenor);
          setLoading(false);
          //setShowPackages(true)
        }
    });
  }

  const onSubmit = (item) => {
    console.log("submit>>"+ JSON.stringify(item));
    setLoading(true);

    if(phoneNo.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Enter phone number'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else{
      let valid = eloadManager.checkPhoneNoValidation(phoneNo, selectedOperator);
      console.log("valid>>"+ valid);
      if(valid == null || valid == false){
        setLoading(false);
        Alert.alert('', 'Invalid Phone Number', [
          { text: IMLocalized('OK'), style: 'default' },
        ]);
      }
      else{
        setTempItem(item);
        setShowPasswordModal(true);
        setLoading(false);
      } 
    }
  }

  const checkPassword = async () => {
    const isSame = await BcryptReactNative.compareSync(password, agentInfo.Password);
    setLoading(true);
    if(isSame){
      setShowPasswordModal(false);
      setPasswordError('');
      getToken2(tempItem);
    }
    else{
      let count = wrongCount + 1;
      setWrongCount(count);
      if(count == 3){
        setShowPasswordModal(false);
        goLogout();
      }
      else{
        setLoading(false);
        setPasswordError(IMLocalized('Wrong password'))
      }
    }
  }

  const goLogout = () => {
    billManager.updateAgentProfile(agentInfo.ID, '', null, null, null, null).then((response) => {
      console.log("");
      setLoading(false);
    });
    AsyncStorage.removeItem('agentInfo');
    AsyncStorage.removeItem('banned');
    dispatch(setPayNotiCount(0));
    setTimeout(()=> {
      props.navigation.navigate('AuthHome');
    }, 1000)
  }
  
  const goInsertTopUp = (item) => {
    let data = {
      "RegDate": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
      "from_account": agentInfo.AgentID,
      "to_account": "-",
      "description": "",
      "out_amount": item.Price,
      "reference": null,
      "from_phone": agentInfo.Contact_Phone,
      "to_phone": phoneNo,
      "ServiceCode": serviceCode,
      "OperatorType": selectedOperator,
      "OperatorPackage": item.OperatorCode,
      "SellingPrice": item.Price,
    }
    console.log("Transfer2 Request>>"+ JSON.stringify(data))
 
    billManager.transferBill2(data, links.transferLink2).then((response) => {
      if(response == null){
        alert("Fail!");
        resetData();
      }
      else{
        if(response.data == true){
          notificationManager.sendPayNotification(
            agentInfo,
            'Nine Pay',
            'Buy package successful',
            'buy_package',
            null
          );
          //Update agent's notiCount
          let count = agentInfo.noti_count;
          if(count){
            count += 1;
          }
          else{
            count = 1;
          }
          dispatch(setPayNotiCount(count));
          AsyncStorage.setItem('payNotiCount', ''+count)
          billManager.updateAgentProfile(agentInfo.ID, null, null, count, null, null).then((response) => {
            console.log("");
          })  
          resetData()
        }
        else{
          if(response.data.message == 'Your Balance is not sufficient'){
            alert(IMLocalized('Your Balance is not sufficient'))
          }
          else{
            alert(response.data.message);
          }
          resetData();
        }
      }
      ToastAndroid.show('Successful', ToastAndroid.SHORT);
    })
  }

  const getRandomOrderNo = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
  }

  const buyPackage = (item, token) => {
    console.log("selected package>>"+ JSON.stringify(item))
    let order = 'O-' + getRandomOrderNo();
    eloadManager.buyPackage(phoneNo, item.PackageCode, order, token).then((response) => {
      if(response){
        if(response.StatusCode == 200){
          goInsertTopUp(item);
        }
        else{
          resetData();
          let code = response.StatusCode;
          Alert.alert('', eLOADerrorCodes[code], [
            { text: IMLocalized('OK'), style: 'default' },
          ]);
        }
      }
      else{
        setLoading(false);
        ToastAndroid.show(IMLocalized('Something went wrong. Try again!'), ToastAndroid.SHORT); 
      }

    })
  }

  const resetData = () => {
    setToken('');
    setLoading(false);
    setPhoneNo('')
  }

  const CorrectView = () => {
    return (
      <View style={styles.checkBg}>
          <IconFeather name='check' size={Scales.deviceWidth * 0.07} color='white' style={styles.checkicon} />
      </View>
    )
  }

  const Package = ({ item }) => {
    return(
      <Card2 style={styles.card2}>
        <View style={styles.nameView}>
          <Text style={styles.nameText}>{item.PackageType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.data}>{item.Volume}</Text>
          <Text style={styles.data}>{item.Validity}</Text>
          <Text style={styles.data}>{item.Price} Ks</Text>
        </View>
        <TouchableOpacity style={styles.buyBtn} onPress={() => {
        onSubmit(item);
        }}>
          <Text style={styles.buyText}>{IMLocalized('BUY NOW')}</Text>
        </TouchableOpacity>
      </Card2>
    );
  }

  return (
    <ScrollView>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Data Packs')}  
        onLeftIconPress={() => {
          props.navigation.navigate('Home')
        }}
      />
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <View style={styles.midContainer}>

        <Modal
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
        </Modal>

        <Modal
          transparent={true}
          visible={showPasswordModal}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setShowPasswordModal(false)
           }}>
          <View style={styles.modalBackground2}>
            <View style={styles.modalView2}>
                <View
                  style={styles.passwordContainer}>
                  {
                    showPassword ?
                    <TextInput
                    style={styles.passwordInput}
                    placeholder={IMLocalized('Password')}
                    maxLength={6}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                    :
                    <TextInput
                    style={styles.passwordInput}
                    placeholder={IMLocalized('Password')}
                    maxLength={6}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                  }
                    
                  {
                    showPassword ?
                    <TouchableOpacity onPress={()=> setShowPassword(false)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye' size={23} color='#3494c7' style={styles.eye} />
                      }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=> setShowPassword(true)} style={styles.eyeView}>
                      {
                        <IconFeather name='eye-off' size={23} color='#3494c7' style={styles.eye} />
                      }
                    </TouchableOpacity>
                  }
                </View>
                {
                  passwordError != ''?
                  <Text style={styles.error}>{passwordError}</Text>
                  :
                  null
                }
                  <View style={styles.btnView}>
                  <TouchableOpacity style={styles.cancelBtn}
                    onPress={() => {
                      setShowPasswordModal(false);
                      setWrongCount(0);
                    }}>
                      <Text style={styles.cancelText}>{IMLocalized('CancelTransfer')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sendBtn}
                    onPress={() => {
                      checkPassword()
                    }}>
                      <Text style={styles.sendText}>{IMLocalized('SendConfirm')}</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>


          <Text style={styles.title}>{IMLocalized('Choose an operator')}</Text>
          <View style={styles.operators}>
            <TouchableOpacity style={styles.operatorView} onPress={() => changeOperator('TELENOR')}>
              <Image
                style={styles.operator}
                source={require('../../assets/img/cv_telenor.png')}
              />
              {
                 selectedOperator == 'TELENOR' && (
                  <CorrectView />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.operatorView} onPress={() => changeOperator('OOREDOO')}>
              <Image
                style={styles.operator}
                source={require('../../assets/img/cv_ooredoo.png')}
              />
              {
                 selectedOperator == 'OOREDOO' && (
                  <CorrectView />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.operatorView} onPress={() => changeOperator('MPT')}>
              <Image
                style={styles.operator}
                source={require('../../assets/img/cv_mpt.png')}
              />
              {
                 selectedOperator == 'MPT' && (
                  <CorrectView />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.operatorView} onPress={() => changeOperator('MYTEL')}>
              <Image
                style={styles.operator}
                source={require('../../assets/img/cv_mytel.jpg')}
              />
              {
                 selectedOperator == 'MYTEL' && (
                  <CorrectView />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.operatorView} onPress={() => changeOperator('MECTEL')}>
              <Image
                style={styles.operator}
                source={require('../../assets/img/cv_mectel.png')}
              />
              {
                 selectedOperator == 'MECTEL' && (
                  <CorrectView />
              )}
            </TouchableOpacity>
          </View>
          <Card style={styles.card}>
          <IconMaterialIcons name='phone-android' size={50} color='white' style={styles.div1} />
          <View style={styles.div2}>
               <Text style={styles.label}>{IMLocalized('Phone Number')}</Text>
               <View style={styles.inputView}>
                  <TextInput
                    style={styles.body}
                    autoCompleteType={'tel'}
                    keyboardType={'phone-pad'}
                    //maxLength={11}
                    onChangeText={(text) => setPhoneNo(text)}
                    value={phoneNo}
                    onBlur={() => {  }}
                  />
                  {/* <TouchableOpacity style={styles.icon}>
                    <IconMaterialIcons name='people' size={30} color='white' />
                  </TouchableOpacity> */}
               </View>

          </View>
        </Card>

        </View>
      </KeyboardAvoidingView>

      
{
  showPackages?
  <View style={{ marginBottom: 10 }}>
    {/* <Text style={styles.text2}>{IMLocalized('Choose data pack')}</Text> */}

    {packageList.map((item, index) => (
        <View key={index}>
            <Package item={item} />
        </View>
      ))}
  </View>
    :
  null
  }
    </ScrollView>
  );
};

export default DataPackScreen;

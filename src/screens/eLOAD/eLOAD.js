import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Modal,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ToastAndroid,
  BackHandler
} from 'react-native';
import { Scales } from '@common';
import moment from 'moment';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import PickerSelect from '../../components/dropDown/dropdown';
import Card from '../../components/ui/Card';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './eLOAD.styles';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { links } from '../../../StaticData/paymentData';
import eloadManager from '../eloadManager';
import eLOADerrorCodes from '../eLOADerrorCodes';
import AsyncStorage from '@react-native-community/async-storage';
import { notificationManager } from '../../Core/notifications';
import { setPayNotiCount } from '../../store/action/homeData';
import { useDispatch } from 'react-redux';
import billManager from '../billManager';
import BcryptReactNative from 'bcrypt-react-native';

const EloadScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [amounts, setAmounts] = useState([]);
  const [serviceCode, setServiceCode] = useState('999010301');
  const [operationCode, setOperationCode] = useState(102);
  const [agentInfo, setAgentInfo] = useState({});

  const [password, setPassword] = useState('')
  const [wrongCount, setWrongCount] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  var CryptoJS = require("crypto-js");
  const dispatch = useDispatch();
  const telenorAmounts = [
    { label: '200', value: '200' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '3000', value: '3000' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' }
  ];
  const mytelAmounts = [
    { label: '200', value: '200' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '3000', value: '3000' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' }
  ];
  const MECTELAmounts = [
    { label: '1000', value: '1000' },
    { label: '3000', value: '3000' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' },
    { label: '20000', value: '20000' },
    { label: '30000', value: '30000' }
  ];
  const MPTAmounts = [
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '2000', value: '2000' },
    { label: '3000', value: '3000' },
    { label: '4000', value: '4000' },
    { label: '5000', value: '5000' },
    { label: '6000', value: '6000' },
    { label: '7000', value: '7000' },
    { label: '8000', value: '8000' },    
    { label: '9000', value: '9000' },
    { label: '10000', value: '10000' },
    { label: '20000', value: '20000' },
    { label: '30000', value: '30000' },
    { label: '40000', value: '40000' },
    { label: '50000', value: '50000' }
  ];
  const OoredooAmounts = [
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '2000', value: '2000' },
    { label: '3000', value: '3000' },
    { label: '5000', value: '5000' },
    { label: '6000', value: '6000' },
    { label: '10000', value: '10000' },
    { label: '20000', value: '20000' },
    { label: '30000', value: '30000' },
    { label: '50000', value: '50000' },
  ];

  const changeAmount = (value) => {
    setAmount(value);
  }

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
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setAgentInfo(decryptedData)
      });
    })();
  }, []);

  const changeOperator = (operator) => {
    setSelectedOperator(operator);
    if(operator == 'TELENOR')
    {
      setAmounts(telenorAmounts);
      setServiceCode('999010301')
      setOperationCode(102)
    }
    else if(operator == 'MYTEL')
    {
      setAmounts(mytelAmounts);
      setServiceCode('999010401')
      setOperationCode(104)
    }
    else if(operator == 'MPT')
    {
      setAmounts(MPTAmounts);
      setServiceCode('999010101')
      setOperationCode(100)
    }
    else if(operator == 'OOREDOO')
    {
      setAmounts(OoredooAmounts);
      setServiceCode('999010201')
      setOperationCode(101)
    }
    else if(operator == 'MECTEL')
    {
      setAmounts(MECTELAmounts);
      setServiceCode('999010501')
      setOperationCode(103)
    }
  }

  const onSubmit = () => {
    setLoading(true)
    if(selectedOperator == ''){
      setLoading(false)
      Alert.alert('', IMLocalized('Choose Operator'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else if(phoneNo.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Enter phone number'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else if(amount.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Choose amount'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else{
      let valid = eloadManager.checkPhoneNoValidation(phoneNo, selectedOperator);
      if(valid){
        setShowPasswordModal(true);
        setLoading(false);
      }
      else{
        setLoading(false);
        Alert.alert('', 'Invalid Phone Number', [
          { text: IMLocalized('OK'), style: 'default' },
        ]);
      }
    }
  }

  const checkPassword = async () => {
    const isSame = await BcryptReactNative.compareSync(password, agentInfo.Password);
    setLoading(true);
    if(isSame){
      setShowPasswordModal(false);
      setPasswordError('');
      getToken();
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

  const getToken = () => {
    eloadManager.getToken().then((response) => {
      if(response == null){
          setLoading(false)
      }
      else{
          setToken(response.access_token);
          goTopUp(response.access_token);
      }
    });
  }

  const goTopUp = (token1) => {
    let order = 'O-' + getRandomOrderNo();
    eloadManager.eLOADTopUp(phoneNo, amount, order, token1).then((response) => {

    //eloadManager.eLOADTopUp(phoneNo, 1000, 'B-344773', token1).then((response) => {
    if(response == null){
      setLoading(false)
    }
    else{
      console.log("topUP response>>"+ JSON.stringify(response));
      if(response.StatusCode == 200){
        setLoading(false);
        setToken('');
        setSelectedOperator('');
        setAmounts([])
        ToastAndroid.show('TopUp Successful', ToastAndroid.SHORT); 
        goInsertTopUp()
      }
      else{
        setLoading(false);
        setPhoneNo('');
        setToken('');
        setSelectedOperator('');
        setAmounts([]);
        setAmount('');
        let code = response.StatusCode;
        Alert.alert('', eLOADerrorCodes[code], [
          { text: IMLocalized('OK'), style: 'default' },
        ]);
      }
    }
  });
  }

  const getRandomOrderNo = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
  }

  const goInsertTopUp = () => {
    let data = {
      "RegDate": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
      "from_account": agentInfo.AgentID,
      "to_account": "-",
      "description": "",
      "out_amount": amount,
      "reference": null,
      "from_phone": agentInfo.Contact_Phone,
      "to_phone": phoneNo,
      "ServiceCode": serviceCode,
      "OperatorType": selectedOperator,
      "OperatorPackage": operationCode,
      "SellingPrice": amount,
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
            'Topup successful',
            'eload_topup',
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
      setPhoneNo('');
      //ToastAndroid.show('Successful', ToastAndroid.SHORT);
    })
  }

  const resetData = () => {
    setPhoneNo('');
  }

  const CorrectView = () => {
    return (
      <View style={styles.checkBg}>
          <IconFeather name='check' size={Scales.deviceWidth * 0.07} color='white' style={styles.checkicon} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('ELOAD')}  
        onLeftIconPress={() => {
          props.navigation.navigate('Home')
        }}
      />
      <KeyboardAvoidingView behavior={'padding'}>
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

          {/* <View style={styles.titleView}> */}
          <Text style={styles.title}>{IMLocalized('Choose an operator')}</Text>
          <View style={styles.operators}>
          {/* <Operator img={require('../../assets/img/cv_telenor.png')} pressOperator={() => changeOperator('TELENOR')} />
            <Operator img={require('../../assets/img/cv_ooredoo.png')} pressOperator={() => changeOperator('OOREDOO')} />
            <Operator img={require('../../assets/img/cv_mpt.png')} pressOperator={() => changeOperator('MPT')} />
            <Operator img={require('../../assets/img/cv_mytel.jpg')} pressOperator={() => changeOperator('MYTEL')} />
            <Operator img={require('../../assets/img/cv_mectel.png')} pressOperator={() => changeOperator('MECTEL')} />
          */}
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

{/* 
          <View style={styles.correctview}>
       
               {
                 selectedOperator == 'TELENOR' ?
                 <View style={styles.correct}>
              <Image
                style={styles.check}
                source={require('../../assets/img/correct.png')}
              />
              </View>
                 :
                 <View style={styles.incorrect} />
               }
          
              {
                 selectedOperator == 'OOREDOO' ?
                 <View style={styles.correct}>
              <Image
                style={styles.check}
                source={require('../../assets/img/correct.png')}
              />
                   </View>
                 :
                 <View style={styles.incorrect} />
               }
     
              {
                 selectedOperator == 'MPT' ?
                     
              <View style={styles.correct}>
              <Image
                style={styles.check}
                source={require('../../assets/img/correct.png')}
              />
              </View>
                 :
                 <View style={styles.incorrect} />
               } 

            
              {
                 selectedOperator == 'MYTEL' ?
                 <View style={styles.correct}>
              <Image
                style={styles.check}
                source={require('../../assets/img/correct.png')}
              />
              </View>
                 :
                 <View style={styles.incorrect} />
               } 
     
            
              {
                 selectedOperator == 'MECTEL' ?
                 <View style={styles.correct}>
              <Image
                style={styles.check}
                source={require('../../assets/img/correct.png')}
              />
              </View>
                 :
                 <View style={styles.incorrect} />
               } 
          </View> */}

    <Card style={styles.card1}>
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

    <Card style={styles.card1}>
          <View style={styles.div2}>
              <Text style={styles.label}>{IMLocalized('Choose amount')}</Text>
              {
                amounts.length > 0 ?
                <PickerSelect
                  //style={styles.body}
                  onValueChange={(value) => changeAmount(value)}
                  items={amounts}
                  placeholder={{
                    label: IMLocalized('Select amount'),
                    value: null,
                    color: '#3494c7',
                  }}
                />
                :
                <TouchableOpacity style={styles.row} onPress={()=> {
                  Alert.alert('', IMLocalized('Choose Operator'), [
                    { text: IMLocalized('OK'), style: 'default' },
                  ]);
                }
                }>
                  <Text style={styles.amt}>{IMLocalized('Select amount')}</Text>
                  <IconAnt name='caretdown' size={8} color='black' />
                </TouchableOpacity>
              }
                
          </View>
   </Card>


        </View>

      </KeyboardAvoidingView>

      
      <TouchableOpacity style={styles.btn}
        onPress={() => {
          onSubmit();
        }}>
        <Text style={styles.btnText}>{IMLocalized('Top Up')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EloadScreen;

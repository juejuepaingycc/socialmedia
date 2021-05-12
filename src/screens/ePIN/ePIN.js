import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  Alert,
  ToastAndroid,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import { Scales } from '@common';
import moment from 'moment';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import billManager from '../billManager';
import eLOADerrorCodes from '../eLOADerrorCodes';
import eloadManager from '../eloadManager';
import PickerSelect from '../../components/dropDown/dropdown';
import Card from '../../components/ui/Card';
import styles from './ePIN.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { links } from '../../../StaticData/paymentData';
import AsyncStorage from '@react-native-community/async-storage';
import { notificationManager } from '../../Core/notifications';
import { setPayNotiCount } from '../../store/action/homeData';
import { useDispatch } from 'react-redux';
import BcryptReactNative from 'bcrypt-react-native';

const EpinScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [amounts, setAmounts] = useState([]);
  const [cardTypeSubCategoryCode, setCardTypeSubCategoryCode] = useState(0);
  const [agentInfo, setAgentInfo] = useState({})
  const [serviceCode, setServiceCode] = useState('999010302');
  const [operationCode, setOperationCode] = useState(102);

  const [password, setPassword] = useState('')
  const [wrongCount, setWrongCount] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  var CryptoJS = require("crypto-js");
  const dispatch = useDispatch();
  const telenorAmounts = [
    { label: '1000', value: '1000', code: 220 },
    { label: '3000', value: '3000', code: 221 },
    { label: '5000', value: '5000', code: 222 },
    { label: '6000', value: '6000', code: 223 },
    { label: '10000', value: '10000', code: 224 }
  ];
  const mytelAmounts = [
    { label: '1000', value: '1000', code: 720 },
    { label: '3000', value: '3000', code: 721 },
    { label: '5000', value: '5000', code: 722 },
    { label: '10000', value: '10000', code: 723 }
  ];
  const MECTELAmounts = [
    { label: '1000', value: '1000', code: 245 },
    { label: '3000', value: '3000', code: 246 },
    { label: '5000', value: '5000', code: 247 },
    { label: '10000', value: '10000', code: 248 }
  ];
  const MPTAmounts = [
    { label: '1000', value: '1000', code: 200 },
    { label: '3000', value: '3000', code: 201 },
    { label: '5000', value: '5000', code: 202 },
    { label: '10000', value: '10000', code: 203 }
  ];
  const OoredooAmounts = [
    { label: '1000', value: '1000', code: 210 },
    { label: '3000', value: '3000', code: 211 },
    { label: '5000', value: '5000', code: 212 },
    { label: '10000', value: '10000', code: 213 },
    { label: '10000', value: '20000', code: 214 }
  ];

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
      setServiceCode('999010302')
      setOperationCode(102)
    }
    else if(operator == 'MYTEL')
    {
      setAmounts(mytelAmounts);
      setServiceCode('999010402')
      setOperationCode(104)
    }
    else if(operator == 'MPT')
    {
      setAmounts(MPTAmounts);
      setServiceCode('999010102')
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
      setServiceCode('999010502')
      setOperationCode(103)
    }
  }

  const changeAmount = (value) => {
    setAmount(value);
    for(let i= 0;i<amounts.length;i++){
      if(amounts[i].label == value){
        setCardTypeSubCategoryCode(amounts[i].code);
        console.log("card code>>"+ amounts[i].code);
      }
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
    else if(amount.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Choose amount'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else{
      setShowPasswordModal(true);
      setLoading(false);
    }
  }

  const insertIntoLedger = (sellingPrice) => {
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
      "SellingPrice": sellingPrice,
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
            'epin_topup',
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
          alert(response.data.message);
          resetData();
        }
      }
      setPhoneNo('');
      ToastAndroid.show('Successful', ToastAndroid.SHORT);
    })
  }

  const getToken = () => {
    eloadManager.getEPINToken().then((response) => {
      if(response == null){
          setLoading(false)
        }
        else{
          setToken(response.access_token);
          goBuyCard(response.access_token);
        }
    });
  }

  const getRandomOrderNo = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
  }

  const resetData = () => {
    setSelectedOperator('');
    setAmounts([]);
    setAmount('');
    setLoading(false)
  }
 // cardType, balanceType, currencyCode, orderNo, token 
  const goBuyCard = (token1) => {
    let order = 'O-' + getRandomOrderNo();
    //balanceType 500 = Prepaid Card
    //currencyCode 100 = MMK
    eloadManager.buyCard(cardTypeSubCategoryCode, 500, 100, order, token1).then((response) => {
      if(response == null){
        resetData();
      }
      else{
        console.log("goBuyCard response>>"+ JSON.stringify(response));
        if(response.StatusCode == 200){
           setToken('');
           setOrderNo('');
           setShowPin(true);
           setPinNumber(response.PinNumber);
           setSelectedOperator('');
           setAmounts([]);
           setAmount('');
          ToastAndroid.show('Successful', ToastAndroid.SHORT); 
           getSellingPrice();
        }
        else{
          resetData();
          let code = response.StatusCode;
          Alert.alert('', eLOADerrorCodes[code], [
            { text: IMLocalized('OK'), style: 'default' },
          ]);
        }
      }
    });
  }

  const getSellingPrice = () => {
    eloadManager.getEPINToken().then((response) => {
      if(response == null){
          setLoading(false)
        }
        else{
          eloadManager.getSellingPriceOfCard(cardTypeSubCategoryCode, 100, response.access_token).then((response) => {
            insertIntoLedger(response.SellingPrice)
          })
        }
    });
  }

  const Operator = ({selected, img, pressOperator}) => {
    return(
        <TouchableOpacity style={styles.operatorView} onPress={pressOperator}>
          <Image
            style={styles.operator}
            source={img}
          />
          {
            selected && (
              <CorrectView />
            )
          }
        </TouchableOpacity>
    );
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
  
  const CorrectView = () => {
    return (
      <View style={styles.checkBg}>
          <IconFeather name='check' size={Scales.deviceWidth * 0.07} color='white' style={styles.checkicon} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
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
          animationType={'none'}
          visible={showPin}
          onRequestClose={() => { 
            setShowPin(false)
            setPinNumber('');
            }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Icon name='check' size={Scales.deviceWidth * 0.08} color='#3494c7' style={styles.successfulicon} />
              <Text style={styles.title}>Pin Number</Text>
              <Text style={styles.number}>{pinNumber}</Text>
              <TouchableOpacity style={styles.btnView} onPress={() => {
                setPinNumber('');
                setShowPin(false)
              }}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
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
                    <TextInput
                    style={styles.passwordInput}
                    placeholder={IMLocalized('Password')}
                    maxLength={6}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                </View>
                {
                  passwordError != ''?
                  <Text style={styles.error}>{passwordError}</Text>
                  :
                  null
                }
                  <View style={styles.pwbtnView}>
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
{/* 
          <View style={styles.titleView}>
            <Text style={styles.choose}>{IMLocalized('Choose an operator')}</Text>
            <Text style={[styles.choose, { fontWeight: 'bold' }]}>{selectedOperator}</Text>
          </View> */}
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
          <View style={styles.div2}>
               <Text style={styles.label}>{IMLocalized('Choose amount')}</Text>

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

export default EpinScreen;

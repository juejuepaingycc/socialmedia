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
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  FlatList
} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import { setPayNotiCount } from '../../store/action/homeData';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Card from '../../components/ui/Card';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './qrTransferBill.styles';
import moment from 'moment';
import { notificationManager } from '../../Core/notifications';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import billManager from '../billManager';
import BcryptReactNative from 'bcrypt-react-native';
import { links } from '../../../StaticData/paymentData';

const qrTransferScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [agentInfo, setAgentInfo] = useState('')
  const [otherAgentInfo, setOtherAgentInfo] = useState('')
  const [qrID, setQrID] = useState('')
  const [editAmount, setEditAmount] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [wrongCount, setWrongCount] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const shopping = props.navigation.getParam('shopping');
  console.log("Shopping>>", shopping)
  const dispatch = useDispatch();
  var CryptoJS = require("crypto-js");

  function backButtonHandler() {
    if(shopping){
      console.log("From Shopping")
      props.navigation.navigate('Shopping');
    }
    else
      props.navigation.navigate('Home')
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  const onSubmit = () => {
    setLoading(true)
    if(amount.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Enter amount'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else if(parseInt(amount) == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Please Enter Valid Amount'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else if(otherAgentInfo.Contact_Phone == agentInfo.Contact_Phone){
      setLoading(false)
      Alert.alert('', IMLocalized("You can't transfer money to yourself"), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else{
      setLoading(false)
      setShowModal(true);
    }
  }

 const checkPassword = async () => {
  const isSame = await BcryptReactNative.compareSync(password, agentInfo.Password);
    
   if(isSame){
     setShowPasswordModal(false);
     setPasswordError('');
     setLoading(true);
     submitTransfer();
   }
   else{
     let count = wrongCount + 1;
     setWrongCount(count);
     if(count == 3){
       setShowPasswordModal(false);
       goLogout();
     }
     else{
       setPasswordError('Password is wrong. Try again.')
     }
   }
 }

 const goLogout = () => {
  billManager.updateAgentProfile(agentInfo.ID, '', null, null, null, null).then((response) => {
    console.log("");
  });
  AsyncStorage.removeItem('agentInfo');
  AsyncStorage.removeItem('banned');
  dispatch(setPayNotiCount(0));
  setTimeout(()=> {
    props.navigation.navigate('AuthHome');
  }, 1000)
}

  const submitTransfer = () => {
      let data = {
        "RegDate": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
        "from_account": agentInfo.AgentID,
        "to_account": otherAgentInfo.AgentID,
        "description": description,
        "out_amount": parseInt(amount),
        "reference": null,
        "from_phone": agentInfo.Contact_Phone,
        "to_phone": otherAgentInfo.Contact_Phone
      }
      console.log("QR Transfer Request>>"+ JSON.stringify(data))
   
      billManager.transferBill(data, links.transferLink).then((response) => {
        if(response == null){
          alert("Transfer bill fail!");
          resetData();
        }
        else{
          if(response.data == true){
          //success, send noti to both user
          sendNoti(agentInfo, 'Payment successful', 'transfer_bill')
          sendNoti(otherAgentInfo, agentInfo.AName + ' transferred bill.', 'receive_bill')

            //Update both agent's notiCount
             updateAgentNotiCount(agentInfo, true)
             updateAgentNotiCount(otherAgentInfo, false)
            setTimeout(()=> {
              props.navigation.navigate('QRTransferSuccess',{
                userName: otherAgentInfo.AName,
                amount
              });
              resetData();
            }, 500)
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
      });
  }

  const sendNoti = (agent, msg, type) => {
    notificationManager.sendPayNotification(
      agent,
      'Nine Pay',
      msg,
      type,
      null
    );
  }

  const updateAgentNotiCount = (agent, status) => {
    let count = agent.noti_count;
    if(count)
      count += 1;
    else
      count = 1;
    if(status){
      dispatch(setPayNotiCount(count));
      AsyncStorage.setItem('payNotiCount', ''+count)
    }
    billManager.updateAgentProfile(agent.ID, null, null, count, null, null).then((response) => {
    }) 
  }

  const resetData = () => {
    setLoading(false);
    setAmount('');
    setOtherAgentInfo('');
  }

  useEffect(() => {
    let passData = props.navigation.state.params;
    setQrID(passData.data.AgentID);
    if(passData.data.amount != '' && passData.data.amount != null && passData.data.amount != undefined){
      setAmount(passData.data.amount);
      setEditAmount(false);
    }

    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('decryptedData>>'+ JSON.stringify(decryptedData));

        billManager.getAgentWithPhoneNo(decryptedData.Contact_Phone).then((response) => {
         setAgentInfo(response[0]);
        });
      });
    })(); 

    billManager.getAgentWithAgentID(passData.data.AgentID).then((response) => {
      if(response == null || response.length == 0){

        }
        else{
          setOtherAgentInfo(response[0])
        }
    }); 

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title='Remit'
        onLeftIconPress={() => {
          if(shopping)
            props.navigation.navigate('Shopping');
          else
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
          visible={showModal}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setShowModal(false)
           }}>
          <View style={styles.modalBackground2}>

           <View style={styles.modalView}>

            <View style={styles.row}>
              <Text style={styles.label}>{IMLocalized('Receiver')}:</Text>
              <Text style={styles.value}>{otherAgentInfo.AName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{IMLocalized('ToTransfer')}:</Text>
              <Text style={styles.value}>{otherAgentInfo.Contact_Phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{IMLocalized('amount')}:</Text>
              <View style={{ paddingTop: 4, flex: 2, flexDirection: 'row' }}>
                <Text style={styles.value2}>{parseInt(amount)}</Text>
                <Text style={styles.kyat}>&nbsp;Ks</Text>
              </View>
            </View>

            <View
              style={styles.phoneInputContainer2}>
                <TextInput
                style={styles.body2}
                placeholder={IMLocalized('Description')}
                maxLength={20}
                onChangeText={(text) => setDescription(text)}
                value={description}
                onBlur={() => {  }}
                multiline
                numberOfLines={3}
                textAlignVertical='top'
              />
              </View>
              <View style={styles.sendBtnView}>
                <TouchableOpacity style={styles.cancelBtn}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                    <Text style={styles.cancelText}>{IMLocalized('CancelTransfer')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendBtn}
                  onPress={() => {
                    setShowModal(false);
                    setShowPasswordModal(true);
                  }}>
                    <Text style={styles.sendText}>{IMLocalized('SendConfirm')}</Text>
                </TouchableOpacity>
              </View>
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
              <Text style={styles.error}>{passwordError}</Text>
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
                    checkPassword();
                  }}>
                    <Text style={styles.sendText}>{IMLocalized('SendConfirm')}</Text>
                </TouchableOpacity>
              </View>
          </View>
          </View>
        </Modal>

          <Card style={styles.card}>
            <View
              style={{
                ...styles.phoneInputContainer,
                borderColor: 'gray',
              }}>
               <TextInput
                style={styles.body}
                placeholder={IMLocalized('amount')}
                //autoCompleteType={'tel'}
                keyboardType='numeric'
                editable={editAmount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
                value={amount}
                onBlur={() => { }}
                contextMenuHidden={true}
              />
              <Text style={styles.kyat}>Ks</Text>
              </View>
          </Card>

          <View style={styles.loginBtnSection}>
            <View style={styles.loginBtnContainer}>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    activeOpacity={0.7}
                    onPress={onSubmit}>
                    <Text style={styles.loginBtnText}>{IMLocalized('Transfer')}</Text>
                  </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default qrTransferScreen;

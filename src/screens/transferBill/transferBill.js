import React, { useState, useEffect, useRef, Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
  Image,
  ToastAndroid,
  ScrollView,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import moment from "moment";
import { setPayNotiCount } from '../../store/action/homeData';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import Card from '../../components/ui/Card';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './transferBill.styles';
import { links } from '../../../StaticData/paymentData';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import billManager from '../billManager';
import { notificationManager } from '../../Core/notifications';
import BcryptReactNative from 'bcrypt-react-native';
import IconFeather from 'react-native-vector-icons/Feather';

const transferScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [amount, setAmount] = useState('');
  const [agentInfo, setAgentInfo] = useState('')
  const [otherAgentInfo, setOtherAgentInfo] = useState('')
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [description, setDescription] = useState('')
  const [recentContacts, setRecentContacts] = useState([]);
  const [password, setPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [wrongCount, setWrongCount] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const countries = [
    {name:'Myanmar', code: '+95', img: require('../../../assets/icons/mm.png')},
    {name:'China', code: '+86', img: require('../../../assets/icons/cn.png')},
    {name:'Thailand', code: '+66', img: require('../../../assets/icons/th.png')}
  ];
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const dispatch = useDispatch();
  var CryptoJS = require("crypto-js");

  function backButtonHandler() {
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
    if(phoneNo.length == 0){
      setLoading(false)
      Alert.alert('', IMLocalized('Enter phone number'), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else if(amount.length == 0){
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
    else if((selectedCountry.code+phoneNo) == ('+'+agentInfo.Contact_Phone)){
      setLoading(false)
      Alert.alert('', IMLocalized("You can't transfer money to yourself"), [
        { text: IMLocalized('OK'), style: 'default' },
      ]);
    }
    else{
      let phone = selectedCountry.code + phoneNo;
      phone = phone.substring(1, phone.length)
      billManager.getAgentWithPhoneNo(phone).then((response) => {
        if(response == null || response.length == 0){
          setLoading(false)
          Alert.alert('', IMLocalized('There is no account with this phone number!'), [
            { text: IMLocalized('OK'), style: 'default' },
          ]);
        }
        else{
            setOtherAgentInfo(response[0]);
            setLoading(false);
            setShowModal(true);
        }
      });
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
        setPasswordError(IMLocalized('Wrong password'))
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
    let phone = selectedCountry.code + phoneNo;
      phone = phone.substring(1, phone.length)
    let data = {
      "RegDate": moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm"),
      "from_account": agentInfo.AgentID,
      "to_account": otherAgentInfo.AgentID,
      "description": description,
      "out_amount": parseInt(amount),
      "reference": null,
      "from_phone": agentInfo.Contact_Phone,
      "to_phone": phone
    }
    console.log("Transfer Request>>"+ JSON.stringify(data))
 
    billManager.transferBill(data, links.transferLink).then((response) => {
      if(response == null){
        Alert.alert('', IMLocalized('Something went wrong. Try again!'), [
          { text: IMLocalized('OK'), style: 'default' },
        ]);
        resetData();
      }
      else{
        if(response.data == true){
            //success, send noti to both user
            sendNoti(agentInfo, 'Payment successful', 'transfer_bill')
            sendNoti(otherAgentInfo, agentInfo.AName + ' transferred bill.', 'receive_bill')

            //Update both agent's notiCount
            updateAgentNotiCount(agentInfo, true);
            updateAgentNotiCount(otherAgentInfo, false);
            setTimeout(()=> {
              props.navigation.navigate('TransferSuccess',{
                userName: otherAgentInfo.AName,
                amount
              });
              resetData();
            }, 500)
        }
        else{
          if(response.data.message == 'Your Balance is not sufficient'){
            Alert.alert('', IMLocalized('Your Balance is not sufficient'), [
              { text: IMLocalized('OK'), style: 'default' },
            ]);
          }
          else{
            Alert.alert('', response.data.message, [
              { text: IMLocalized('OK'), style: 'default' },
            ]);
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
    setPasswordError('');
    setPassword('');
    setDescription('');
    setPhoneNo('');
  }

  const chooseCountry = (country) => {
    setCountryModalVisible(false)
    setSelectedCountry(country);
    console.log("Selected Country>>"+ JSON.stringify(country));
  };

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('decryptedData>>'+ JSON.stringify(decryptedData));

        billManager.getAgentWithPhoneNo(decryptedData.Contact_Phone).then((response) => {
          setAgentInfo(response[0]);  
          billManager.getRecentTransferLedger(response[0].AgentID, 100).then((response) => {
            if(response != null){

              let temp = [];
              for(let i =0;i < response.length;i++){
                if(temp.length > 0){
                 if(temp.indexOf(response[i].to_account < 0 && temp.length < 10)){
                  temp.push(response[i].to_account)
                 }
                }
                else{
                  temp.push(response[i].to_account)
                }
              }
              billManager.getRecentContacts(temp).then((response) => {
                if(response != null){
                  setRecentContacts(response);
                }
                else{
                  setRecentContacts([]);
                }
              })
            }
            else{
              setRecentContacts([])
            }
          })
        });
      });
    })(); 
  }, []);

  const RecentContact = ({ item, chooseRecentContact }) => {
    return(
      <TouchableOpacity onPress={chooseRecentContact} style={styles.recentContactView}>
        <Image source={require('../../assets/img/contact.png')} style={styles.recentImage} />
        <View style={styles.recentNameView}>
          <Text style={styles.recentContactName}>{item.AName}</Text>
          <Text style={styles.recentPhoneNumber}>{item.Contact_Phone}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Transfer')}
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
                      checkPassword();
                    }}>
                      <Text style={styles.sendText}>{IMLocalized('SendConfirm')}</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={countryModalVisible}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setCountryModalVisible(false)
           }}>
            <View style={styles.countrymodalBackground}>
              <View style={styles.countrymodalView}>
                {
                  countries.map((country)=> {
                    return (
                      <TouchableOpacity style={styles.countries} onPress={()=> chooseCountry(country)}>
                        <Text style={{ color:'black' }}>{country.name}</Text>
                        <Text style={{ color:'black' }}>{country.code}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
                <TouchableOpacity style={[styles.countries, styles.cancel]} onPress={()=> setCountryModalVisible(false)}>
                  <Text style={styles.countrycancelText}>{IMLocalized('CancelLanguage')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Card style={styles.card}>
            <View
              style={{
                ...styles.phoneInputContainer,
              }}>
              <View style={{ borderColor: '#3494c7', flexDirection: 'row' }}>
                <TouchableOpacity style={styles.imgcontainer} onPress={()=> setCountryModalVisible(true)}>
                    <Image source={selectedCountry.img} style={styles.countryImg} />
                    <Text style={styles.code}>{selectedCountry.code}</Text>
                  </TouchableOpacity>
                <TextInput
                style={styles.body}
                placeholder={IMLocalized('Phone Number')}
                autoCompleteType={'tel'}
                keyboardType={'phone-pad'}
                //maxLength={11}
                onChangeText={(text) => setPhoneNo(text)}
                value={phoneNo}
                onBlur={() => {  }}
              />
              </View>
             {/* */}
            </View>

            {
              showError ?
              <View>
                <Text style={{ color: 'red' }}>{IMLocalized('There is no account with this phone number!')}</Text>
              </View>
              :
            null
            }
           
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
                onChangeText={(text) => {
                  setAmount(text.replace(/[^0-9]/g, ''))
                }}
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
                    onPress={() => {
                      onSubmit();
                    }}>
                    <Text style={styles.loginBtnText}>{IMLocalized('Transfer')}</Text>
                  </TouchableOpacity>
            </View>
          </View>

        {
          recentContacts.length > 0 && (
            <ScrollView style={styles.scroll}>
              <Text style={styles.recent}>{IMLocalized('Recent')}</Text>
              <FlatList
                    data={recentContacts}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <RecentContact item={item} chooseRecentContact={() => {
                        let phone = item.Contact_Phone.substring(2, item.Contact_Phone.length)
                        setPhoneNo(phone);
                      }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    />
          </ScrollView>
          )
        }
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default transferScreen;

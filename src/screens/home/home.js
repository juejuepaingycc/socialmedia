import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
  BackHandler,
  Modal,
  NativeModules 
} from 'react-native';
import billManager from '../billManager';
import { setPayNotiCount } from '../../store/action/homeData';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import {useSelector, useDispatch} from 'react-redux';
import ImageSlider from '../../components/imageSlider/imageSlider';
import CustomHeader from '../../components/ui/CustomHeader';
import ServiceTile from '../../components/ui/ServiceTile';
import {Colors, Scales} from '@common';
import styles from './home.styles';
//import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { fcmService } from '../../FCMService';
import { localNotificationService } from '../../LocalNotificationService';
import moment from "moment";

const HomeScreen = (props) => {
  const recentContact = useSelector((state) => state.HomeData.recentContact);
  const services = useSelector((state) => state.HomeData.services);
  const notiCount = useSelector((state) => state.HomeData.payNotiCount);
  //const [notiCount, setNotiCount] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [agentInfo, setAgentInfo] = useState();
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();
  var CryptoJS = require("crypto-js");

  function backButtonHandler() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(()=> {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Nine Pay BackgroundMessage>>"+ JSON.stringify(remoteMessage))
      if(remoteMessage.data.type == 'receive_bill'){
        increateCount();
      } 
    });
  })

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token){
      console.log("[NinePay] Token Refresh: ", token);
    }

    function onNotification(notify){
      console.log("[NinePay] onNotification: ", notify);

 
    }

    function onOpenNotification(notify){
     console.log("[NinePay] onOpenNotification: " + JSON.stringify(notify));

     if(notify.type == 'receive_bill'){
      increateCount()
     }

    }
  }, []);

  const increateCount = () => {
    AsyncStorage.getItem('payNotiCount').then((value) => {
      console.log("Old NotiCount>>" + value);
      let count;
      if(value){
        count = parseInt(value) + 1;
      }
      else{
        count = 1;
      }
      console.log("Updated Count>>" + count)
      AsyncStorage.setItem('payNotiCount', ''+count)
      dispatch(setPayNotiCount(count));
    })
  }

  useEffect(async() => { 
    try {
      const settings = await messaging().requestPermission();
      if (settings) {
        const token = await messaging().getToken();
        console.log("Firebase Token 2>>" + token);

        AsyncStorage.getItem("agentInfo").then((value) => {
          var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
          var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log('decryptedData>>'+ JSON.stringify(decryptedData));

          billManager.getAgentWithPhoneNo(decryptedData.Contact_Phone).then((response) => {
            if(response == null){

            }
            else{
              console.log("Agent>>"+ JSON.stringify(response[0]));
              setAgentInfo(response[0])
              let time =  moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");     
              updateAgentUser(response[0].ID, token, time);
              AsyncStorage.setItem('payNotiCount', ''+response[0].noti_count)
              dispatch(setPayNotiCount(response[0].noti_count));
            }
           });
       });
      }
      else{
        console.log("else condition")
      }
    }
    catch (error) {
      console.log("Error>>"+ JSON.stringify(error));
    }
  }, []);

  const updateAgentUser = (id, token, time) => {
    billManager.updateAgentProfile(id, token, time, null, null, null).then((response) => {
      console.log("");
    })
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text></Text>;
  }
  if (hasPermission === false) {
    return <Text></Text>;
  }

  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }


  const onServicePress = (item) => {
    console.log(item);
    if(item.name == 'Profile'){
      props.navigation.navigate('myProfile')
    }
    else if(item.name == 'Postpaid'){
      props.navigation.navigate('BalanceHistory');
    }
    else if(item.name == 'TopUp'){
      props.navigation.navigate('eLOAD');
    }
    else if(item.name == 'DataPacks'){
      props.navigation.navigate('DataPack');
    }
    else if(item.name == 'ElectricityBill'){
      props.navigation.navigate('BillSections', { title: IMLocalized('Electricity Bill')});
    }
    else if(item.name == 'WaterBill'){
      props.navigation.navigate('BillSections', { title: IMLocalized('Water Bill')});
    }
    else if(item.name == 'Prepaid'){
      props.navigation.navigate('ListWithIcon', { title: IMLocalized('prepaid')});
    }
    else if(item.name == 'TravelTours'){
      props.navigation.navigate('TravelToursList');
    }
    else if(item.name == 'ExchangeRate'){
      //props.navigation.navigate('ExchangeRate');
      showToast(IMLocalized('Exchange Rate'))
    } 
    else if(item.name == 'Pay to Shop'){
      props.navigation.navigate('Shopping');
    }
    else if(item.name == 'Shopping'){
      props.navigation.navigate('ShoppingWebView', { title: IMLocalized('Shopping'), url: 'http://128.199.161.186/myawaddy/index.php/shopping-list/?fbclid=IwAR1oxo807D9axBSa1aMKwtePP55QJm-bo6LPe2lE5opi2LiMt3NtsOOZmj4' })
    }
    else{
      showToast(IMLocalized('Coming Soon'));
    }
  };
  const onSuccess = (e) => {
   // alert(e.data);
   console.log("qr result>"+ JSON.stringify(e.data))

   let data = JSON.parse(e.data);
   console.log("anme>>"+ JSON.stringify(data))
    setShowQR(false);
    props.navigation.navigate('qrTransfer', {data: data})
  };

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <Modal
          animationType="slide"
          //transparent={true}
          hardwareAccelerated
          visible={showQR}
          style={{ height: Scales.deviceHeight }}
          onRequestClose={() => {
            setShowQR(false);
          }}>
        <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : onSuccess}
              style={[StyleSheet.absoluteFill, styles.qrcontainer]}
            >
              <View style={styles.layerTop} />
              <Text style={styles.scan}>{IMLocalized('Scan QR to pay')}</Text>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.focused} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.layerRight} />
              </View>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerBottom} />
            </BarCodeScanner>
      </Modal>

        <View style={{ height: Scales.deviceHeight * 0.15 }}>
          <CustomHeader
            notiCount={notiCount}
            onNotiPress={() => {
              props.navigation.navigate('PayNotification');
            }}
          /> 
        </View> 

        <View style={styles.btnView}>
          <TouchableOpacity style={styles.btn} onPress={() => {setShowQR(true);}}>
              <Image source={require('../../assets/img/10-1.png')} style={[styles.menuImg, { marginLeft: 9 }]} /> 
              <Text style={styles.btnText}>{IMLocalized('scan')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate('Transfer')}>
              <Image source={require('../../assets/img/11-1.png')} style={styles.menuImg} /> 
              <Text style={styles.btnText}>{IMLocalized('payment')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => 
            props.navigation.navigate('QRCode', { agentInfo })
          }>
             <Image source={require('../../assets/img/12-1.png')} style={[styles.menuImg, { marginRight: 9 }]} /> 
             <Text style={styles.btnText}>{IMLocalized('receive')}</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.slideContainer}>
            <ImageSlider />
          </View>
      
          <View style={styles.menuView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
              <FlatList
                showsHorizontalScrollIndicator={false}
                numColumns={6}
                // horizontal={true}
                data={services}
                renderItem={({item, index}) => (
                  <ServiceTile
                    name={item.name}
                    label={item.label}
                    avtar={item.avtar}
                    index={index}
                    onItemPress={() => {
                      onServicePress(item);
                    }}
                  />
                )}
                keyExtractor={(item) => item.name}
              />
            </ScrollView>
          </View> 
    </View>
  );
};
export default HomeScreen;

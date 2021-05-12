import React, {useState, useEffect } from 'react';
import {
  View,
  Text,
  BackHandler,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
  Modal,
  PermissionsAndroid
} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll"
import ViewShot from "react-native-view-shot";
import { PayActivityIndicator } from '../../Core/truly-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RNQRGenerator from 'rn-qr-generator';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './qrCode.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const QRCodeScreen = (props) => {

  const [qrcode, setQrcode] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const agentInfo = props.navigation.getParam('agentInfo');

  function backButtonHandler() {
    props.navigation.goBack();
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(()=> {
    let dots = '*********************************';
    let dotLen = agentInfo.Contact_Phone.length - 4;
    let phno = dots.substring(0, dotLen) + agentInfo.Contact_Phone.substring(dotLen, agentInfo.Contact_Phone.length);
    setPhone(phno);
  },[])

  useEffect(() => {
    generateQR();
  }, [agentInfo]);

  const generateQR = () => {
      RNQRGenerator.generate({
          value: JSON.stringify({ AName: agentInfo.AName, AgentID: agentInfo.AgentID, amount }), // required
          height: hp(40),
          width: hp(40),
          base64: false,            // default 'false'
          //backgroundColor: 'red', // default 'white'
          color: 'black',           // default 'black'
        })
          .then(response => {
            const { uri, width, height, base64 } = response;
            setQrcode(uri)
          })
          .catch(error => console.log('Cannot create QR code', error));
  }

  const saveImage = () => {
    setLoading(true)
  }

  const checkAmount = () => {
    if(amount.length == 0){
      ToastAndroid.show(IMLocalized('Enter amount'), ToastAndroid.SHROT);
    }
    else if(parseInt(amount) == 0){
      ToastAndroid.show(IMLocalized('Please Enter Valid Amount'), ToastAndroid.SHROT);
    }
    else{
      generateQR();
    }
  }

  const onCapture = async (uri) => {
    console.log("do something with ", uri);

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
 
    const hasPermission = await PermissionsAndroid.check(permission);
    console.log("Permission>>" + hasPermission)
    if(hasPermission){
      saveToLibrary(uri);
    }
    else{
      const status = await PermissionsAndroid.request(permission);
      if(status == 'granted'){
        saveToLibrary(uri);
      }
      else{
        setTimeout(()=> {
          setLoading(false);
          Alert.alert('Error', IMLocalized('You need to give permission to save QR image'), [
            { text: IMLocalized('OK'), style: 'default' },
          ]);
        }, 1000)
      }
    }
  }

  const saveToLibrary = (uri) => {
    CameraRoll.save(uri)
    .then((resp) => {
     setTimeout(()=> {
      setLoading(false);
      ToastAndroid.show(IMLocalized('Saved image successfully'), ToastAndroid.LONG);
     }, 1000)
    })
    .catch(err => {
      console.log('err:', err)
      setTimeout(()=> {
        setLoading(false);
        ToastAndroid.show(IMLocalized("Something went wrong. Try again!"), ToastAndroid.LONG);
      }, 1000)
    })
  }

  if(loading){
    return (
      <ViewShot onCapture={onCapture} captureMode="mount" style={styles.Conatainer}>
        <View>
          <Image
                source={require('../../assets/img/logo_only.png')}
                style={styles.logo}
                />
          <Text style={styles.name2}>{agentInfo.AName}({phone})</Text>
          {
            amount != '' && (
              <View style={styles.amtView}>
                <Text style={styles.amount}>{amount}&nbsp;</Text>
                <Text style={styles.amount2}>(Ks)</Text>
              </View>
            )
          }
          <Image
            source={{ uri: qrcode }}
            style={styles.qrImage}
          />
          <Text style={styles.description2}>{IMLocalized('Scan QR to pay')}</Text>
        </View>
    </ViewShot>
    );
  }

  return (
    <View style={{flex: 1}}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('My QR Code')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.Conatainer}>
        <View style={
          amount == '' ?
          styles.card
          :
          styles.card2
        }>
         {
            agentInfo.Profile_Picture != '' && agentInfo.Profile_Picture != null && agentInfo.Profile_Picture != undefined ?
              <Image
              source={{ uri: agentInfo.Profile_Picture }}
              style={styles.profile}
              />
              :
              <Image
              source={require('../../assets/img/contact.png')}
              style={styles.profile}
              />
          } 
          <Text style={styles.name}>{agentInfo.AName}({phone})</Text>
          {
            amount != '' && (
              <View style={styles.amtView}>
                <Text style={styles.amount}>{amount}&nbsp;</Text>
                <Text style={styles.amount2}>(Ks)</Text>
              </View>
            )
          }
          <View style={styles.logoView}>
            <Image
                    source={require('../../assets/img/logo_only.png')}
                    style={styles.logoqr}
                    />
            <Image
              source={{ uri: qrcode }}
              style={styles.qrImage} />
          </View>
          <Text style={styles.description}>{IMLocalized('Scan QR to pay')}</Text>
        </View>
          {
          loading && (          
            <PayActivityIndicator />
          )
          }
          <Modal
          transparent={true}
          visible={showModal}
          backdropOpacity={0.3}
          onRequestClose={() => { 
            setShowModal(false)
           }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
                <View
                  style={styles.amountContainer}>
                    <TextInput
                    style={styles.amountInput}
                    placeholder={IMLocalized('amount')}
                    keyboardType='numeric'
                    onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
                    value={amount}
                    contextMenuHidden={true}
                    maxLength={8}
                  />
                </View>
                <View style={styles.modalBtnView}>
                  <TouchableOpacity style={styles.cancelBtn}
                    onPress={() => {
                      setShowModal(false)
                      setAmount('')
                    }}>
                      <Text style={styles.cancelText}>{IMLocalized('CancelTransfer')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sendBtn}
                    onPress={() => {
                      setShowModal(false)
                      checkAmount()
                    }}>
                      <Text style={styles.sendText}>{IMLocalized('Save')}</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>
        <View style={styles.btnView}>
          {
            amount == '' ?
              <TouchableOpacity style={styles.btn} onPress={()=> setShowModal(true)}>
                <Text style={styles.btnText}>{IMLocalized('Set Amount')}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.btn} onPress={()=> {
                setAmount('')
                generateQR()
              }}>
                <Text style={styles.btnText}>{IMLocalized('Clear Amount')}</Text>
              </TouchableOpacity>
          }
          <TouchableOpacity style={styles.btn} onPress={()=> saveImage()}>
            <Text style={styles.btnText}>{IMLocalized('Save Image')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QRCodeScreen;

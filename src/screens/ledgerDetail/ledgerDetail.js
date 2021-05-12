import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './ledgerDetail.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import billManager from '../billManager';
import IconFeather from 'react-native-vector-icons/Feather';

const LedgerDetailScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [ledgerInfo, setLedgerInfo] = useState({})
  const [otherName, setOtherName] = useState('');
  
  // function backButtonHandler() {
  //   props.navigation.navigate('Home');
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
  //   };
  // }, [backButtonHandler]);

  useEffect(() => {
    setLoading(true);
    let item = props.navigation.getParam('item');
    setLedgerInfo(item);
    console.log("item>>"+ JSON.stringify(item))
    getOtherName(item.To_Phone)
}, []);

 const getOtherName = (phoneNo) => {
    billManager.getAgentWithPhoneNo(phoneNo).then((response) => {
      if(response == null || response.length == 0){
        setOtherName('');
      }
      else{
        setOtherName(response[0].AName);
      }
    });
    setLoading(false);
  }

  const getServiceName = (serviceCode) => {
    if(serviceCode == '9990302')
      return 'Transfer'
    else if(serviceCode == '9990301')
      return 'Receive'
    else if(serviceCode == '9990202')
      return 'Prepaid'
    else if(serviceCode == '9990101' || serviceCode == '9990102' || serviceCode == '9990103' || serviceCode == '9990104' || serviceCode == '9990105')
      return 'Data Package'
    // else if(serviceCode == '999010101' || serviceCode == '999010102' || serviceCode == '999010201' || serviceCode == '999010202' ||
    // serviceCode == '999010301' || serviceCode == '999010302' || serviceCode == '999010401' || serviceCode == '999010402' || 
    // serviceCode == '999010501' || serviceCode == '999010502')
    else
      return 'Top Up';
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Detail')}
        onLeftIconPress={() => {
          props.navigation.goBack();
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
   
        <View style={styles.topView}>
        {
          ledgerInfo.ServiceType == 'RE'?
                  <IconFeather
                      name='arrow-left-circle'
                      size={40}
                      color='#3494c7'
                    />
          :
                  <IconFeather
                      name='arrow-right-circle'
                      size={40}
                      color='#3494c7'
                    />
        }

        {/* {
          ledgerInfo.ServiceType == 'RE'?
                <Text style={styles.type}>{IMLocalized('Receive')}</Text>
                 :
                null
        }
        {
          ledgerInfo.ServiceType == 'RM'?
                <Text style={styles.type}>{IMLocalized('Transfer')}</Text>
                 :
                null
        }
        {
          ledgerInfo.ServiceType == ''?
                <Text style={styles.type}>{IMLocalized('Top Up')}</Text>
                 :
                null
        } */}
        {
          getServiceName(ledgerInfo.Service_Code) == 'Receive' && (
                <Text style={styles.type}>{IMLocalized('receive')}</Text>
          )}
        {
          getServiceName(ledgerInfo.Service_Code) == 'Prepaid' && (
                <Text style={styles.type}>{IMLocalized('Prepaid')}</Text>
          )}
        {
          getServiceName(ledgerInfo.Service_Code) == 'Transfer' && (
                <Text style={styles.type}>{IMLocalized('Transfer')}</Text>
          )}
        {
          getServiceName(ledgerInfo.Service_Code) == 'Top Up' && (
                <Text style={styles.type}>{IMLocalized('Top Up')}</Text>
          )}
                  {
          getServiceName(ledgerInfo.Service_Code) == 'Data Package' && (
                <Text style={styles.type}>{IMLocalized('Data Package')}</Text>
          )}

        {
          ledgerInfo.ServiceType == 'RE'?
            <Text style={styles.amount}>{ledgerInfo.IN_Amount}&nbsp;Ks</Text>
            :
            <Text style={styles.amount}>-{ledgerInfo.Out_Amount}&nbsp;Ks</Text>       
        }
        </View>

        <View style={styles.line}></View>

        <View style={styles.bottomView}>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('Date/Time')}:</Text>
            <Text style={styles.value}>{ledgerInfo.RegDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('Transaction ID')}:</Text>
            <Text style={styles.value}>{ledgerInfo.LedgerID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('Type')}:</Text>
            <Text style={styles.value}>{IMLocalized(getServiceName(ledgerInfo.Service_Code))}</Text>
          </View>
          <View style={styles.row}>
            {
              ledgerInfo.ServiceType == 'RE'?
                <Text style={styles.label}>{IMLocalized('From')}:</Text>
              :
                <Text style={styles.label}>{IMLocalized('To')}:</Text>
            }
            {
              (getServiceName(ledgerInfo.Service_Code) == 'Receive' || getServiceName(ledgerInfo.Service_Code) == 'Transfer' || getServiceName(ledgerInfo.Service_Code) == 'Prepaid') ?
                <Text style={styles.value}>{otherName}</Text>
              :
                <Text style={styles.value}>{ledgerInfo.Operator_Type}</Text>
            }
          </View>
          
          {
            ledgerInfo.To_Phone != '' && ledgerInfo.To_Phone != null && ledgerInfo.To_Phone != undefined && (
              <View style={styles.row2}>
                <Text style={styles.value}>( {ledgerInfo.To_Phone} )</Text>
              </View>
          )}
    
{/* 
            {
              ledgerInfo.ServiceType == 'RM'?
              
              <View style={styles.row2}>
                <Text style={styles.phone}>( {ledgerInfo.To_Phone} )</Text>
              </View>
              :
              null
            } */}


          <View style={styles.row}>
            <Text style={styles.label}>{IMLocalized('amount')}:</Text>
            {
              ledgerInfo.ServiceType == 'RE'?
                <Text style={styles.value}>{ledgerInfo.IN_Amount}&nbsp;Ks</Text>
              :
                <Text style={styles.value}>-{ledgerInfo.Out_Amount}&nbsp;Ks</Text>
            }
          </View>
        </View>

        {
          ledgerInfo.Description != '' && ledgerInfo.Description != null && ledgerInfo.Description != undefined &&
            (
              <View style={styles.row}>
              <Text style={styles.label}>{IMLocalized('Description')}:</Text>
              <Text style={styles.value}>{ledgerInfo.Description}</Text>
            </View>
        )}



        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LedgerDetailScreen;

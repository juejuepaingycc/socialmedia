import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setPayNotiCount } from '../../store/action/homeData';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './payNotificationScreen.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Card from '../../components/ui/Card';
import billManager from '../billManager';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const payNotificationScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [agentInfo, setAgentInfo] = useState({})
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [moreLoading, setMoreLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const dispatch = useDispatch();
  var CryptoJS = require("crypto-js");

    
  function backButtonHandler() {
    props.navigation.navigate('Home');
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);
  
  useEffect(() => {
      SplashScreen.hide();
      dispatch(setPayNotiCount(0));
      AsyncStorage.setItem('payNotiCount', '0')
  }, []);

  useEffect(() => { 
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        //const data = JSON.parse(value);
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      
          billManager.updateAgentProfile(decryptedData.ID, null, null, 0, null, null).then((response) => {
            console.log("");
          })
        setAgentInfo(decryptedData)
        getLedgerWithPagination(decryptedData);
      });
    })();
  }, []);

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

  const goDetail = (item) => {
    //console.log("goDetail>>"+ JSON.stringify(item));
    props.navigation.navigate('BalanceDetail', { item: item })
  }

  const getLedgerWithPagination = (data) => {
    billManager.getBalanceHistoryWithPagination(data.AgentID, page, size).then((response) => {
      if(response == null || response.length == 0){
        setShowError(true);
      }
      else{
        let arr = [];
        for(var i=0;i<=response.length;i++){
          if(i == response.length){
            if(arr.length < size){
              setShowMore(false);
            }
            setTransactionList(arr);
            setLoading(false);
            setShowError(false);    
          }
          else{

            //let d = new Date(response[i].RegDate);
            // var amOrPm = (d.getHours() < 12) ? "AM" : "PM";
            // var hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;
            // var final =    d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + hour + ':' + d.getMinutes() + ' ' + amOrPm;
            let d = response[i].RegDate;
            var hr = parseInt(d.substring(11,13));
            var hour =(hr < 12) ? d.substring(11,13) :  hr-12;
            var amOrPm = (parseInt(d.substring(11,13)) < 12) ? "AM" : "PM";
            var final = d.substring(8,10) + '/' + d.substring(5,7) + '/' + d.substring(0,4) + ' ' + hour + ':' + d.substring(14,16) + ' ' + amOrPm;
            
            response[i].RegDate = final;
            arr.push(response[i]);
          }

        }
      }
    });  
  }

  const Transaction = ({ item, pressItem }) => {
    return(
      <Card style={styles.card2}>
        <TouchableOpacity onPress={()=> pressItem(item)}>
            <View style={styles.topView}>
              <Icon name='checkmark-circle' size={55} color='#3494c7' style={styles.icon} /> 
              <View>
              {
                    getServiceName(item.Service_Code) == 'Receive' && (
                    <Text style={styles.type}>{IMLocalized('receive')}</Text>
                  )}
                {
                    getServiceName(item.Service_Code) == 'Prepaid' && (
                    <Text style={styles.type}>{IMLocalized('Prepaid')}</Text>
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Transfer' && (
                    <Text style={styles.type}>{IMLocalized('Transfer')}</Text>
                    )}
                  {
                    getServiceName(item.Service_Code) == 'Data Package' && (
                  <Text style={styles.type}>{IMLocalized('Data Package')}</Text>
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Top Up' && (
                  <Text style={styles.type}>{IMLocalized('Top Up')}</Text>
                  )}
              {
                  item.ServiceType == 'RE'?
                  <Text style={styles.amt}>{item.IN_Amount} Ks</Text>
                  :
                  <Text style={styles.amt}>-{item.Out_Amount} Ks</Text>
                }
              </View>
            </View>
              <View style={styles.bottomView}>
                <View style={styles.row2}>
                  <Text style={styles.time2}>{IMLocalized('Transaction Time')}:&nbsp;&nbsp;</Text>
                  <Text style={styles.time2}>{item.RegDate}</Text>
                </View>

                {item.ServiceType != '' && (
                  <View style={styles.row2}>
                  {
                    item.ServiceType == 'RE' && (
                    <Text style={styles.time2}>{IMLocalized('Receive From')}:&nbsp;&nbsp;</Text>
                  )}
                  {
                      item.ServiceType == 'RM' && item.To_Phone != '' && item.To_Phone != null && item.To_Phone != undefined && (
                      <Text style={styles.time2}>{IMLocalized('Transfer To')}:&nbsp;&nbsp;</Text>
                  )}
                    <Text style={styles.time2}>{item.To_Phone}</Text>
                  </View>
                )}
            </View>
        </TouchableOpacity>
      </Card>
    )
  }

  const Transaction2 = ({ item, pressItem }) => {
    return(
      <Card style={styles.card}>
        <TouchableOpacity onPress={()=> pressItem(item)} style={styles.row}>
              <View style={styles.leftView}>
              {
                  item.ServiceType == 'RE'?
                  <Text style={styles.title}>{IMLocalized('receive')}</Text>
                  :
                  null
                }
                 {
                  item.ServiceType == 'RM'?
                  <Text style={styles.title}>{IMLocalized('Transfer')}</Text>
                  :
                  null
                }
                 {
                  item.ServiceType == ''?
                 <Text style={styles.title}>{IMLocalized('Top Up')}</Text>
                  :
                  null
                }
                <Text style={styles.date}>{item.RegDate}</Text>
              </View>
              <View style={styles.rightView}>
                {
                  item.ServiceType == 'RE'?
                  <Text style={styles.amount}>{item.IN_Amount}</Text>
                  :
                  <Text style={styles.amount}>-{item.Out_Amount}</Text>
                }
              </View>
            </TouchableOpacity>
      </Card>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Notifications')}
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
        
        {
          !loading && !showError?
          <View style={{ marginBottom: 50 }}>

            <FlatList
            data={transactionList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
            <Transaction item={item} pressItem={() => goDetail(item)} />
            )}
            keyExtractor={(item, index) => index.toString()}
            />

          </View>
          :
          null
        }

        {
          showError?
          <View style={styles.errorView}>
            <Text style={styles.error}>{IMLocalized('No Result Found')}</Text>
          </View>
          :
          null
        }

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default payNotificationScreen;

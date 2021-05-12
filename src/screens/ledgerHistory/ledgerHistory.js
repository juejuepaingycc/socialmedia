import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './ledgerHistory.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Card from '../../components/ui/Card';
import billManager from '../billManager';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

const LedgerHistoryScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [agentInfo, setAgentInfo] = useState({})
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);
  const [moreLoading, setMoreLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('')
  var CryptoJS = require("crypto-js");

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
      SplashScreen.hide();
  }, []);

  useEffect(() => { 
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {  
        var bytes  = CryptoJS.AES.decrypt(value, '1284839994');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setAgentInfo(decryptedData)

        let today = moment().format("YYYY-MM-DD");
        let end = today + 'T23:59:59.000Z';
        setEndDate(end);
        let temp = new Date();
        temp.setDate(new Date().getDate() - 6);

        let year = temp.getFullYear();
        let month = (temp.getMonth()+1);
        let date = temp.getDate();
        if(month < 10){
          month = '0' + month;
        }
        if(date < 10){
          date = '0' + date;
        }
        var lastSeven = year + "-" + month + "-" + date + 'T00:00:00.000Z';
        setStartDate(lastSeven);
        getLedgerWithPagination(decryptedData, lastSeven, end);
      });
    })();
  }, []);

  const goDetail = (item) => {
    props.navigation.navigate('BalanceDetail', { item: item })
  }

  const getData = () => {
    console.log("loading more...")
      setMoreLoading(true);
      getMoreLedger(page+1)
    }

  const getLedgerWithPagination = (data, start, end) => {
    billManager.getBalanceHistoryWithPaginationAndDateRange(data.AgentID, 0, size, start, end).then((response) => {
      //console.log("getBalanceHistoryWithPagination>>" + JSON.stringify(response));
      if(response == null || response.length == 0){
        setShowError(true);
        setLoading(false);
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
            // console.log("Date1>>" + response[i].RegDate);
            // var amOrPm = (d.getHours() < 12) ? "AM" : "PM";
            // var hour = (d.getHours() < 12) ? d.getHours() : d.getHours() - 12;
            // var final = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + hour + ':' + d.getMinutes() + ' ' + amOrPm;
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

  const getMoreLedger = (p) => {
    setPage(p+1);
    billManager.getBalanceHistoryWithPaginationAndDateRange(agentInfo.AgentID, p, size, startDate, endDate).then((response) => {
      if(response == null || response.length == 0){
        //setShowError(true);
        setMoreLoading(false);
      }
      else{
        let arr = [];
        for(var i=0;i<=response.length;i++){
          if(i == response.length){

            console.log("more data>>"+ JSON.stringify(arr));
            if(arr.length < size){
              setShowMore(false);
            }
            for(let j=0;j<=arr.length;j++){
              if(j == arr.length){
                setTransactionList(transactionList);
                setMoreLoading(false);
              }
              else{
                transactionList.push(arr[j]);
              }
            }    
          }
          else{

            // let d = new Date(response[i].RegDate);

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

  const renderFooter = () => {
    return (
      //Footer View with Load More button
 
      <View style={styles.footer}>
        {showMore?
        <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getData()}
        //On Click of button load more data
        style={styles.loadMoreBtn}>
        <Text style={styles.btnText2}>{IMLocalized('Load more')}...</Text>
        {moreLoading ? (
          <ActivityIndicator
            color="white"
            style={{marginLeft: 8}} />
        ) : null}
      </TouchableOpacity>
        :
        null}
      </View>
    );
  };

  const Transaction = ({ item, pressItem }) => {
    return(
      <Card style={styles.card2}>
        <TouchableOpacity onPress={()=> pressItem(item)} style={styles.row}>
              <View style={styles.leftView}>
                  {
                    getServiceName(item.Service_Code) == 'Receive' && (
                    <Icon
                      name='arrow-left-circle'
                      size={26}
                      color='#608ba3'
                    />
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Transfer' && (
                    <Icon
                      name='arrow-right-circle'
                      size={26}
                      color='#608ba3'
                    />
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Prepaid' && (
                      <Icon
                      name='arrow-left-circle'
                      size={26}
                      color='#608ba3'
                    />
                  )}
                  {
                    (getServiceName(item.Service_Code) == 'Top Up' || getServiceName(item.Service_Code) == 'Data Package') && (
                    <IconAnt
                      name='mobile1'
                      size={26}
                      color='#608ba3'
                    />
                  )}
                <View>
                  {
                    getServiceName(item.Service_Code) == 'Receive' && (
                    <Text style={styles.title}>{IMLocalized('receive')}</Text>
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Prepaid' && (
                    <Text style={styles.title}>{IMLocalized('Prepaid')}</Text>
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Transfer' && (
                    <Text style={styles.title}>{IMLocalized('Transfer')}</Text>
                    )}
                  {
                    getServiceName(item.Service_Code) == 'Data Package' && (
                    <Text style={styles.title}>{IMLocalized('Data Package')}</Text>
                  )}
                  {
                    getServiceName(item.Service_Code) == 'Top Up' && (
                    <Text style={styles.title}>{IMLocalized('Top Up')}</Text>
                  )}
                  <Text style={styles.date}>{item.RegDate}</Text>
                </View>
              </View>
              <View style={styles.rightView}>
                {
                  item.ServiceType == 'RE'?
                  <Text style={styles.amount}>+{item.IN_Amount}&nbsp;Ks</Text>
                  :
                  <Text style={styles.amount}>-{item.Out_Amount}&nbsp;Ks</Text>
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
        title={IMLocalized('Balance History')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <View style={styles.midContainer}>
        <View style={styles.dateView}>
            <Text style={styles.dateLabel}>{IMLocalized('From')}</Text>
            <DatePicker
              style={styles.datePick}
              date={startDate}
              mode="date"
              placeholder="Select date"
              showIcon={false}
              format="YYYY-MM-DD"
              minDate="2021-01-01"
              maxDate="2030-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 5
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                let st = date + 'T00:00:00.000Z';
                setLoading(true);
                setStartDate(st);
                setPage(0);
                getLedgerWithPagination(agentInfo, st, endDate);
              }
              }
            />
            <Text style={styles.dateLabel}>{IMLocalized('To')}</Text>
            <DatePicker
              style={styles.datePick}
              date={endDate}
              mode="date"
              placehol5der="Select date"
              showIcon={false}
              format="YYYY-MM-DD"
              minDate="2021-01-01"
              maxDate="2030-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 5
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                console.log("Changed2>>"+ date)
                let end = date + 'T23:59:59.000Z';
                setLoading(true);
                setEndDate(end);
                setPage(0)
                getLedgerWithPagination(agentInfo, startDate, end);
              }}
            />
            </View>
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
          <View style={{ marginTop: 40  }}>

            <FlatList
            data={transactionList}
            ListFooterComponent={renderFooter}
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

export default LedgerHistoryScreen;

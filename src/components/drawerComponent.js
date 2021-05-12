import React, { Component, useState, useEffect, useFocusEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ToastAndroid,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { IMLocalized } from '../Core/localization/IMLocalization';
import AsyncStorage from '@react-native-community/async-storage';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import { links } from '../../StaticData/paymentData';
import { Colors, Scales } from '@common';

const drawerContentComponents = (props) => {
  const userData = useSelector((state) => state.Auth.userData);
  const kycData = useSelector((state) => state.Auth.kycData);
  const [balance, setBalance] = useState(0);
  const [agentInfo, setAgentInfo] = useState('')

 

  useEffect(() => {
    (async () => {
      AsyncStorage.getItem("agentInfo").then((value) => {
        const data = JSON.parse(value);
        setAgentInfo(data)
        const url = links.apilink + 'ledger?_size=1&_sort=-LedgerID&_where=(from_account,eq,'+ data.AgentID +')';
        fetch(url)
          .then((resp) => resp.json())
          .then(function (data) {
            if(data.length == 0){
              setBalance(0)
            }
            else{
              setBalance(data[0].Balance);
            }
          })

   
      });
    })();
  }, []);

  useEffect(() => {
    let timer =  setInterval(getBalance, 5000);
      return () => {
        console.log('clear interval...')
        clearInterval(timer)
    }
  }, []);

  getBalance = () => {
    //GET LATEST BALANCE
    AsyncStorage.getItem("agentInfo").then((value) => {
    const data2 = JSON.parse(value);
    const url = links.apilink + 'ledger?_size=1&_sort=-LedgerID&_where=(from_account,eq,'+ data2.AgentID +')';
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        if(data.length == 0){
          setBalance(0)
        }
        else{
          setBalance(data[0].Balance);
        }
      })
    })
  }


  const items = [
    {
      navOptionThumb: 'home',
      navOptionName: IMLocalized('Home'),
      screenToNavigate: 'Home',
      type: 'Feather'
    },
    {
      navOptionThumb: 'qrcode',
      navOptionName: IMLocalized('My QR Code'),
      screenToNavigate: 'QRCode',
      type: 'Fontisto'
    },
    {
      navOptionThumb: 'at-sign',
      navOptionName: IMLocalized('My BHIM UPI ID'),
      screenToNavigate: 'UPIID',
      type: 'Feather'
    },
    {
      navOptionThumb: 'location',
      navOptionName: IMLocalized('my address'),
      screenToNavigate: 'Adress',
      type: 'EvilIcons'
    },
    {
      navOptionThumb: 'cart',
      navOptionName: IMLocalized('my order'),
      screenToNavigate: 'MyOrder',
      type: 'EvilIcons'
    },
    {
      navOptionThumb: 'credit-card',
      navOptionName: IMLocalized('bill Notification'),
      screenToNavigate: 'BillNotification',
      type: 'EvilIcons'
    },
    {
      navOptionThumb: 'swap-vert',
      navOptionName: IMLocalized('Transaction History'),
      screenToNavigate: 'TransactionHistory',
      type: 'MaterialIcons'
    },
    {
      navOptionThumb: 'lock',
      navOptionName: IMLocalized('blocked contact'),
      screenToNavigate: 'BlockedContact',
      type: 'Feather'
    },
    {
      navOptionThumb: 'key',
      navOptionName: IMLocalized('change password'),
      screenToNavigate: 'ChangePassword',
      type: 'Feather'
    },
    {
      navOptionThumb: 'library-books',
      navOptionName: IMLocalized('policies'),
      screenToNavigate: 'Policies',
      type: 'MaterialIcons'
    },
    {
      navOptionThumb: 'language',
      navOptionName: IMLocalized('choose language'),
      screenToNavigate: 'Language',
      type: 'MaterialIcons'
    },
    {
      navOptionThumb: 'person-outline',
      navOptionName: IMLocalized('support'),
      screenToNavigate: 'Support',
      type: 'MaterialIcons'
    },
  ];

  return (
    <SafeAreaView style={styles.sideMenuContainer}>
      <View style={styles.kycContainer}>
        <View style={styles.kycInfoContainer}>
          <Image
            source={require('../assets/img/avathar.png')}
            style={styles.avtarImage}
          />
          <View style={styles.kycTextContainer}>
            <Text style={styles.phoneText}>
              {agentInfo.AgentID}
            </Text>
            <Text style={styles.nameText}>
              {agentInfo.AName}
            </Text>
            <Text style={styles.phoneText}>
              Ks {balance}
            </Text>
          </View>
        </View>
        {/* <View style={styles.kycImageContainer}>
          {kycData && kycData.approve === 1 ? (
            <Image
              source={require('../assets/img/verified.png')}
              resizeMode={'contain'}
              style={styles.kycCheckImage}
            />
          ) : (
              <Image
                source={require('../assets/img/notverified.png')}
                resizeMode={'contain'}
                style={styles.kycCheckImage}
              />
            )}
        </View> */}
      </View>
      {/*Divider between Top Image and Sidebar Option*/}
      <View style={styles.devider} />
      <View style={{ width: '100%' }}>
        {items.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                global.currentScreenIndex = index;
                props.navigation.toggleDrawer();
                if (item.navOptionName == 'My QR Code' || item.navOptionName == 'Home') {
                  props.navigation.navigate(item.screenToNavigate);
                }
                else {
                  ToastAndroid.show(item.navOptionName, ToastAndroid.SHORT);
                }
              }}
              style={{
                ...styles.item,
                // backgroundColor:
                //   global.currentScreenIndex === key
                //     ? Colors.TRANSPARENT_BLACK1
                //     : Colors.WHITE,
              }}>
              <View style={{ ...styles.iconContainer }}>
                {
                  item.type == 'EvilIcons'
                    ?
                    <IconEvilIcons
                      name={item.navOptionThumb}
                      size={23}
                      color={Colors.TRANSPARENT_BLACK5}
                    />
                    :
                    null
                }
                {
                  item.type == 'Feather'
                    ?
                    <IconFeather
                      name={item.navOptionThumb}
                      size={18}
                      color={Colors.TRANSPARENT_BLACK5}
                    />
                    :
                    null
                }
                {
                  item.type == 'Fontisto'
                    ?
                    <IconFontisto
                      name={item.navOptionThumb}
                      size={18}
                      color={Colors.TRANSPARENT_BLACK5}
                    />
                    :
                    null
                }
                {
                  item.type == 'MaterialIcons'
                    ?
                    <IconMaterialIcons
                      name={item.navOptionThumb}
                      size={20}
                      color={Colors.TRANSPARENT_BLACK5}
                    />
                    :
                    null
                }


              </View>
              <Text style={styles.itemText}>{item.navOptionName}</Text>
            </TouchableOpacity>
            <View style={styles.devider} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: Scales.moderateScale(32),
  },
  itemContainer: {
    borderBottomWidth: 2,
    borderColor: Colors.TRANSPARENT_BLACK1,
  },
  kycContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kycInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kycTextContainer: {
    paddingTop: 20,
    justifyContent: 'center',
  },
  kycImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycCheckImage: {
    width: Scales.deviceWidth * 0.05,
    height: Scales.deviceWidth * 0.05,
    margin: 10,
  },
  phoneText: {
    fontSize: Scales.moderateScale(16),
    fontWeight: '700',
  },
  nameText: {
    fontSize: Scales.moderateScale(12),
  },

  btnText: {
    fontSize: Scales.moderateScale(12),
    fontWeight: '700',
    color: '#3494c7',
  },
  avtarImage: {
    resizeMode: 'center',
    width: Scales.moderateScale(70),
    height: Scales.moderateScale(70),
    marginTop: 20,
  },
  devider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.TRANSPARENT_BLACK1,
    //marginTop: 15,
  },
  iconContainer: {
    marginRight: Scales.moderateScale(15),
    marginLeft: Scales.moderateScale(20),
    width: Scales.moderateScale(20),
  },
  itemText: {
    fontSize: Scales.moderateScale(12),
    color: Colors.TRANSPARENT_BLACK8,
    paddingLeft: 5,
  },
});

export default drawerContentComponents;

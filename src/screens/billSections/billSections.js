import React, { useEffect } from 'react';
import {
  View,
  BackHandler,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './billSections.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import PayMenuWithoutIcon from '../../components/ui/PayMenuWithoutIcon'

const BillSectionsScreen = (props) => {
  function backButtonHandler() {
    props.navigation.navigate('Home');
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

   const showToast = (msg) => {
    ToastAndroid.show("You clicked " + msg, ToastAndroid.SHORT);
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={props.navigation.getParam('title')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      
        {
          props.navigation.getParam('title') == IMLocalized('Shopping')
          ?
          <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
            <PayMenuWithoutIcon menu={IMLocalized('Laukkai')} pressMenu={() => showToast('Laukkai(လောက်ကိုင်)')} />
            <PayMenuWithoutIcon menu={IMLocalized('Myawaddy')} pressMenu={() => showToast('Myawaddy(မြ၀တီ)')} />
            <PayMenuWithoutIcon menu='RGO47' pressMenu={() => showToast('RGO47')} />
            <PayMenuWithoutIcon menu='Shop.com.mm' pressMenu={() => showToast('Shop.com.mm')} />
            <PayMenuWithoutIcon menu='Alipay' pressMenu={() => showToast('Alipay')} />
          </KeyboardAvoidingView>
          :
          <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
            <PayMenuWithoutIcon menu={IMLocalized('Yangon')} pressMenu={() => showToast('Yangon')} />
            <PayMenuWithoutIcon menu={IMLocalized('Mandalay')} pressMenu={() => showToast('Mandalay')} />
            <PayMenuWithoutIcon menu={IMLocalized('Laukkai')} pressMenu={() => showToast('Laukkai(လောက်ကိုင်)')} />
          </KeyboardAvoidingView>
        }
        
    </View>
  );
};

export default BillSectionsScreen;

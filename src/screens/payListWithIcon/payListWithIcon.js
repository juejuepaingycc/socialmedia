import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './payListWithIcon.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Card from '../../components/ui/Card';

const PayListWithIconScreen = (props) => {
  const title = props.navigation.getParam('title');
  const Menu = ({ menu, img, pressMenu }) => {
    return(
        <Card style={styles.card}>
          <TouchableOpacity onPress={pressMenu} style={styles.btn}>
            <Image source={img} style={styles.image} />
            <Text style={styles.text}>{menu}</Text>
          </TouchableOpacity>
        </Card>
    )
  }

 const showToast = (msg) => {
    ToastAndroid.show("You clicked " + msg, ToastAndroid.SHORT);
  }

  return (
    <View style={{ flex: 1 }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={title}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
          <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
            <Menu menu='OK' img={require('../../assets/img/ok.png')} pressMenu={() => showToast('OK')} />
            <Menu menu='Easy Pay' img={require('../../assets/img/easypay.jpg')} pressMenu={() => showToast('Easy Pay')} />
            <Menu menu='One Pay' img={require('../../assets/img/onepay.png')} pressMenu={() => showToast('One Pay')} />
            <Menu menu='Skynet' img={require('../../assets/img/skynet.jpg')} pressMenu={() => showToast('Skynet')} />
            <Menu menu='Google Pay' img={require('../../assets/img/googlepay.png')} pressMenu={() => showToast('Google Pay')} />
            <Menu menu='Master Card' img={require('../../assets/img/master.jpg')} pressMenu={() => showToast('Master')} />
            <Menu menu='Visa Card' img={require('../../assets/img/visacard.gif')} pressMenu={() => showToast('Visa')} />
          </KeyboardAvoidingView>
    </View>
  );
};

export default PayListWithIconScreen;

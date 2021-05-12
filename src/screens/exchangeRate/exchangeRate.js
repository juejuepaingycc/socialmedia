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
import { Colors, Scales } from '@common';
import styles from './exchangeRate.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Card from '../../components/ui/Card';

const ExchangeRateScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    let strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let d = new Date();
    let month = strArray[d.getMonth()]
    let date = d.getDate() + '-' + month + '-' + d.getFullYear();
    setDate(date);
  }, []);

  const Menu = ({ name, img, buyPrice, sellPrice }) => {
    return(
       <View style={styles.row}>
          <View style={styles.leftView1}>
            <Image source={img} style={styles.image} />
            <Text style={styles.text}>{name}</Text>
          </View>
          <View style={styles.rightView}>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.price}>{buyPrice}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.price}>{sellPrice}</Text>
            </TouchableOpacity>
          </View>
       </View>
    )
  }

   const showToast = (msg) => {
    ToastAndroid.show("You clicked " + msg, ToastAndroid.SHORT);
  }

  return (
    <View style={{ flex: 1, }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Exchange Rate')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <View style={styles.dateView}>
          <Text style={styles.date}>Last updated on: </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.titleView}>
          <View style={styles.titleLeft} />
          <View style={styles.titleRight}>
            <Text style={styles.title}>We Buy</Text>
            <Text style={styles.title}>We Sell</Text>
          </View>
        </View>
        <Menu name='MMK' img={require('../../../assets/icons/mm.png')} buyPrice={1222} sellPrice={344} />
        <Menu name='EUR' img={require('../../../assets/icons/eu.png')} buyPrice={1222} sellPrice={344} />
        <Menu name='SGD' img={require('../../../assets/icons/sg.jpg')} buyPrice={1222} sellPrice={344} />
        <Menu name='USD' img={require('../../../assets/icons/en.png')} buyPrice={1222} sellPrice={344} />
        <Menu name='THB' img={require('../../../assets/icons/th.png')} buyPrice={1222} sellPrice={344} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ExchangeRateScreen;

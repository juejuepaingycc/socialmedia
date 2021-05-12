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
  ToastAndroid,
  ScrollView,
  TextInput
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import { Colors, Scales } from '@common';
import styles from './swapScreen.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';

const SwapScreen = (props) => {

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [balance2, setBalance2] = useState(26184.5);
  const [rate, setRate] = useState(188.8348844);
  const [amountResult, setAmountResult] = useState('188.82 - 5000000')

  const Menu = ({ name, rate, img, pressMenu }) => {
    return(
          <TouchableOpacity onPress={pressMenu} style={styles.btn}>
            <View style={styles.card}>
              <View style={styles.topRow}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={img} style={styles.image} style={{ width: 55, height: 55, borderRadius: 30 }} />
                  <Text style={styles.text}>{name}</Text>
                </View>
                <Text style={styles.rate}>{rate}</Text>
              </View>
            </View>
          </TouchableOpacity>
    )
  }

 const showToast = (msg) => {
    ToastAndroid.show("You clicked " + msg, ToastAndroid.SHORT);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#e3e5e8' }}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={IMLocalized('Exchange Rate')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <View style={{ backgroundColor: '#3494c7', paddingBottom: 80 }}>
        <View style={styles.topView}>
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.label}>Pay</Text>
              <View style={styles.valueView}>
                <Text style={styles.value}>Balance: </Text>
                <Text style={styles.value}>{balance}</Text>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <TextInput
                  style={styles.input}
                  placeholder={IMLocalized('Enter amount')}
                  autoCompleteType={'tel'}
                  keyboardType={'phone-pad'}
                  onChangeText={(text) => setAmount(text)}
                  value={amount}
                />
              <View style={styles.rightView}>
                <Text style={styles.label2}>CNY</Text>
                <IconFeather name='grid' size={27} color='gray' style={{ paddingLeft: 10 }} />
              </View>
            </View>
          </View>
        </View>

    <View style={styles.middle}>
      <View style={styles.middleView}>
        <IconMaterialIcons name='swap-vert' size={40} color='white'  />
        <View style={{ alignItems: 'flex-end'}}>
          <Text style={{ color: 'white', fontSize: 14 }}>Limit</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>{balance2} CNY</Text>
        </View>
      </View>
      </View>

       </View>

       <View style={styles.bottomView}>
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.label}>Will Receive</Text>
              <View style={styles.valueView}>
  <Text style={styles.value}>Rate {rate}</Text>
                <Text style={styles.value}>{balance}</Text>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <TextInput
                  style={styles.input}
                  placeholder={amountResult}
                  autoCompleteType={'tel'}
                  keyboardType={'phone-pad'}
                  onChangeText={(text) => setAmountResult(text)}
                 // value={amountResult}
                />
              <View style={styles.rightView}>
                <Text style={styles.label2}>MMK</Text>
                <IconFeather name='grid' size={27} color='gray' style={{ paddingLeft: 10 }} />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.exbtn}>
          <Text style={styles.btnText}>Exchange</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginVertical :14 }}>
          <Text style={styles.title}>Fiat</Text>
        </View>

          <ScrollView behavior={'padding'} style={styles.container}>
            <Menu name='IDR' rate='Rate 1998' img={require('../../assets/img/idr.png')} pressMenu={() => showToast('OK')} />
            <Menu name='TWD' rate='Rate 4.4534555' img={require('../../assets/img/twd.png')} pressMenu={() => showToast('OK')} />
            <Menu name='KIP' rate='Rate 2.56435689221' img={require('../../assets/img/kip.png')} pressMenu={() => showToast('OK')} />
            <Menu name='THB' rate='Rate 50.38585' img={require('../../assets/img/thb.png')} pressMenu={() => showToast('OK')} />
          </ScrollView> 
    </View>
  );
};

export default SwapScreen;

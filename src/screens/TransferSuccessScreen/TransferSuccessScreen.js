import React, { useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import styles from './TransferSuccessScreen.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const TransferSuccessScreen = (props) => {

  function backButtonHandler() {
    props.navigation.navigate('Home')
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  const transferInfo = IMLocalized('Transfer To ') + props.navigation.getParam('userName');

  return(
    <View style={styles.container}>
        <Icon name='checkmark-circle' size={55} color='#3494c7' style={styles.icon} />
        <Text style={styles.desc}>{IMLocalized('Payment successful')}</Text>

        <Text style={styles.transfer}>{transferInfo}</Text>
        <Text style={styles.amount}>{props.navigation.getParam('amount')} (Ks)</Text>

        <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate('Home')}>  
          <Text style={styles.btnText}>{IMLocalized('OK')}</Text>
        </TouchableOpacity>
    </View>
  )
  
}
export default TransferSuccessScreen;

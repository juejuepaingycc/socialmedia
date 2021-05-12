import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Card from './Card';
import Icon from 'react-native-vector-icons/Entypo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Scales } from '@common'

const PayMenuWithoutIcon = props => {
  return (
  <Card style={styles.card}>
    <TouchableOpacity onPress={props.pressMenu} style={styles.btn}>
      <Text style={styles.text}>{props.menu}</Text>
      <Icon name='chevron-right' size={20} color='#24526b' style={{ right: 10 }}
      />
    </TouchableOpacity>
  </Card>
  )
};

const styles = StyleSheet.create({
  card: {
    paddingLeft: hp(2.2),
    width: Scales.deviceWidth * 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: '2.5%',
    borderRadius: 8,
    alignSelf: 'center',
    height: hp(6.8),
  },
  text: {
    color: '#24526b',
    fontSize: hp(2.1),
    fontWeight: 'bold'
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
});

export default PayMenuWithoutIcon
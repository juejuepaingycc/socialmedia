import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Scales, Colors } from '@common';

const Card2 = props => {
  return <TouchableOpacity
  style={{...styles.card, ...props.style}}>{props.children}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: 'white',
  },
});

export default Card2;

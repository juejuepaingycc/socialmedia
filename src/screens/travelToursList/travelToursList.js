import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import { Colors, Scales } from '@common';
import styles from './travelToursList.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Card from '../../components/ui/Card';

const TravelToursListScreen = (props) => {

  const Menu = ({ menu, img, pressMenu }) => {
    return(
        <Card style={styles.card}>
          <TouchableOpacity onPress={pressMenu} style={styles.btn}>
            <Image source={img} style={styles.image} style={{ width: 55, height: 55, borderRadius: 30 }} />
            <Text style={styles.text}>{menu}</Text>
          </TouchableOpacity>
        </Card>
    )
  }

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
        title={IMLocalized('Travel & Tours')} 
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <Menu menu={IMLocalized('Car Rental')} img={require('../../assets/img/car.jpg')} pressMenu={() => showToast('Car Rental')} />
        <Menu menu={IMLocalized('Hotel Booking')} img={require('../../assets/img/hotelbooking.jpg')} pressMenu={() => showToast('Hotel Booking')} />
        <Menu menu={IMLocalized('Flight Ticket')} img={require('../../assets/img/flight2.jpg')} pressMenu={() => showToast('Flight Ticket')} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default TravelToursListScreen;

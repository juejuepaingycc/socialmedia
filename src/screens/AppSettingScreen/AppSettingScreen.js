

import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform, View,  Text, StyleSheet, BackHandler, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class AppSettingScreen extends Component {

  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: IMLocalized('App Settings'),
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      headerLeft: Platform.OS === 'android' && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.info = [
      {
        'label': IMLocalized('App Name'),
        'value': 'Nine Chat'
      },
      {
        'label': IMLocalized('Version'),
        'value': '2.0'
      },
      {
        'label': IMLocalized('Latest Version'),
        'value': '2.0'
      }
    ]
    // this.state = {
    //   appName: 'Nine Chat',
    //   versionNo: '2.0',
    //   latestVersionNo: '2.0'
    // }
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    })
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  render(){

    return(
            <View style={styles.container}>
              <View style={styles.card}>
                {
                  this.info.map((info) => {
                    return(
                      <View style={styles.row}>
                        <Text style={styles.label}>{info.label}: &nbsp;</Text>
                        <Text style={styles.value}>{info.value}</Text>
                      </View>
                    )
                  })
                }
              </View>
            </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    //paddingLeft: 20,
  },
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingLeft: 16,
    paddingVertical: 15
  },
  row: {
    flexDirection: 'row',
    paddingVertical: hp(0.7)
  },
  label: {
    fontSize: hp(2),
    color: '#565759',
    width: wp(30),
    fontFamily: AppStyles.customFonts.klavikaMedium,
  },
  value: {
    fontSize: hp(2),
    fontFamily: AppStyles.customFonts.klavikaMedium,
  }
})
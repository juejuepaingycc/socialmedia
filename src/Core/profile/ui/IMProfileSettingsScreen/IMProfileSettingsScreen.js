import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import IMProfileSettings from '../components/IMProfileSettings/IMProfileSettings';
import { logout } from '../../../onboarding/redux/auth';
import AppStyles from '../../../../AppStyles';
import AsyncStorage from '@react-native-community/async-storage';
import billManager from '../../../../screens/billManager';
import moment from 'moment';

class IMProfileSettingsScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    //let appStyles = navigation.state.params.appStyles;
    let appStyles = AppStyles;
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: navigation.state.params.screenTitle,
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    //this.title1 = 'djfkdjfkd'
    this.state = {
      title1: 'djfkdjfkd'
    }
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.lastScreenTitle = this.props.navigation.getParam('lastScreenTitle');
    this.appStyles = this.props.navigation.getParam('appStyles');
    this.appConfig = this.props.navigation.getParam('appConfig');
    if (!this.lastScreenTitle) {
      this.lastScreenTitle = 'Profile';
    }
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onLogout = () => {
    console.log("Logout...")
    AsyncStorage.setItem('currentUser', '');
    AsyncStorage.setItem('ninepayPhNo', '');
    billManager.getLatestLogIDOfUser(this.props.user.id, 'ninechat_users_log').then((response) => {
      if(response && response.length > 0){
        let time = moment().format("YYYY-MM-DD") + "T" + moment().format("HH:mm");
        billManager.updateUserLog(response[0].id, time, 'ninechat_users_log').then((response) => {
          
        })
      }
    })

    this.props.logout();
  };

  render() {
    return (
      <IMProfileSettings
        navigation={this.props.navigation}
        onLogout={this.onLogout}
        lastScreenTitle={this.lastScreenTitle}
        user={this.props.user}
        appStyles={this.appStyles}
        appConfig={this.appConfig}
      />
    );
  }
}

IMProfileSettingsScreen.propTypes = {};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {
  logout,
})(IMProfileSettingsScreen);

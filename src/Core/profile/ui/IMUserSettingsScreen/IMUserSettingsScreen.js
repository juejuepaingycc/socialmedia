import React, { Component } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { IMLocalized } from '../../../localization/IMLocalization';
import { setUserData } from '../../../onboarding/redux/auth';
import { firebaseUser } from '../../../firebase';
import IMFormComponent from '../IMFormComponent/IMFormComponent';
import AppStyles from '../../../../AppStyles';

class IMUserSettingsScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    //let appStyles = navigation.state.params.appStyles;
    let appStyles = AppStyles;
    let screenTitle =
      navigation.state.params.screenTitle || IMLocalized('Settings');
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: screenTitle,
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);

    this.appStyles = props.navigation.getParam('appStyles') || props.appStyles;
    this.form = props.navigation.getParam('form') || props.form;
    this.initialValuesDict = props.user.settings || {};

    this.state = {
      form: props.form,
      alteredFormDict: {},
    };

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
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

  onFormSubmit = () => {
    const user = this.props.user;
    var newSettings = user.settings || {};
    const form = this.form;
    const alteredFormDict = this.state.alteredFormDict;

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const newValue = alteredFormDict[field.key];
        if (newValue != null) {
          newSettings[field.key] = alteredFormDict[field.key];
        }
      });
    });

    let newUser = { ...user, settings: newSettings };
    console.log("New>>"+ JSON.stringify(newUser))
    firebaseUser.updateUserData(user.id, newUser);
    this.props.setUserData({ user: newUser });
    this.props.navigation.goBack();
  };

  onFormChange = (alteredFormDict) => {
    console.log("Changed..." + JSON.stringify(alteredFormDict))
    this.setState({ alteredFormDict });
    if(alteredFormDict.show_friend_list != null && alteredFormDict.show_friend_list != undefined){
      firebaseUser.updateUserData(this.props.user.id, { show_friend_list: alteredFormDict.show_friend_list });
      let newUser = { ...this.props.user, show_friend_list: alteredFormDict.show_friend_list };
      this.props.setUserData({ user: newUser });
    }
    if(alteredFormDict.push_notifications_enabled != null && alteredFormDict.push_notifications_enabled != undefined){
      firebaseUser.updateUserData(this.props.user.id, { push_notifications_enabled: alteredFormDict.push_notifications_enabled });
      let newUser = { ...this.props.user, show_friend_list: alteredFormDict.push_notifications_enabled };
      this.props.setUserData({ user: newUser });
    }
  };

  onFormButtonPress = (buttonField) => {
    console.log("click btn>>" + JSON.stringify(buttonField))
    if (buttonField.key == "change_language") {
      this.props.navigation.navigate('Language');
    }
    else if (buttonField.key == "change_password") {
      if(this.props.user.email != null && this.props.user.email != undefined && this.props.user.email != ''){
        this.props.navigation.navigate('ChangePassword',{
          user: this.props.user
        });
      }
      else{
        ToastAndroid.show(IMLocalized('You can change password only for account with email'), ToastAndroid.SHORT)
      }
    }
    else if(buttonField.key == 'blocked_users'){
      this.props.navigation.navigate('BlockedUsers');
    }
    //this.onFormSubmit();
  };

  render() {
    return (
      <IMFormComponent
        form={this.form}
        initialValuesDict={this.props.user}
        onFormChange={this.onFormChange}
        navigation={this.props.navigation}
        appStyles={this.appStyles}
        onFormButtonPress={this.onFormButtonPress}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, { setUserData })(IMUserSettingsScreen);

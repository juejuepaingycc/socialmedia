import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import { firebaseUser } from '../../../firebase';
import IMFormComponent from '../IMFormComponent/IMFormComponent';
import { setUserData } from '../../../onboarding/redux/auth';
import { IMLocalized } from '../../../localization/IMLocalization';
import AppStyles from '../../../../AppStyles';

class IMEditProfileScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    //let appStyles = navigation.state.params.appStyles;
    let appStyles = AppStyles;
    let screenTitle = navigation.state.params.screenTitle;
    let currentTheme = AppStyles.navThemeConstants['light'];
    const { params = {} } = navigation.state;

    return {
      headerTitle: screenTitle,
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerRight: (
        <TextButton style={{ marginRight: 12, fontFamily: appStyles.customFonts.klavikaMedium }} onPress={params.onFormSubmit}>
          {IMLocalized('Done')}
        </TextButton>
      ),
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
    this.onComplete =
      props.navigation.getParam('onComplete') || props.onComplete;

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
    this.props.navigation.setParams({
      onFormSubmit: this.onFormSubmit,
    });
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

  isInvalid = (value, regex) => {

    const regexResult = regex.test(value);
    console.log("Res>>" + regexResult)

    // if (value.length > 0 && !regexResult) {
    //   return true;
    // }
    // if (value.length > 0 && regexResult) {
    //   return false;
    // }
    if(value.length > 0)
      return false;
    else return true;
  };

  onFormSubmit = () => {
    var newUser = this.props.user;
    const form = this.form;
    const alteredFormDict = this.state.alteredFormDict;
    var allFieldsAreValid = true;

    console.log("Form Submit>>" + JSON.stringify(newUser))
    console.log("Form>>" + JSON.stringify(form));
    console.log("alteredFormDict>>" + JSON.stringify(alteredFormDict));

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const newValue = alteredFormDict[field.key];
        if (newValue != null) {
          console.log("Regex>>" + field.regex);
          if (field.regex && this.isInvalid(newValue, field.regex)) {
            console.log("Invalid...");
            allFieldsAreValid = false;
          } else {
            console.log("Valid...");
            newUser[field.key] = alteredFormDict[field.key];
          }
        }
      });
    });

    if (allFieldsAreValid) {
      firebaseUser.updateUserData(this.props.user.id, newUser);
      this.props.setUserData({ user: newUser });
      this.props.navigation.goBack();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      alert(
        IMLocalized(
          'An error occured while trying to update your account. Please make sure all fields are valid.',
        ),
      );
    }
  };

  onFormChange = (alteredFormDict) => {
    this.setState({ alteredFormDict });
  };

  render() {
    return (
      <IMFormComponent
        form={this.form}
        initialValuesDict={this.props.user}
        onFormChange={this.onFormChange}
        navigation={this.props.navigation}
        appStyles={this.appStyles}
      />
    );
  }
}

IMEditProfileScreen.propTypes = {
  user: PropTypes.object,
  setUserData: PropTypes.func,
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, { setUserData })(IMEditProfileScreen);

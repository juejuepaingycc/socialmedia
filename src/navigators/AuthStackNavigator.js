import { createStackNavigator } from 'react-navigation-stack';
import {
  WelcomeScreen,
  LoginScreen,
  SignupScreen,
  SmsAuthenticationScreen,
  VerifyScreen
} from '../Core/onboarding';
import AppStyles from '../AppStyles';
import SocialNetworkConfig from '../SocialNetworkConfig';
import { StyleSheet } from 'react-native';
import App from '../../App';

const AuthStackNavigator = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: { header: null },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: () => ({
        headerStyle: styles.headerStyle,
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: () => ({
        headerStyle: styles.headerStyle,
      }),
    },
    Sms: {
      screen: SmsAuthenticationScreen,
      navigationOptions: () => ({
        headerStyle: styles.headerStyle,
      }),
    },
    SPayment: {screen: App,
      navigationOptions: {
      headerShown: false
    }
   },
    Verify: {
      screen: VerifyScreen,
      navigationOptions: () => ({
        headerStyle: styles.headerStyle,
      }),
    },
  },
  {
    initialRouteName: 'Welcome',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
    },
    headerMode: 'none',
    headerBackTitleVisible: false,
    cardStyle: { backgroundColor: '#FFFFFF' },
    cardShadowEnabled: false,
  },
);

const styles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0, // remove shadow on Android
  },
});

export default AuthStackNavigator;

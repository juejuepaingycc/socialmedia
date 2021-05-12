import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform } from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import { Colors, Scales } from '@common';
import drawerContentComponents from '../components/drawerComponent';
import LoadingScreen from '../screens/loading/loading';
import IntroScreen from '../screens/intro/intro';
import SignInScreen from '../screens/signIn/signIn';
import RequestOTPScreen from '../screens/RequestOTPScreen/RequestOTPScreen';
import CheckOTPScreen from '../screens/CheckOTPScreen/CheckOTPScreen';
import SignUpScreen from '../screens/signUp/signUp';
import ForgotPassScreen from '../screens/forgotPass/forgotPass';
import HomeScreen from '../screens/home/home';
import AuthCheckScreen from '../screens/authCheck/authCheck';
import QRCodeScreen from '../screens/qrCode/qrCode';
import ChangePasswordScreen from '../screens/changePassword/changePassword';
import PoliciesScreen from '../screens/policies/policies';
import LanguageScreen from '../screens/language/language';
import SupportScreen from '../screens/support/support';
import CustomWebViewScreen from '../screens/customWebView/customWebView';
import { FeedScreen } from "../screens";
import transferScreen from '../screens/transferBill/transferBill';
import qrTransferScreen from '../screens/qrTransferBill/qrTransferBill';
import TransferSuccessScreen from '../screens/TransferSuccessScreen/TransferSuccessScreen';
import MyProfileScreen from '../screens/myProfile/myProfile';
import LedgerHistoryScreen from '../screens/ledgerHistory/ledgerHistory';
import payNotificationScreen from '../screens/payNotification/payNotificationScreen';
import EloadScreen from '../screens/eLOAD/eLOAD';
import TopTabNavigator from '../navigators/TopTabNavigator';
import DataPackScreen from '../screens/dataPack/dataPack';
import LedgerDetailScreen from '../screens/ledgerDetail/ledgerDetail';
import BillSectionsScreen from '../screens/billSections/billSections';
import TravelToursListScreen from '../screens/travelToursList/travelToursList';
import PayListWithIconScreen from '../screens/payListWithIcon/payListWithIcon';
import ExchangeRateScreen from '../screens/exchangeRate/exchangeRate';
import SwapScreen from '../screens/swap/swap';
import ShoppingList from '../screens/ShoppingList/ShoppingList';

const LoadingNavigator = createStackNavigator({
  Loading: { screen: LoadingScreen, navigationOptions: { headerShown: false } },
});

const AuthCheckNavigator = createStackNavigator({
  AuthCheck: {
    screen: AuthCheckScreen,
    navigationOptions: { headerShown: false },
  },
});

const IntroNavigator = createStackNavigator({
  Intro: { screen: IntroScreen, navigationOptions: { headerShown: false } },
});

const AuthNavigator = createStackNavigator({
  SignIn: { screen: SignInScreen, navigationOptions: { headerShown: false } },
  RequestOTP: { screen: RequestOTPScreen, navigationOptions: { headerShown: false } },
  CheckOTP: { screen: CheckOTPScreen, navigationOptions: { headerShown: false } },
  SignUp: { screen: SignUpScreen, navigationOptions: { headerShown: false } },
  Feed: { screen: FeedScreen},
  Forgot: { screen: ForgotPassScreen, navigationOptions: { headerShown: false } },
});
const MyProfileNavigator = createStackNavigator({
  Profile: { screen: MyProfileScreen, navigationOptions: { headerShown: false } },
  CustomWebView: { screen: CustomWebViewScreen, navigationOptions: { headerShown: false } },
  ChangePassword: { screen: ChangePasswordScreen, navigationOptions: { headerShown: false }},
  //SignIn: { screen: SignInScreen, navigationOptions: { headerShown: false } },
});

// const TransferNavigator = createStackNavigator({
//   Transfer: { screen: transferScreen, navigationOptions: { headerShown: false } },
//   TransferSuccess: { screen: TransferSuccessScreen, navigationOptions: { headerShown: false } },
//   SignIn: { screen: SignInScreen, navigationOptions: { headerShown: false } },
// });

const TransferNavigator = createSwitchNavigator(
  {
      Transfer: { screen: transferScreen, navigationOptions: { headerShown: false } },
      TransferSuccess: { screen: TransferSuccessScreen, navigationOptions: { headerShown: false } },
  },
  {
    initialRouteName: 'Transfer',
  },
);

const QRTransferNavigator = createSwitchNavigator({
  qrTransfer: { screen: qrTransferScreen, navigationOptions: { headerShown: false } },
  QRTransferSuccess: { screen: TransferSuccessScreen, navigationOptions: { headerShown: false } }
},
{
  initialRouteName: 'qrTransfer',
}
);

const ShoppingNavigator = createSwitchNavigator({
  Shopping: { screen: ShoppingList },
  ShoppingTransfer: { screen: qrTransferScreen, navigationOptions: { headerShown: false } },
  QRTransferSuccess: { screen: TransferSuccessScreen, navigationOptions: { headerShown: false } }
},
{
  initialRouteName: 'Shopping',
}
);

// const QRTransferNavigator = createStackNavigator({
//   Transfer: { screen: qrTransferScreen, navigationOptions: { headerShown: false } },
//   QRTransferSuccess: { screen: TransferSuccessScreen, navigationOptions: { headerShown: false } },
//   SignIn: { screen: SignInScreen, navigationOptions: { headerShown: false } },
// });

const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen, navigationOptions: { headerShown: false, headerMode: 'none' } },
  Transfer: { screen: TransferNavigator },
  //qrTransfer: { screen: qrTransferScreen, navigationOptions: { headerShown: false } },
  qrTransfer: { screen: QRTransferNavigator },
  QRCode: { screen: QRCodeScreen, navigationOptions: { headerShown: false } },
  myProfile: { screen: MyProfileNavigator},
  AuthHome: { screen: AuthNavigator },
  //myProfile: { screen: ProfileSwitchNavigator },
  BalanceHistory: { screen: LedgerHistoryScreen},
  BalanceDetail: { screen: LedgerDetailScreen },
  PayNotification: { screen: payNotificationScreen },
  BillSections: { screen: BillSectionsScreen },
  Shopping: { screen: ShoppingNavigator },
  ListWithIcon: { screen: PayListWithIconScreen },
  TravelToursList: { screen: TravelToursListScreen },
  ShoppingWebView: { screen: CustomWebViewScreen },
  ExchangeRate: { screen: SwapScreen },
  eLOAD: { screen: EloadScreen,
    navigationOptions: { headerMode: 'float' }
  },
  DataPack: { screen: DataPackScreen},
},
{
  headerMode: 'none',
  headerShown: false
});

// const LedgerNavigator = createStackNavigator({
//   BalanceHistory: { screen: LedgerHistoryScreen},
//   BalanceDetail: { screen: LedgerDetailScreen },
// },
// {
//   initialRouteName: 'BalanceHistory',
// });

const QRCodeNavigator = createStackNavigator({
  QRCode: { screen: QRCodeScreen, navigationOptions: { headerShown: false } },
});
const ChangePasswordNavigator = createStackNavigator({
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: { headerShown: false },
  },
});
const PoliciesNavigator = createStackNavigator({
  Policies: {
    screen: PoliciesScreen,
    navigationOptions: { headerShown: false },
  },
});
const LanguageNavigator = createStackNavigator({
  Language: { screen: LanguageScreen, navigationOptions: { headerShown: false } },
});
const SupportNavigator = createStackNavigator({
  Support: { screen: SupportScreen, navigationOptions: { headerShown: false } },
});

const AppNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerIcon: ({ tintColor }) => (
          // <Icon
          //   name={'ios-home'}
          //   size={Scales.moderateScale(23)}
          //   color={tintColor}
          // />
          <IconFeather
            name={'home'}
            size={Scales.moderateScale(23)}
            color={tintColor}
          />
        ),
      },
    },
    QRCode: {
      screen: QRCodeNavigator,
      navigationOptions: {
        title: 'My QR Code',
        drawerIcon: (drawerConfig) => (
          // <Icon
          //   name={'qr-code-outline'}
          //   size={Scales.moderateScale(23)}
          //   color={drawerConfig.tintColor}
          // />
          <IconFontAwesome
            name={'qrcode'}
            color={'#3494c7'
            }
            size={Scales.moderateScale(22)}
          />
        ),
      },
    },
    ChangePassword: {
      screen: ChangePasswordNavigator,
      navigationOptions: {
        title: 'Change Password',
        drawerIcon: (drawerConfig) => (
          // <Icon
          //   name={'md-lock'}
          //   size={Scales.moderateScale(23)}
          //   color={drawerConfig.tintColor}
          // />
          <IconFeather
            name={'lock'}
            size={Scales.moderateScale(23)}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Policies: {
      screen: PoliciesNavigator,
      navigationOptions: {
        title: 'Policies',
        drawerIcon: (drawerConfig) => (
          // <Icon
          //   name={'ios-paper'}
          //   size={Scales.moderateScale(23)}
          //   color={drawerConfig.tintColor}
          // />
          <IconMaterialIcons
            name={'library-books'}
            size={Scales.moderateScale(23)}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Language: {
      screen: LanguageNavigator,
      navigationOptions: {
        title: 'Choose Language',
        drawerIcon: (drawerConfig) => (
          // <Icon
          //   name={'md-globe'}
          //   size={Scales.moderateScale(23)}
          //   color={drawerConfig.tintColor}
          // />
          <IconMaterialIcons
            name={'language'}
            size={Scales.moderateScale(23)}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Support: {
      screen: SupportNavigator,
      navigationOptions: {
        title: 'Support',
        drawerIcon: (drawerConfig) => (
          // <Icon
          //   name={'ios-globe'}
          //   size={Scales.moderateScale(23)}
          //   color={drawerConfig.tintColor}
          // />
          <IconMaterialIcons
            name={'person-outline'}
            size={Scales.moderateScale(23)}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
  },

  {
    contentComponent: drawerContentComponents,
    backBehavior: 'initialRoute',
    drawerType: 'front',
    drawerWidth: Scales.deviceWidth * 0.6,
    drawerBackgroundColor: Colors.WHITE,
    contentOptions: {
      activeTintColor: '#3494c7',
      inactiveTintColor: Colors.TRANSPARENT_BLACK8,
      labelStyle: {
        fontSize: Scales.moderateScale(14),
      },
      iconContainerStyle: {
        hight: Scales.moderateScale(26),
        width: Scales.moderateScale(26),
        marginRight: 0,
      },
      itemsContainerStyle: {
        marginTop:
          Platform.OS === 'android'
            ? Scales.deviceHeight * 0.06
            : Scales.deviceHeight * 0.01,
      },
      itemStyle: {
        borderBottomWidth: 2,
        borderColor: Colors.TRANSPARENT_BLACK1,
      },

      activeBackgroundColor: Colors.TRANSPARENT_BLACK1,
      //inactiveBackgroundColor: '#red',
    },
  },
);



const defaultGetStateForAction = AppNavigator.router.getStateForAction;

AppNavigator.router.getStateForAction = (action, state) => {

    //use 'DrawerOpen' to capture drawer open event
    if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerOpen') {
      console.log('DrawerOpen...');
      //write the code you want to deal with 'DrawerClose' event
  }
    if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
        console.log('DrawerClose...');
        //write the code you want to deal with 'DrawerClose' event
    }
    return defaultGetStateForAction(action, state);
};

const RootNavigator = createSwitchNavigator(
  {
    Loading: LoadingNavigator,
    AuthCheck: AuthCheckNavigator,
    Intro: IntroNavigator,
    Auth: AuthNavigator,
    Feed: { screen: FeedScreen },
    App: HomeNavigator
  },
  {
    initialRouteName: 'Auth',
    headerShown: false,
    headerMode: 'none'
  },
);

export default createAppContainer(RootNavigator);

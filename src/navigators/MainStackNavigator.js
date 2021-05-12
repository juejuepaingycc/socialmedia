import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import ContactTabNavigator from './ContactTabNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { IMChatScreen } from '../Core/chat';
import AppStyles from '../AppStyles';
import { InnerFeedNavigator, InnerCallNavigator, InnerChatNavigator } from './InnerStackNavigators';
import CallScreen from '../screens/CallScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';
import NavigationService from '../routes/NavigationService';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SocialNetworkConfig from '../SocialNetworkConfig';
import { LoadScreen, WalkthroughScreen } from '../Core/onboarding';
import LoginStack from './AuthStackNavigator';
import ReactionListScreen from '../screens/reactionList/reactionList';

const MainStackNavigator = createStackNavigator(
  {
    // NavStack: {
    //   screen: InnerFeedNavigator,
    //   initialRouteParams: {
    //     appStyles: AppStyles,
    //     appConfig: SocialNetworkConfig,
    //   },
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    NavStack: {screen: BottomTabNavigator},
    LoadScreen2: {screen: LoadScreen},
    Walkthrough2: {screen: WalkthroughScreen},
    LoginStack2: {screen: LoginStack},
    Chat: { screen: InnerChatNavigator },
    PersonalChat: { screen: IMChatScreen,
      initialRouteParams: {
        appStyles: AppStyles,
        appConfig: SocialNetworkConfig,
      },
    },
    ChatReactionList: { screen: ReactionListScreen },
    Call: { screen: CallScreen,
      navigationOptions: {
        headerShown: false
      } },
    IncomingCall: { screen: IncomingCallScreen,
      navigationOptions: {
        headerShown: false
      } }
  },
  {
    initialRouteName: 'NavStack',
    headerMode: 'float',
    initialRouteParams: {
      appStyles: AppStyles,
      appConfig: SocialNetworkConfig,
    },
  },
);

export default createAppContainer(MainStackNavigator);

import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  InnerFeedNavigator,
  InnerChatNavigator,
  InnerFriendsNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
} from './InnerStackNavigators';
import { tabBarBuilder } from '../Core/ui';
import SocialNetworkConfig from '../SocialNetworkConfig';
import AppStyles from '../AppStyles';
import App from '../../App';

const BottomTabNavigator = createBottomTabNavigator(
  {
    Chat: {
      screen: InnerChatNavigator,
    },
    Moment: {
      screen: InnerFeedNavigator,
    },
    Wallet: {
      screen: App,
    },
    Me: {
      screen: InnerProfileNavigator,
    },
  },
  {
    initialRouteName: 'Chat',
    tabBarComponent: tabBarBuilder(SocialNetworkConfig.tabIcons, AppStyles, 'bottom'),
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: '',
        header: null,
      };
    }
    
  },
  
);

export default BottomTabNavigator;

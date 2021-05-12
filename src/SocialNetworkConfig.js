import AppStyles from './AppStyles';
import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const locale = NativeModules.I18nManager.localeIdentifier;
const lan = locale.substring(locale.indexOf('_')+1);
//  if(lan == 'ZH-CN'){
//   setI18nConfig('CN');
// }
// else if(lan == 'ZH-TW'){
//   setI18nConfig('TW')
// }
// else if(lan == 'MM' || lan =='KH' || lan =='TH'){
//   setI18nConfig(lan)
// }
// else{
//   setI18nConfig('EN')
// }

AsyncStorage.getItem("languageAsync").then((value) => {
  if(value == null || value == undefined){
    setI18nConfig('EN');
  }
  else{
    setI18nConfig(value);
  }
});

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const SocialNetworkConfig = {
  voxImplantAccountId: 3795250,
  voxImplantAppId: 10205592,
  voxImplantApiKey: '55b9a769-7720-4421-977e-88bfb1eece0b',
  isSMSAuthEnabled: true,
  adsConfig: {
    facebookAdsPlacementID:
      Platform.OS === 'ios'
        ? '834318260403282_834914470343661'
        : '834318260403282_834390467062728',
    adSlotInjectionInterval: 10,
  },
  appIdentifier: 'rn-social-network-android',
  onboardingConfig: {
    welcomeTitle: IMLocalized('Welcome to your app'),
    welcomeCaption: IMLocalized(
      'Use this codebase to build your own social network in minutes.',
    ),
    walkthroughScreens: [
      {
        icon: require('../assets/images/file.png'),
        title: IMLocalized('Posts'),
        description: IMLocalized(
          'Share posts, photos and comments with your network.',
        ),
      },
      {
        icon: require('../assets/images/photo.png'),
        title: IMLocalized('Stories'),
        description: IMLocalized('Share stories that disappear after 24h.'),
      },
      {
        icon: require('../assets/images/like.png'),
        title: IMLocalized('Reactions'),
        description: IMLocalized(
          'React to posts and photos with likes, dislikes, laughs and more..',
        ),
      },
      {
        icon: require('../assets/images/chat.png'),
        title: IMLocalized('Chat'),
        description: IMLocalized(
          'Communicate with your friends via private messages.',
        ),
      },
      {
        icon: require('../assets/icons/friends-unfilled.png'),
        title: IMLocalized('Group Chats'),
        description: IMLocalized('Have fun with your gang in group chats.'),
      },
      {
        icon: require('../assets/images/instagram.png'),
        title: IMLocalized('Send Photos & Videos'),
        description: IMLocalized(
          'Have fun with your matches by sending photos and videos to each other.',
        ),
      },
      {
        icon: require('../assets/images/pin.png'),
        title: IMLocalized('Check ins'),
        description: IMLocalized(
          'Check in when posting to share your location with friends.',
        ),
      },
      {
        icon: require('../assets/images/notification.png'),
        title: IMLocalized('Get Notified'),
        description: IMLocalized(
          'Receive notifications when you get new messages and matches.',
        ),
      },
    ],
  },
  tabIcons: {
    Chat: {
      name: IMLocalized('Chat'),
      icon: 'chatbubble-outline'
    },
    Moment: {
      name: IMLocalized('Moments'),
      icon: 'camera'
    },
    Wallet: {
      name: IMLocalized('Wallet'),
      icon: 'account-balance-wallet'
    },
    Me: {
      name: IMLocalized('Me'),
      icon: 'person-outline'
    }
  },
  topTabIcons: {
    Friends: {
      name: 'Friends',
    },
    Group: {
      name: 'Group',
    },
    Contacts: {
      name: 'Contacts',
    },
  },
  tosLink: 'https://www.instamobile.io/eula-instachatty/',
  editProfileFields: {
    sections: [
      {
        title: 'PUBLIC PROFILE',
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'First Name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Last Name',
          },
          {
            displayName: IMLocalized('Gender'),
            type: 'select',
            editable: true,
            key: 'gender',
            placeholder: 'Gender',
            displayOptions: [
              'Male',
              'Female'
              // IMLocalized('Male'),
              // IMLocalized('Female')
            ]
          },
          {
            displayName: IMLocalized('Relationship Status'),
            type: 'select',
            editable: true,
            key: 'rsStatus',
            placeholder: 'Relationship Status',
            displayOptions: [
              'Single',
              'In a relationship',
              'Engaged'
              // IMLocalized('Single'),
              // IMLocalized('In a relationship'),
              // IMLocalized('Engaged')
            ]
          },
          {
            displayName: IMLocalized('Bio'),
            type: 'text',
            editable: true,
            key: 'bio',
            placeholder: 'Describe Yourself',
          },
        ],
      },
      {
        title: 'PRIVATE DETAILS',
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: true,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('GENERAL'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: false,
          },
          {
            displayName: IMLocalized('Show Friend List'),
            type: 'switch',
            editable: true,
            key: 'show_friend_list',
            value: false,
          }
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Change Password'),
            type: 'button',
            key: 'change_password',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Blocked Users'),
            type: 'button',
            key: 'blocked_users',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Change Language'),
            type: 'button',
            key: 'change_language',
          }
        ],
      },
      // {
      //   title: '',
      //   fields: [
      //     {
      //       displayName: IMLocalized('Save'),
      //       type: 'button',
      //       key: 'savebutton',
      //     },
      //   ],
      // },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'push_notifications_enabled',
            value: '142 Steiner Street, San Francisco, CA, 94115',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'florian@instamobile.io',
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: '+16504859694',
};

export default SocialNetworkConfig;

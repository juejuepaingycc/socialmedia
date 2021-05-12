import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { IMChatHomeComponent } from '../../Core/chat';
import {
  FriendshipConstants,
  filteredNonFriendshipsFromUsers,
} from '../../Core/socialgraph/friendships';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import {
  setFriends,
  setFriendships,
} from '../../Core/socialgraph/friendships/redux';
import { setNotiCount, setChatNotiCount, setChatNotifications, setFriendNotifications, setFriendNotiCount } from '../../Core/notifications/redux';
import { setUsers } from '../../Core/onboarding/redux/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import * as firebaseFriendship from '../../Core/socialgraph/friendships/firebase/friendship';
import FriendshipManager from '../../Core/socialgraph/friendships/firebase/friendshipManager';
import { TouchableOpacity, View, Image, Text, Alert, StyleSheet, ToastAndroid, BackHandler } from 'react-native';
import { firebaseNotification } from '../../Core/notifications';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import LoginManager from '../../manager/LoginManager';
import PushManager from '../../manager/PushManager';
import AsyncStorage from '@react-native-community/async-storage';
import { geoFirestore } from '../../Core/firebase';
import Geolocation from '@react-native-community/geolocation';
import { firebaseUser } from '../../Core/firebase';
import messaging from '@react-native-firebase/messaging';
import BGActions from '../../../BGActions';

class ChatScreen extends Component {
  static contextType = ReactReduxContext;


  static navigationOptions = ({ screenProps, navigation }) => {
    // let currentTheme = AppStyles.navThemeConstants['light'];
    let currentTheme = AppStyles.navThemeConstants['light']
    const { params = {} } = navigation.state;

    const androidNavIconOptions = [
      // {
      //   key: 'addFriend',
      //   onSelect: params.addFriend,
      //   iconSource: 'user-plus',
      //   name: IMLocalized('Add friends')
      // },
      {
        key: 'scan',
        onSelect: params.goScan,
        iconSource: 'maximize',
        name: IMLocalized('scan')
      },
      {
        key: 'groupChat',
        onSelect: params.goGroupChat,
        iconSource: 'edit',
        name: IMLocalized('Group Chats')
      },
      {
        key: 'contact',
        onSelect: params.goContacts,
        iconSource: 'users',
        name: IMLocalized('contact')
      },
    ];

    const navMenuRef = React.createRef();

    return {
      headerTitle: (
        <View style={{flexDirection: 'row',
        alignItems: 'center',}}>
          <Image source={require('../../assets/img/logo_only.png')} style={{ width: 40, height: 40, marginLeft: 10 }} />
          <Text style={{ color: '#3494c7', fontSize: 22, paddingLeft: 6, fontFamily: AppStyles.customFonts.klavikaMedium }}>Nine Chat</Text>
        </View>
      ),
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium,
        color: '#3494c7'
      },
      headerRight: (
        <View style={styles.doubleNavIcon}>
          <TouchableOpacity
            style={styles.bell}
            onPress={params.addFriend}
          >
            {
              navigation.getParam('showFriendNoti') == true && (
              <TouchableOpacity style={styles.notiCount}
                onPress={params.addFriend}
                >
                <Text style={styles.noticount}>
                  {navigation.getParam('friendNotiCount')} 
                </Text>
            </TouchableOpacity>
            )}
            <Icon name='people' size={hp(3)} color='#345476' />
          </TouchableOpacity>   
          
          <Menu ref={navMenuRef} style={{ width: 40 }}>
            <MenuTrigger>
              <Icon name='add' size={hp(3.4)} color='#3494c7' style=
                  {{
                    alignSelf: 'center',
                    paddingRight: 6
                  }} />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  ...styles.navIconMenuOptions,
                  backgroundColor: 'white',
                },
              }}>
            {androidNavIconOptions.map((option) => (
              <MenuOption onSelect={option.onSelect}>
                <View style={styles.row}>
                  <IconFeather name={option.iconSource} size={26} color='#546d7a' />
                  <Text style={styles.name}>{option.name}</Text>
                </View>

              </MenuOption>

            ))}
            </MenuOptions>
          </Menu>
        </View>

                ),

       
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isSearchModalOpen: false,
      filteredFriendships: [],
      loading: true,
      notiCount: 0,
      showQR: false,
      friends: [],
      outboundFriends: [],
      inboundFriends: [],
      hasPermission: true,
      username: '',
      insertStatus: true,
      showOfflineMessage: true,
      chatNotis: []
    };
    this.searchBarRef = React.createRef();
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });

  }

  onNotificationCollection = (notifications) => {
    //console.log("NNNN>" + JSON.stringify(notifications))
    let count = 0;
    let chatCount = 0;
    let chatNotis = [];
    let friendNotiCount = 0;
    let friendNotis = [];

    for (let i = 0; i <= notifications.length; i++) {
      if (i == notifications.length) {
        if(chatCount == 0){
          this.props.navigation.setParams({ showCount: false });
        }
        else{
          this.props.navigation.setParams({ showCount: true });
        }
        if(friendNotiCount == 0){
          this.props.navigation.setParams({ showFriendNoti: false });
        }
        else{
          this.props.navigation.setParams({ showFriendNoti: true });
        }
        this.props.setChatNotifications(chatNotis)
        this.props.setNotiCount(count);
        this.props.setChatNotiCount(chatCount);
        this.props.setFriendNotifications(friendNotis);
        this.props.setFriendNotiCount(friendNotiCount);
        this.props.navigation.setParams({ notiCount: chatCount, friendNotiCount });
      }
      else if(!notifications[i].checkedCount) { 
        if(notifications[i].type == 'chat_message'){
          chatNotis.push(notifications[i])
          chatCount++;
        }
        else if(notifications[i].type == 'friend_request'){
          friendNotis.push(notifications[i]);
          friendNotiCount++;
        }
        else
          count++;
      }
    }
  };

  componentDidMount() {
    AsyncStorage.setItem('AppKilled', 'false');
    const user = this.props.user;
    AsyncStorage.setItem('voximplantUserID', user.id)
    this.addLocation(user.id);
      this.friendshipTracker = new FriendshipTracker(
        this.context.store,
        user.id || user.userID,
        true,
        false,
        true,
      );
    PushManager.init();
    LoginManager.getInstance().loginWithPassword(user.id + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
    LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
    LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
    LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
    LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);
    LoginManager.getInstance().on('onConnectionEstablished', (reason) => this.onConnectionEstablished(reason));
    LoginManager.getInstance().on('AuthResult', (reason) => this.onAuthResult(reason));

    const self = this;
    self.props.navigation.setParams({
      openDrawer: self.openDrawer,
      addFriend: self.addFriend,
      goScan: self.goScan,
      goGroupChat: self.goGroupChat,
      goContacts: self.goContacts
    });

    this.friendshipTracker.subscribeIfNeeded();

    this.friendshipManager = new FriendshipManager(
      this.props.users,
      false,
      this.onFriendshipsRetrieved,
    );

    this.notificationUnsubscribe = firebaseNotification.subscribeNotifications(
      user.id,
      this.onNotificationCollection,
    );

    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        )
    })

      // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      //   console.log("[CHATSCREEN] BackgroundMessage>>"+ remoteMessage.notification.body);
      //   let message = remoteMessage.notification.body;
      //   if(message && message.substring(0,9) == 'Call from'){
      //       AsyncStorage.getItem('voximplantUserID').then((value) => {
      //         console.log("Logging In to VOXIMPLANT...")
      //         LoginManager.getInstance().loginWithPassword(value + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
      //       });
      //     }
      // });
  }

  addLocation = (id) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const res = geoFirestore.addGeolocation(id, position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        //alert(error.message);
      },
    );
  };

  onAuthResult = (reason) => {
    console.log("Voximplant onAuthResult>>"+ reason)
  }

  onConnectionFailed = (reason) => {
    console.log("Voximplant Connection failed>>"+ reason)
    AsyncStorage.setItem('voximplantState', 'failed');
    if(this.state.showOfflineMessage){
      //this.showToast('Failed to connect, check internet settings')
      this.setState({ showOfflineMessage: false })
    }
  }

  showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  onLoggedIn = (reason) => {
    (async() => {
      console.log("Voximplant onLoggedIn>>" , reason)
      AsyncStorage.setItem('usernameValue', reason);
      AsyncStorage.setItem('voximplantState', 'success');
  })();
}

  onLoginFailed = (reason) => {
    //console.log("Voximplant onLoginFailed>>" + reason)
    AsyncStorage.setItem('voximplantState', 'failed');
    if(this.state.showOfflineMessage){
      //this.showToast('Failed to connect, check internet settings')
      this.setState({ showOfflineMessage: false })
    }
  }

  onFriendshipsRetrieved = (
    mutualFriendships,
    inboundFriendships,
    outboundFriendships,
  ) => {
    console.log("Outbound>>"+ JSON.stringify(outboundFriendships));
    console.log("inBound>>"+ JSON.stringify(inboundFriendships));
    this.setState({
      loading: false,
      friends: mutualFriendships.map((friendship) => friendship.user),
      outboundFriends: outboundFriendships,
      inboundFriends: inboundFriendships
    });
  };

  onBackButtonPressAndroid = () => {
    Alert.alert("", IMLocalized("Are you sure you want to exit app"), [
      {
        text: IMLocalized('CancelTransfer'),
        onPress: () => null,
        style: "cancel"
      },
      { text: IMLocalized('YesExit'), onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  _connectionClosed = () => {
    console.log("[ChatScreen] Connection Closed...");
    AsyncStorage.setItem('voximplantState', 'failed');
    if(this.state.showOfflineMessage){
      //this.showToast('Failed to connect, check internet settings')
      this.setState({ showOfflineMessage: false })
    }
  };

  onConnectionEstablished = (reason) => {
    console.log("[ChatScreen] Connection Established...", reason)
    this.setState({ showOfflineMessage: true });
  }

  componentWillUnmount() {
    AsyncStorage.setItem('AppKilled', 'true');
    this.friendshipTracker.unsubscribe();
    this.friendshipManager && this.friendshipManager.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
    LoginManager.getInstance().off('onConnectionClosed', this._connectionClosed);
    LoginManager.getInstance().off('onConnectionEstablished', this.onConnectionEstablished);
  }

  updateFilteredFriendships = (keyword) => {
    this.setState({ keyword: keyword });
    const filteredFriendships = filteredNonFriendshipsFromUsers(
      keyword,
      this.props.users,
      this.props.friendships,
    ).filter(
      (element) => element.user && element.user.id != this.props.user.id,
    );
    this.setState({ filteredFriendships });
  };

  onSearchTextChange = (text) => {
    this.updateFilteredFriendships(text);
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  addFriend = () => {
    this.props.navigation.navigate('ChatPeopleStack')
  }

  goScan = async () => {
      this.setState({ showQR: true });
  }

  goGroupChat = () => {
    this.props.navigation.navigate('GroupChat') 
  }

  goContacts = () => {
    this.props.navigation.navigate('Contacts')  
  }

  onAddFriendWithQR = (otherID, otherUser) => {
    firebaseFriendship.addFriendRequest(
      this.props.user,
      otherUser,
      true,
      false,
      true,
      IMLocalized('sent you a friend request.'),
      ({ success, error }) => {
        if (error) {
          alert(error);
        } else {
          ToastAndroid.show('Sent a friend request to ' + otherUser.firstName, ToastAndroid.LONG);
          const newFriendId = otherID;
          const friendships = this.props.friendships;
          const detectedFriendship = friendships.find(
            (friendship) =>
              friendship.user.id == newFriendId &&
              friendship.type == FriendshipConstants.FriendshipType.reciprocal,
          );
          if (detectedFriendship) {
            firebaseFriendship.updateFeedsForNewFriends(
              this.props.user.id,
              newFriendId,
            );
          }
        }
      },
    );
  };

  
  onQRUserUpdate = (qrdata) => {
    console.log("in qrUser..");
    const alreadyfriend = this.props.friends.find((friend) => friend.id == qrdata.id);
    if (alreadyfriend != undefined) {
      ToastAndroid.show('You are already friend with ' + qrdata.firstName, ToastAndroid.LONG);
    }
    else {
      if (this.state.outboundFriends.length != 0) {
        for (let i = 0; i <= this.state.outboundFriends.length; i++) {
          if (i == this.state.outboundFriends.length) {
            this.onAddFriendWithQR(qrdata.id, qrdata);
          }
          else {
            if (this.state.outboundFriends[i].user.id == qrdata.id) {
              ToastAndroid.show('You already sent a friend request to ' + qrdata.firstName, ToastAndroid.LONG);
              break;
            }
          }
        }
      }
      else {
        console.log("no request...")
        this.onAddFriendWithQR(qrdata.id, qrdata);
      }
    }
  }

  onSuccess = async (e) => {
    this.setState({ showQR: false })

    let userData = await firebaseUser.getUserData(e.data);

    console.log("dat>>"+ JSON.stringify(userData))
    this.onQRUserUpdate(userData);

    //alert('ffff')
    //  var qrdata = JSON.parse(e.data);
    // console.log("qr result>>" + JSON.stringify(qrdata))
    // this.setState({ showQR: false })

    // const alreadyfriend = this.props.friends.find((friend) => friend.id == qrdata.id);
    // //console.log("alreadyFriend>>" + JSON.stringify(alreadyfriend));

    // if (alreadyfriend != undefined) {
    //   ToastAndroid.show('You are already friend with ' + qrdata.firstName, ToastAndroid.LONG);
    // }
    // else {
    //   if (this.state.outboundFriends.length != 0) {
    //     for (let i = 0; i <= this.state.outboundFriends.length; i++) {
    //       if (i == this.state.outboundFriends.length) {
    //         this.onAddFriendWithQR(qrdata.id, qrdata);
    //       }
    //       else {
    //         if (this.state.outboundFriends[i].user.id == qrdata.id) {
    //           ToastAndroid.show('You already sent a friend request to ' + qrdata.firstName, ToastAndroid.LONG);
    //           break;
    //         }
    //       }
    //     }
    //   }
    //   else {
    //     this.onAddFriendWithQR(qrdata.id, qrdata);
    //   }
    // } 
  };

  onFriendItemPress = (friend) => {
    //console.log("Friend>>"+ JSON.stringify(friend))
    console.log("Press 1..")
    const id1 = this.props.user.id || this.props.user.userID;
    const id2 = friend.id || friend.userID;
    if (id1 == id2) {
      return;
    }
    const channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: [friend],
    };

    this.setState({ isSearchModalOpen: false });
    this.props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles
    });
  };

  removeFriendshipAt = async (index) => {
    const newFilteredFriendships = [...this.state.filteredFriendships];
    await newFilteredFriendships.splice(index, 1);
    this.setState({
      filteredFriendships: [...newFilteredFriendships],
    });
  };

  onSearchBar = async () => {
    this.props.navigation.navigate('FriendsChatPeopleStack')
  };

  onSearchModalClose = () => {
    this.setState({
      isSearchModalOpen: false,
    });
  };

  onSearchClear = () => {
    this.updateFilteredFriendships('');
  };

  onEmptyStatePress = () => {
    this.onSearchBar();
  };

  onSenderProfilePicturePress = (item) => {
    console.log(item);
  };

  render() {
    return (
        <IMChatHomeComponent
          loading={this.state.loading}
          searchBarRef={this.searchBarRef}
          friends={this.props.friends}
          onFriendItemPress={this.onFriendItemPress}
          onSearchBarPress={this.onSearchBar}
          searchData={this.state.filteredFriendships}
          onSearchTextChange={this.onSearchTextChange}
          isSearchModalOpen={this.state.isSearchModalOpen}
          onSearchModalClose={this.onSearchModalClose}
          onSearchBarCancel={this.onSearchBar}
          onSearchClear={this.onSearchClear}
          appStyles={AppStyles}
          navigation={this.props.navigation}
          onEmptyStatePress={this.onEmptyStatePress}
          onSenderProfilePicturePress={this.onSenderProfilePicturePress}
          audioVideoChatConfig={this.props.audioVideoChatConfig}
          showQR={this.state.showQR}
          disableQR={() => this.setState({ showQR: false })}
          onSuccess={this.onSuccess}
          hasPermission={this.state.hasPermission}
          groupScreen={false}
        />
    );
  }
}

ChatScreen.propTypes = {
  friends: PropTypes.array,
  users: PropTypes.array,
};

const mapStateToProps = ({ friends, auth, audioVideoChat, notifications }) => {
  return {
    payNotiCount: notifications.payNotiCount,
    user: auth.user,
    friends: friends.friends,
    users: auth.users,
    friendships: friends.friendships,
    audioVideoChatConfig: audioVideoChat,
  };
};

const styles = StyleSheet.create({
  navIconMenuOptions: {
    flexDirection: 'row',
    width: null,
    padding: 15,
    paddingRight: 50,
    borderRadius: 10,
    marginTop: 40,
    marginRight: 6
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 13,
    //borderBottomWidth: 0.2,
    //borderBottomColor: 'gray'
  },
  name: {
    fontSize: 17,
    paddingLeft: 10,
    color: '#546d7a'
  },
    doubleNavIcon: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 25,
      height: 25,
      margin: 6
    },
    notiCount: {
      backgroundColor: 'green',
      width: 28,
      height: 20,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#216a91',
      position: 'absolute',
      marginBottom: 15,
      marginLeft: 15,
      zIndex: 2
    },
    bell: {
      marginRight: hp(1.5)
    },
    noticount: {
      color: 'white', 
      fontSize: hp(1.2)
    },
    notiCount: {
      backgroundColor: 'green',
      width: hp(3.2),
      height: hp(2.2),
      borderRadius: hp(0.8),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#216a91',
      position: 'absolute',
      marginTop: hp(-1.1),
      marginLeft: hp(1.3),
      zIndex: 2,
    },
    image: {
      width: hp(2.7),
      height: hp(2.7),
    },
})

export default connect(mapStateToProps, {
  setFriends,
  setUsers,
  setFriendships,
  setNotiCount,
  setChatNotiCount,
  setChatNotifications,
  setFriendNotifications,
  setFriendNotiCount
})(ChatScreen);

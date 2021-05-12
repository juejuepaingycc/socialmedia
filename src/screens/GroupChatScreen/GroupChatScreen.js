import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { IMChatHomeComponent } from '../../Core/chat';
import { TNTouchableIcon } from '../../Core/truly-native';
import {
  FriendshipConstants,
  filteredNonFriendshipsFromUsers,
} from '../../Core/socialgraph/friendships';
import { TNActivityIndicator } from '../../Core/truly-native';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import {
  setFriends,
  setFriendships,
} from '../../Core/socialgraph/friendships/redux';
import { setUsers } from '../../Core/onboarding/redux/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import * as firebaseFriendship from '../../Core/socialgraph/friendships/firebase/friendship';
import FriendshipManager from '../../Core/socialgraph/friendships/firebase/friendshipManager';
import { TouchableOpacity, BackHandler, Platform, StyleSheet, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


class GroupChatScreen extends Component {
  static contextType = ReactReduxContext;

  static navigationOptions = ({ screenProps, navigation }) => {
    // let currentTheme = AppStyles.navThemeConstants['light'];
    let currentTheme = AppStyles.navThemeConstants['light']
    const { params = {} } = navigation.state;
    if(navigation.getParam('shareStatus')){
      return {
        headerTitle: IMLocalized('Forward Post'),
        headerTitleStyle: {
          fontFamily: AppStyles.customFonts.klavikaMedium,
          color: 'black',
          fontSize: 25
        },
        headerLeft: Platform.OS === 'android' && (
          <TouchableOpacity onPress={params.goingBack}>
            <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: currentTheme.backgroundColor,
        },
        headerTintColor: currentTheme.fontColor,
      };
    }
    else if(navigation.getParam('forwarded')){
      return {
        headerTitle: IMLocalized('Send To'),
        headerTitleStyle: {
          fontFamily: AppStyles.customFonts.klavikaMedium,
          color: 'black',
          fontSize: 25
        },
        headerLeft: Platform.OS === 'android' && (
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: currentTheme.backgroundColor,
        },
        headerTintColor: currentTheme.fontColor,
      };
    }
    else{
      return {
        headerTitle: IMLocalized('Group Chats'),
        headerTitleStyle: {
          fontFamily: AppStyles.customFonts.klavikaMedium,
          color: 'black',
          fontSize: 25
        },
        headerRight: (
          // <TNTouchableIcon
          //   imageStyle={{ tintColor: currentTheme.fontColor }}
          //   iconSource={AppStyles.iconSet.inscription}
          //   onPress={() =>
          //     navigation.navigate('CreateGroup', { appStyles: AppStyles })
          //   }
          //   appStyles={AppStyles}
          // />
          
<TouchableOpacity onPress={() => navigation.navigate('CreateGroup', { appStyles: AppStyles })}>
          <Icon name='add' size={35} color='black' style=
                  {{
                    alignSelf: 'center',
                    paddingRight: 6
                  }} />
          </TouchableOpacity>
        ),
        headerLeft: Platform.OS === 'android' && (
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: currentTheme.backgroundColor,
        },
        headerTintColor: currentTheme.fontColor,
      };
   }
  };

  constructor(props) {
    super(props);
    this.state = {
      isSearchModalOpen: false,
      filteredFriendships: [],
      loading: false,
      notiCount: 0,
      showQR: false,
      friends: [],
      outboundFriends: [],
      hasPermission: null,
      forwarded: false,
      forwardMessage: ''
    };
    this.forwarded = this.props.navigation.getParam('forwarded');
    this.forwardMessage = this.props.navigation.getParam('forwardMessage');
    this.shareStatus = this.props.navigation.getParam('shareStatus')
    this.shareName = this.props.navigation.getParam('shareName');
    this.shareText = this.props.navigation.getParam('shareText')
    this.shareMedia = this.props.navigation.getParam('shareMedia')
    this.sharePostInfo = this.props.navigation.getParam('sharePostInfo');
    this.setState({
      forwarded: this.forwarded,
      forwardMessage: this.forwardMessage
    })
    this.props.navigation.setParams({ 
      goingBack: this.goingBack,
      forwarded: this.forwarded, shareStatus: this.shareStatus });
    this.searchBarRef = React.createRef();
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });
    }

    goingBack = () => {
      console.log("Goin back..")
      this.props.navigation.goBack();
    }

  componentDidMount() {
    if(!this.state.forwarded){
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status === 'granted') {
          this.setState({ hasPermission: true })
        }
        else {
          this.setState({ hasPermission: false })
        }
      })();
    }

    const user = this.props.user;
    this.friendshipTracker = new FriendshipTracker(
      this.context.store,
      user.id || user.userID,
      true,
      false,
      true,
    );

    const self = this;
    self.props.navigation.setParams({
      openDrawer: self.openDrawer,
      addFriend: self.addFriend,
      goScan: self.goScan,
      goGroupChat: self.goGroupChat,
    });

    this.friendshipTracker.subscribeIfNeeded();

    this.friendshipManager = new FriendshipManager(
      this.props.users,
      false,
      this.onFriendshipsRetrieved,
    );

    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
      })
  }

  onBackButtonPressAndroid = () => {
    if(this.shareStatus)
      this.props.navigation.goBack();
    else
      this.props.navigation.navigate('Chat')
    return true;
  };


  onFriendshipsRetrieved = (
    mutualFriendships,
    inboundFriendships,
    outboundFriendships,
  ) => {
    this.setState({
      friends: mutualFriendships.map((friendship) => friendship.user),
      outboundFriends: outboundFriendships
    });
  };

  componentWillUnmount() {
    this.friendshipTracker.unsubscribe();
    this.friendshipManager && this.friendshipManager.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
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

  goScan = () => {
    this.setState({ showQR: true })
  }

  goGroupChat = () => {
    this.props.navigation.navigate('GroupChat') 
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

  onSuccess = (e) => {
    //alert('ffff')
     var qrdata = JSON.parse(e.data);
    console.log("qr result>>" + JSON.stringify(qrdata))
    this.setState({ showQR: false })

    const alreadyfriend = this.props.friends.find((friend) => friend.id == qrdata.id);
    //console.log("alreadyFriend>>" + JSON.stringify(alreadyfriend));

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
        this.onAddFriendWithQR(qrdata.id, qrdata);
      }
    } 
  };

  onFriendItemPress = (friend) => {
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
      appStyles: AppStyles,
    });
  };

  removeFriendshipAt = async (index) => {
    const newFilteredFriendships = [...this.state.filteredFriendships];
    await newFilteredFriendships.splice(index, 1);
    this.setState({
      filteredFriendships: [...newFilteredFriendships],
    });
  };

  onSearchBar = (keyword) => {
      console.log("search.."+ keyword);
  };

  onSearchModalClose = () => {
    this.setState({
      isSearchModalOpen: false,
    });
  };

  toggleLoading = (loading) => {
    this.setState({ loading })
  }

  onSearchClear = () => {
    this.updateFilteredFriendships('');
  };

  onEmptyStatePress = () => {
    //this.onSearchBar();
    this.props.navigation.navigate('CreateGroup', { appStyles: AppStyles })
  };

  onSenderProfilePicturePress = (item) => {
    console.log(item);
  };

  render() {
    if(this.state.loading)
      return (
        <TNActivityIndicator appStyles={AppStyles} />
      )
    else
      return (
      <IMChatHomeComponent
          forwarded={this.forwarded}
          forwardMessage={this.forwardMessage}
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
          groupScreen={true}
          toggleLoading={this.toggleLoading}
          shareStatus={this.shareStatus}
          shareText={this.shareText}
          shareMedia={this.shareMedia}
          shareName={this.shareName}
          sharePostInfo={this.sharePostInfo}
        />
        )
  }
}

GroupChatScreen.propTypes = {
  friends: PropTypes.array,
  users: PropTypes.array,
};

const mapStateToProps = ({ friends, auth, audioVideoChat }) => {
  return {
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
  }
})

export default connect(mapStateToProps, {
  setFriends,
  setUsers,
  setFriendships,
})(GroupChatScreen);

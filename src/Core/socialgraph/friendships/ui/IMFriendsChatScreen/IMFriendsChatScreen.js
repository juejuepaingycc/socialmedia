import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { TNTouchableIcon } from '../../../../truly-native';
import {
  filteredNonFriendshipsFromUsers,
  FriendshipConstants,
  IMFriendsListComponent,
} from '../..';
import { setFriendships, setFriends } from '../../redux';
import { setUsers } from '../../../../onboarding/redux/auth';
import { IMLocalized } from '../../../../localization/IMLocalization';
import FriendshipTracker from '../../firebase/tracker';
import { TouchableOpacity, BackHandler, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppStyles from '../../../../../AppStyles';

class IMFriendsChatScreen extends Component {
  static contextType = ReactReduxContext;

  static navigationOptions = ({ navigation }) => {
    let appStyles = AppStyles;
    let showDrawerMenuButton = navigation.state.params.showDrawerMenuButton;
    let headerTitle =
      navigation.state.params.friendsScreenTitle || IMLocalized('Friends');
    let currentTheme = AppStyles.navThemeConstants['light'];

    return {
      headerTitle: headerTitle,
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerLeft: showDrawerMenuButton && (
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.appStyles =
      this.props.navigation.state.params.appStyles ||
      this.props.navigation.getParam('appStyles');
    this.followEnabled =
      this.props.navigation.state.params.followEnabled ||
      this.props.navigation.getParam('followEnabled');

    this.state = {
      isSearchModalOpen: false,
      filteredFriendships: [],
      isLoading: false,
      onlyFriends: [],
      originalFriends: []
    };
    this.searchBarRef = React.createRef();
    this.searchBarRef2 = React.createRef();

    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        )
      });
  }

  componentDidMount() {
    const user = this.props.user;
    this.friendshipTracker = new FriendshipTracker(
      this.context.store,
      user.id || user.userID,
      this.followEnabled,
      this.followEnabled,
      this.followEnabled,
    );
    this.friendshipTracker.subscribeIfNeeded();

    this.props.navigation.setParams({
      toggleCamera: this.toggleCamera,
      openDrawer: this.openDrawer,
    });

    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        )
        })

    var friends = this.props.friendships.filter((friendShip) => friendShip.type == "reciprocal");
    console.log("onlyFriends>>"+ JSON.stringify(friends[0]));
    
    this.setState({ 
      onlyFriends: friends,
      originalFriends: friends
   });
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate('Chat')
    return true;
  };

  componentWillUnmount() {
    this.friendshipTracker.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  searchFriendsWithKeyword = (keyword)  => {
    console.log("search.."+ keyword);
    const friends = this.state.originalFriends.filter((friend) => {
      //console.log("fff>>"+ JSON.stringify(friend))
      if(friend.user.firstName.includes(keyword) || friend.user.lastName.includes(keyword)){
        return friend;
      }
    })
    this.setState({ onlyFriends: friends })
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

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onSearchBar = () => {
    this.setState((prevState) => ({
      isSearchModalOpen: !prevState.isSearchModalOpen,
    }));
    setTimeout(() => {
      if (this.searchBarRef.current) {
        this.searchBarRef.current.focus();
      }
    }, 500);
  };

  onSearchModalClose = () => {
    this.setState({
      isSearchModalOpen: false,
    });
  };

  onSearchTextChange = (text) => {
    this.updateFilteredFriendships(text);
  };

  onSearchTextChange2 = (text) => {
    this.searchFriendsWithKeyword(text);
  };

  onSearchClear = () => {
    this.updateFilteredFriendships('');
  };

  onSearchClear2 = () => {
    this.searchFriendsWithKeyword('');
  };

  onSearchBarCancel2 = () => {
    this.props.navigation.goBack();
  }

  onFriendCancel = (item, index) => {
    if (
      this.state.isLoading ||
      (item.user && item.user.id == this.props.user.id)
    ) {
      return;
    }
    this.onCancel(item, index);
  };

  onFriendAction = (item, index) => {
    if (
      this.state.isLoading ||
      (item.user && item.user.id == this.props.user.id)
    ) {
      return;
    }
    switch (item.type) {
      case FriendshipConstants.FriendshipType.none:
        this.onAddFriend(item, index);
        break;
      case FriendshipConstants.FriendshipType.reciprocal:
        this.onUnfriend(item, index);
        break;
      case FriendshipConstants.FriendshipType.inbound:
        this.onAccept(item, index);
        break;
      case FriendshipConstants.FriendshipType.outbound:
        this.onCancel(item, index);
        break;
    }
  };

  onUnfriend = (item, index) => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to unfriend?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('OK'),
          onPress: () => {
            this.setState({ isLoading: true });
            this.friendshipTracker.unfriend(this.props.user, item.user, (respone) => {
              this.setState({ isLoading: false });
            });
          }
        }
    ]
    );
  };

  onAddFriend = (item, index) => {
    const oldFilteredFriendships = this.state.filteredFriendships;
    this.removeFriendshipAt(index);
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      item.user,
      'sent you a friend request.',
      'friend_request',
      (response) => {
        if (response && response.error) {
          this.setState({
            filteredFriendships: oldFilteredFriendships,
          });
        }
      },
    );
  };

  onCancel = (item, index) => {
    console.log('cancel user>>' + JSON.stringify(item.user));
    this.setState({ isLoading: true });
    this.friendshipTracker.cancelFriendRequest(
      this.props.user,
      item.user,
      (response) => {
        this.setState({ isLoading: false });
      },
    );
  };

  onAccept = (item, index) => {
    this.setState({ isLoading: true });
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      item.user,
      'accepted your friend request.',
      'accept_friend_request',
      (response) => {
        this.setState({ isLoading: false });
      },
    );
  };

  removeFriendshipAt = async (index) => {
    const newFilteredFriendships = [...this.state.filteredFriendships];
    await newFilteredFriendships.splice(index, 1);
    this.setState({
      filteredFriendships: [...newFilteredFriendships],
    });
  };

  onFriendItemPress = (friend) => {
    let friendship = friend.user;
    const id1 = this.props.user.id || this.props.user.userID;
    const id2 = friendship.id;
    if (id1 == id2) {
      return;
    }
    const channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: [friendship],
    };
    this.props.navigation.navigate('PersonalFriendsChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  onEmptyStatePress = () => {
    this.onSearchBar();
  };

  render() {
    const emptyStateConfig = {
      title: IMLocalized('No Friends'),
      description: IMLocalized(
        'Make some friend requests and have your friends accept them. All your friends will show up here.',
      ),
      buttonName: IMLocalized('Find friends'),
      onPress: this.onEmptyStatePress,
    };

    return (
      <IMFriendsListComponent
        searchBarRef={this.searchBarRef}
        searchBarRef2={this.searchBarRef2}
        friendsData={this.state.onlyFriends}
        searchBar={true}
        onSearchBarPress={this.onSearchBar}
        searchData={this.state.filteredFriendships}
        onSearchTextChange={this.onSearchTextChange}
        onSearchTextChange2={this.onSearchTextChange2}
        onSearchClear={this.onSearchClear}
        onSearchClear2={this.onSearchClear2}
        isSearchModalOpen={this.state.isSearchModalOpen}
        onSearchModalClose={this.onSearchModalClose}
        onSearchBarCancel={this.onSearchBar}
        onSearchBarCancel2={this.onSearchBarCancel2}
        onFriendItemPress={this.onFriendItemPress}
        onFriendAction={this.onFriendAction}
        onFriendCancel={this.onFriendCancel}
        appStyles={this.appStyles}
        onEmptyStatePress={this.onEmptyStatePress}
        isLoading={this.state.isLoading}
        followEnabled={this.followEnabled}
        emptyStateConfig={emptyStateConfig}
        showAction={false}
      />
    );
  }
}

IMFriendsChatScreen.propTypes = {
  friends: PropTypes.array,
  friendships: PropTypes.array,
  users: PropTypes.array,
  searchFriends: PropTypes.func,
  setFriends: PropTypes.func,
};

const mapStateToProps = ({ friends, auth, language }) => {
  return {
    friendships: friends.friendships,
    users: auth.users,
    friends: friends.friends,
    user: auth.user,
    language: language
  };
};

export default connect(mapStateToProps, {
  setUsers,
  setFriends,
  setFriendships,
})(IMFriendsChatScreen);

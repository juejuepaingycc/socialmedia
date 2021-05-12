import React, { Component } from 'react';
import { Platform, Alert, View, Text, StyleSheet, Share, BackHandler, Modal, ToastAndroid, TouchableOpacity } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import { Profile } from '../../components';
import { firebaseUser } from '../../Core/firebase';
import * as firebaseFriendship from '../../Core/socialgraph/friendships/firebase/friendship';
import { firebaseStorage } from '../../Core/firebase/storage';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { setUserData } from '../../Core/onboarding/redux/auth';
import SocialNetworkConfig from '../../SocialNetworkConfig';
import { FriendshipConstants } from '../../Core/socialgraph/friendships';
import {
  firebasePost,
  firebaseComment,
} from '../../Core/socialgraph/feed/firebase';
import { reportingManager } from '../../Core/user-reporting';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FriendshipManager from '../../Core/socialgraph/friendships/firebase/friendshipManager';
import FeedManager from '../../Core/socialgraph/feed/FeedManager';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { 
  removeProfilePost, 
  removePost, 
  editPostReactions, 
  editProfilePostReactions, 
  editOtherProfilePostReactions,
  setEditedProfileStatus, 
  setProfileFeeds,
  setOtherProfileFeeds } from '../../Core/socialgraph/feed/redux';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

class ProfileScreen extends Component {
  static contextType = ReactReduxContext;

  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    const { params = {} } = navigation.state;
    return {
      headerTitle: (
        <View style={{flexDirection: 'row',
        alignItems: 'center',}}>
          <Text style={{ color: '#3494c7', fontSize: 22, paddingLeft: 16, fontFamily: AppStyles.customFonts.klavikaMedium }}>
          {IMLocalized('Profile')}
          </Text>
        </View>
      ),
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium,
        color: '#3494c7'
      },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.otherUser = this.props.navigation.getParam('user');
    this.fromChat = this.props.navigation.getParam('fromChat');
    this.fromMoment = this.props.navigation.getParam('fromMoment');
    const shouldAddFriend = this.otherUser
      ? !this.props.friends.find((friend) => friend.id == this.otherUser.id)
      : false;
    this.state = {
      isCameraOpen: false,
      isMediaViewerOpen: false,
      selectedFeedItems: [],
      friends: [],
      loading: true,
      userFeed: [],
      uploadProgress: 0,
      shouldAddFriend: shouldAddFriend,
      isFetching: false,
      selectedMediaIndex: null,
      showQR: false,
      scanned: false,
      outboundFriends: [],
      userFeeds: [],
      hasPermission: null,
      nearbyFriends: [],
      moreLoading: false,
      latestDate: null,
      friendsArr: [],
      authors: [],
      status: '',
      moreData: true
    };

    this.isFetching = false;
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) => {
        this.willBlur = false;
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );

    this.willBlur = false;
    this.stackKeyTitle = 'Profile';
    const keyTitle = this.props.navigation.getParam('stackKeyTitle');
    if (keyTitle) {
      this.stackKeyTitle = keyTitle;
    }
    this.ProfileSettingsTitle = 'ProfileProfileSettings';
    this.lastScreenTitle = this.props.navigation.getParam('lastScreenTitle');
    if (this.lastScreenTitle) {
      this.ProfileSettingsTitle = this.lastScreenTitle + 'ProfileSettings';
    } else {
      this.lastScreenTitle = 'Profile';
    }
  }

  componentDidUpdate() {
    if(this.props.editedProfileStatus == 'edited'){
      this.props.setEditedProfileStatus(false);
      this.setState({ userFeeds: this.props.posts })
    }
    else if(this.props.editedProfileStatus){
      this.props.setEditedProfileStatus(false);
      let feeds = this.state.userFeeds.map((feed) => 
      feed.id === this.props.profileEditedPost.id ? 
        { ...feed, ...this.props.profileEditedPost} 
        : feed
      )
      this.setState({ userFeeds: feeds })
    }
  }

  componentDidMount() {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === 'granted') {
        this.setState({ hasPermission: true })
      }
      else {
        this.setState({ hasPermission: false })
      }
    })();

    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) => {
        this.willBlur = true;
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );

    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      otherUser: this.otherUser,
    });
    this.feedManager = new FeedManager(this.context.store, this.props.user.id);
    this.feedManager.subscribeIfNeeded();

    this.friendshipManager = new FriendshipManager(
      this.props.users,
      false,
      this.onFriendshipsRetrieved,
    );
    if (this.otherUser && this.otherUser.id != this.props.user.id) {
      
      this.friendshipTracker = new FriendshipTracker(
        this.context.store,
        this.otherUser.id,
        true,
        false,
        true,
      );
      this.getFirstProfileFeeds(this.otherUser)
      this.setState({
        loading: true,
      });
      this.friendshipManager.fetchFriendships(this.otherUser.id);
    } else {
      this.friendshipTracker = new FriendshipTracker(
        this.context.store,
        this.props.user.id,
        true,
        false,
        true,
      );
      this.getFirstProfileFeeds(this.props.user)
      this.friendshipManager.fetchFriendships(this.props.user.id);
      this.setState({ loading: true });
    }

  }

  getFirstProfileFeeds = (user) => {
    const friendsArr = [{ "user": user }]
    const authors = [user.id]
    let status = 'All';
    if(this.otherUser){
      status = 'Normal'; // 'Normal'
      if (this.state.shouldAddFriend) {
        status = 'Public';
      }
    }

    this.setState({ friendsArr, authors, status });
    this.feedManager.getFirstProfileFeedsFromAPI(friendsArr, authors, status).then((response) => {
      if(response && response.length > 0){
        //console.log("Profile getFirstFeedsFromAPI response>>", response[response.length-1]);
        var tempArr = response.splice(0, response.length-1);
        this.setState({ latestDate: response[response.length-1] });
        this.getReactionForFeeds(tempArr, false);
      }
      else{
        this.props.setOtherProfileFeeds([])
      }
    });
  }

  getReactionForFeeds = (tempArr, moreStatus) => {
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
        let timeObj = {
          "seconds": tempArr[index].createdAt._seconds,
          "nanoseconds": tempArr[index].createdAt._nanoseconds
        }
        tempArr[index].createdAt = timeObj;
  
        tempArr[index]['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
        tempArr[index]['gaveReaction'] = 'thumbsupUnfilled';
  
        if(tempArr[index].postReactions){
          tempArr[index].postReactions.map((reaction) => {
            if(this.props.user.id == reaction.userID){
              if(reaction.reaction == 'like')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['like'];
                tempArr[index]['gaveReaction'] = 'like';
              }
              else if(reaction.reaction == 'love')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['love'];
                tempArr[index]['gaveReaction'] = 'love'
              }
              else if(reaction.reaction == 'angry')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['angry'];
                tempArr[index]['gaveReaction'] = 'angry'
              }
              else if(reaction.reaction == 'surprised')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['surprised'];
                tempArr[index]['gaveReaction'] = 'surprised'
              }
              else if(reaction.reaction == 'laugh')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['laugh'];
                tempArr[index]['gaveReaction'] = 'laugh'
              }
              else if(reaction.reaction == 'cry')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['cry'];
                tempArr[index]['gaveReaction'] = 'cry'
              }
            }
          })
        }
      }
      else{
        if(moreStatus){ //pagination feeds
          let newArr = [ ...this.state.userFeeds, ...tempArr ];
          this.setState({ userFeeds: newArr });
          if(this.otherUser)
            this.props.setOtherProfileFeeds(newArr)
          else
            this.props.setProfileFeeds(newArr);
        }
        else{ //first time
          this.setState({ userFeeds: tempArr, loading: false });
          if(this.otherUser)
            this.props.setOtherProfileFeeds(tempArr)
          else
            this.props.setProfileFeeds(tempArr);
        }
      }
    } 
  }
  
  componentWillUnmount() {
    this.willBlur = true;
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.currentProfileFeedUnsubscribe && this.currentProfileFeedUnsubscribe();
    this.currentUserUnsubscribe && this.currentUserUnsubscribe();
    this.friendshipManager && this.friendshipManager.unsubscribe();
  }

  onCurrentUserUpdate = (user) => { };

  updateNearByFriends = (user) => {
    let arr = this.state.nearbyFriends;
    arr.push(user);
    this.setState({ nearbyFriends: arr })
  }

  onFriendshipsRetrieved = (
    mutualFriendships,
    inboundFriendships,
    outboundFriendships,
  ) => {
    this.setState({
      loading: false,
      friends: mutualFriendships.map((friendship) => friendship.user),
      outboundFriends: outboundFriendships
    });
  };

  onBackButtonPressAndroid = () => {
    if(this.fromChat)
      this.props.navigation.navigate('Chat')
    else if(this.fromMoment)
      this.props.navigation.navigate('Feed')
    else{
      this.props.setOtherProfileFeeds([]);
      this.props.navigation.navigate('Profile')
    }
    return true;
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onAppSettingPress = () => {
    this.props.navigation.navigate('AppSettings')
  }

  onNearByPress = async () => {
    this.props.navigation.navigate('Nearby', { userID: this.props.user.id })
  }

  onVideoAlbumPress = () => {
    let name;
    if(this.otherUser){
      name = this.otherUser.firstName + "'s"
    }
    else{
      name = 'My'
    }
    if(this.otherUser)
      this.props.navigation.navigate('Album', { 
        currentUserPosts: this.props.otherPosts, 
        name,
        type: 'Video',
        title: name + ' Video ' + IMLocalized('VideoAlbum')
      })
    else
      this.props.navigation.navigate('Album', { 
        currentUserPosts: this.props.posts, 
        name,
        type: 'Video',
        title: name + ' Video ' + IMLocalized('VideoAlbum')
      })
  }

  onAlbumPress = () => {
    let name;
    if(this.otherUser){
      name = this.otherUser.firstName + "'s"
    }
    else{
      name = 'My'
    }
    if(this.otherUser){
      console.log("OtherUser..")
      this.props.navigation.navigate('Album', { 
        currentUserPosts: this.props.otherPosts, 
        name,
        type: 'Photo',
        title: name + ' Photo ' + IMLocalized('Album')
      })
    }
    else
      this.props.navigation.navigate('Album', { 
        currentUserPosts: this.props.posts, 
        name,
        type: 'Photo',
        title: name + ' Photo ' + IMLocalized('Album')
      })
  }

  onBlockUser = async () => {
    Alert.alert('', IMLocalized("Are you sure you want to block this user",), [
      {
        text: IMLocalized('Cancel'),
        style: 'cancel',
      },
      {
        text: IMLocalized('Yes'),
        onPress: this.blockUser
      }
    ]);
  }

  blockUser = () => {
    reportingManager.markAbuse(this.props.user.id, this.otherUser.id, 'block').then((response) => {
        if (!response.error) {
          this.props.setOtherProfileFeeds([]);
          this.props.navigation.navigate('Profile')
          return true;
        }
      });
  }

  onDeleteRequest = () => {
    this.setState({ loading: true });
    this.friendshipTracker.cancelFriendRequest(
      this.otherUser,
      this.props.user,
      (response) => {
        this.setState({ loading: false });
      },
    );
  }

  onMainButtonPress = (action) => {
    console.log("Action>>" + action);
    if (action == 'setting') {
      this.props.navigation.navigate(this.ProfileSettingsTitle, {
        lastScreenTitle: this.lastScreenTitle,
        appStyles: AppStyles,
        appConfig: SocialNetworkConfig,
        screenTitle: IMLocalized('Profile Settings'),
        fromChat: this.fromChat,
        fromMoment: this.fromMoment
      });
    }
    else if(action == 'sendMessage'){
      this.onMessage();
    }
    else if(action == 'addFriend'){
      this.onAddFriend();
    }
    else if(action == 'accept'){
      this.onAccept();
    }
    else if(action == 'cancel'){
      this.onCancel();
    }
  };

  onAccept = () => {
    this.setState({ loading: true });
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      this.otherUser,
      'accepted your friend request.',
      'accept_friend_request',
      (response) => {
        this.setState({ loading: false });
      },
    );
  };

  onCancel = () => {
    this.setState({ loading: true });
    this.friendshipTracker.cancelFriendRequest(
      this.props.user,
      this.otherUser,
      (response) => {
        this.setState({ loading: false });
      },
    );
  };


  onMessage = () => {
    const viewer = this.props.user;
    const otherUser = this.otherUser;
    const viewerID = viewer.id || viewer.userID;
    const friendID = otherUser.id || otherUser.userID;
    let channel = {
      id: viewerID < friendID ? viewerID + friendID : friendID + viewerID,
      participants: [otherUser],
    };
    this.props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  onMediaClose = () => {
    this.setState({ isMediaViewerOpen: false });
  };

  startUpload = async (source) => {
    const self = this;
    self.props.setUserData({
      user: { ...self.props.user, profilePictureURL: source },
    });

    const filename =
      new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? source.replace('file://', '') : source;

    firebaseStorage.uploadFileWithProgressTracking(
      filename,
      uploadUri,
      async (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        self.setState({ uploadProgress });
      },
      async (url) => {
        const data = {
          profilePictureURL: url,
        };
        self.props.setUserData({
          user: { ...self.props.user, profilePictureURL: url },
        });

        firebaseUser.updateUserData(self.props.user.id, data);
        self.setState({ uploadProgress: 0 });
      },
      (error) => {
        self.setState({ uploadProgress: 0 });
        alert(
          IMLocalized(
            'Oops! An error occured while trying to update your profile picture. Please try again.',
          ),
        );
        console.log(error);
      },
    );
  };

  removePhoto = async () => {
    const self = this;
    const res = await firebaseUser.updateUserData(this.props.user.id, {
      profilePictureURL: defaultAvatar,
    });
    if (res.success) {
      self.props.setUserData({
        user: { ...self.props.user, profilePictureURL: defaultAvatar },
      });
    } else {
      alert(
        IMLocalized(
          'Oops! An error occured while trying to remove your profile picture. Please try again.',
        ),
      );
    }
  };

  pressScan = () => {
    this.setState({ showQR: true })
  }

  onAddFriendWithQR = (otherID, otherUser) => {
    const newFriendId = otherID;
    this.setState({ shouldAddFriend: false, loading: true });

    firebaseFriendship.addFriendRequest(
      this.props.user,
      otherUser,
      true,
      false,
      true,
      IMLocalized('sent you a friend request.'),
      'friend_request',
      ({ success, error }) => {
        if (error) {
          alert(error);
          this.setState({ loading: false });
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
          this.setState({ loading: false });
        }
      },
    );
  };

  giveReaction = async (reaction, item, insertStatus) => {
    this.reactionRes = await firebasePost.applyPostReaction(item,  this.props.user, this.props.user.id, reaction, insertStatus,
      this.onGiveReactionDone);
  }

  deletePostReaction = async (item) => {
    this.reactionDelRes = firebasePost.deletePostReaction(item.id, item.authorID, this.props.user.id,
      this.onDeleteReactionDone);
  }

  onDeleteReactionDone = (result) => {
    console.log("remove Reaction>>"+ JSON.stringify(result))
    this.props.editPostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']);
    if(this.otherUser)
      this.props.editOtherProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']);
    else
      this.props.editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']);

    this.changeUpdatedPost(result, 'thumbsupUnfilled');
  }
  
  onGiveReactionDone = (result) => {
    let icon = 'thumbsupUnfilled';
    if(result.gaveReaction == 'like')
                  {
                    icon = AppStyles.iconSet['like'];
                  }
                  else if(result.gaveReaction == 'love')
                  {
                    icon = AppStyles.iconSet['love'];
                  }
                  else if(result.gaveReaction == 'angry')
                  {
                    icon = AppStyles.iconSet['angry'];
                  }
                  else if(result.gaveReaction == 'surprised')
                  {
                    icon = AppStyles.iconSet['surprised'];
                  }
                  else if(result.gaveReaction == 'laugh')
                  {
                    icon = AppStyles.iconSet['laugh'];
                  }
                  else if(result.gaveReaction == 'cry')
                  {
                    icon = AppStyles.iconSet['cry'];
                  }
                  this.props.editPostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon);
                  if(this.otherUser)
                    this.props.editOtherProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon);
                  else
                    this.props.editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon);

    this.changeUpdatedPost(result, icon);
  }

  changeUpdatedPost = (result, icon) => {
    let feeds = this.state.userFeeds.map((feed) => 
    feed.id === result.postID ? 
    { ...feed, postReactions: result.reactions, postReactionsCount: result.postReactionsCount, gaveReaction: result.gaveReaction, iconSource: icon} 
    : feed
    )
    this.setState({ userFeeds: feeds })
  }

  onViewReaction = (item) => {
    this.props.navigation.navigate('ReactionList', {
      postID: item.id
    })
  }

  onAddFriend = () => {
    this.setState({ shouldAddFriend: false, loading : true });

    firebaseFriendship.addFriendRequest(
      this.props.user,
      this.otherUser,
      true,
      false,
      true,
      IMLocalized('sent you a friend request.'),
      'friend_request',
      ({ success, error }) => {
        this.setState({ loading: false });
        if (error) {
          alert(error);
          this.setState({ shouldAddFriend: true });
        } else {
          const newFriendId = this.otherUser.id || this.otherUser.userID;
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

  onEmptyStatePress = () => {
    this.props.navigation.navigate('ProfileCreatePost', { newPost: true, fromProfile: true });
  };

  onReaction = async (reaction, item) => {
    this.feedManager.applyReaction(reaction, item, false);
    firebaseComment.handleReaction(
      reaction,
      this.props.user,
      item,
      false,
      this.props.users,
    );
  };

  onSharePostToChat = (item) => {
    let url = '';
    if(item.postMedia && item.postMedia.length > 0){
      url = item.postMedia[0];
      url['uri'] = url.url;
      url['source'] = url.url;
    }
    else{
      url = {
        profile: item.author.profilePictureURL
      }
    }
    this.props.navigation.navigate('FeedGroupChat', { 
      forwarded: true, 
      shareStatus: true,
      shareText: item.postText,
      shareName: item.author.firstName +
      (item.author.lastName ? ' ' + item.author.lastName : ''),
      shareMedia: url,
      sharePostInfo: item,
      forwardMessage: ''
    })
  }

  onSharePost = async (item) => {
    let url = '';
    if (item.postMedia && item.postMedia.length > 0) {
      url = item.postMedia[0];
    }
    try {
      const result = await Share.share(
        {
          title: 'Share SocialNetwork post.',
          message: item.postText,
          url,
        },
        {
          dialogTitle: 'Share SocialNetwork post.',
        },
      );
    } catch (error) {
      alert(error.message);
    }
  };

  onEditPost = async (item) => {
    this.props.navigation.navigate('ProfileCreatePost',{ item, newPost: false, fromProfile: true })
  }

  
  getPaginationFeeds = () => {
    this.setState({ moreLoading: true })
      if(this.state.userFeeds.length >= 20){//render only 20 posts
        let cloneArr = this.state.userFeeds;
        cloneArr.splice(0, 10); 
        this.setState({ userFeeds: cloneArr });
        if(this.otherUser)
          this.props.setOtherProfileFeeds(cloneArr)
        else
          this.props.setProfileFeeds(cloneArr);//remove first 10 posts
        this._getMoreFeeds();
      }
      else{
        this._getMoreFeeds();
      }
  }

  _getMoreFeeds = () => {
    this.feedManager.getMoreProfileFeedsFromAPI(this.state.friendsArr, this.state.authors,  this.state.latestDate._seconds, this.state.latestDate._nanoseconds, 10, this.state.status).then((response) => {
      if(response && response.length > 0){
        var result = response.splice(0, response.length-1); 
        this.setState({ latestDate: response[response.length - 1] });
        this.getReactionForFeeds(result, true);
      }
      else{
        this.setState({ moreData: false })
      }
      this.setState({ moreLoading: false })
    });
  }

  onDeletePost = (item) => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to delete?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('OK'),
          onPress: () => {
            this.deletePost(item)
          }
        }
    ]
    );
  };

  deletePost = async (item) => {
    this.deletePostUnsubscribe = await firebasePost.deletePost(
      item,
      this.onDeletePostSuccess,
    );
  };

  onDeletePostSuccess = (postID) => {
    this.props.removeProfilePost(postID);
    this.props.removePost(postID);
    let feeds = this.state.userFeeds.filter(
              (feed) => feed.id != postID
            );
    this.setState({ userFeeds: feeds })
    ToastAndroid.show(IMLocalized('Post was successfully deleted'), ToastAndroid.SHORT);
  }

  onFriendItemPress = (item) => {
    if (item.id === this.props.user.id || item.userID === this.props.user.id) { //Your profile
      this.props.navigation.push(this.stackKeyTitle, {
        stackKeyTitle: this.stackKeyTitle,
        fromChat: this.fromChat,
        fromMoment: this.fromMoment
      });
    } else { //Other user profile
        this.props.navigation.push(this.stackKeyTitle, {
          user: item,
          stackKeyTitle: this.stackKeyTitle,
          fromChat: this.fromChat,
          fromMoment: this.fromMoment
        });
    }
  };

  onSubButtonTitlePress = () => {
    this.props.navigation.push(this.lastScreenTitle + 'AllFriends', {
      lastScreenTitle: this.lastScreenTitle,
      title: IMLocalized('Friends'),
      stackKeyTitle: this.stackKeyTitle,
      otherUser: this.otherUser,
      includeReciprocal: true,
      appStyles: AppStyles,
      followEnabled: false,
    });
  };

  onFeedUserItemPress = async (author) => {
    if (this.other && this.other.id == author.id) {
      return;
    }
    if (!this.other) {
      return;
    }
    if (author.id === this.props.user.id) {
      this.props.navigation.navigate('DiscoverProfile', {
        stackKeyTitle: this.stackKeyTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    } else {
      this.props.navigation.navigate('DiscoverProfile', {
        user: author,
        stackKeyTitle: this.stackKeyTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    }
  };

  onMediaPress = (media, mediaIndex) => {
    this.setState({
      selectedMediaIndex: mediaIndex,
      selectedFeedItems: media,
    });
    this.props.navigation.navigate('ProfileMediaSwiper',{
      feedItems: media
    })
  };

  onCommentPress = (item) => {
    this.props.navigation.navigate('ProfilePostDetails', {
      item: item,
      lastScreenTitle: 'Profile',
    });
  };

  onQRUserUpdate = (qrdata) => {
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
    console.log("QR ID>>", e.data)
    this.setState({ showQR: false })

    let user = await firebaseUser.getUserData(e.data);
    this.onQRUserUpdate(user);
  };

  onUserReport = async (item, type) => {
    if(type == IMLocalized('Report Post')){
      const res = await firebasePost.reportPost(this.props.user.id, item);
      if (res.error) {
        alert(res.error);
      }
      else if(res.success){
        ToastAndroid.show(IMLocalized('Post was successfully reported'), ToastAndroid.SHORT);
      }
    }
    else{
      await reportingManager.markAbuse(this.props.user.id, item.authorID, type);
    }
};

  render() {
    const initialCountDisplay = 6;
    const displaySubButton =
      this.state.friends && this.state.friends.length > initialCountDisplay;
    let validFriends = [];
    this.state.friends.map((friend) => {
      let temp = this.props.bannedUserIDs.filter((id)=> id == friend.id)
      if(temp.length == 0)
        validFriends.push(friend);
    })

    const friends = validFriends
      ? validFriends.slice(0, initialCountDisplay)
      : null;

    if (this.state.hasPermission === null || this.state.hasPermission === false) {
      return <Text></Text>
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <Modal
            animationType="slide"
            //transparent={true}
            hardwareAccelerated
            visible={this.state.showQR}
            style={{ height: hp(100) }}
            onRequestClose={() => {
              this.setState({ showQR: false })
            }}>
            <BarCodeScanner
              onBarCodeScanned={this.state.scanned ? undefined : this.onSuccess}
              style={[StyleSheet.absoluteFill, styles.qrcontainer]}
            >
              <View style={styles.layerTop} />
              <Text style={styles.scan}>{IMLocalized('Scan QR to add friend')}</Text>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.focused} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.layerRight} />
              </View>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerBottom} />
            </BarCodeScanner>
          </Modal>

          <Profile
            loading={this.state.loading}
            moreData={this.state.moreData}
            moreLoading={this.state.moreLoading}
            uploadProgress={this.state.uploadProgress}
            user={this.otherUser ? this.otherUser : this.props.user}
            loggedInUser={this.props.user}
            subButtonTitle={IMLocalized('See All Friends')}
            displaySubButton={displaySubButton}
            friends={friends}
            recentUserFeeds={this.state.userFeeds}
            getMore={this.getPaginationFeeds}
            onFriendItemPress={this.onFriendItemPress}
            onMainButtonPress={this.onMainButtonPress}
            onUserReport={this.onUserReport}
            onAlbumPress={this.onAlbumPress}
            onVideoAlbumPress={this.onVideoAlbumPress}
            onViewReaction={this.onViewReaction}
            onNearByPress={this.onNearByPress}
            onAppSettingPress={this.onAppSettingPress}
            selectedMediaIndex={this.state.selectedMediaIndex}
            onSubButtonTitlePress={this.onSubButtonTitlePress}
            onCommentPress={this.onCommentPress}
            onFeedUserItemPress={this.onFeedUserItemPress}
            isMediaViewerOpen={this.state.isMediaViewerOpen}
            feedItems={this.state.selectedFeedItems}
            onMediaClose={this.onMediaClose}
            onReaction={this.onReaction}
            onMediaPress={this.onMediaPress}
            giveReaction={this.giveReaction}
            deletePostReaction={this.deletePostReaction}
            removePhoto={this.removePhoto}
            startUpload={this.startUpload}
            isFetching={this.state.isFetching}
            isOtherUser={this.otherUser}
            onSharePost={this.onSharePost}
            onSharePostToChat={this.onSharePostToChat}
            onDeletePost={this.onDeletePost}
            willBlur={this.state.willBlur}
            onEmptyStatePress={this.onEmptyStatePress}
            navigation={this.props.navigation}
            pressScan={this.pressScan}
            onEditPost={this.onEditPost}
            friendships={this.props.friendships}
            onDeleteRequest={this.onDeleteRequest}
            onBlockUser={this.onBlockUser}
          />
        </View>

      );
   }
  }
}

const mapStateToProps = ({ feed, auth, friends, userReports }) => {
  return {
    currentUserFeedPosts: feed.currentUserFeedPosts,
    editedProfileStatus: feed.editedProfileStatus,
    profileEditedPost: feed.profileEditedPost,
    posts: feed.profileFeeds,
    otherPosts: feed.otherProfileFeeds,
    user: auth.user,
    users: auth.users,
    friends: friends.friends,
    friendships: friends.friendships,
    bannedUserIDs: userReports.bannedUserIDs
  };
};

export default connect(mapStateToProps, { 
  editPostReactions, 
  editProfilePostReactions, 
  editOtherProfilePostReactions,
  setEditedProfileStatus, 
  setUserData, 
  removePost, 
  removeProfilePost, 
  setProfileFeeds, 
  setOtherProfileFeeds
 })(ProfileScreen);

const styles = StyleSheet.create({
  qrcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scan: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    textAlign: 'center',
    color: '#cdd0d4',
    height: hp(5),
  },
  layerTop: {
    height: hp(27.5),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  leftBorder: {
    width: wp(0.4),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    //paddingHorizontal: wp(7),
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 2
  },
  leftBorder1: {
    height: wp(8),
    width: wp(0.4),
    backgroundColor: '#3494c7',
  },
  leftBorder2: {
    height: wp(8),
    width: wp(0.4),
    backgroundColor: '#3494c7',
  },
  topBorder: {
    height: wp(0.4),
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp(100),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingHorizontal: wp(9.6),
    //justifyContent: 'space-between',
  },
  topBorder1: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  topBorder2: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
    position: 'absolute',
    right: wp(8.8)
  },
  bottomBorder: {
    height: wp(0.4),
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp(100),
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingHorizontal: wp(9.6),
    justifyContent: 'space-between',
  },
  bottomBorder1: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  bottomBorder2: {
    height: wp(0.4),
    width: wp(8),
    backgroundColor: '#3494c7',
  },
  layerCenter: {
    height: hp(40),
    flexDirection: 'row'
  },
  layerLeft: {
    width: wp(9.6),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  focused: {
    width: wp(80.8),
    //borderWidth: 1,
    //borderColor: '#3494c7'
  },
  layerRight: {
    width: wp(9.6),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  layerBottom: {
    height: hp(27.5),
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
})
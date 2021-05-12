import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { Platform, Alert, BackHandler, ToastAndroid, PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import IMChat from '../IMChat/IMChat';
import { channelManager } from '../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { reportingManager } from '../../user-reporting';
import { IMLocalized } from '../../localization/IMLocalization';
import { notificationManager } from '../../notifications';
import { firebaseUser } from '../../firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { setMediaChatReceivers } from '../audioVideo/redux';
import { setChannels } from '../redux';
import DocumentPicker from 'react-native-document-picker';
import RNRestart from 'react-native-restart';
import RNFetchBlob from 'rn-fetch-blob'
import LoginManager from '../../../manager/LoginManager';
import PushManager from '../../../manager/PushManager';
import AppStyles from '../../../AppStyles';
import FriendshipTracker from '../../socialgraph/friendships/firebase/tracker';
import PushNotification from 'react-native-push-notification';

class IMChatScreen extends Component {
  static contextType = ReactReduxContext;

  static navigationOptions = ({ screenProps, navigation }) => {
    const options = {};
    //let appStyles = navigation.state.params.appStyles;
    let appStyles = AppStyles;
    let channel = navigation.state.params.channel;
    let group;
    if(channel.participants.length > 1){
      group = true;
    }
    else{
      group = false;
    }
    //console.log("Channel>>"+ JSON.stringify(channel));
    let currentTheme = AppStyles.navThemeConstants['light'];
    let title = channel.name;

    if (!title) {
      title = channel.participants[0].firstName
        ? channel.participants[0].firstName
        : channel.participants[0].fullname;
    }

    options.headerTitle = title;
    options.headerTitleStyle = {
      fontFamily: appStyles.customFonts.klavikaMedium
    },
      options.headerStyle = {
        backgroundColor: currentTheme.backgroundColor,
      };
    options.headerTintColor = currentTheme.fontColor;
    // options.headerLeft = (
    //   <TouchableOpacity onPress={navigation.state.params?.goChat}>
    //       <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
    //     </TouchableOpacity>
    // )
    options.headerRight = (
      <>
      </>
    );
    return options;
  };

  constructor(props) {
    super(props);
    this.channel = this.props.navigation.getParam('channel');
    this.blocked = this.props.navigation.state.params.blocked;
    this.source = this.props.navigation.state.params.source;
    this.blockID = this.props.navigation.state.params.blockID;
    this.blockDest = this.props.navigation.state.params.blockDest;
    //this.appStyles = this.props.navigation.getParam('appStyles');
    this.appStyles = AppStyles;
    this.state = {
      voximplantState: '',
      showOfflineMessage: true,
      thread: [],
      inputValue: '',
      channel: this.channel,
      downloadUrl: '',
      uploadProgress: 0,
      isMediaViewerOpen: false,
      isRenameDialogVisible: false,
      selectedMediaIndex: null,
      inReplyToItem: null,
      viewingPDF: false,
      link: '',
      showMenuBox: false,
      editToItem: null,
      editing: false,
      loading: false
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
    if(!this.channel.group){
      console.log("[FUCK] Not Group...")
      AsyncStorage.getItem('voximplantState')
      .then(async (state) => {
        this.setState({ voximplantState: state });
        console.log("Voximplant State on start>>" + state);
          if(state == 'failed'){
            LoginManager.getInstance().loginWithPassword(this.props.user.id + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
          }
      });
    }
    
    this.props.navigation.setParams({
      onVideoChat: this.onVideoChat,
      onAudioChat: this.onAudioChat,
      goChat: this.goChat
    });
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.threadUnsubscribe = channelManager.subscribeThreadSnapshot(
      this.channel,
      this.onThreadCollectionUpdate,
    );
    channelManager.insertSeenUsers(this.channel.channelID, this.props.user.id, true);

    this.friendshipTracker = new FriendshipTracker(
      this.context.store,
      this.props.user.id,
      true,
      false,
      true,
    );
    if(!this.channel.group){
      PushManager.init();
      LoginManager.getInstance().on('onConnectionFailed', (reason) => this.onConnectionFailed(reason));
      LoginManager.getInstance().on('onLoggedIn', (displayName) => this.onLoggedIn(displayName));
      LoginManager.getInstance().on('onLoginFailed', (errorCode) => this.onLoginFailed(errorCode));
      LoginManager.getInstance().on('onConnectionClosed',(reason) => this._connectionClosed(reason));
      LoginManager.getInstance().on('onConnectionEstablished', (reason) => this.onConnectionEstablished(reason));
      LoginManager.getInstance().on('AuthResult', (reason) => this.onAuthResult(reason));
    }
  }

  onAuthResult = (reason) => {
    console.log("Voximplant onAuthResult>>"+ reason)
  }

  onConnectionFailed = (reason) => {
    AsyncStorage.setItem('voximplantState', 'failed');
      this.setState({ voximplantState: 'failed' })
    console.log("Voximplant Connection failed>>"+ reason)
    if(this.state.showOfflineMessage){
      this.setState({ showOfflineMessage: false })
    }
  }

  showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  _connectionClosed = () => {
    AsyncStorage.setItem('voximplantState', 'failed');
    this.setState({ voximplantState: 'failed' })
    if(this.state.showOfflineMessage){
      //this.showToast('Failed to connect, check internet settings')
      this.setState({ showOfflineMessage: false })
    }
  };

  onConnectionEstablished = (reason) => {
    console.log("[ChatScreen] Connection Established...", reason)
    AsyncStorage.setItem('voximplantState', 'success');
    this.setState({ voximplantState: 'success' })
    this.setState({ showOfflineMessage: true });
  }

  onLoggedIn = (reason) => {
    (async() => {
      console.log("[ChatScreen] onLoggedIn>>" , reason)
      AsyncStorage.setItem('usernameValue', reason);
      //AsyncStorage.setItem('useridValue', this.props.user.id);
      AsyncStorage.setItem('voximplantState', 'success');
      this.setState({ voximplantState: 'success' })
      this.setState({ showOfflineMessage: true });
  })();
}

  onLoginFailed = (reason) => {
    //console.log("Voximplant onLoginFailed>>" + reason)
    AsyncStorage.setItem('voximplantState', 'failed');
    this.setState({ voximplantState: 'failed' });
    if(this.state.showOfflineMessage){
      //this.showToast('Failed to connect, check internet settings')
      this.setState({ showOfflineMessage: false })
    }
  }

  componentWillUnmount() {
    this.threadUnsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  toggleMenuBox = () => {
    let toggle = !this.state.showMenuBox;
    this.setState({ showMenuBox: toggle })
  }

  closeMenuBox = () => {
    this.setState({ showMenuBox: false })
    let tempArr = this.state.thread;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showOtherReaction'] = false;
      }
      else{
        //console.log("fff>>"+ JSON.stringify(tempArr))
        this.setState({ thread: tempArr })
      }
    }
  }

  onVideoChat = async () => {
  //   console.log("Voximplant State>>" + this.state.voximplantState);
  //   if(this.state.voximplantState == 'failed'){
  //     this.setState({ loading: true });
  //     LoginManager.getInstance().loginWithPassword(this.props.user.id + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
  //     setTimeout(()=> {
  //       console.log("Voximplant Loginnn while videoChat...")
  //       this.setState({ loading: false })
  //       // if(this.state.voximplantState == 'failed'){
  //       //   ToastAndroid.show(IMLocalized('Please check internet connection'), ToastAndroid.SHORT);
  //       // }
  //       // else{
  //         this.videoChatActive()
  //      // }
  //     }, 4000)
  //   }
  //   else{
  //     console.log("Voximplant Active...")
  //     this.videoChatActive()
  //  }
   this.videoChatActive()
  };

  videoChatActive = async () => {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

        permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
        if (recordAudioGranted) {

        } else {
          console.warn('MainScreen: makeCall: record audio permission is not granted');
          return;
        }
      }

      //console.log("Video call>>"+ JSON.stringify(this.channel.participants[0]))
        notificationManager.sendPushNotification(
          this.channel.participants[0],
          'Nine Chat',
          'Call from ' + this.props.user.firstName,
          'chat_message',
          { outBound: this.props.user },
          0,
          this.channel.id
        );
        notificationManager.sendPusher(
          this.channel.participants[0].id,
          'Nine Chat',
          'Call from ' + this.props.user.firstName
        );
      AsyncStorage.setItem('callToID', this.channel.participants[0].id)
      this.props.navigation.navigate('Call', {
        callId: null,
        isVideo: true,
        isIncoming: false,
        callTo: this.channel.participants[0].id,
        channel: this.channel,
        callName: this.channel.participants[0].firstName,
        sendMessage: true,
        user: this.props.user,
        startedCall: true
      });
    } catch (e) {
      console.warn('MainScreen: makeCall failed: ' + e);
    }
  }

  onSenderProfilePicturePress = async (userID) => {
    let user = await firebaseUser.getUserData(userID);
    console.log("userData>>", user)

    let temp = this.props.bannedUserIDs.filter((id)=> id == userID)
      if(temp.length == 0)
        this.props.navigation.navigate('ChatProfile', {
            user,
            stackKeyTitle: 'Profile',
            lastScreenTitle: 'Feed',
            fromChat: true,
          });
      else
        ToastAndroid.show(IMLocalized('This person is unavailable'), ToastAndroid.SHORT)
  }

  onAudioChat = async () => {
  //   if(this.state.voximplantState == 'failed'){
  //     this.setState({ loading: true });
  //     LoginManager.getInstance().loginWithPassword(this.props.user.id + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
  //     setTimeout(()=> {
  //       console.log("Voximplant Loginnn while videoChat...")
  //       this.setState({ loading: false });
  //         this.audioChatActive()
  //     }, 4000)
  //   }
  //   else{
  //     console.log("Voximplant Active...")
  //     this.audioChatActive()
  //  }
   this.audioChatActive()
  };

  audioChatActive = async () => {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
        const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
        if (recordAudioGranted) {
          // let state = await this.client.getClientState()
        } else {
          console.warn('MainScreen: makeCall: record audio permission is not granted');
          return;
        }
      }

      //console.log("Voice call>>"+ this.channel.id)
      notificationManager.sendPushNotification(
        this.channel.participants[0],
        'Nine Chat',
        'Call from ' + this.props.user.firstName,
        'chat_message',
        { outBound: this.props.user },
        0,
        this.channel.id
      );
      console.log("Sent Call Noti...")
      notificationManager.sendPusher(
        this.channel.participants[0].id,
        'Nine Chat',
        'Call from ' + this.props.user.firstName
      );
      AsyncStorage.setItem('callToID', this.channel.participants[0].id)
      this.props.navigation.navigate('Call', {
          callId: null,
          isVideo: false,
          isIncoming: false,
          callTo: this.channel.participants[0].id,
          //callTo: 'test3',
          channel: this.channel,
          callName: this.channel.participants[0].firstName,
          sendMessage: true,
          user: this.props.user,
          startedCall: true
        });
    } catch (e) {
      console.warn('MainScreen: makeCall failed: ' + e);
    }
  }

  onChangeName = (text) => {
    this.showRenameDialog(false);

    const channel = { ...this.state.channel };
    channel.name = text;

    channelManager.onRenameGroup(
      text,
      channel,
      ({ success, error, newChannel }) => {
        if (success) {
          this.setState({ channel: newChannel });
          this.props.navigation.setParams({
            channel: newChannel,
          });
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  showGroupMembers = () => {
    this.props.navigation.navigate('GroupMembers', { 
      admin,
      members: this.state.channel.participants
     })
  }

  onLeave = () => {
    Alert.alert(
      IMLocalized(`Leave ${this.state.channel.name || 'group'}`),
      IMLocalized('Are you sure you want to leave this group?'),
      [
        { text: IMLocalized('No') },
        {
          text: IMLocalized('YesExit'),
          onPress: this.onLeaveDecided,
          style: 'destructive',
        }
      ],
      { cancelable: false },
    );
  };

  onDeleteGroupDecided = () => {
    channelManager.onDeleteGroup(
      this.state.channel.id,
      ({ success, error }) => {
        if (success) {
          ToastAndroid.show(IMLocalized('Deleted successfully'), ToastAndroid.SHORT)
          this.props.navigation.goBack();
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  onLeaveDecided = () => {
    channelManager.onLeaveGroup(
      this.state.channel.id,
      this.props.user.id,
      ({ success, error }) => {
        if (success) {
          this.props.navigation.goBack(null);
        }

        if (error) {
          alert(error);
        }
      },
    );
  };

  goDetailPost = (item) => {
    if(!this.blocked)
      this.props.navigation.navigate('FeedDetailPost', {
        item: item,
        lastScreenTitle: 'Feed'
      });
  }

  showRenameDialog = (show) => {
    this.setState({ isRenameDialogVisible: show });
  };

  onReactionsUpdate = (threads) => {
    console.log("[FUCK] Reaction Updated...")
    let tempArr = threads;
    if(threads.length > 0){
      for(let index=0;index<=threads.length;index++){

        if(index != threads.length){
          tempArr[index]['iconSource'] = '';
          tempArr[index]['gaveReaction'] = null;

          if(threads[index].reactions){
            threads[index].reactions.map((reaction) => {
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
             this.setState({ thread: tempArr });
        }
      }          
    }
  }

  onThreadCollectionUpdate = async (querySnapshot) => {
    console.log("[FUCK] Thread Updated...")
    const data = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      if(message.deletedUsers == null || message.deletedUsers == undefined || message.deletedUsers.length == 0){
        data.push({ ...message, id: doc.id });
      }
      else{
        const checkID = message.deletedUsers.filter(user => user === this.props.user.id)
        if(checkID == null || checkID == undefined || checkID == ''){
          data.push({ ...message, id: doc.id });
        }
      }
    });
    this.setState({ thread: data });
    channelManager.subscribeThreadReactions(this.channel.channelID,
      data,
      this.onReactionsUpdate
    );
  };

  onChangeTextInput = (text) => {
    this.setState({
      inputValue: text,
    });
  };

  createOne2OneChannel = () => {
    const self = this;
    return new Promise((resolve) => {
      channelManager
        .createChannel(self.props.user, self.state.channel.participants, '', false)
        .then((response) => {
          self.setState({ channel: response.channel });
          self.threadUnsubscribe = channelManager.subscribeThreadSnapshot(
            response.channel,
            self.onThreadCollectionUpdate,
          );
          resolve(response.channel);
        });
    });
  };

  onSendInput = async (msg) => {

    //console.log("thread>>"+ JSON.stringify(this.state.thread));
    //console.log("uuuuuu>>"+ JSON.stringify(this.state.channel))

    const self = this;
    if (
      this.state.thread.length > 0 ||
      this.state.channel.participants.length > 1
    ) {
      self.sendMessage(msg);
      return;
    }
    else if(
      this.state.thread.length == 0 &&
      this.state.channel.participants.length == 1 && 
      this.state.channel.deletedUsers && this.state.channel.deletedUsers.includes(this.props.user.id)
    ){
      console.log("hhhhh");
      self.sendMessage(msg);
      return;
    }
    // If we don't have a chat id, we need to create it first together with the participations
    this.createOne2OneChannel().then((_response) => {
      self.sendMessage(msg);
    });
  };

  sendMessage = (msg) => {
    if(this.state.editToItem){
      this.setState({
        inputValue: '',
        editToItem: null,
      });
      channelManager.updateEditedStatus(this.state.channel.id, this.state.editToItem.id, msg)
    }
    else{
      console.log("New Message");
      channelManager.insertSeenUsers(this.channel.channelID, this.props.user.id, false)
    const self = this;
    //const inputValue = this.state.inputValue;
    const inputValue = msg;
    const downloadURL = this.state.downloadUrl;
    const inReplyToItem = this.state.inReplyToItem;
    self.setState({
      inputValue: '',
      downloadUrl: '',
      inReplyToItem: null,
    });
    channelManager
      .sendMessage(
        this.props.user,
        this.state.channel,
        inputValue,
        downloadURL,
        inReplyToItem,
        '',
        false,
        '',
        ''
      )
      .then((response) => {
        if (response.error) {
          alert(error);
          self.setState({
            inputValue: inputValue,
            downloadUrl: downloadURL,
            inReplyToItem: inReplyToItem,
          });
        } else {
          self.broadcastPushNotifications(inputValue, downloadURL);
          // RNRestart.Restart();
        }
      });
    }
  };

  broadcastPushNotifications = (inputValue, downloadURL) => {
    const channel = this.state.channel;
    const participants = channel.participants;
    if (!participants || participants.length == 0) {
      return;
    }
    const sender = this.props.user;
    const isGroupChat = channel.name && channel.name.length > 0;
    const fromTitle = isGroupChat
      ? channel.name
      : sender.firstName + ' ' + sender.lastName;
    var message;
    
    if (isGroupChat) {
      if (downloadURL) {
        if (downloadURL.mime && downloadURL.mime.startsWith('video')) {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a video.');
        } 
        else if (downloadURL.mime && downloadURL.mime.startsWith('audio')) {
          message =
          sender.firstName +
          ' ' +
          sender.lastName +
          ' ' +
          IMLocalized('sent an audio.');
        }
        else {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a photo.');
        }
      } else {
        message = sender.firstName + ' ' + sender.lastName + ': ' + inputValue;
      }
    } else {
      if (downloadURL) {
        if (downloadURL.mime && downloadURL.mime.startsWith('video')) {
          message = sender.firstName + ' ' + IMLocalized('sent you a video.');
        } 
        else if (downloadURL.mime && downloadURL.mime.startsWith('audio')) {
          message = sender.firstName + ' ' + IMLocalized('sent an audio.');
        }
        else {
          message = sender.firstName + ' ' + IMLocalized('sent you a photo.');
        }
      } else {
        message = inputValue;
      }
    }

    participants.forEach((participant) => {
      if (participant.id != this.props.user.id) {
        //console.log('Sender>>'+ JSON.stringify(sender));
        notificationManager.sendPushNotification(
          participant,
          fromTitle,
          message,
          'chat_message',
          { outBound: sender },
          0,
          channel.id
        );
      }
    });
  };

  onAddMediaPress = (photoUploadDialogRef) => {
    photoUploadDialogRef.current.show();
  };

  onAudioRecordSend = (audioRecord) => {
    this.startUpload({ ...audioRecord, source: audioRecord.uri });
  };

  sendSurprise = () => {
    ToastAndroid.show(IMLocalized('Coming Soon'), ToastAndroid.SHORT);
  }

  onSendDocument = async () => {
    console.log("send document...")
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      this.startUpload({ source: res.uri, mime: res.type }, res, 'pdf');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  onUploadDocument = (name, type, uri) => {
    new Promise((resolve, reject) => {
      firebaseStorage.uploadPDF(name, uri).then((response) => {
        if (!response.error) {
          console.log("uploadPDF response>>" + JSON.stringify(response))
          let uploadData = {
            "source": uri,
            "mime": "image/jpeg"
          }
          this.setState(
            {
              //downloadUrl: { ...uploadData, source: url, uri: url, url, mime },

              downloadUrl: { ...uploadData, source: response.downloadURL, uri: response.downloadURL, url: response.downloadURL, mime: type },
              uploadProgress: 0,
            },
            () => {
              this.onSendInput('');
            },
          );
        } else {
          alert(
            'Oops! An error occured while uploading profile picture. Please try again.',
          );
        }
        resolve();
      });
    });
  }

  onViewPDF = (item2) => {
    console.log("onViewPDF...>>" + JSON.stringify(item2));
    console.log("Date>>" + new Date());
    let fileName = item2.content;
    let item = item2.url;

    let url = item.uri;

    let append = item.mime.substring(item.mime.indexOf('/') + 1)
    console.log("append>>" + append);
    let dirs = RNFetchBlob.fs.dirs;
    let path = dirs.DownloadDir + '/' + fileName;
    console.log("Path>>" + path);

    RNFetchBlob.config({
      fileCache: true,
      appendExt: append,
      indicator: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'File'
      },
    }).fetch("GET", url).then(res => {
      console.log(res, 'end downloaded')
      ToastAndroid.show('Download successful', ToastAndroid.SHORT);
    });
  }

  onLaunchCamera = (image) => {
    const self = this;
    const { id, firstName, profilePictureURL } = this.props.user;
    if(image.path){
      const source = image.path;
        const mime = image.mime;
        const data = {
          content: '',
          created: channelManager.currentTimestamp(),
          senderFirstName: firstName,
          senderID: id,
          senderLastName: '',
          senderProfilePictureURL: profilePictureURL,
          url: 'http://fake',
        };
        self.startUpload({ source, mime }, data);
    }
  };

  onOpenPhotos = () => {
    const { id, firstName, profilePictureURL } = this.props.user;
    const self = this;

    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    })
      .then((images) => {
        this.uploadImage(images, firstName, profilePictureURL, id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  uploadImage = (image, firstName, profilePictureURL, id) => {
    if (image != undefined && image != null) {
      const source = image.path;
      const mime = image.mime;

      const data = {
        content: '',
        created: channelManager.currentTimestamp(),
        senderFirstName: firstName,
        senderID: id,
        senderLastName: '',
        senderProfilePictureURL: profilePictureURL,
        url: 'http://fake',
      };
      this.startUpload({ source, mime }, data);
    }
  }

  startUpload = (uploadData, data, type) => {
    const { source, mime } = uploadData;
    const self = this;

    let filename = '';
    let uploadUri = '';
    if (type == 'pdf') {
      filename = '/Nine Chat PDF' + data.name;
      uploadUri = data.uri;
      //this.setState({ inputValue: data.name })
     // this.setState({ editing: true })
    }
    else {
      filename =
        new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
      uploadUri =
        Platform.OS === 'ios' ? source.replace('file://', '') : source;

    }

    // let filename =
    //   new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
    // let uploadUri =
    //   Platform.OS === 'ios' ? source.replace('file://', '') : source;

    firebaseStorage.uploadFileWithProgressTracking(
      filename,
      uploadUri,
      async (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        self.setState({ uploadProgress });
      },
      async (url) => {
        if (url) {
          console.log("...uploaddata>>" + JSON.stringify(uploadData));
          console.log("url>>" + url + "  mime>>" + mime)
          self.setState(
            {
              downloadUrl: { ...uploadData, source: url, uri: url, url, mime },
              uploadProgress: 0,
            },
            () => {
              if(type == 'pdf')
                self.onSendInput(data.name);
              else
                self.onSendInput('');
            },
          );
        }
      },
      (error) => {
        self.setState({ uploadProgress: 0 });
        alert(IMLocalized('Oops! An error has occured. Please try again.'));
        console.log(error);
      },
    );
  };

  sortMediafromThread = () => {
    this.imagesUrl = [];
    this.images = [];

    this.state.thread.forEach((item) => {
      if (item.url && item.url != '') {
        if (item.url.mime && item.url.mime.startsWith('image')) {
          this.imagesUrl.push(item.url.url);
          this.images.push({
            id: item.id,
            url: item.url,
          });
        } 
        else if (item.url.profile && item.url.profile != '' && item.url.profile != null && item.url.profile != undefined) {
          this.imagesUrl.push(item.url.profile);
          this.images.push({
            id: item.id,
            url: item.url,
          });
        } 
        else if (!item.url.mime && item.url.startsWith('https://')) {
          // To handle old format before video feature
          this.imagesUrl.push(item.url);
          this.images.push({
            id: item.id,
            url: item.url,
          });
        }
      }
    });

    return this.imagesUrl;
  };

  onChatMediaPress = (item) => {
    if(!this.blocked){
      const index = this.images.findIndex((image) => {
        return image.id === item.id;
      });
  
      this.setState({
        selectedMediaIndex: index,
        //isMediaViewerOpen: true,
      });
      this.props.navigation.navigate('ChatMediaSwiper',{
        feedItems: [this.images[index].url.url]
      })
    }
  };

  onMediaClose = () => {
    this.setState({ isMediaViewerOpen: false });
  };

  onUserUnBlockPress = async () => {
    this.setState({ loading: true })
    reportingManager.unmarkAbuse(this.blockID, this.unblockSuccess);
    let blockedUser = await firebaseUser.getUserData(this.blockDest);
    this.friendshipTracker.unfriend(this.props.user, blockedUser, (respone) => {
      this.friendshipTracker.cancelFriendRequest(
        blockedUser,
        this.props.user,
        (response) => {
            this.setState({ loading: false })
            RNRestart.Restart();
        },
      );
    });
  }

  unblockSuccess = (response) => {
      if (response) {
        //ToastAndroid.show(IMLocalized('Unblocked user'), ToastAndroid.SHORT);
      }
      else{
        ToastAndroid.show(IMLocalized('Something went wrong. Try again!'), ToastAndroid.SHORT);
        //this.props.navigation.goBack();
      }
  }

  onUserBlockPress = () => {
    this.setState({ loading: true })
    this.reportAbuse('block');
  };

  onUserReportPress = () => {
    this.reportAbuse('report');
  };

  onReactionPress = async (reaction, messageID) => {
    let tempArr = this.state.thread;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showOtherReaction'] = false;
          if(tempArr[index].id == messageID){
            tempArr[index]['iconSource'] = AppStyles.iconSet[reaction];
              if(tempArr[index]['gaveReaction'] && tempArr[index]['gaveReaction'] == reaction){
                console.log("Same Reaction, Nothing to do...");
              }
              else if(tempArr[index]['gaveReaction'] != '' && tempArr[index]['gaveReaction'] != null){
                console.log("Update Reaction..."+ messageID);
                tempArr[index]['gaveReaction'] = reaction;
                await channelManager.applyMessageReaction(
                  this.channel.channelID,
                  messageID,
                  reaction, 
                  this.props.user.id,
                  false
                )
                channelManager.updateMessageReactionsCount(
                  this.channel.channelID,
                  messageID,
                  false
                )
              }
              else{
                console.log("Insert Reaction..."+ messageID);
                tempArr[index]['gaveReaction'] = reaction;
                await channelManager.applyMessageReaction(
                  this.channel.channelID,
                  messageID,
                  reaction, 
                  this.props.user.id,
                  true
                )
                channelManager.updateMessageReactionsCount(
                  this.channel.channelID,
                  messageID,
                  true
                )
              }
          }
      }
      else{
        this.setState({ thread: tempArr })
      }
    }
  }

  onReactionList = (item) => {
    if(!this.blocked)
      this.props.navigation.navigate('ChatReactionList', {
        threadID: item.id,
        channelID: this.channel.channelID
      })
  }

  deleteGroup = () => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to delete this group?'),
      [
        { text: IMLocalized('No') },
        {
          text: IMLocalized('YesExit'),
          onPress: this.onDeleteGroupDecided,
          style: 'destructive',
        }
      ],
      { cancelable: false },
    );
  }

  onAddMember = () => {
    //console.log('Old Members>>' + JSON.stringify(this.channel.participants));
    this.props.navigation.navigate('CreateGroup', { 
      appStyles: AppStyles,
      oldGroup: true,
      channel: this.channel,
      members: this.channel.participants
     })
  }

  onRemoveMember = (item) => {
    channelManager.onLeaveGroup(
      this.state.channel.id,
      item.id,
      ({ success, error }) => {
        if (success) {
         // let msg = 'You removed ' + item.firstName + ' from group';
          //ToastAndroid.show(msg, ToastAndroid.SHORT);
          console.log("ppppp>>"+ JSON.stringify(this.state.channel))
          let temp = this.props.channels.map((channel) => {
            if(channel.id == this.state.channel.id){
              console.log("Channel matched...");
              let filterUsers = channel.participants.filter((participant) => participant.id != item.id)
              channel.participants = filterUsers; 
              this.setState({ channel })
              return channel;
            }
            else{
              return channel;
            }
          })
          //console.log("temp>>"+ JSON.stringify(temp));
          this.props.setChannels(temp);
        }
        if (error) {
          alert(error);
        }
      },
    );
  }

  messageLongPress = (id) => {
    if(!this.blocked){
      let temp = this.state.thread;
      let index = 0;
      this.state.thread.forEach((msg) => {
        if(msg.id == id){
          temp[index]['showOtherReaction'] = true;
        }
        else{
          temp[index]['showOtherReaction'] = false;
        }
        index++;
      })
    //  setTimeout(() => {
        this.setState({ thread: temp });
     // }, 1000);
    }
  }

  reportAbuse = (type) => {
    const participants = this.state.channel.participants;
    if (!participants || participants.length != 1) {
      this.setState({ loading: false })
      return;
    }
    const myID = this.props.user.id;
    const otherUserID = participants[0].id || participants[0].userID;
    reportingManager.markAbuse(myID, otherUserID, type).then((response) => {
      if (!response.error) {
        this.props.navigation.goBack(null);
      }
      this.setState({ loading: false })
    });
  };

  
  goProfile = (item) => {

       this.props.navigation.navigate('ChatProfile', {
          user: item,
          stackKeyTitle: 'FeedProfile',
          lastScreenTitle: 'Feed',
        });
  }

  onReplyActionPress = (inReplyToItem) => {
    this.setState({ inReplyToItem });
  };

  onForwardActionPress = (inReplyToItem) => {
    this.props.navigation.navigate('GroupChat', { 
      forwarded: true, 
      forwardMessage: inReplyToItem,
      shareStatus: false
    })
  };

  onEditActionPress = (editToItem) => {
    console.log("Message>>" + JSON.stringify(editToItem));
    this.setState({ editToItem, inputValue: editToItem.content, editing: true });
  }

  onReplyingToDismiss = () => {
    this.setState({ inReplyToItem: null, editing: false, editToItem: null, inputValue: '' });
  };

  render() {
    return (
      <IMChat
        onAudioChat={this.onAudioChat}
        loading={this.state.loading}
        editing={this.state.editing}
        onSenderProfilePicturePress={this.onSenderProfilePicturePress}
        disableMenuBox={() => this.setState({ showMenuBox: false })}
        onVideoChat={this.onVideoChat}
        toggleMenuBox={this.toggleMenuBox}
        closeMenuBox={this.closeMenuBox}
        onReactionPress={this.onReactionPress}
        showMenuBox={this.state.showMenuBox}
        appStyles={this.appStyles}
        user={this.props.user}
        thread={this.state.thread}
        inputValue={this.state.inputValue}
        inReplyToItem={this.state.inReplyToItem}
        onAddMediaPress={this.onAddMediaPress}
        onReactionList={this.onReactionList}
        onSendInput={this.onSendInput}
        onAudioRecordSend={this.onAudioRecordSend}
        onChangeTextInput={this.onChangeTextInput}
        onLaunchCamera={this.onLaunchCamera}
        onSendDocument={this.onSendDocument}
        sendSurprise={this.sendSurprise}
        onOpenPhotos={this.onOpenPhotos}
        uploadProgress={this.state.uploadProgress}
        sortMediafromThread={this.sortMediafromThread()}
        isMediaViewerOpen={this.state.isMediaViewerOpen}
        selectedMediaIndex={this.state.selectedMediaIndex}
        onChatMediaPress={this.onChatMediaPress}
        onMediaClose={this.onMediaClose}
        isRenameDialogVisible={this.state.isRenameDialogVisible}
        showRenameDialog={this.showRenameDialog}
        onChangeName={this.onChangeName}
        onLeave={this.onLeave}
        showGroupMembers={this.showGroupMembers}
        onUserBlockPress={this.onUserBlockPress}
        onUserUnBlockPress={this.onUserUnBlockPress}
        onUserReportPress={this.onUserReportPress}
        onReplyActionPress={this.onReplyActionPress}
        onForwardActionPress={this.onForwardActionPress}
        onEditActionPress={this.onEditActionPress}
        onReplyingToDismiss={this.onReplyingToDismiss}
        onViewPDF={this.onViewPDF}
        goProfile={this.goProfile}
        channel={this.channel}
        participants={this.state.channel.participants}
        messageLongPress={this.messageLongPress}
        editToItem={this.state.editToItem}
        onAddMember={this.onAddMember}
        onRemoveMember={this.onRemoveMember}
        deleteGroup={this.deleteGroup}
        goDetailPost={this.goDetailPost}
        blocked={this.blocked}
        source={this.source}
      />
    );
  }
}

IMChatScreen.propTypes = {
  thread: PropTypes.array,
  setChatThread: PropTypes.func,
  createThread: PropTypes.func,
  createChannel: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = ({ chat, auth, userReports }) => {
  return {
    user: auth.user,
    channels: chat.channels,
    thread: chat.thread,
    bannedUserIDs: userReports.bannedUserIDs
  };
};

export default connect(mapStateToProps, { setMediaChatReceivers, setChannels })(
  IMChatScreen,
);

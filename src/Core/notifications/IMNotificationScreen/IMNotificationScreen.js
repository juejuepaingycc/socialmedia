import React, { PureComponent } from 'react';
import { BackHandler, TouchableOpacity, ToastAndroid, View, Image, StyleSheet, Modal, ScrollView, Text } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import IMNotification from '../Notification/IMNotification';
import { firebaseNotification } from '../../notifications';
import { firebasePost } from '../../socialgraph/feed/firebase';
import { setNotifications } from '../redux';
import AppStyles from '../../../AppStyles';
import PropTypes from 'prop-types';
import ChannelsTracker from '../../chat/firebase/channelsTracker';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { UIActivityIndicator } from 'react-native-indicators';
import { Scales } from '@common';
import Icon from 'react-native-vector-icons/FontAwesome';

class IMNotificationScreen extends PureComponent {
  static contextType = ReactReduxContext;

  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    const { params = {} } = navigation.state;
    return {
      headerTitle: navigation.state.params.title,
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      /*     headerRight:
          <TextButton style={{ marginRight: 12, fontFamily: AppStyles.customFonts.klavikaMedium }} 
          onPress={params.readAllNoti}
          >
            <Text style={{ fontSize: 13 , color: '#3494c7', paddingRight: 16, fontWeight: 'bold' }}>Read</Text>
          </TextButton>
          , */
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true, //top loading
      moreData: true, //If there are more data to load, true
      loadingMoreData: false, //If loading more data(bottom), true
      notifications: [],
      startIndex: 0,
      endIndex: 15,
      first: true,
      currentPage: true,
      allNotifications: [],
      showModal: false,
      removeImage: '',
      removeNotiText: '',
      removeID: 0
   }
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

    this.lastScreenTitle = this.props.navigation.getParam('lastScreenTitle');
    if (!this.lastScreenTitle) {
      this.lastScreenTitle = 'Profile';
    }
    this.appStyles =
      this.props.navigation.state.params.appStyles ||
      this.props.navigation.getParam('appStyles') ||
      this.props.appStyles;
  }

  componentDidMount() {
    const userId = this.props.user.id;
    this.channelsTracker = new ChannelsTracker(this.context.store, userId);
    this.channelsTracker.subscribeIfNeeded();

    // this.props.navigation.setParams({
    //   readAllNoti: this.setNotiRead
    // });

    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.notificationUnsubscribe = firebaseNotification.getNotifications(
      this.props.user.id,
      this.onNotificationCollection,
    );
  }

  componentWillUnmount() {
    console.log("Leave...")
    this.setState({ currentPage: false })
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
   // this.unsubscribeSinglePost && this.unsubscribeSinglePost();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  doneCheckedNoti = (res) => {
    this.setState({ loading: false })
  }

  onNotificationDelete = async (notification) => {
    //console.log("Noti>>"+ JSON.stringify(notification))
    this.setState({ 
      removeImage: notification.metadata.outBound.profilePictureURL,
      showModal: true,
      removeNotiText: notification.body,
      removeID: notification.id
    })
  }

  removeNotification = async () => {
      this.setState({ loading: true, showModal: false })
      this.deleteRes = await firebaseNotification.deleteNotification(this.state.removeID);
      if(this.deleteRes.success){
        let temp = this.state.notifications.filter((noti)=> noti.id != this.state.removeID)
        this.setState({ notifications: temp, loading: false, removeID: 0, removeImage: '', removeNotiText: '' })
        ToastAndroid.show(IMLocalized('Notification removed.'), ToastAndroid.SHORT);
      }
      else{
        this.setState({ loading: false, removeID: 0, removeImage: '', removeNotiText: '' });
        ToastAndroid.show(IMLocalized('Something went wrong. Try again!'), ToastAndroid.SHORT);
      }
  }

  onNotificationCollection = (notifications) => {
    console.log("onNotificationCollection>>" + notifications.length)
    if(notifications == undefined || notifications == null || notifications.length == 0){
      this.setState({ loading: false});
    }
    else{
      let temp = notifications.filter((noti) => noti.type != 'chat_message' && noti.type != 'friend_request');
      if(temp.length > 0){
        this.props.setNotifications(temp);

        if(this.state.first){
          if(temp.length <= 15){
            this.setState({ moreData: false });
          }
          if(temp.length > 0){
            let arr = temp.slice(this.state.startIndex, this.state.endIndex);
            this.setState({
              notifications: arr
            })
          }
          this.setState({ first: false, loading: false })
        }
        else{
          this.setState({ loading: false })
        }
  
        this.setState({ loading: false, allNotifications: temp })
        this.checkedCountUnsubscribe = firebaseNotification.checkecdCountNotifications(
          temp,
          this.doneCheckedNoti,
        );
      }
      else{
        this.setState({ loading: false })
      }
    }
  };

  onLoadMoreData = () => {
  //console.log("aaaaaaa>>"+ this.state.notifications.length);
    this.setState({ loadingMoreData: true })
    //setTimeout(() => {
      if(this.state.moreData){
        let start = this.state.startIndex + 15;
        let end = this.state.endIndex + 15;
        let arr = this.state.allNotifications.slice(start, end);
        this.setState({ 
          startIndex: start, 
          endIndex: end 
        });
        if(arr.length < 15){
          this.setState({ moreData: false })
        }
        this.setState({
          notifications: [ ...this.state.notifications, ...arr ],
          loadingMoreData: false
        })
      }
      else{
        this.setState({ loadingMoreData: false })
      }
   // }, 2000);
  }

  onNotificationPress = async (notification, index) => {
    let arr = this.state.notifications;
    arr[index]['seen'] = true;

    this.setState({ loading: true, notifications: arr });
    const res = await firebasePost.getPost(notification.id);
    firebaseNotification.updateNotification({
      ...notification,
      seen: true,
    });
    if (res.error) {
      alert(res.error);
      this.setState({ loading: false });
    }

    if (res.success) {
      if (notification.type == 'social_follow') {
        this.setState({ loading: false });
        // this.props.navigation.navigate('FeedProfile', {
        //   user: notification.metadata.outBound,
        //   stackKeyTitle: 'FeedProfile',
        //   lastScreenTitle: 'Feed',
        // });
        this.props.navigation.navigate('ChatPeopleStack')
      }
      else if (notification.type == 'social_reaction' || notification.type == 'social_comment') {
        // this.unsubscribeSinglePost = firebasePost.subscribeToSinglePost(
        //   notification.postId,
        //   this.onFeedItemUpdate,
        // );
        firebasePost.getSinglePost(
          notification.postId,
          this.onFeedItemUpdate,
        );
      }

      else if (notification.type == 'chat_message') {
        let arr = this.props.channels.filter((channel) => channel.channelID == notification.channelId);
        if(arr.length > 0) {
            this.onChannelUpdate(this.props.channels[j]);
        }
        else{
          alert(IMLocalized('Conversation was already deleted'));
          this.props.navigation.goBack();
        }
      }
    }
  };

  onChannelUpdate = (channel) => {
    this.setState({ loading: false })
    this.props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: this.appStyles,
    });
  };

  onFeedItemUpdate = (feedItem) => {
    console.log("return post>>" + JSON.stringify(feedItem))
    this.setState({ loading: false })
    if(feedItem){
      this.props.navigation.navigate('FeedDetailPost', {
        item: feedItem,
        lastScreenTitle: 'Feed',
      });
    }
    else{  
      alert(IMLocalized('Post was already deleted'));
    }
  };

  render() {  
    // if(this.state.loading){
    //   return (
    //     <View style={{
    //       width: 100,
    //       height: 100,
    //       borderRadius: 10,
    //       backgroundColor: 'rgba(52, 52, 52, 0.7)',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       position: 'absolute',
    //       marginTop: 150,
    //       marginLeft: (Scales.deviceWidth - 100)/2
    //     }}>
    //       <UIActivityIndicator
    //         color="#f5f5f5"
    //         size={30}
    //         animationDuration={400}
    //       />
    //     </View>
    //   )
    // }
    if(this.state.notifications && this.state.notifications.length > 0){
        return (
          <ScrollView>
            <Modal
            transparent={true}
            visible={this.state.showModal}
            backdropOpacity={0.3}
            onRequestClose={() => { 
              this.setState({ showModal: false });
            }}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalView}>
                    <Image source={{ uri: this.state.removeImage || 'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg' }} 
                    style={styles.img} />
                    <Text style={styles.notiDesc}>{this.state.removeNotiText}</Text>
                    <TouchableOpacity style={styles.row} onPress={() => this.removeNotification()}>
                      <View style={styles.closeBg}>
                        <Icon name='window-close' size={18} />
                      </View>
                      <Text style={styles.remove}>{IMLocalized('Remove this notification')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>
            <IMNotification
              onNotificationPress={this.onNotificationPress}
              onNotificationDelete={this.onNotificationDelete}
              notifications={this.state.notifications}
              appStyles={this.appStyles}
              loading={this.state.loading}
              loadingMoreData={this.state.loadingMoreData}
              onLoadMoreData={this.onLoadMoreData}
            />
          </ScrollView>
        );
      }
      else if(this.state.notifications.length == 0 && !this.state.loading){
        return (
          <Text style={{ fontSize: 30,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: 'black',
            marginBottom: 15, marginTop: 200 }}>{IMLocalized('No Result Found')}</Text>
        )
      }
      else{
        return null;
      }
   
  }
}

IMNotificationScreen.propTypes = {
  channels: PropTypes.array,
};

const mapStateToProps = ({ chat, notifications, auth }) => {
  return {
    channels: chat.channels,
    user: auth.user,
    notifications: notifications.notifications,
  };
};

export default connect(mapStateToProps, { setNotifications })(
  IMNotificationScreen,
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    alignItems: 'center'
  },
  modalView: {
    width: Scales.deviceWidth,
    //height: Scales.deviceHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 25
  },
  img: {
    width: Scales.deviceWidth * 0.12,
    height: Scales.deviceWidth * 0.12,
    borderRadius: 100
  },
  notiDesc: {
    color: 'gray',
    paddingVertical: 9,
    paddingHorizontal: 16,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5
  },
  closeBg: {
    backgroundColor: '#d4d7d9',
    borderRadius: 100,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems:'center'
  },
  remove: {
    fontWeight: 'bold',
    fontSize: 17,
    paddingLeft: 10,
  }
})
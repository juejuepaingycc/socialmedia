import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ToastAndroid, StyleSheet, View } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import IMConversationList from '../IMConversationList';
import { TNActivityIndicator } from '../../truly-native';
import ChannelsTracker from '../firebase/channelsTracker';
import { Alert } from 'react-native';
import { IMLocalized } from '../../localization/IMLocalization';
import { channelManager } from '../firebase';
import { notificationManager } from '../../notifications';
import AppStyles from '../../../AppStyles'

class IMConversationListView extends Component {
  static contextType = ReactReduxContext;

  constructor(props) {
    super(props);
    this.state = {
      appStyles:
        (props.navigation &&
          props.navigation.state &&
          props.navigation.state.params &&
          props.navigation.state.params.appStyles) ||
        props.navigation.getParam('appStyles') ||
        props.appStyles
    };
  }

  componentDidMount() {
    const self = this;
    const userId = self.props.user.id || self.props.user.userID;
    this.channelsTracker = new ChannelsTracker(this.context.store, userId);
    this.channelsTracker.subscribeIfNeeded();
  }

  componentWillUnmount() {
    this.channelsTracker.unsubscribe();
  }

  onSendForward = (message, item) => {
    this.props.toggleLoading(true);
      channelManager.insertSeenUsers(item.id, this.props.user.id, false)
      if(this.props.shareStatus){
        console.log("Post Share>>" + this.props.shareText + ' ' + JSON.stringify(this.props.shareMedia));
        channelManager
          .sendMessage(
            this.props.user,
            item,
            this.props.shareText,
            this.props.shareMedia,
            null,
            '',
            true,
            this.props.shareName,
            this.props.sharePostInfo
          )
          .then((response) => {
            if (response.error) {
              this.props.toggleLoading(false);
              alert(error);
            } else {
              this.props.toggleLoading(false)
              ToastAndroid.show(IMLocalized('Shared post'), ToastAndroid.SHORT);
            }
          });
      }
      else{
        let url;
        if(message.url && message.url.url)
          url = message.url;
        else
          url = ''
        channelManager
          .sendMessage(
            this.props.user,
            item,
            message.content,
            url,
            null,
            '',
            false,
            '',
            ''
          )
          .then((response) => {
            if (response.error) {
              this.props.toggleLoading(false);
              alert(error);
            } else {
              this.broadcastPushNotifications(message.content, url, item);
              ToastAndroid.show(IMLocalized('Forwarded message'), ToastAndroid.SHORT);
              //this.props.navigation.goBack();
            }
          });
      }
  }

  broadcastPushNotifications = (inputValue, downloadURL, channel) => {
    const participants = channel.participants;
    if (!participants || participants.length == 0) {
      this.props.toggleLoading(false);
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
    this.props.toggleLoading(false)
  };

  onConversationLongPress = (channel) => {
    console.log("onConversationLongPress..."+ channel.id)
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to delete this conversation?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('YesExit'),
          
          onPress: () => {
            channelManager.deleteConversationForSingleUser(
              channel,
              this.props.user.id,
            )
          }
        }
    ]
    );
  };

  onConversationPress = (channel) => {
    console.log("BannedUser>>" , this.props.bannedUserIDs)
    if(this.props.bannedUserIDs && this.props.bannedUserIDs.length > 0){
      let temp = this.props.bannedUsers.filter((user) => (channel.id.includes(user.source) && user.source != this.props.user.id) || (channel.id.includes(user.dest) && user.dest != this.props.user.id) )
      if(temp.length > 0){
        console.log("Temp>>", temp[0])
        if(temp[0].source == this.props.user.id){
          this.props.navigation.navigate('PersonalChat', {
            channel,
            appStyles: this.state.appStyles,
            blocked: true,
            source: true,
            blockID: temp[0].blockID,
            blockDest: temp[0].dest
          });
        }
        else{
          this.props.navigation.navigate('PersonalChat', {
            channel,
            appStyles: this.state.appStyles,
            blocked: true,
            source: false,
            blockID: temp[0].blockID,
            blockDest: temp[0].dest
          });
        }     
      }
      else{
        this.props.navigation.navigate('PersonalChat', {
          channel,
          appStyles: this.state.appStyles,
          blocked: false
        });
      }
    }
    else{
      this.props.navigation.navigate('PersonalChat', {
        channel,
        appStyles: this.state.appStyles,
        blocked: false
      });
    }
  };

  render() {
    let realChannels = [];
    let allFriendsArr = this.props.friends.filter((friend) => friend.type == "reciprocal");
    if(this.props.groupScreen){
      if(this.props.forwarded){ //forward only to Groups and Reciprocal Friends
        if(this.props.channels){
          this.props.channels.forEach((channel) => {
            if(channel.group)
              realChannels.push(channel);
            else{
              let temp = allFriendsArr.filter((friend) => friend.user.id == channel.participants[0].id)
              if(temp.length > 0)
                realChannels.push(channel);
            }
          })
        }
      }
      else{ //Group Screen
        if(this.props.channels){
          this.props.channels.forEach((channel) => {
            if(channel.group && channel.deletedUsers && !channel.deletedUsers.includes(this.props.user.userID))
            {
              realChannels.push(channel);
            }
            else if(channel.group && !channel.deletedUsers){
              realChannels.push(channel);
            } 
          })
        }
      }
  }
  else{
    if(this.props.forwarded){
      if(this.props.channels){
        this.props.channels.forEach((channel) => {
          if(channel.group)
            realChannels.push(channel);
          else{
            let temp = allFriendsArr.filter((friend) => friend.user.id == channel.participants[0].id)
            if(temp.length > 0)
              realChannels.push(channel);
          }
        })
      }
    }
    else{
      if(this.props.channels){
        this.props.channels.forEach((channel) => {
          const resultArr = channel.participants.filter((data,index)=>{
            return channel.participants.indexOf(data) === index;
          })
          channel.participants = resultArr;
          if((channel.seenUsers && channel.seenUsers.includes(this.props.user.userID))
          ||
          !channel.seenUsers)
          {
            channel['seen'] = true;
          }
          else if(channel.seenUsers && !channel.seenUsers.includes(this.props.user.userID))
          {
            channel['seen'] = false;
          }

          if(channel.group){
            if(channel.deletedUsers && !channel.deletedUsers.includes(this.props.user.userID))
            {
              realChannels.push(channel);
            }
            else if(!channel.deletedUsers){
              realChannels.push(channel);
            } 
          }
          else{
            let temp = allFriendsArr.filter((friend) => friend.user.id == channel.participants[0].id)
            if(temp.length > 0){
              if(channel.deletedUsers && !channel.deletedUsers.includes(this.props.user.userID))
              {
                realChannels.push(channel);
              }
              else if(!channel.deletedUsers){
                realChannels.push(channel);
              } 
            }
            else{
              let temp = this.props.bannedUserIDs.filter((id)=> id == channel.participants[0].id)
              if(temp.length > 0){
                if(channel.deletedUsers && !channel.deletedUsers.includes(this.props.user.userID))
                {
                  realChannels.push(channel);
                }
                else if(!channel.deletedUsers){
                  realChannels.push(channel);
                } 
              }
            }
          }
        })
      }
    } 
  }

    return (
      <IMConversationList
          loading={this.props.channels == null}
          conversations={realChannels}
          onConversationPress={this.onConversationPress}
          onConversationLongPress={this.onConversationLongPress}
          appStyles={this.state.appStyles}
          emptyStateConfig={this.props.emptyStateConfig}
          forwarded={this.props.forwarded}
          forwardMessage={this.props.forwardMessage}
          onSendForward={this.onSendForward}
      />
    );
  }
}

IMConversationListView.propTypes = {
  channels: PropTypes.array,
};

const mapStateToProps = ({ chat, auth, userReports, friends }) => {
  return {
    channels: chat.channels,
    user: auth.user,
    bannedUserIDs: userReports.bannedUserIDs,
    bannedUsers: userReports.bannedUsers,
    friends: friends.friendships
  };
};

export default connect(mapStateToProps)(IMConversationListView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
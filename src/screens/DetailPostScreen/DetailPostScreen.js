import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { BackHandler, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Modal, View, Text, Image, Alert, Share, ToastAndroid } from 'react-native';
import { DetailPost } from '../../components';
import {
  firebaseComment,
  firebasePost,
} from '../../Core/socialgraph/feed/firebase';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { reportingManager } from '../../Core/user-reporting';
import FeedManager from '../../Core/socialgraph/feed/FeedManager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
  removePost, 
  removeProfilePost, 
  editNewFeeds, 
  editProfileFeeds, 
  setProfileEditedPost, 
  setEditedProfileStatus, 
  editPostReactions, 
  editProfilePostReactions } from '../../Core/socialgraph/feed/redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Scales, Colors } from '@common';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

class DetailScreen extends Component {
  static contextType = ReactReduxContext;
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];

    return {
      headerTitle: IMLocalized('Post'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');

    this.state = {
      comments: [],
      replies: [],
      feedItem: [],
      selectedMediaIndex: null,
      selectedFeedItems: [],
      commentsLoading: true,
      isMediaViewerOpen: false,
      shouldUpdate: false,
      replyName: '',
      clickedReply: false,
      clickedCommentID: '',
      commentReactions: [],
      actions: [],
      showModal: false,
      editingComment: {},
      editedText: ''
    };

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

    this.scrollViewRef = React.createRef();
    this.lastScreenTitle = this.props.navigation.getParam('lastScreenTitle');
    this.ProfileScreenTitle = this.lastScreenTitle + 'Profile';
    this.likedPost = false;
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.unsubscribeSinglePost = firebasePost.subscribeToSinglePost(
      this.item.id,
      this.onFeedItemUpdate,
    );
    this.unsubscribeComments = firebaseComment.subscribeComments(
      this.item.id,
      this.onCommentsUpdate,
    );
    this.setState({ shouldUpdate: true });
    this.feedManager = new FeedManager(this.context.store, this.props.user.id);

  }

  componentWillUnmount() {
    this.unsubscribeComments && this.unsubscribeComments();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.unsubscribeSinglePost && this.unsubscribeSinglePost();
  }

  onFeedItemUpdate = (feedItem) => {
    //console.log('Detailpost>>'+ JSON.stringify(feedItem))

            feedItem['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
            feedItem['gaveReaction'] = 'thumbsupUnfilled';
  
            if(feedItem.postReactions){
              feedItem.postReactions.map((reaction) => {
                if(this.props.user.id == reaction.userID){
                  if(reaction.reaction == 'like')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['like'];
                    feedItem['gaveReaction'] = 'like';
                  }
                  else if(reaction.reaction == 'love')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['love'];
                    feedItem['gaveReaction'] = 'love'
                  }
                  else if(reaction.reaction == 'angry')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['angry'];
                    feedItem['gaveReaction'] = 'angry'
                  }
                  else if(reaction.reaction == 'surprised')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['surprised'];
                    feedItem['gaveReaction'] = 'surprised'
                  }
                  else if(reaction.reaction == 'laugh')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['laugh'];
                    feedItem['gaveReaction'] = 'laugh'
                  }
                  else if(reaction.reaction == 'cry')
                  {
                    feedItem['iconSource'] = AppStyles.iconSet['cry'];
                    feedItem['gaveReaction'] = 'cry'
                  }
                }
              })
            }
            //console.log("FinalPost>>" + JSON.stringify(feedItem));
            this.setState({ feedItem })

  };

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onRepliesUpdate = (replies) => {
   // console.log("Replies>>"+ JSON.stringify(replies))
    this.setState({
      replies,
      commentsLoading: false,
    });
  };

  onCommentsUpdate = (comments) => {
    this.postCommentLength = comments.length;
    this.setState({
      comments,
      commentsLoading: false,
    });
  };

  removeMenu = () => {
    this.setState({ actions: [] })
  }

  onReplySend = async (value) => {
    console.log("Val>>"+ value);
    this.setState({ replyName: '', clickedReply: false, clickedCommentID: '' })
    const replyObject = {
      replyText: value,
      authorID: this.props.user.id,
    };
    firebaseComment.addReply(
      replyObject,
      this.props.user,
      this.state.feedItem,
      this.state.clickedCommentID
    );

  };

  onCommentSend = async (value) => {
    console.log("Val>>"+ value);
    let name = '';
    let comment = value;
    // let arr = value.split(">");
    // if(arr.length > 1){
    //   name = arr[0];
    //   comment = arr[1];
    // }
    // else{
    //   comment = value;
    // }

    const commentObject = {
      postID: this.state.feedItem.id,
      commentText: comment,
      replyName: name,
      authorID: this.props.user.id,
    };
    firebaseComment.addComment(
      commentObject,
      this.props.user,
      this.state.feedItem,
      false,
    );
    this.setState({ replyName: '' })

    setTimeout(() => {
      let editedPost = {
        id: this.state.feedItem.id,
        commentCount: this.state.feedItem.commentCount + 1
      }
     // this.setState({ feedItem: { ...this.state.feedItem, commentCount: this.state.feedItem.commentCount + 1 } })
      //if(this.lastScreenTitle == 'Feed')
        this.props.editNewFeeds(editedPost);
        if(this.state.feedItem.authorID == this.props.user.id && this.props.profileFeeds && this.props.profileFeeds.length > 0){
          console.log("dddddd");
          this.props.editProfileFeeds(editedPost);
          this.props.setProfileEditedPost(editedPost);
          this.props.setEditedProfileStatus(true);
        }
    }, 400)
  };

  onCommentReactionList = (comment) => {
    this.props.navigation.navigate('ReactionList', {
      commentID: comment.commentID
    })
  }

  onCommentReactionDelete = (commentID) => {
    this.reactionDelRes = firebaseComment.deleteCommentReaction(commentID, this.props.user.id);
  }

  onCommentReaction = (commentID, reaction, increaseCount) => {
    this.reactionRes = firebaseComment.applyCommentReaction(commentID, this.props.user.id, reaction, increaseCount);
  }

  onDelete = (comment) => {
    if(comment.authorID == this.props.user.id){
      //Own Comment
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.deleteComment(comment);
          }
        },
        {
          icon: 'edit',
          name: IMLocalized('Edit'),
          pressMenu: () => {
            this.setState({ actions: [], showModal: true, editingComment: comment, editedText: comment.commentText });
          }
        },
      ] })
    }

    else if(comment.authorID != this.props.user.id && this.item.authorID == this.props.user.id){
      //Not own comment, but post owner
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.deleteComment(comment);
          }
        }
      ] })
    }
  }

  updateComment = async () => {
    console.log("Edited ID"+ comment.id);
    console.log("EditedText>>"+ this.state.editedText);
    this.setState({ showModal: false });
    let res = await firebaseComment.editComment(comment, this.state.editedText);
    if(!res){
      ToastAndroid.show(IMLocalized('Fail to edit comment'), ToastAndroid.SHORT);
    }
  }

  deleteComment = (comment) => {
      //Comment Owner or Post Owner
      Alert.alert(
        '',
        IMLocalized('Are you sure you want to delete?'),
        [
          { 
            text: IMLocalized('CancelTransfer') ,
            style: 'cancel',
            onPress: () => {
              this.setState({ actions: [] })
            }
          },
          { 
            text: IMLocalized('OK'),
            onPress: () => {
              this.setState({ actions: [] })
              this.deleteRes = firebaseComment.deleteComment(comment);
              setTimeout(() => {
                let editedPost = {
                  id: this.state.feedItem.id,
                  commentCount: this.state.feedItem.commentCount - 1
                }
                //this.setState({ feedItem: { ...this.state.feedItem, commentCount: this.state.feedItem.commentCount - 1 } })
                if(this.lastScreenTitle == 'Feed')
                  this.props.editNewFeeds(editedPost);
                else{
                  this.props.editProfileFeeds(editedPost);
                  this.props.setProfileEditedPost(editedPost);
                  this.props.setEditedProfileStatus(true);
                }
                if(this.deleteRes){
                  ToastAndroid.show(IMLocalized('Deleted successfully'), ToastAndroid.SHORT);
                }
                else{
                  ToastAndroid.show('Fail to delete', ToastAndroid.SHORT);
                }
              }, 200)
            }
          }
      ]
      );
  }

  clickReply = (comment) => {
    this.props.navigation.navigate('FeedCommentReply', {
      comment,
      feedItem: this.state.feedItem,
      postAuthorID: this.item.authorID
    });
  }

  onReaction = async (reaction, item) => {
    feedManager.applyReaction(reaction, item, false);
    await firebaseComment.handleReaction(
      reaction,
      this.props.user,
      item,
      false,
      this.props.users,
    );
  };

  onMediaPress = (media, mediaIndex) => {
    this.setState({
      selectedMediaIndex: mediaIndex,
      selectedFeedItems: media,
      //isMediaViewerOpen: true,
    });
    this.props.navigation.navigate('MediaSwiper',{
      feedItems: media
    })
  };

  onMediaClose = () => {
    this.setState({ isMediaViewerOpen: false });
  };

  onFeedUserItemPress = async (item) => {
    if (item.id === this.props.user.id) {
      this.props.navigation.navigate(this.ProfileScreenTitle, {
        stackKeyTitle: this.ProfileScreenTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    } else {
      this.props.navigation.navigate(this.ProfileScreenTitle, {
        user: item,
        stackKeyTitle: this.ProfileScreenTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    }
  };

  onSharePostToChat = (item) => {
    console.log('jjjjjj')
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

  onDeletePost = async (item) => {
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
          onPress: () => {this.deletePost(item)}
        }
    ]
    );

  };

  deletePost = async (item) => {
    this.deletePostUnsubscribe = await firebasePost.deletePost(
      item,
      this.onDeletePostSuccess,
    );
  }

  onViewReaction = (item) => {
    this.props.navigation.navigate('ReactionList', {
      postID: item.id
    })
  }

  onDeletePostSuccess = (postID) => {
      this.props.removePost(postID);
      if(this.props.profileFeeds && this.props.profileFeeds.length > 0){
        this.props.removeProfilePost(postID);
        this.props.setEditedProfileStatus('edited');
      }
    ToastAndroid.show(IMLocalized('Post was successfully deleted'), ToastAndroid.SHORT);
    this.props.navigation.goBack();
  }

  giveReaction = async (reaction, item, insertStatus) => {
    this.reactionRes = await firebasePost.applyPostReaction(item, 
      this.props.user,
      this.props.user.id, reaction, insertStatus,
      this.onGiveReactionDone);
  }

  deletePostReaction = async (item) => {
    this.reactionDelRes = firebasePost.deletePostReaction(item.id, item.authorID, this.props.user.id,
      this.onDeleteReactionDone);
  }

  onDeleteReactionDone = (result) => {
    //if(this.lastScreenTitle == 'Feed')
      this.props.editPostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']);
   // else{
      if(result.authorID == this.props.user.id && this.props.profileFeeds && this.props.profileFeeds.length > 0){
        console.log("dddddddddd");
        this.props.editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']); 
        this.props.setProfileEditedPost({
          id: result.postID,
          postReactions: result.reactions,
          postReactionsCount: result.postReactionsCount,
          gaveReaction: 'thumbsupUnfilled',
          iconSource: AppStyles.iconSet['thumbsupUnfilled']
        })
        this.props.setEditedProfileStatus(true);
      }
    //}
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
                //if(this.lastScreenTitle == 'Feed')
                  this.props.editPostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon);
                //else{
                  if(result.authorID == this.props.user.id && this.props.profileFeeds && this.props.profileFeeds.length > 0){
                    console.log("dddddddddd");
                    this.props.editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon);
                      let obj = {
                        id: result.postID,
                        postReactions: result.reactions,
                        postReactionsCount: result.postReactionsCount,
                        gaveReaction: result.gaveReaction,
                        iconSource: icon
                      }
                      this.props.setProfileEditedPost(obj);
                      this.props.setEditedProfileStatus(true);
                  }
              //  }
  }

  onUserReport = async (item, type) => {
      console.log("onUserReport>>"+ JSON.stringify(item) + "   " + type);
      if(type == IMLocalized('Report Post')){
        //const res = await firebasePost.deletePostFromUser(this.props.user.id, item);
      
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
        this.props.navigation.goBack();
      }
  };

  render() {     
        return (
        <>
          <DetailPost
          scrollViewRef={this.scrollViewRef}
          feedItem={this.state.feedItem}
          commentItems={this.state.comments}
          replyItems={this.state.replies}
          commentReactions={this.state.commentReactions}
          onCommentSend={this.onCommentSend}
          onReplySend={this.onReplySend}
          removeMenu={this.removeMenu}
          clickReply={this.clickReply}
          onDelete={this.onDelete}
          onViewReaction={this.onViewReaction}
          onCommentReaction={this.onCommentReaction}
          onCommentReactionDelete={this.onCommentReactionDelete}
          onCommentReactionList={this.onCommentReactionList}
          onFeedUserItemPress={this.onFeedUserItemPress}
          giveReaction={this.giveReaction}
          deletePostReaction={this.deletePostReaction}
          onMediaPress={this.onMediaPress}
          feedItems={this.state.selectedFeedItems}
          onMediaClose={this.onMediaClose}
          isMediaViewerOpen={this.state.isMediaViewerOpen}
          selectedMediaIndex={this.state.selectedMediaIndex}
          onReaction={this.onReaction}
          shouldUpdate={this.state.shouldUpdate}
          onSharePost={this.onSharePost}
          onSharePostToChat={this.onSharePostToChat}
          onDeletePost={this.onDeletePost}
          onUserReport={this.onUserReport}
          user={this.props.user}
          commentsLoading={this.state.commentsLoading}
          replyName={this.state.replyName}
          clickedReply={this.state.clickedReply}
          actions={this.state.actions}
        />
        <Modal
          transparent={true}
          visible={this.state.showModal}
          backdropOpacity={0.3}
         // style={{ justifyContent: 'flex-end', }}
          onRequestClose={() => { 
            this.setState({ showModal: false })
           }}>
             <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
     style={styles.modalBackground2}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <TouchableOpacity onPress={()=> {
                  this.setState({ showModal: false });
                  }}>
                  <Icon name='chevron-back' size={23} style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{IMLocalized('Edit')}</Text>
                <Text style={{ color: 'white' }}>Edit</Text>
              </View>
              <View style={styles.body}>
                <View style={styles.commentItemContainer}>
                  <View style={styles.commentItemImageContainer}>
                    <Image
                      style={styles.commentItemImage}
                      source={{
                        uri: this.state.editingComment.profilePictureURL,
                      }}
                    />
                  </View>
                  <View style={styles.commentItemBodyContainer}>
                    <View style={styles.inputContainer}>
                      <AutoGrowingTextInput
                        style={styles.input}
                        value={this.state.editedText}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({ editedText: text })}
                      />
                    </View>
                    <View style={styles.btnView}>
                      <TouchableOpacity style={styles.cancelBtn} onPress={()=> {
                        this.setState({ showModal: false })
                      }}>
                        <Text style={styles.cancelText}>{IMLocalized('CancelTransfer')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.updateBtn} onPress={()=> {
                            console.log("Edited ID"+ this.state.editingComment.id);
                            console.log("EditedText>>"+ this.state.editedText);
                            this.setState({ showModal: false });
                            let res = firebaseComment.editComment(this.state.editingComment, this.state.editedText);
                            if(!res){
                              ToastAndroid.show(IMLocalized('Fail to edit comment'), ToastAndroid.SHORT);
                            }
                      }}>
                        <Text style={styles.updateText}>{IMLocalized('Update')}</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal> 
        </>
        )
  }
}

const styles = StyleSheet.create({
  modalBackground2: {
    flex: 1,
    backgroundColor: 'rgba(150, 153, 153,0.6)',
    width: Scales.deviceWidth,
    height: Scales.deviceHeight,
    //alignItems: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: Scales.deviceWidth,
    height: Scales.deviceHeight,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    width: Scales.deviceWidth,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentItemContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 2,
  },
  commentItemImageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  commentItemImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginVertical: 5,
    marginLeft: 5,
  },
  commentItemBodyContainer: {
    flex: 5,
  },
  body: {
    marginTop: 16
  },
  inputContainer: {
    borderRadius: 8,
    backgroundColor: '#c3c7c9',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: 6,
    backgroundColor: AppStyles.colorSet['light'].whiteSmoke,
    marginRight: 16
  },
  input: {
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 3,
    paddingRight: 20,
    width: '93%',
    fontSize: 16,
    lineHeight: 22,
    color: AppStyles.colorSet['light'].mainTextColor,
  },
  btnView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 10
  },
  cancelBtn: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#c3c7c9',
    marginRight: 10
  },
  updateBtn: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'black'
  },
  cancelText: {
    fontSize: 14
  },
  updateText: {
    fontSize: 14,
    color: 'white'
  }
})

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    comments: feed.comments,
    myReactions: feed.feedPostReactions,
    profileFeeds: feed.profileFeeds,
    user: auth.user,
    users: auth.users,
    friends: friends.friends,
  };
};

export default connect( mapStateToProps,
  { editNewFeeds, 
    editProfileFeeds, 
    setEditedProfileStatus,
    setProfileEditedPost,
    removePost, 
    removeProfilePost,
    editPostReactions, 
    editProfilePostReactions 
  })(DetailScreen);

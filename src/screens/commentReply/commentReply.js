import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, View, Alert, ToastAndroid  } from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { firebaseComment } from '../../Core/socialgraph/feed/firebase';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import CommentItem from '../../components/screens/DetailPost/CommentItem';
import CommentInput from '../../components/screens/DetailPost/CommentInput';
import Icon from 'react-native-vector-icons/Ionicons';
import ThreadOptionsItem from '../../Core/chat/IMChat/ThreadOptionsItem';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Scales } from '@common';

class CommentReplyScreen extends Component {
  //static styles = dynamicStyles('light');
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: IMLocalized('Replies'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.comment = this.props.navigation.getParam('comment');
    this.items = this.props.navigation.getParam('feedItem');
    this.postAuthorID = this.props.navigation.getParam('postAuthorID');
    this.state = {
      comment: this.comment,
      replies: '',
      subReplies: [],
      feedItem: this.items,
      postAuthorID: this.postAuthorID,
      showReplying: false,
      subReply: null,
      updatingReply: false,
      actions: [],
      showModal: false,
      editingComment: null,
      editedText: '',
      editingReply: null,
      editedReplyText: '',
      editingSubReply: null,
      editedSubReplyText: ''
    };

    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

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
    this.unsubscribeReplies = firebaseComment.subscribeCommentReplies(
      this.state.comment.commentID,
      this.onRepliesUpdate,
    );
  }

  componentWillUnmount() {
    this.unsubscribeReplies && this.unsubscribeReplies();
    this.unsubscribeSubReplies && this.unsubscribeSubReplies();
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }


  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onRepliesUpdate = (replies) => {
    let tempArr = replies;
    if(replies.length > 0){
      for(let index=0;index<=replies.length;index++){

        if(index != replies.length){
          tempArr[index]['showReplyReaction'] = false;
          tempArr[index]['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
          tempArr[index]['gaveReaction'] = ''

          if(replies[index].reactions){
            replies[index].reactions.map((reaction) => {
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
          if(this.state.updatingReply){
            this.setState({ replies: tempArr, updatingReply: false })
          }
          else{
            if(this.state.showReplying){
              this.setState({ subReplies: tempArr })
            }
            else{
              this.setState({ replies: tempArr })
            }
          }
        }
      }          
    }
    else{
      if(this.state.showReplying)
        this.setState({ subReplies: [] })
      else
        this.setState({ replies: [] });
    }  
  };

  onSubReplySend = (value) => {
    const replyObject = {
      subReplyText: value,
      authorID: this.props.user.id,
    };
    firebaseComment.addSubReply(
      replyObject,
      this.props.user,
      this.state.feedItem,
      this.state.comment.commentID,
      this.state.subReply.replyID
    );
    this.setState({ showReplying: false, subReply: null, subReplies: [] })
  }

  subReplyCancel = () => {
    this.setState({ showReplying: false, subReply: null, subReplies: [] })
  }

  onReplySend = async (value) => {
    const replyObject = {
      replyText: value,
      authorID: this.props.user.id,
    };
    firebaseComment.addReply(
      replyObject,
      this.props.user,
      this.state.feedItem,
      this.state.comment.commentID
    );
  };

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

    else if(comment.authorID != this.props.user.id && this.comment.authorID == this.props.user.id){
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

  deleteComment = (comment) => {
      //Comment Owner or Post Owner
      Alert.alert(
        '',
        IMLocalized('Are you sure you want to delete?'),
        [
          { 
            text: IMLocalized('CancelTransfer') ,
            style: 'cancel'
          },
          { 
            text: IMLocalized('OK'),
            onPress: () => {
              this.deleteRes = firebaseComment.deleteComment(comment);
              if(this.deleteRes){
                ToastAndroid.show(IMLocalized('Deleted successfully'), ToastAndroid.SHORT);
                this.props.navigation.goBack();
              }
              else{
                ToastAndroid.show('Fail to delete', ToastAndroid.SHORT);
              }
            }
          }
      ]
      );
  }

  onReplyReactionDelete = (commentID, replyID) => {
    this.replyReactionDel = firebaseComment.deleteCommentReplyReaction(commentID, replyID, this.props.user.id);
  }

  onReplyReaction = (commentID, replyID, reaction, increaseCount) => {
    this.replyReactionRes = firebaseComment.applyCommentReplyReaction(commentID, replyID, this.props.user.id, reaction, increaseCount);
  }

  onSubReplyReaction = (commentID, replyID, subReplyID, reaction, increaseCount) => {
    this.replyReactionRes = firebaseComment.applySubReplyReaction(commentID, replyID, subReplyID, this.props.user.id, reaction, increaseCount);
  }

  deleteSubReplyReaction = async ( commentID, replyID, subReplyID, userID ) => {
    this.replyReactionDeleteRes = await firebaseComment.deleteSubReplyReaction(commentID, replyID, subReplyID, userID);
    this.decreaseReplyReactionCount = await firebaseComment.decreaseSubReplyReactionCount(commentID, replyID, subReplyID);
  }

  deleteReplyReaction = async ( commentID, replyID, userID ) => {
    this.replyReactionDeleteRes = await firebaseComment.deleteReplyReaction(commentID, replyID, userID);
    this.decreaseReplyReactionCount = await firebaseComment.decreaseReplyReactionCount(commentID, replyID);
  }

  onSubReplyReactionList = (reply, subreply) => {
    this.props.navigation.navigate('ReactionList', {
      commentID: this.state.comment.commentID,
      replyID: reply.replyID,
      subReplyID: subreply.subReplyID
    })
  }

  onReplyReactionList = (reply) => {
    this.props.navigation.navigate('ReactionList', {
      commentID: this.state.comment.commentID,
      replyID: reply.replyID
    })
  }
  
  onSubReplyReactionPress = (reaction, id, subid) => {
    let tempArr = this.state.subReplies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showSubReplyReaction'] = false;
          if(tempArr[index].subReplyID == subid){
            tempArr[index]['iconSource'] = AppStyles.iconSet[reaction];
              if(tempArr[index]['gaveReaction'] && tempArr[index]['gaveReaction'] == reaction){

              }
              else if(tempArr[index]['gaveReaction'] != ''){
                tempArr[index]['gaveReaction'] = reaction;
                this.onSubReplyDelete(this.state.comment.commentID, id, subid, reaction, false);
              }
              else{
                tempArr[index]['gaveReaction'] = reaction;
                this.onSubReplyReaction(this.state.comment.commentID, id, subid, reaction, true);
              }
          }
      }
      else{
        this.setState({ subReplies: tempArr })
      }
    }
  }

   onReplyReactionPress = (reaction, id) => {
    let tempArr = this.state.replies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showReplyReaction'] = false;
          if(tempArr[index].replyID == id){
            tempArr[index]['iconSource'] = AppStyles.iconSet[reaction];
              if(tempArr[index]['gaveReaction'] && tempArr[index]['gaveReaction'] == reaction){

              }
              else if(tempArr[index]['gaveReaction'] != ''){
                tempArr[index]['gaveReaction'] = reaction;
                this.setState({ updatingReply: true })
                this.onReplyReaction(this.state.comment.commentID, id, reaction, false);
              }
              else{
                tempArr[index]['gaveReaction'] = reaction;
                this.setState({ updatingReply: true })
                this.onReplyReaction(this.state.comment.commentID, id, reaction, true);
              }
          }
      }
      else{
        this.setState({ replies: tempArr })
      }
    }
  }

  onSubReplyReactionLongPress = (reply, subreply) => {
    let tempArr = this.state.subReplies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
        if(tempArr[index].subReplyID == subreply.subReplyID){
          tempArr[index]['showSubReplyReaction'] = true;
        }
        else{
          tempArr[index]['showSubReplyReaction'] = false;
        }
      }
      else{
        this.setState({ subReplies: tempArr })
      }
    }
  };

  onReplyReactionLongPress = (reply) => {
    let tempArr = this.state.replies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
        if(tempArr[index].replyID == reply.replyID){
          tempArr[index]['showReplyReaction'] = true;
        }
        else{
          tempArr[index]['showReplyReaction'] = false;
        }
      }
      else{
        this.setState({ replies: tempArr })
      }
    }

  };

  onSubReplyLikePress = (reply, subreply) => {
    let tempArr = this.state.subReplies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showSubReplyReaction'] = false;
          if(tempArr[index].subReplyID == subreply.subReplyID){
            if(subreply.gaveReaction != ''){
              tempArr[index]['gaveReaction'] = '';
              tempArr[index]['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
              this.deleteSubReplyReaction(this.state.comment.commentID, reply.replyID, subreply.subReplyID, this.props.user.id);
            }
            else{
              tempArr[index]['gaveReaction'] = 'like';
              tempArr[index]['iconSource'] = AppStyles.iconSet['like'];
              this.onSubReplyReaction(this.state.comment.commentID, reply.replyID, subreply.subReplyID, 'like', true);
            }
          }
      }
      else{
        this.setState({ subReplies: tempArr })
      }
    }
  }

  goEdit = () => {
    this.setState({ showModal: false });
    if(this.state.editingSubReply){
      let temp = this.state.editedSubReplyText.replace(/\s/g, '');
      if(temp.length == 0){
        ToastAndroid.show('Enter reply', ToastAndroid.SHORT);
        this.resetEditing();
      }
      else{
        let res = firebaseComment.editSubReply(this.state.editingComment, this.state.editingReply, this.state.editingSubReply, this.state.editedSubReplyText);
        if(!res){
          this.resetEditing();
          ToastAndroid.show(IMLocalized('Fail to edit reply'), ToastAndroid.SHORT);
        }
        else{
          this.resetEditing();
        }
      }
    }
    else if(this.state.editingReply){
      let temp = this.state.editedReplyText.replace(/\s/g, '');
      if(temp.length == 0){
        ToastAndroid.show('Enter reply', ToastAndroid.SHORT);
        this.resetEditing();
      }
      else{
        let res = firebaseComment.editReply(this.state.editingComment, this.state.editingReply, this.state.editedReplyText);
        if(!res){
          this.resetEditing();
          ToastAndroid.show(IMLocalized('Fail to edit reply'), ToastAndroid.SHORT);
        }
        else{
          this.resetEditing();
        }
      }
    }
    else{
      let temp = this.state.editedText.replace(/\s/g, '');
      if(temp.length == 0){
        ToastAndroid.show('Enter comment', ToastAndroid.SHORT);
        this.resetEditing();
      }
      else{
        let res = firebaseComment.editComment(this.state.editingComment, this.state.editedText);
        if(!res){
          this.resetEditing();
          ToastAndroid.show(IMLocalized('Fail to edit comment'), ToastAndroid.SHORT);
        }
        else{
          this.resetEditing();
          this.props.navigation.goBack();
        }
      }
    }
  }

  resetEditing = () => {
    this.setState({ editingComment: null, editedText: '', editingReply: null, editedReplyText: '', editingSubReply: null, editedSubReplyText: '' });
  }
  
  onReplyLikePress = (reply) => {
    let tempArr = this.state.replies;
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
          tempArr[index]['showReplyReaction'] = false;
          if(tempArr[index].replyID == reply.replyID){
            if(reply.gaveReaction != ''){
              console.log("Unlike...")
              tempArr[index]['gaveReaction'] = '';
              tempArr[index]['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
              this.setState({ updatingReply: true })
              this.deleteReplyReaction(this.state.comment.commentID, reply.replyID, this.props.user.id);
            }
            else{
              console.log("Like...")
              tempArr[index]['gaveReaction'] = 'like';
              tempArr[index]['iconSource'] = AppStyles.iconSet['like'];
              this.setState({ updatingReply: true })
              this.onReplyReaction(this.state.comment.commentID, reply.replyID, 'like', true);
            }
          }
      }
      else{
        this.setState({ replies: tempArr })
      }
    }
  }

  onSubReplyDelete = async (comment, reply, subreply) => {
    // if(subreply.authorID == this.props.user.id || this.state.postAuthorID == this.props.user.id){
    if(subreply.authorID == this.props.user.id){
      //Own Reply
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.setState({ actions: [] })
            this.deleteSubReply(comment, reply, subreply);
          }
        },
        {
          icon: 'edit',
          name: IMLocalized('Edit'),
          pressMenu: () => {
            this.setState({ actions: [], showModal: true,
              editingComment: comment, editedText: comment.commentText,
              editingReply: reply, editedReplyText: reply.replyText,
              editingSubReply: subreply, editedSubReplyText: subreply.subReplyText,
            });
          }
        },
      ] })
    }

    else if(subreply.authorID != this.props.user.id && this.comment.authorID == this.props.user.id){
      //Not own comment, but post owner
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.setState({ actions: [] })
            this.deleteSubReply(comment, reply, subreply);
          }
        }
      ] })
    }
  }

  deleteSubReply = (comment, reply, subreply) => {
      Alert.alert(
        '',
        IMLocalized('Are you sure you want to delete?'),
        [
          { 
            text: IMLocalized('CancelTransfer') ,
            style: 'cancel'
          },
          { 
            text: IMLocalized('OK'),
            onPress: () => {this.goSubReplyDelete(comment, reply, subreply)}
          }
      ]
      );
  }

  onReplyDelete = async (comment, reply) => {
    if(reply.authorID == this.props.user.id){
      //Own Comment
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.setState({ actions: [] })
            this.deleteReply(comment, reply);
          }
        },
        {
          icon: 'edit',
          name: IMLocalized('Edit'),
          pressMenu: () => {
            this.setState({ actions: [], showModal: true,
              editingComment: comment, editedText: comment.commentText,
              editingReply: reply, editedReplyText: reply.replyText });
          }
        },
      ] })
    }

    else if(reply.authorID != this.props.user.id && this.comment.authorID == this.props.user.id){
      //Not own comment, but post owner
      this.setState({ actions: [
        {
          icon: 'delete',
          name: IMLocalized('delete'),
          pressMenu: () => {
            this.setState({ actions: [] })
            this.deleteReply(comment, reply);
          }
        }
      ] })
    }
  }

  deleteReply = (comment, reply) => {
    if(reply.authorID == this.props.user.id || this.state.postAuthorID == this.props.user.id){
      Alert.alert(
        '',
        IMLocalized('Are you sure you want to delete?'),
        [
          { 
            text: IMLocalized('CancelTransfer') ,
            style: 'cancel'
          },
          { 
            text: IMLocalized('OK'),
            onPress: () => {this.goDelete(comment, reply)}
          }
      ]
      );
    }
  }

  goSubReplyDelete = async (comment, reply, subreply) => {
    this.setState({ showReplying: false, subReply: null, subReplies: [] })
    this.deleteRes = await firebaseComment.deleteSubReply(comment.commentID, reply.replyID, subreply.subReplyID);
    ToastAndroid.show(IMLocalized('Deleted successfully'), ToastAndroid.SHORT);
    this.decreaseSubReplyCount = firebaseComment.decreaseSubReplyCount(comment.commentID, reply.replyID);
  }

  goDelete = async (comment, reply) => {
    this.deleteRes = await firebaseComment.deleteCommentReply(comment.commentID, reply.replyID);
    ToastAndroid.show(IMLocalized('Deleted successfully'), ToastAndroid.SHORT);
    this.decreaseReplyCount = firebaseComment.decreaseCommentReplyCount(comment.commentID);
  }

  clickSubReply = (reply) => {
    console.log("Reply>>", reply.replyID + '  ' + this.state.comment.commentID)
    if(!this.state.showReplying){
      this.setState({ showReplying: true, subReply: reply })
      this.unsubscribeSubReplies = firebaseComment.subscribeSubReplies(
        this.state.comment.commentID,
        reply.replyID,
        this.onRepliesUpdate,
      );
    }
    else{
      this.setState({ showReplying: false, subReply: null, subReplies: [] })
    }
  }

  render() {
    return (
    <KeyboardAwareView style={styles.detailPostContainer}>
      <ScrollView>
        <CommentItem 
            item={this.state.comment} 
            clickedReply={true}
            clickSubReply={this.clickSubReply}
            replyItems={this.state.replies} 
            subReplyItems={this.state.subReplies}
            showReplying={this.state.showReplying}
            subReply={this.state.subReply}
            userId={this.props.user.id}
            onReplyReaction={this.onReplyReaction}
            onReplyReactionDelete={this.onReplyReactionDelete}
            onDelete={this.onDelete}
            onReplyReactionList={this.onReplyReactionList}
            onSubReplyReactionList={this.onSubReplyReactionList}
            onReplyDelete={this.onReplyDelete}
            onSubReplyDelete={this.onSubReplyDelete}
            onReplyReactionLongPress={this.onReplyReactionLongPress}
            onSubReplyReactionLongPress={this.onSubReplyReactionLongPress}
            onReplyReactionPress={this.onReplyReactionPress}
            onSubReplyReactionPress={this.onSubReplyReactionPress}
            onReplyLikePress={this.onReplyLikePress}
            onSubReplyLikePress={this.onSubReplyLikePress}
            renderHTML={
            <View style={styles.row}>
            <Text style={styles.commentItemBodySubtitle}>{this.state.comment.commentText}</Text>
          </View>}
        />
      </ScrollView>
      <CommentInput onSubReplySend={this.onSubReplySend} subReplyCancel={this.subReplyCancel} showReplying={this.state.showReplying} onReplySend={this.onReplySend} clickedReply={true} />
    
      {
        this.state.actions.length > 0 && (
          <View style={styles.bottomModal}>
                <TouchableOpacity style={styles.removeIcon} onPress={()=> this.setState({ actions: [] })}>
                  <MCIcon name='close-circle' color='black' size={25}  />
                </TouchableOpacity>
                <ThreadOptionsItem items={this.state.actions} />
          </View>
      )}
    
      <Modal
          transparent={false}
          visible={this.state.showModal}
          backdropOpacity={0.3}
         // style={{ justifyContent: 'flex-end', }}
          onRequestClose={() => { 
            this.setState({ showModal: false })
           }}>
             <View
              //keyboardShouldPersistTaps="always"
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
                  {
                    this.state.editingComment && !this.state.editingReply && !this.state.editingSubReply && (
                      <Image
                      style={styles.commentItemImage}
                      source={{
                        uri: this.state.editingComment.profilePictureURL             
                      }}
                    />
                    )
                  }
                   {
                    this.state.editingReply && !this.state.editingSubReply && (
                      <Image
                      style={styles.commentItemImage}
                      source={{
                        uri: this.state.editingReply.profilePictureURL             
                      }}
                    />
                    )
                  }  
                   {
                    this.state.editingSubReply && (
                      <Image
                      style={styles.commentItemImage}
                      source={{
                        uri: this.state.editingSubReply.profilePictureURL             
                      }}
                    />
                    )
                  }   
                  </View>
                  <View style={styles.commentItemBodyContainer}>
                    <View style={styles.inputContainer}>
                      {
                        this.state.editingSubReply && (
                          <AutoGrowingTextInput
                        style={styles.input}
                        value={this.state.editedSubReplyText}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({ editedSubReplyText: text })}
                      />
                        )
                      }
                      {
                        this.state.editingReply && !this.state.editingSubReply && (
                        <AutoGrowingTextInput
                        style={styles.input}
                        value={this.state.editedReplyText}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({ editedReplyText: text })}
                      />
                        )}
                        {
                          this.state.editingComment && !this.state.editingReply && !this.state.editingSubReply && (
                          <AutoGrowingTextInput
                          style={styles.input}
                          value={this.state.editedText}
                          multiline={true}
                          underlineColorAndroid="transparent"
                          onChangeText={(text) => this.setState({ editedText: text })}
                        />
                      )}
                    </View>
                    <View style={styles.btnView}>
                      <TouchableOpacity style={styles.cancelBtn} onPress={()=> {
                        this.setState({ showModal: false });
                        this.resetEditing();
                      }}>
                        <Text style={styles.cancelText}>{IMLocalized('Cancel')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.updateBtn} onPress={this.goEdit}>
                        <Text style={styles.updateText}>{IMLocalized('Update')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal> 
    </KeyboardAwareView>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

const styles = StyleSheet.create({
  detailPostContainer: {
    flex: 1,
    backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
  },
  commentItemContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 2,
  },
  commentItemImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginVertical: 5,
    marginLeft: 5,
  },
  replyItemImage: {
    height: 25,
    width: 25,
    borderRadius: 18,
    marginVertical: 5,
    marginLeft: 5,
  },
  commentItemBodyContainer: {
    flex: 5,
  },
  commentItemBodyRadiusContainer: {
    width: Math.floor(AppStyles.WINDOW_WIDTH * 0.71),
    padding: 7,
    borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.03),
    margin: 5,
    backgroundColor: AppStyles.colorSet['light'].whiteSmoke,
  },
  commentItemBodyTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: AppStyles.colorSet['light'].mainTextColor,
    paddingVertical: 3,
    paddingLeft: 8,
    lineHeight: 12,
  },
  commentItemBodySubtitle: {
    fontSize: 12,
    color: AppStyles.colorSet['light'].mainTextColor,
    paddingVertical: 3,
    paddingLeft: 8,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 18,
  },
  commentItemReplyName: {
    fontSize: 12,
    color: AppStyles.colorSet['light'].mainTextColor,
    paddingVertical: 3,
    //
    fontWeight: 'bold'
  },
  commentInputContainer: {
    backgroundColor: AppStyles.colorSet['light'].whiteSmoke,
    flexDirection: 'row',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentTextInputContainer: {
    flex: 6,
    backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
    color: AppStyles.colorSet['light'].mainTextColor,
    height: '90%',
    width: '90%',
    marginLeft: 8,
    justifyContent: 'center',
  },
  commentTextInput: {
    padding: 8,
    color: AppStyles.colorSet['light'].mainTextColor,
  },
  commentInputIconContainer: {
    flex: 0.7,
    justifyContent: 'center',
    marginLeft: 8,
  },
  commentInputIcon: {
    height: 22,
    width: 22,
    tintColor: AppStyles.colorSet['light'].mainTextColor,
  },
  placeholderTextColor: {
    color: AppStyles.colorSet['light'].mainTextColor,
  },
  reply: {
    color: '#3494c7',
    fontSize: 13
  },
  replyBtn: {
    marginLeft: 19,
    marginTop: -3,
    flexDirection: 'row'
  },

  bottomModal: {
    height: 70,
    //alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    //backgroundColor: 'rgba(150, 153, 153,0.6)'
  },
  removeIcon: {
    right: 10,
    position: 'absolute',
    top: -10,
  },
  editedText: {
    fontSize: 11,
    color: '#677c85',
    paddingLeft: 8,
    paddingBottom: 1,
    paddingTop: 3
  },
  replyingView: {
    flexDirection: 'row',
    paddingLeft: hp(1.6),
    paddingVertical: hp(0.8)
  },
  cancelBtn: {
    paddingLeft: hp(1.4)
  },
  cancelText: {
    fontSize: hp(1.7),
    fontWeight: 'bold',
    color: '#3494c7'
  },
  replyingText: {
    fontSize: hp(1.6),
  },
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
  commentItemImageContainer: {
    flex: 1,
    alignItems: 'center',
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
});


export default connect(mapStateToProps)(CommentReplyScreen);
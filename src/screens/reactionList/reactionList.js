import React, { Component } from 'react';
import { BackHandler, StyleSheet, ScrollView, Image, Text, View, ActivityIndicator } from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { firebaseComment } from '../../Core/socialgraph/feed/firebase';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
//import styles from './styles';
import { channelManager } from '../../Core/chat/firebase'
import { firebasePost } from '../../Core/socialgraph/feed/firebase';

class ReactionListScreen extends Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle: IMLocalized('People who reacted'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.commentID = this.props.navigation.getParam('commentID');
    this.threadID = this.props.navigation.getParam('threadID');
    this.channelID = this.props.navigation.getParam('channelID');
    this.replyID = this.props.navigation.getParam('replyID');
    this.subReplyID = this.props.navigation.getParam('subReplyID');
    this.postID = this.props.navigation.getParam('postID'); 
    this.reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry'];
    this.state = {
      commentID: this.commentID,
      threadID: this.threadID,
      channelID: this.channelID,
      replyID: this.replyID,
      subReplyID: this.subReplyID,
      postID: this.postID,
      loading: true,
      reactions: []
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
    if(this.subReplyID != '' && this.subReplyID != undefined && this.subReplyID != null)
    {
      this.unsubscribeSubReplyReactions = firebaseComment.subscribeSubReplyReactions(
        this.state.commentID,
        this.state.replyID,
        this.state.subReplyID,
        this.onReactionsUpdate,
      );
    }
    else if(this.replyID != '' && this.replyID != undefined && this.replyID != null)
    {
      this.unsubscribeReplyReactions = firebaseComment.subscribeReplyReactions(
        this.state.commentID,
        this.state.replyID,
        this.onReactionsUpdate,
      );
    }
    else if(this.commentID != '' && this.commentID != undefined && this.commentID != null)
    {
      this.unsubscribeReactions = firebaseComment.subscribeCommentReactions(
      this.state.commentID,
      this.onReactionsUpdate,
      );
    }
    if(this.postID != '' && this.postID != undefined && this.postID != null)
    {
      this.unsubscribeReactions = firebasePost.subscribePostReactions(
      this.state.postID,
      this.onReactionsUpdate,
      );
    }
    
    else{
         this.threadReactionsUnsubscribe = channelManager.subscribeThreadReactionsDetail(
          this.state.channelID,
          this.state.threadID,
          this.onReactionsUpdate,
      );
    }
  }

  componentWillUnmount() {
    //this.unsubscribeReactions && this.unsubscribeReactions();
    this.willBlurSubscription && this.willBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }


  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };


  onReactionsUpdate = (reactions) => {
    //console.log("Reactions>>"+ JSON.stringify(reactions))
    let tempArr = reactions;
    if(reactions){
      for(let index = 0; index <= reactions.length; index++){
        if(index != reactions.length){
          if(reactions[index].reaction == 'like')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['like'];
          }
          else if(reactions[index].reaction == 'love')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['love'];
          }
          else if(reactions[index].reaction == 'angry')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['angry'];
          }
          else if(reactions[index].reaction == 'surprised')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['surprised'];
          }
          else if(reactions[index].reaction == 'laugh')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['laugh'];
          }
          else if(reactions[index].reaction == 'cry')
          {
            tempArr[index]['iconSource'] = AppStyles.iconSet['cry'];
          }
        }
        else{
          this.setState({ reactions: tempArr, loading: false })
        }
      }
    }
  }

  render() {
    return (
    <KeyboardAwareView style={styles.detailPostContainer}>
              {this.state.loading && (
                <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
              )}

              {this.state.reactions && (
              <ScrollView>
              {
                this.state.reactions.map((reaction) => {
                  let url = reaction.profileURL;
                  return(
                  <View style={styles.row2}>
                    <Image style={styles.image} source={{ uri: url }} />
                    <Text style={styles.name}>{reaction.userName}</Text>
                    <Image style={styles.reactIcon} source={reaction.iconSource} />
                  </View>
                  )
                })
              }
              </ScrollView>
              )}
    </KeyboardAwareView>
    );
  }
}

export default ReactionListScreen;

const styles = StyleSheet.create({
  detailPostContainer: {
    flex: 1,
    backgroundColor: AppStyles.colorSet['light'].mainThemeBackgroundColor,
  },
  row2: {
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginLeft: 16,
    marginRight: 30
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100
  },
  reactIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 0
  },
  name: {
    fontSize: 17,
    paddingLeft: 16
  }
})
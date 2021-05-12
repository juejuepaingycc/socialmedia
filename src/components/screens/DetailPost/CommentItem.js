import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
//import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import AppStyles from '../../../AppStyles';
import { TNTouchableIcon } from '../../../Core/truly-native';
import { commentTimeFormat } from '../../../Core';

const reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry'];

function CommentItem({
  item, 
  userId, 
  clickReply, 
  clickSubReply,
  replyItems, 
  subReplyItems,
  showReplying,
  subReply,
  clickedReply, 
  onDelete, 
  onCommentReaction, 
  onCommentReactionDelete,
  onReplyDelete,
  onSubReplyDelete,
  onReplyReactionLongPress,
  onSubReplyReactionLongPress,
  onReplyReactionPress,
  onSubReplyReactionPress,
  onReplyLikePress,
  onSubReplyLikePress,
  onCommentReactionList,
  onReplyReactionList,
  onSubReplyReactionList
}) {

  const styles = dynamicStyles('light');
  const [iconSource, setIconSource] = useState(AppStyles.iconSet['thumbsupUnfilled'])
  const [otherReactionsVisible, setOtherReactionsVisible] = useState(false);
  const [gaveReaction, setGaveReaction] = useState('');
  
  useEffect(() => {
   // console.log("Comment>>"+ JSON.stringify(item));
    if(item.reactions){
      item.reactions.map((reaction) => {
        if(userId == reaction.userID){
          if(reaction.reaction == 'like')
          {
            setIconSource(AppStyles.iconSet['like'])
            setGaveReaction('like');
          }
          else if(reaction.reaction == 'love')
          {
            setIconSource(AppStyles.iconSet['love'])
            setGaveReaction('love');
          }
          else if(reaction.reaction == 'angry')
          {
            setIconSource(AppStyles.iconSet['angry'])
            setGaveReaction('angry');
          }
          else if(reaction.reaction == 'surprised')
          {
            setIconSource(AppStyles.iconSet['surprised'])
            setGaveReaction('surprised');
          }
          else if(reaction.reaction == 'laugh')
          {
            setIconSource(AppStyles.iconSet['laugh'])
            setGaveReaction('laugh');
          }
          else if(reaction.reaction == 'cry')
          {
            setIconSource(AppStyles.iconSet['cry'])
            setGaveReaction('cry');
          }
        }
      })
    }
  }, []);

  const onCommentReactionLongPress = () => {
    setOtherReactionsVisible(!otherReactionsVisible);
  };

  const renderTouchableIconIcon = (src, tappedIcon, index) => {
    return (
      <TNTouchableIcon
        key={index + 'icon'}
        containerStyle={styles.reactionIconContainer}
        iconSource={src}
        imageStyle={styles.reactionIcon}
        onPress={() => onReactionPress(tappedIcon)}
        appStyles={AppStyles}
      />
    );
  };

  const renderReplyTouchableIcon = (src, tappedIcon, index, replyID, subReplyID) => {
    return (
      <TNTouchableIcon
        key={index + 'icon'}
        containerStyle={styles.reactionIconContainer}
        iconSource={src}
        imageStyle={styles.reactionIcon}
        onPress={() => {
          if(subReplyID == null)
            onReplyReactionPress(tappedIcon, replyID)
          else
          onSubReplyReactionPress(tappedIcon, replyID, subReplyID)
        }}
        appStyles={AppStyles}
      />
    );
  };

  const onCommentLikePress = () => {
    setOtherReactionsVisible(false);
    if(gaveReaction != ''){
      //Delete Reaction
      setGaveReaction('');
      setIconSource(AppStyles.iconSet['thumbsupUnfilled']);
      onCommentReactionDelete(item.commentID);
    }
    else{
      setGaveReaction('like');
      setIconSource(AppStyles.iconSet['like']);
      onCommentReaction(item.commentID, 'like', true);
    }
  }

  const onReactionPress = async (reaction) => {
    setIconSource(AppStyles.iconSet[reaction]);
    setOtherReactionsVisible(false);
    setGaveReaction(reaction);
    if (gaveReaction && gaveReaction == reaction) {
      setOtherReactionsVisible(false);
      return;
    }
    if(gaveReaction != ''){
      onCommentReaction(item.commentID, reaction, false);
    }
    else{
      onCommentReaction(item.commentID, reaction, true);
    }
  };

  return (
    <View style={[styles.commentItemContainer, { marginTop: 10 }]}>
      <View style={styles.commentItemImageContainer}>
        <Image
          style={styles.commentItemImage}
          source={{
            uri: item.profilePictureURL,
          }}
        />
      </View>
      <View style={styles.commentItemBodyContainer}>
        <TouchableOpacity style={styles.commentItemBodyRadiusContainer} onLongPress={() => onDelete(item)}>
          <Text style={styles.commentItemBodyTitle}>{item.firstName}</Text>
          {/* {renderHTML} */}
          <Text style={styles.commentItemBodySubtitle}>{item.commentText}</Text>
          {/* {
            item.edited && (
              <Text style={styles.editedText}>{IMLocalized('Edited')}</Text>
            )
          } */}
        </TouchableOpacity>

        {
          clickedReply?
          null
          :
          <View style={styles.commentButtonsContainer}>

          {otherReactionsVisible && (
            <View style={styles.reactionContainer}>
              {reactionIcons.map((icon, index) =>
                renderTouchableIconIcon(AppStyles.iconSet[icon], icon, index),
              )}
            </View>
          )}

            <Text style={styles.commentTime}>{commentTimeFormat(item.createdAt)}&nbsp;&nbsp;</Text>

            <TouchableOpacity style={styles.replyBtn} onPress={() => onCommentLikePress()} onLongPress={() => onCommentReactionLongPress()}>
              <Text style={styles.reply}>{IMLocalized('Like')}&nbsp;&nbsp;&nbsp;</Text>
              {/* <Image style={styles.Image} source={iconSource} /> */}
              {/* {
                item.reactionsCount > 0 && (
                  <Text style={styles.reply}>&nbsp;&nbsp;{item.reactionsCount}</Text>
                )
              } */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.replyBtn} onPress={() => clickReply(item)}>
              <Text style={styles.reply}>{IMLocalized('Reply')}</Text>
              {
                item.replyCount > 0 && (
                  <Text style={styles.reply}>&nbsp;.&nbsp;{item.replyCount}</Text>
                )
              }
            </TouchableOpacity>

            {
                item.reactionsCount > 0 && (
                  <TouchableOpacity style={styles.reactionBtn} onPress={() => onCommentReactionList(item)} >
                    <Image style={styles.Image} source={iconSource} />
                    <Text style={styles.reply}>&nbsp;&nbsp;{item.reactionsCount}</Text>
                  </TouchableOpacity>
                )
              }
       
          </View>
        }
        

          {
            clickedReply && replyItems?
            <View>
              {replyItems.map((reply) =>
              <View>
                <View style={styles.commentItemContainer}>
                  <View style={styles.commentItemImageContainer}>
                    <Image
                      style={styles.replyItemImage}
                      source={{
                        uri: reply.profilePictureURL,
                      }}
                    />
                  </View>
                  <View style={styles.replyItemBodyContainer}>
                    <TouchableOpacity style={styles.replyItemBodyRadiusContainer} onLongPress={() => onReplyDelete(item, reply)}>
                      <Text style={styles.commentItemBodyTitle}>{reply.firstName}</Text>
                      <View style={styles.row}>
                          {
                            reply.replyName?
                            <Text style={styles.commentItemReplyName}>{reply.replyName} </Text>
                            :
                            null
                          }
                        <Text style={styles.replyItemBodySubtitle}>{reply.replyText}</Text>
                      </View>
                        {/* {
                          reply.edited && (
                            <Text style={styles.editedText}>{IMLocalized('Edited')}</Text>
                          )
                        } */}
                    </TouchableOpacity>

                    <View style={styles.replyButtonsContainer}>
                     {reply.showReplyReaction && ( 
                        <View style={styles.replyreactionContainer}>
                          {reactionIcons.map((icon, index) =>
                            renderReplyTouchableIcon(AppStyles.iconSet[icon], icon, index, reply.replyID, null),
                          )} 
                        </View>
                     )}

                      <Text style={styles.commentTime}>{commentTimeFormat(reply.createdAt)}&nbsp;&nbsp;</Text>
                      
                      <TouchableOpacity style={styles.replyBtn} onPress={() => onReplyLikePress(reply)} onLongPress={() => onReplyReactionLongPress(reply)}>
                        <Text style={styles.reply}>{IMLocalized('Like')}&nbsp;&nbsp;</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.replyBtn} onPress={() => clickSubReply(reply)}>
                        <Text style={styles.reply}>{IMLocalized('Reply')}</Text>
                        {
                          reply.replyCount > 0 && (
                            <Text style={styles.reply}>&nbsp;.&nbsp;{reply.replyCount}</Text>
                          )
                        }
                      </TouchableOpacity>

                      {
                        reply.reactionsCount > 0 && (
                          <TouchableOpacity style={styles.reactionBtn} onPress={() => onReplyReactionList(reply)} >
                            <Image style={[styles.Image]} source={reply.iconSource} />
                            <Text style={styles.reply2}>&nbsp;&nbsp;{reply.reactionsCount}</Text>
                          </TouchableOpacity>
                        )
                      }

                    </View>

                  </View>
                </View>
                {
                  showReplying && reply.replyID == subReply.replyID && subReplyItems && (
                    <View>
                    {subReplyItems.map((subreply) =>
                      <View style={styles.left}>
                        <View style={styles.commentItemContainer}>
                          <View style={styles.commentItemImageContainer}>
                            <Image
                              style={styles.replyItemImage}
                              source={{
                                uri: subreply.profilePictureURL,
                              }}
                            />
                          </View>
                          <View style={styles.replyItemBodyContainer}>
                            <TouchableOpacity style={styles.replyItemBodyRadiusContainer} onLongPress={() => onSubReplyDelete(item, reply, subreply)}>
                              <Text style={styles.commentItemBodyTitle}>{subreply.firstName}</Text>
                              <View style={styles.row}>
                                  {
                                    subreply.replyName?
                                    <Text style={styles.commentItemReplyName}>{subreply.replyName} </Text>
                                    :
                                    null
                                  }
                                <Text style={styles.replyItemBodySubtitle}>{subreply.subReplyText}</Text>
                              </View>
                              {/* {
                                subreply.edited && (
                                  <Text style={styles.editedText}>{IMLocalized('Edited')}</Text>
                                )
                              } */}
                            </TouchableOpacity>
        
                            <View style={styles.replyButtonsContainer}>
                             {subreply.showSubReplyReaction && ( 
                                <View style={styles.replyreactionContainer}>
                                  {reactionIcons.map((icon, index) =>
                                    renderReplyTouchableIcon(AppStyles.iconSet[icon], icon, index, reply.replyID, subreply.subReplyID),
                                  )} 
                                </View>
                             )}
        
                              <Text style={styles.commentTime}>{commentTimeFormat(subreply.createdAt)}&nbsp;&nbsp;</Text>
                              
                              <TouchableOpacity style={styles.replyBtn} onPress={() => onSubReplyLikePress(reply, subreply)} onLongPress={() => onSubReplyReactionLongPress(reply, subreply)}>
                                <Text style={styles.reply}>{IMLocalized('Like')}&nbsp;&nbsp;</Text> 
                              </TouchableOpacity>
                              {
                                subreply.reactionsCount > 0 && (
                                  <TouchableOpacity style={styles.reactionBtn} onPress={() => onSubReplyReactionList(reply, subreply)} >
                                    <Image style={[styles.Image]} source={subreply.iconSource} />
                                    <Text style={styles.reply2}>&nbsp;&nbsp;{subreply.reactionsCount}</Text>
                                  </TouchableOpacity>
                                )
                              }
                            </View>
                          </View>
                        </View>
                      </View>
                      )}
                      </View>
                  )
                }
              </View>
              )}
              </View>
            :
            null
            }
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  item: PropTypes.object,
};

export default CommentItem;

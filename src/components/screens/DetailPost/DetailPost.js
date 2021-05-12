import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//import { useColorScheme } from 'react-native-appearance';
import FeedItem from '../../FeedItem/FeedItem';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import TNMediaViewerModal from '../../../Core/truly-native/TNMediaViewerModal';
import dynamicStyles from './styles';
import ThreadOptionsItem from '../../../Core/chat/IMChat/ThreadOptionsItem';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

function DetailPost(props) {
  const {
    feedItem,
    feedItems,
    commentItems,
    onCommentSend,
    onReplySend,
    scrollViewRef,
    onMediaPress,
    onReaction,
    onOtherReaction,
    shouldUpdate,
    onMediaClose,
    isMediaViewerOpen,
    selectedMediaIndex,
    onFeedUserItemPress,
    onSharePost,
    onSharePostToChat,
    onDeletePost,
    onCommentReaction,
    onCommentReactionDelete,
    onCommentReactionList,
    onUserReport,
    user,
    commentsLoading,
    onViewReaction,
    giveReaction,
    deletePostReaction,
    clickReply,
    onDelete,
    replyName,
    replyItems,
    clickedReply,
    onEditPost,
    messageType,
    actions,
    removeMenu
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(colorScheme);

  const onCommentPress = () => {
    console.log('comment');
  };

 
  return (
    <KeyboardAwareView style={styles.detailPostContainer}>
      <ScrollView ref={scrollViewRef}>
        <FeedItem
          item={feedItem}
          onUserItemPress={onFeedUserItemPress}
          onCommentPress={onCommentPress}
          onMediaPress={onMediaPress}
          onEditPost={onEditPost}
          onReaction={onReaction}
          shouldUpdate={shouldUpdate}
          onSharePress={onSharePost}
          onSharePostToChat={onSharePostToChat}
          onDeletePost={onDeletePost}
          onViewReaction={onViewReaction}
          giveReaction={giveReaction}
          deletePostReaction={deletePostReaction}
          onUserReport={onUserReport}
          user={user}
          disableEditButton={true}
        />
        {commentsLoading ? (
          <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
        ) : (
          commentItems.map((comment) => <CommentItem item={comment} 
          clickReply={clickReply}
          onDelete={onDelete}
          replyItems={replyItems} 
          onCommentReaction={onCommentReaction}
          onCommentReactionDelete={onCommentReactionDelete}
          userId={user.id}
          onCommentReactionList={onCommentReactionList}
          renderHTML={<View style={styles.row}>
            {/* {
              comment.replyName?
              <Text style={styles.commentItemReplyName}>{comment.replyName} </Text>
              :
              null
            } */}
          <Text style={styles.commentItemBodySubtitle}>{comment.commentText}</Text>
        </View>}
          />)
        )}
      </ScrollView>
      <CommentInput onReplySend={onReplySend} onCommentSend={onCommentSend} replyName={replyName} clickedReply={clickedReply} />
      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      
      {
        actions.length > 0 && (
          <View style={styles.bottomModal}>
                <TouchableOpacity style={styles.removeIcon} onPress={removeMenu}>
                  <MCIcon name='close-circle' color='black' size={25}  />
                </TouchableOpacity>
                <ThreadOptionsItem items={actions} />
          </View>
      )}

     
    </KeyboardAwareView>
  );
}

DetailPost.propTypes = {
  item: PropTypes.object,
  scrollViewRef: PropTypes.any,
  onMediaPress: PropTypes.func,
  removeMenu: PropTypes.func,
  onEditPost: PropTypes.func,
  onOtherReaction: PropTypes.func,
  onReaction: PropTypes.func,
  onFeedUserItemPress: PropTypes.func,
  onMediaClose: PropTypes.func,
  shouldUpdate: PropTypes.bool,
  feedItems: PropTypes.array,
  isMediaViewerOpen: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
};

export default DetailPost;

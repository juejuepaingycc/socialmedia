import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Text } from 'react-native';

import ThreadItem from './ThreadItem';
import dynamicStyles from './styles';

function MessageThread(props) {
  const {
    thread,
    user,
    onChatMediaPress,
    appStyles,
    onSenderProfilePicturePress,
    onMessageLongPress,
    keyboardDismissMode,
    onViewPDF,
    onReactionPress,
    onReactionList,
    goDetailPost
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const RenderChatItem = ({ item, index }) => (
    <ThreadItem
      item={item}
      index={index}
      len={thread.length}
      key={'chatitem' + item.createdAt + item.senderID}
      user={{ ...user, userID: user.id }}
      appStyles={appStyles}
      onChatMediaPress={onChatMediaPress}
      onSenderProfilePicturePress={onSenderProfilePicturePress}
      onMessageLongPress={onMessageLongPress}
      onViewPDF={onViewPDF}
      showOtherReaction={item.showOtherReaction}
      onReactionPress={onReactionPress}
      onReactionList={onReactionList}
      goDetailPost={goDetailPost}
    />
  );

  return (
    <FlatList
      inverted={true}
      vertical={true}
      keyboardDismissMode={keyboardDismissMode}
      showsVerticalScrollIndicator={false}
      data={thread}
      renderItem={
        ({ item, index }) => (
          <RenderChatItem item={item} index={index} />
        )
      }
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={styles.messageThreadContainer}
      style={{ marginBottom: 30 }}
      removeClippedSubviews={true}
    />
  );
}

MessageThread.propTypes = {
  thread: PropTypes.array,
  user: PropTypes.object,
  onChatMediaPress: PropTypes.func,
};

export default MessageThread;

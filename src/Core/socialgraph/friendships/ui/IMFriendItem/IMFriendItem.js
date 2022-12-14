import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { IMConversationIconView } from '../../../../chat';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { FriendshipConstants } from '../..';
import { IMLocalized } from '../../../../localization/IMLocalization'

const IMFriendItem = memo((props) => {
  const {
    item,
    index,
    onFriendAction,
    onFriendCancel,
    onFriendItemPress,
    displayActions,
    appStyles,
    followEnabled,
    showAction
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const user = item.user;
  let actionTitle = followEnabled
    ? FriendshipConstants.localizedFollowActionTitle(item.type)
    : FriendshipConstants.localizedActionTitle(item.type);

  var name = 'No name';
  if (user.firstName && user.lastName) {
    name = user.firstName + ' ' + user.lastName;
  } else if (user.fullname) {
    name = user.fullname;
  } else if (user.firstName) {
    name = user.firstName;
  }

  const renderActions = (displayActions, actionTitle) => {
    if (displayActions && actionTitle) {
      return (
        <View
          style={
            followEnabled
              ? styles.addFlexContainerFollow
              : styles.addFlexContainer
          }>
          {
            actionTitle == IMLocalized('Accept') ?
            <View style={styles.row}>
              <TouchableOpacity
              onPress={() => onFriendCancel(item, index)}
              style={followEnabled ? [styles.followButton] : [styles.cancelButton]}>
                <Text
                  style={
                    followEnabled
                      ? [styles.followActionTitle]
                      : [styles.name, { padding: 0 }]
                  }>
                  {IMLocalized('Cancel request')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => onFriendAction(item, index)}
              style={followEnabled ? [styles.followButton] : [styles.addButton]}>
                <Text
                  style={
                    followEnabled
                      ? [styles.followActionTitle]
                      : [styles.name, { padding: 0 }]
                  }>
                  {actionTitle}
                </Text>
              </TouchableOpacity>
            </View>
            :
            <TouchableOpacity
            onPress={() => onFriendAction(item, index)}
            style={followEnabled ? [styles.followButton] : [styles.addButton]}>
            <Text
              style={
                followEnabled
                  ? [styles.followActionTitle]
                  : [styles.name, { padding: 0 }]
              }>
              {actionTitle}
            </Text>
          </TouchableOpacity>
          }
          
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onFriendItemPress(item)}
      style={styles.friendItemContainer}>
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[user]}
          appStyles={appStyles}
        />
        {name && <Text style={styles.name}>{name}</Text>}
      </View>
      {
        showAction && (
          renderActions(displayActions, actionTitle)
        )
      }
      
      <View style={styles.divider} />
    </TouchableOpacity>
  );
});

IMFriendItem.propTypes = {
  onFriendAction: PropTypes.func,
  onFriendCancel: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  actionIcon: PropTypes.bool,
  item: PropTypes.object,
  index: PropTypes.number,
};

IMFriendItem.defaultProps = {
  displayActions: true,
};

export default IMFriendItem;

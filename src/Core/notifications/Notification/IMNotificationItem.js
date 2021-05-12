import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TNStoryItem } from '../../truly-native';
import PropTypes from 'prop-types';
import { timeFormat } from '../..';
import dynamicStyles from './styles';
import { Viewport } from '@skele/components';

const ViewportAwareTouchableOpacity = Viewport.Aware(TouchableOpacity);

const IMNotificationItem = memo((props) => {
  const { item, index, onNotificationPress, onNotificationDelete, appStyles } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  return (
    <ViewportAwareTouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNotificationPress(item, index)}
      onLongPress={() => onNotificationDelete(item)}
      style={[
        styles.notificationItemBackground,
        item.seen
          ? styles.seenNotificationBackground
          : styles.unseenNotificationBackground,
      ]}>
      <View style={styles.notificationItemContainer}>
        {item.metadata && item.metadata.outBound && (
          <TNStoryItem
            containerStyle={styles.userImageMainContainer}
            imageContainerStyle={styles.userImageContainer}
            imageStyle={styles.userImage}
            item={item.metadata.outBound}
            activeOpacity={1}
            onPress={() => onNotificationPress(item, index)}
            appStyles={appStyles}
          />
        )}
        <View style={styles.notificationLabelContainer}>
          <Text style={styles.description} numberOfLines={2} >
            {item.body}
          </Text>
          <Text style={styles.moment}>
            {timeFormat(item.createdAt)}
          </Text>
        </View>
      </View>
    </ViewportAwareTouchableOpacity>
  );
});

IMNotificationItem.propTypes = {
  item: PropTypes.object,
};

export default IMNotificationItem;

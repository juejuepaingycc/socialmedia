import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
//import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import IMConversationIconView from './IMConversationIconView/IMConversationIconView';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';

function IMConversationForwardView(props) {
  const { onSendForward, item, appStyles, forwardMessage } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  let title = item.name;
  if (!title) {
    if (item.participants.length > 0) {
      let friend = item.participants[0];
      title = friend.firstName + ' ' + friend.lastName;
    }
  }

  return (
    <View
      style={styles.chatItemContainer}>
      <IMConversationIconView
        participants={item.participants}
        appStyles={appStyles}
      />
      <View style={styles.chatItemContent}>
        <Text style={styles.chatFriendName}>{title}</Text>
      </View>
      {/* {
        item.sent ?
        <View style={styles.disableBtn}>
          <Text style={styles.disableText}>{IMLocalized('Sent')}</Text>
        </View>
        : */}
        <TouchableOpacity onPress={()=> onSendForward(forwardMessage, item)} style={styles.sendBtn}>
          <Text style={styles.sendText}>{IMLocalized('Send')}</Text>
        </TouchableOpacity>
     
    </View>
  );
}

IMConversationForwardView.propTypes = {
  onSendForward: PropTypes.func,
  item: PropTypes.object,
};

export default IMConversationForwardView;

import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, Image } from 'react-native';
import DialogInput from 'react-native-dialog-input';

import PropTypes from 'prop-types';
import { IMConversationIconView } from '../..';
import AppStyles from '../../../../AppStyles';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { TNEmptyStateView } from '../../../truly-native';
import { IMLocalized } from '../../../localization/IMLocalization';
import Icon from 'react-native-vector-icons/AntDesign';

function IMCreateGroupComponent(props) {
  const {
    onCancel,
    isNameDialogVisible,
    friends,
    onSubmitName,
    onCheck,
    appStyles,
    onEmptyStatePress,
    oldGroup,
    members
  } = props;

  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  // const [friends, setFriends] = useState([...DATA]);
  // const [nameDialogVisible, setNameDialogVisible] = useState(false);
  // const [input] = useState('');
  const [imgErr, setImgErr] = useState(false);

  // const onCreate = () => {
  //   const checkedFriends = friends.filter(friend => friend.checked);
  //   if (checkedFriends.length === 0) {
  //     alert('Please check one more friends.');
  //   } else {
  //     showNameDialog(true);
  //   }
  // };

  // const onCheck = friend => {
  //   friend.checked = !friend.checked;
  //   const newFriends = friends.map(item => {
  //     if (item.id == friend.id) {
  //       return friend;
  //     }
  //     return item;
  //   });
  //   setFriends(newFriends);
  // };

  // const showNameDialog = show => {
  //   setNameDialogVisible(show);
  // };

  const renderItem = ({ item }) => (
    item.disable ?
    <View
      style={styles.itemContainer}>
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[item]}
          appStyles={AppStyles}
        />
          <Text style={[styles.name, { color: '#b0b5b8' }]}>{item.firstName}</Text>
      </View>
      <View style={styles.addFlexContainer}>
          <Icon name='checkcircle' color='#b0b5b8' size={22} />
      </View>
      <View style={styles.divider} />
    </View>
    :
    <TouchableOpacity
      onPress={() => onCheck(item)}
      style={styles.itemContainer}>
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[item]}
          appStyles={AppStyles}
        />
          <Text style={styles.name}>{item.firstName}</Text>
      </View>
      <View style={styles.addFlexContainer}>
        {
          item.checked && (
            <Icon name='checkcircle' color='black' size={22} />
          )
        }
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
    
  );

  const onImageError = () => {
    setImgErr(true);
    console.log('oops an error occured');
  };

  const emptyStateConfig = {
    title: IMLocalized("You can't create groups"),
    description: IMLocalized(
      "You don't have enough friends to create groups. Add at least 2 friends to be able to create groups.",
    ),
    buttonName: IMLocalized('Go back'),
    onPress: onEmptyStatePress,
  };

  return (
    <View style={styles.container}>
      {friends && friends.length > 1 && (
        <FlatList
          data={friends}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          initialNumToRender={5}
          removeClippedSubviews={true}
        />
      )}
      {friends && friends.length <= 1 && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView
            appStyles={appStyles}
            emptyStateConfig={emptyStateConfig}
          />
        </View>
      )}
      <DialogInput
        isDialogVisible={isNameDialogVisible}
        title={IMLocalized('Type group name')}
        hintInput="Group Name"
        textInputProps={{ selectTextOnFocus: true }}
        cancelText={IMLocalized('No')}
        submitText={IMLocalized('YesExit')}
        submitInput={(inputText) => {
          onSubmitName(inputText);
        }}
        closeDialog={onCancel}
      />
    </View>
  );
}

IMCreateGroupComponent.propTypes = {
  friends: PropTypes.array,
  onCancel: PropTypes.func,
  isNameDialogVisible: PropTypes.bool,
  friends: PropTypes.func,
  onSubmitName: PropTypes.func,
  onCheck: PropTypes.func,
};

export default IMCreateGroupComponent;

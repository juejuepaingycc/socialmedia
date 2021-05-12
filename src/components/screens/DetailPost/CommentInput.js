import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';

function CommentInput(props) {
  const { onCommentSend, onSubReplySend, subReplyCancel, showReplying, clickedReply, onReplySend } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(colorScheme);
  const [value, setValue] = useState('');
  const [reply, setReply] = useState('');
  const isDisabled = value.length < 1 && reply.length < 1;

  const onChangeText = (value) => {
    setValue(value);
  };

  const onChangeReply = (value) => {
    setReply(value);
  };
    
  const onSendComment = () => {
    if(clickedReply && showReplying){
      onSubReplySend(reply);
    }
    else if(clickedReply && !showReplying){
      onReplySend(reply);
    }
    else{
      onCommentSend(value);
    }

    setValue('');
    setReply('')
  };

  return (
    <View style={
      showReplying ?
      styles.inputContainer
      :
      null
    }>
          {
            showReplying && (
              <View style={styles.replyingView}>
                <Text style={styles.replyingText}>{IMLocalized('Replying')}...</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={subReplyCancel}>
                    <Text style={styles.cancelText}>{IMLocalized('Cancel')}</Text>
                </TouchableOpacity>
              </View>
            )
          }
        <View style={styles.commentInputContainer}>
          <View style={styles.commentTextInputContainer}>
            {
              clickedReply?
                <TextInput
                underlineColorAndroid="transparent"
                placeholder={IMLocalized('Write a reply')}
                placeholderTextColor='#3494c7'
                value={reply}
                onChangeText={onChangeReply}
                style={styles.commentTextInput}
              />
              :
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={IMLocalized('Add Comment to this Post')}
                placeholderTextColor='#3494c7'
                value={value}
                onChangeText={onChangeText}
                style={styles.commentTextInput}
              />
            }
            
          </View>
          <TouchableOpacity
            onPress={onSendComment}
            disabled={isDisabled}
            style={styles.commentInputIconContainer}>
            <Image
              style={[
                styles.commentInputIcon,
                isDisabled ? { opacity: 0.3 } : { opacity: 1 },
              ]}
              source={AppStyles.iconSet.send}
            />
          </TouchableOpacity>
        </View>
    </View>
  );
}

CommentInput.propTypes = {
  item: PropTypes.object,
};

export default CommentInput;

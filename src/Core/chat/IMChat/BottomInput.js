import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
  Text,
  Alert,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { KeyboardAccessoryView } from 'react-native-keyboard-input';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';
import './BottomAudioRecorder';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IsIOS = Platform.OS === 'ios';

const assets = {
  send: require('../assets/send.png'),
  mic: require('../assets/microphone.png'),
  close: require('../assets/close-x-icon.png'),
};

function BottomInput(props) {
  const {
    item,
    value,
    onChangeText,
    onAudioRecordDone,
    onSend,
    onAddMediaPress,
    editing,
    uploadProgress,
    appStyles,
    trackInteractive,
    inReplyToItem,
    onReplyingToDismiss,
    closeMenuBox,
    disableBottomMenus,
    value2,
    editToItem,
    showAudioView,
    toggleShowAudioView,
    closeAudioView
  } = props;

  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const textInputRef = useRef(null);
  const [customKeyboard, setCustomKeyboard] = useState({
    component: undefined,
    initialProps: undefined,
  });
  const [audioOpen, setAudioOpen] = useState(false);
  const [text, setText] = useState();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(()=> {
    if(editing){
      setText(value);
      setIsDisabled(false)
    }
  }, [editing])

  useEffect(() => {
    if(value2 == 'close'){
      if(audioOpen){
        textInputRef.current.focus();
        setCustomKeyboard({});
        setAudioOpen(false);
      }
    }
  }, [value2])

  const onSendMessage = () => {
    onSend(text);
    setText('');
    setIsDisabled(true);
  }

  const onKeyboardResigned = () => {
    resetKeyboardView();
  };

  const resetKeyboardView = () => {
    setCustomKeyboard({});
    setAudioOpen(false);
  };

  const onVoiceRecord = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    closeMenuBox();
    if (response.status === 'granted') {
      toggleShowAudioView();
      //showKeyboardView('BottomAudioRecorder');
    } else {
      Alert.alert(
        IMLocalized('Audio permission denied'),
        IMLocalized(
          'You must enable audio recording permissions in order to send a voice note.',
        ),
      );
    }
  };

  const showKeyboardView = (component) => {
    setAudioOpen(true);
    disableBottomMenus();
    onReplyingToDismiss();
    // setCustomKeyboard({
    //   component,
    //   initialProps: { appStyles },
    // });
  };

  const onCustomKeyboardItemSelected = (keyboardId, params) => {
    onAudioRecordDone(params);
  };

  const renderBottomInput = () => {
    return (
      <View style={styles.bottomContentContainer}>
        {inReplyToItem && (
          <View style={styles.inReplyToView}>
            <Text style={styles.replyingToHeaderText}>
              {IMLocalized('Replying to')}{' '}
              <Text style={styles.replyingToNameText}>
                {inReplyToItem.senderFirstName || inReplyToItem.senderLastName}
              </Text>
            </Text>
            <Text style={styles.replyingToContentText}>
              {inReplyToItem.content}
            </Text>
            <TouchableHighlight
              style={styles.replyingToCloseButton}
              onPress={() => onReplyingToDismiss && onReplyingToDismiss()}>
              <Image source={assets.close} style={styles.replyingToCloseIcon} />
            </TouchableHighlight>
          </View>
        )}

        {editToItem && (
          <View style={styles.editToView}>
            <Text style={styles.editHeaderText}>
              {IMLocalized('Edit message')}
            </Text>
            <TouchableHighlight
              style={styles.replyingToCloseButton}
              onPress={() => onReplyingToDismiss && onReplyingToDismiss()}>
              <Image source={assets.close} style={styles.replyingToCloseIcon} />
            </TouchableHighlight>
          </View>
        )}

        <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        <View style={styles.inputBar}>
          {/* <TouchableOpacity
            onPress={onAddMediaPress}
            style={styles.inputIconContainer}>
           <IconMaterialIcons name="add" size={23} color='#3494c7' />
          </TouchableOpacity> */}
          {
            !editToItem && (
              <TouchableOpacity
                onPress={onVoiceRecord}
                style={styles.micIconContainer}>
                  <Image style={styles.micIcon} source={assets.mic} />
              </TouchableOpacity>
            )
          }

          <View style={styles.inputContainer}>
            <AutoGrowingTextInput
              maxHeight={100}
              style={styles.input}
              ref={textInputRef}
              value={text}
              //value={value}
              multiline={true}
              placeholder={IMLocalized('Start typing...')}
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                // onChangeText(text)
                  if(text.length > 0){
                    setIsDisabled(false)
                  }
                  setText(text)
                }
              }
              // onFocus={resetKeyboardView}
            />
          </View>
          {
            !editToItem && (
              <TouchableOpacity
              onPress={() => {
                if(audioOpen){
                  textInputRef.current.focus();
                  setAudioOpen(false);
                  resetKeyboardView();
                }
                onAddMediaPress();
                onReplyingToDismiss();
                closeAudioView();
                }
              }
              style={[styles.inputIconContainer, { margin: 4 }]}>
                <IconMaterialIcons name="add" size={24} color='#3494c7' />
              </TouchableOpacity>
            )}

          <TouchableOpacity
            disabled={isDisabled}
            onPress={onSendMessage}
            style={[
              styles.inputIconContainer,
              { marginLeft: 6, marginRight: 12 },
              isDisabled ? { opacity: 0.2 } : { opacity: 1 },
            ]}>
            <Image style={styles.inputIcon} source={assets.send} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAccessoryView
      renderContent={renderBottomInput}
      // onHeightChanged={
      //   IsIOS
      //     ? (height) => {
      //         console.log('see height', height);
      //         setKeyboardAccessoryHeight(height);
      //       }
      //     : undefined
      // }
      trackInteractive={trackInteractive}
      kbInputRef={textInputRef}
      kbComponent={customKeyboard.component}
      kbInitialProps={customKeyboard.initialProps}
      onItemSelected={onCustomKeyboardItemSelected}
      onKeyboardResigned={onKeyboardResigned}
      revealKeyboardInteractive
    />
  );
}

BottomInput.propTypes = {};

export default BottomInput;

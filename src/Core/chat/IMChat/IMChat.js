import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, View, Modal, Text, ScrollView,
  FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import TNMediaViewerModal from '../../truly-native/TNMediaViewerModal';
import DialogInput from 'react-native-dialog-input';
import BottomInput from './BottomInput';
import MessageThread from './MessageThread';
import dynamicStyles from './styles';
import { IMLocalized } from '../../localization/IMLocalization';
import CustomActionSheet from './CustomActionSheet';
import { channelManager } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconIonicon from 'react-native-vector-icons/Ionicons';
import IconAnt from 'react-native-vector-icons/AntDesign'
import Clipboard from '@react-native-community/clipboard';
import ThreadOptionsItem from './ThreadOptionsItem';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomAudioRecorder from './BottomAudioRecorder';
import { TNActivityIndicator } from '../../truly-native';
import AppStyles from '../../../AppStyles';

const TrackInteractive = true;

function IMChat(props) {
  const {
    onSendInput,
    onAudioRecordSend,
    thread,
    inputValue,
    user,
    inReplyToItem,
    onLaunchCamera,
    onSendDocument,
    sendSurprise,
    onOpenPhotos,
    uploadProgress,
    sortMediafromThread,
    isMediaViewerOpen,
    selectedMediaIndex,
    onChatMediaPress,
    onMediaClose,
    onChangeName,
    isRenameDialogVisible,
    showRenameDialog,
    onLeave,
    appStyles,
    onUserBlockPress,
    onUserUnBlockPress,
    onSenderProfilePicturePress,
    onReplyActionPress,
    onForwardActionPress,
    onEditActionPress,
    onReplyingToDismiss,
    editing,
    onViewPDF,
    channel,
    participants,
    onAudioChat,
    onVideoChat,
    showMenuBox,
    toggleMenuBox,
    closeMenuBox,
    messageLongPress,
    onReactionPress,
    onReactionList,
    goDetailPost,
    disableMenuBox,
    editToItem,
    onAddMember,
    deleteGroup,
    onRemoveMember,
    blocked,
    source,
    loading
  } = props;

  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const [admin, setAdmin] = useState(false);
  const [temporaryInReplyToItem, setTemporaryInReplyToItem] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [showBottomMenus, setShowBottomMenus] = useState(false);
  const [value, setValue] = useState('');
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showAudioView, setShowAudioView] = useState(false);

  const otherTextActions = [
    {
      icon: 'reply',
      name: IMLocalized('Reply'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onReplyActionPress && onReplyActionPress(temporaryInReplyToItem);
      }
    },
    {
      icon: 'content-copy',
      name: IMLocalized('Copy'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        ToastAndroid.show(IMLocalized('Copied'), ToastAndroid.SHORT);
        Clipboard.setString(temporaryInReplyToItem.content);
      }
    },
    {
      icon: 'forward',
      name: IMLocalized('Forward'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onForwardActionPress && onForwardActionPress(temporaryInReplyToItem)
      }
    },
    {
      icon: 'delete',
      name: IMLocalized('Delete for you'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        deleteMessageForYou();
      }
    }
  ]
  
  const otherMediaActions = [
    {
      icon: 'delete',
      name: IMLocalized('Delete for you'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        deleteMessageForYou();
      }
    },
    {
      icon: 'forward',
      name: IMLocalized('Forward'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onForwardActionPress && onForwardActionPress(temporaryInReplyToItem)
      }
    },
  ];

  const deleteOptions = [
  {
      icon: 'delete',
      name: IMLocalized('Delete for you'),
      pressMenu: () => {
        setShowDeleteOptions(false);
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        deleteMessageForYou();
      }
    },
    {
      icon: 'message-minus-outline',
      name: IMLocalized('Unsend'),
      pressMenu: () => {
        setShowDeleteOptions(false);
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        unsendMessage();
      }
    }
  ]

  const ownTextMessageActions = [
    {
      icon: 'reply',
      name: IMLocalized('Reply'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onReplyActionPress && onReplyActionPress(temporaryInReplyToItem);
      }
    },
    {
      icon: 'edit',
      name: IMLocalized('Edit'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onEditActionPress && onEditActionPress(temporaryInReplyToItem);
      }
    },
    {
      icon: 'content-copy',
      name: IMLocalized('Copy'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        Clipboard.setString(temporaryInReplyToItem.content);
        ToastAndroid.show(IMLocalized('Copied'), ToastAndroid.SHORT);
      }
    },
    {
      icon: 'forward',
      name: IMLocalized('Forward'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onForwardActionPress && onForwardActionPress(temporaryInReplyToItem)
      }
    },
    {
      icon: 'delete',
      name: IMLocalized('delete'),
      pressMenu: () => {
        closeMenuBox();
        setValue('');
        setShowDeleteOptions(true);
        setMessageType('')
      }
    }
  ]

  const ownMediaActions = [
    {
      icon: 'forward',
      name: IMLocalized('Forward'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        onForwardActionPress && onForwardActionPress(temporaryInReplyToItem)
      }
    },
    {
      icon: 'delete',
      name: IMLocalized('Delete for you'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        deleteMessageForYou();
      }
    },
    {
      icon: 'message-minus-outline',
      name: IMLocalized('Unsend'),
      pressMenu: () => {
        closeMenuBox();
        setShowBottomMenus(false);
        setValue('');
        if(thread.length == 1){
          channelManager.deleteConversationForSingleUser(
            channel,
            user.id,
          )
        }
        unsendMessage();
      }
    }
  ]

  const menus = [
    {
      icon: 'photo-camera',
      title: IMLocalized('Camera'),
      pressMenu: () => {
        openCamera()
      }
    },
    {
      icon: 'image',
      title: IMLocalized('gallery'),
      pressMenu: () => {
        openPhotos()
      }
    },
    {
      icon: 'insert-drive-file',
      title: IMLocalized('Document'),
      pressMenu: () => {
        sendDocument()
      }
    },
    {
      icon: 'remove-circle-outline',
      title: IMLocalized('Block User'),
      pressMenu: () => {
        onBlockUser()
      }
    },
    {
      icon: 'drafts',
      title: IMLocalized('Surprise'),
      pressMenu: () => {
        sendSurprise()
      }
    },
    {
      icon: 'phone',
      title: IMLocalized('Voice'),
      pressMenu: () => {
        audioChat()
      }
    },
    {
      icon: 'voice-chat',
      title: IMLocalized('Video'),
      pressMenu: () => {
        videoChat()
      }
    }
  ]

  const groupMenus = [
    {
      icon: 'photo-camera',
      title: IMLocalized('Camera'),
      pressMenu: () => {
        openCamera()
      }
    },
    {
      icon: 'image',
      title: IMLocalized('gallery'),
      pressMenu: () => {
        openPhotos()
      }
    },
    {
      icon: 'insert-drive-file',
      title: IMLocalized('Document'),
      pressMenu: () => {
        sendDocument()
      }
    },
    {
      icon: 'exit-to-app',
      title: IMLocalized('Leave Group'),
      pressMenu: () => {
        onLeaveGroup()
      }
    },
    {
      icon: 'people',
      title: IMLocalized('Group Members'),
      pressMenu: () => {
        showGpMembers()
      }
    }
  ]

  const groupAdminMenus = [
    {
      icon: 'photo-camera',
      title: IMLocalized('Camera'),
      pressMenu: () => {
        openCamera()
      }
    },
    {
      icon: 'image',
      title: IMLocalized('gallery'),
      pressMenu: () => {
        openPhotos()
      }
    },
    {
      icon: 'insert-drive-file',
      title: IMLocalized('Document'),
      pressMenu: () => {
        sendDocument()
      }
    },
    {
      icon: 'border-color',
      title: IMLocalized('Rename Group'),
      pressMenu: () => {
        showRename()
      }
    },
    {
      icon: 'people',
      title: IMLocalized('Group Members'),
      pressMenu: () => {
        showGpMembers()
      }
    },
    {
      icon: 'person-add',
      title: IMLocalized('Add Member'),
      pressMenu: () => {
        onAddMember()
      }
    },
    {
      icon: 'person-remove',
      title: IMLocalized('Remove Member'),
      pressMenu: () => {
        showGpMembers()
      }
    },
    {
      icon: 'delete',
      title: IMLocalized('Delete Group'),
      pressMenu: () => {
        deleteGroup()
      }
    },
  ]

  const [actionSheet, setActionSheet] = useState(false);
  useEffect(()=> {
    if(channel.creator_id == user.id)
      setAdmin(true);
  },[channel, user])

  useEffect(() => {
    if(showMenuBox){
      setShowBottomMenus(false);
      setShowDeleteOptions(false)
      setValue('');
    }
  },[])

  const onChangeText = (text) => {
   // onChangeTextInput(text);
  };

  const onLeaveGroup = () => {
    toggleMenuBox();
    onLeave();
  }

  const showGpMembers = () => {
    toggleMenuBox();
    setShowMembers(true);
  }

  const showRename = () => {
    toggleMenuBox();
    showRenameDialog(true);
  }

  const audioChat = () => {
    toggleMenuBox();
    onAudioChat();
  }

  const videoChat = () => {
    toggleMenuBox();
    onVideoChat();
  }

  const onUnblockUser = () => {
    var message, actionCallback;

      actionCallback = onUserUnBlockPress;
      message = IMLocalized(
        "Are you sure you want to unblock this user?",
      );
      Alert.alert(IMLocalized('Are you sure?'), message, [
        {
          text: IMLocalized('Cancel'),
          style: 'cancel',
        },
        {
          text: IMLocalized('Yes'),
          onPress: actionCallback,
        }
      ]);
  }

  const onBlockUser = () => {
    toggleMenuBox();
    var message, actionCallback;

      actionCallback = onUserBlockPress;
      message = IMLocalized(
        "Are you sure you want to block this user",
      );
      Alert.alert(IMLocalized('Are you sure?'), message, [
        {
          text: IMLocalized('Cancel'),
          style: 'cancel',
        },
        {
          text: IMLocalized('Yes'),
          onPress: actionCallback,
        }
      ]);
  }

  const openPhotos = () => {
    toggleMenuBox();
    onOpenPhotos();
  }

  const sendDocument = () => {
    toggleMenuBox();
    onSendDocument();
  }

  const onAudioRecordDone = (item) => {
    onAudioRecordSend(item);
  };

  const onSend = (msg) => {
    onSendInput(msg);
  };

  const onMessageLongPress = (inReplyToItem) => {
    console.log("LL>>"+ JSON.stringify(inReplyToItem))
    if(inReplyToItem.content.includes('Missed call') || inReplyToItem.content.includes('Call ended')){
      console.log("Do nothing..")
    }
    else{
      messageLongPress(inReplyToItem.id);
      disableMenuBox();
      setShowBottomMenus(true);
      //closeMenuBox();
      setValue('close');
      onReplyingToDismiss();
      
      if(inReplyToItem.senderID == user.userID){
        if(inReplyToItem.url){
          setMessageType('ownMedia')
        }
        else{
          setMessageType('ownText')
        }
        setTemporaryInReplyToItem(inReplyToItem);
        //longPressActionSheetRef.current.show();
      }
      else{
        if(inReplyToItem.url){
          setMessageType('otherMedia')
        }
        else{
          setMessageType('otherText')
        }  
        setTemporaryInReplyToItem(inReplyToItem);
        //longPressActionSheetRef.current.show();
      }
    }
  };

  const reactionPress = async (reaction, messageID) => {
    setShowDeleteOptions(false)
    setShowBottomMenus(false);
    setValue('');
    onReactionPress(reaction, messageID);
  }

  const deleteMessageForYou = () => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to delete?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('OK'),
          onPress: () => {
            channelManager.deleteMessageForSingleUser(
              channel,
              temporaryInReplyToItem.id,
              user.id,
            )
          }
        }
    ]
    );
  }

  const unsendMessage = () => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to unsend?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('OK'),
          onPress: () => {
            channelManager.deleteMessage(
              channel,
              temporaryInReplyToItem.id,
              deleteFunc,
            );
          }
        }
    ]
    );
  }

  const pressProfile = (item) => {
    onSenderProfilePicturePress && onSenderProfilePicturePress(item.id)
  }

  const deleteFunc = () => {
  }

  // if(show){
  //   return(
  //     <Modal
  //     style={styles.container}
  //     isOpen={true}
  //     position="center"
  //     swipeToClose
  //     swipeArea={250}
  //     coverScreen={true}
  //     useNativeDriver={false}
  //     animationDuration={500}>
  //     <CameraScreen capturePhoto={(f)=> onLaunchCamera(f)} disableCamera={()=> setShow(false)} />
  //   </Modal>
  //   )
  // }

  if(showMembers){
    return(
      <Modal
          style={styles.container}
          isOpen={true}
          onRequestClose={() => { 
            setShowMembers(false)
           }}>
        <View style={styles.modalTitle}>
            <TouchableOpacity onPress={() => setShowMembers(false)}>
              <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{IMLocalized('Group Members')}</Text>
        </View>
        <ScrollView>
                {participants.length > 0 &&
                participants.map((item) => (
                  <TouchableOpacity style={styles.block} onPress={() => pressProfile(item)}>
                    <Image source={{uri: item.profilePictureURL}} style={styles.img} />
                    <View>
                      <Text style={styles.name}>
                        {item.firstName +
                          (item.lastName ? ' ' + item.lastName : '')}
                      </Text>
                    </View>
                    {
                      admin && (
                        <TouchableOpacity style={styles.removeView} 
                        onPress={() => {
                            Alert.alert(
                              IMLocalized(''),
                              IMLocalized('Are you sure you want to remove') + ' ' + item.firstName + '?',
                              [
                                { text: IMLocalized('No') },
                                {
                                  text: IMLocalized('YesExit'),
                                  onPress: () => {
                                    setShowMembers(false);
                                     onRemoveMember(item)
                                  },
                                  style: 'destructive',
                                },
                              ],
                              { cancelable: false },
                            )
                        }}>
                          <IconAnt name='deleteuser' size={23} style={{ marginLeft: 16 }} />
                        </TouchableOpacity>
                      )
                    }
    
                  </TouchableOpacity>
                ))}
        </ScrollView>
      </Modal>
    )
  }

  const remove = () => {
    setShowBottomMenus(false);
    setValue('');
    closeMenuBox();
    setShowDeleteOptions(false);
  }

  const openCamera = () => {
   ImagePicker.openCamera({
    cropping: true,
    width: 400,
    height: 380
  }).then((image) => {
    onLaunchCamera(image)
  }).catch((err)=> {
  })
    setActionSheet(false);
  }

  const MenuButton = ({ index, menuTitle, icon, pressButton}) => {
    if(index == 0 || index == 1 || index == 2 || index == 3)
      return (
        <TouchableOpacity onPress={pressButton} style={styles.menu}>
          <Icon name={icon} size={23} color='#4e5154' />
          <Text style={styles.menuTitle}>{menuTitle}</Text>
        </TouchableOpacity>
      );
    else
      return (
        <TouchableOpacity onPress={pressButton} style={styles.menu2}>
          {
            menuTitle == IMLocalized('Remove Member') ?
            <IconIonicon name={icon} size={21} color='#4e5154' />
            :
            <Icon name={icon} size={23} color='#4e5154' />
          }
          <Text style={styles.menuTitle}>{menuTitle}</Text>
        </TouchableOpacity>
      );
  };

  return (
    <SafeAreaView style={styles.personalChatContainer}>
      {
        loading && (
          <TNActivityIndicator appStyles={AppStyles} text='Please wait' />
        )
      }
      <MessageThread
        // keyboardDismissMode={TrackInteractive ? 'interactive' : 'none'}
        thread={thread}
        user={user}
        appStyles={appStyles}
        onChatMediaPress={onChatMediaPress}
        onSenderProfilePicturePress={onSenderProfilePicturePress}
        onMessageLongPress={onMessageLongPress}
        onViewPDF={onViewPDF}
        onReactionPress={reactionPress}
        onReactionList={onReactionList}
        goDetailPost={goDetailPost}
      />
      {
        blocked && source && (
          <View stye={styles.bottomBtn}>
            <Text style={styles.tt}>{IMLocalized("You've blocked this user")}</Text>
            <TouchableOpacity style={styles.unblockBtn} onPress={onUnblockUser}>
              <Text style={styles.unblockText}>{IMLocalized('Unblock')}</Text>
            </TouchableOpacity>
          </View>
        )
      }
      {
        blocked && !source && (
          <View style={styles.blockview}>
            <Text style={styles.blockText}>{IMLocalized("You are blocked by this user")}</Text>
          </View>
        )
      }
      {
        !blocked && (
          <BottomInput
          editing={editing}
          toggleShowAudioView={()=> setShowAudioView(!showAudioView)}
          uploadProgress={uploadProgress}
          closeAudioView={()=> setShowAudioView(false)}
          value={inputValue}
          onAudioRecordDone={onAudioRecordDone}
          onChangeText={onChangeText}
          onSend={onSend}
          appStyles={appStyles}
          trackInteractive={TrackInteractive}
          onAddMediaPress={toggleMenuBox}
          inReplyToItem={inReplyToItem}
          editToItem={editToItem}
          onReplyingToDismiss={onReplyingToDismiss}
          closeMenuBox={closeMenuBox}
          disableBottomMenus={() => {
            setValue('');
            setShowBottomMenus(false)
            setShowDeleteOptions(false)
          }}
          value2={value}
      />
        )
      } 
       {
        showMenuBox && !blocked && (
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
            {
              !channel.group && (
              <FlatList
                showsHorizontalScrollIndicator={false}
                numColumns={4}
                data={menus}
                renderItem={({ item, index }) => (
                    <MenuButton index={index} icon={item.icon} menuTitle={item.title} pressButton={item.pressMenu} />
                  )}
                keyExtractor={(item) => menus.indexOf(item)}
              />
            )}
            {
              channel.group && !admin && (
              <FlatList
                showsHorizontalScrollIndicator={false}
                numColumns={4}
                data={groupMenus}
                renderItem={({ item, index }) => (
                    <MenuButton index={index} icon={item.icon} menuTitle={item.title} pressButton={item.pressMenu} />
                  )}
                keyExtractor={(item) => menus.indexOf(item)}
              />
            )}
            {
              channel.group && admin && (
              <FlatList
                showsHorizontalScrollIndicator={false}
                numColumns={4}
                data={groupAdminMenus}
                renderItem={({ item, index }) => (
                    <MenuButton index={index} icon={item.icon} menuTitle={item.title} pressButton={item.pressMenu} />
                  )}
                keyExtractor={(item) => menus.indexOf(item)}
              />
            )}

            </ScrollView>
          </View> 

        )}
        {
          showAudioView && (
            <BottomAudioRecorder onAudioRecordDone={onAudioRecordDone} />
          )
        }
      
      <ActionSheet
        title={IMLocalized('Group Settings')}
        options={[
          IMLocalized('Rename Group'),
          IMLocalized('Leave Group'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
      />
      <ActionSheet
        title={'Are you sure?'}
        options={['Confirm', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
      />
      <DialogInput
        isDialogVisible={isRenameDialogVisible}
        title={IMLocalized('Change Name')}
        hintInput={channel.name}
        textInputProps={{ selectTextOnFocus: true }}
        cancelText={IMLocalized('No')}
        submitText={IMLocalized('YesExit')}
        submitInput={onChangeName}
        closeDialog={() => {
          showRenameDialog(false);
        }}
      />

        {
          showBottomMenus && !blocked && (
        //   <Modal
        //   transparent={true}
        //   visible={true}
        //   backdropOpacity={0.3}
        //   style={{
        //     bottom: 0,
        //   }}
        // >
          <View style={styles.bottomModal}>
            <TouchableOpacity style={styles.removeIcon} onPress={() => remove()}>
              <MCIcon name='close-circle' color='black' size={25}  />
            </TouchableOpacity>
            {
              showDeleteOptions && (
                <ThreadOptionsItem items={deleteOptions} />
              )
            }
            {
              messageType == 'ownText' && (
                <ThreadOptionsItem items={ownTextMessageActions} />
              )
            }
            {
              messageType == 'ownMedia' && (
                <ThreadOptionsItem items={ownMediaActions} />
              )
            }
            {
              messageType == 'otherText' && (
                <ThreadOptionsItem items={otherTextActions} />
              )
            }
            {
              messageType == 'otherMedia' && (
                <ThreadOptionsItem items={otherMediaActions} />
              )
            }
            
          </View>
            
          )
        }

      <TNMediaViewerModal
        mediaItems={sortMediafromThread}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />

    </SafeAreaView>
  );
}

IMChat.propTypes = {
  onSendInput: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeTextInput: PropTypes.func,
  onLaunchCamera: PropTypes.func,
  onSendDocument: PropTypes.func,
  sendSurprise: PropTypes.func,
  onOpenPhotos: PropTypes.func,
  onAddMediaPress: PropTypes.func,
  user: PropTypes.object,
  uploadProgress: PropTypes.number,
  isMediaViewerOpen: PropTypes.bool,
  isRenameDialogVisible: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
  onChatMediaPress: PropTypes.func,
  onMediaClose: PropTypes.func,
  showRenameDialog: PropTypes.func,
  onLeave: PropTypes.func,
  showGroupMembers: PropTypes.func
};

export default IMChat;

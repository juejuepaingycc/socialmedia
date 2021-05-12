import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { Video } from 'expo-av';
//
import { TNStoryItem, TNTouchableIcon } from '../../../Core/truly-native';
import IMLocationSelectorModal from '../../../Core/location/IMLocationSelectorModal/IMLocationSelectorModal';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { extractSourceFromFile } from '../../../Core/helpers/retrieveSource';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob'
import CameraScreen from '../MenuBanner/CameraScreen';
import CustomActionSheet from '../../../Core/chat/IMChat/CustomActionSheet';
import { add } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { Scales } from '@common';
import { TNActivityIndicator } from '../../../Core/truly-native';

const Image2 = createImageProgress(FastImage);

function CreatePost(props) {
  const {
    onPostDidChange,
    onSetMedia,
    onSetNewMedia,
    onRemoveOldPhoto,
    onLocationDidChange,
    onPrivacyDidChange,
    user,
    inputRef,
    blurInput,
    onPost,
    privacyOptions,
    privacy,
    paramAddress,
    oldPostMedia,
    paramValue,
    newPost,
    loading
  } = props;
  const styles = dynamicStyles('light');
  const [address, setAddress] = useState('');
  const [locationSelectorVisible, setLocationSelectorVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaSources, setMediaSources] = useState([]);
  const [newMediaSources, setNewMediaSources] = useState([]);
  const [value, setValue] = useState('');
  const [isCameralContainer, setIsCameralContainer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const photoUploadDialogRef = useRef();
  const removePhotoDialogRef = useRef();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [uploadVisible, setUploadVisible] = useState(true)
  const [show, setShow] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  // const [privacyOptions, setPrivacyOptions] = useState(
  //   [
  //     {
  //       title: IMLocalized('Public'),
  //       engTitle: 'Public',
  //       description: IMLocalized('Anyone on Nine Chat'),
  //       icon: 'earth',
  //       checked: false
  //     },
  //     {
  //       title: IMLocalized('Friends'),
  //       engTitle: 'Friends',
  //       description: IMLocalized('Your friends on Nine Chat'),
  //       icon: 'people',
  //       checked: true
  //     },
  //     {
  //       title: IMLocalized('Only me'),
  //       engTitle: 'Only me',
  //       description: IMLocalized('Only me'),
  //       icon: 'lock-closed-outline',
  //       checked: false
  //     },
  //   ]
  // );

  useEffect(() => {
    if(!newPost && oldPostMedia){
      setMedia([...oldPostMedia])
    }
  }, [newPost, oldPostMedia])

  useEffect(() => {
    if(paramValue){
      const Post = {
        postText: paramValue,
        commentCount: 0,
        reactionsCount: 0,
        reactions: {
          surprised: 0,
          angry: 0,
          sad: 0,
          laugh: 0,
          like: 0,
          cry: 0,
          love: 0,
        },
    };
      setValue(paramValue);
      onPostDidChange(Post);
    }
  }, [paramValue])

  useEffect(() => {
    if(paramAddress){
      setAddress(paramAddress);
      onLocationDidChange(paramAddress);
    }
  }, [paramAddress])

  useEffect(() => {
    if(!newPost && oldPostMedia){
      setMedia(oldPostMedia);
      setMediaSources(oldPostMedia);
    }
  }, [newPost, oldPostMedia])

  useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
       setUploadVisible(false)
    }
}, [])

  const androidAddPhotoOptions = [
    IMLocalized('Import from Library'),
    IMLocalized('Take Photo'),
    IMLocalized('Record Video'),
    IMLocalized('Cancel'),
  ];

  const iosAddPhotoOptions = [
    IMLocalized('Import from Library'),
    IMLocalized('Open Camera'),
    IMLocalized('Cancel'),
  ];

  const actionItems = [
    {
      id: 0,
      label: IMLocalized('Import from Library'),
      onPress: () => {
      }
    },
    {
      id: 1,
      label: IMLocalized('Take Photo'),
      onPress: () => {
      }
    },
    {
      id: 2,
      label: IMLocalized('Record Video'),
      onPress: () => {
      }
    },
  ];
  
  const pressMenu2 = (item) => {
    console.log("Menu>>"+ JSON.stringify(item))
    if (item.id == 0) {
      onPhotoUploadDialogDoneAndroid(0);
    }
    else if (item.id == 1) {
      onPhotoUploadDialogDoneAndroid(1);
    }
    else if(item.id == 2){
      onPhotoUploadDialogDoneAndroid(2);
    }
  }

  const choosePrivacy = (chosenPrivacy) => {
    setShowPrivacy(false);
    if(chosenPrivacy.title == IMLocalized('Public'))
    {
      onPrivacyDidChange('Public');
    }
    else if(chosenPrivacy.title == IMLocalized('Friends'))
    {
      onPrivacyDidChange('Friends');
    }
    else
    {
      onPrivacyDidChange('Only me');
    }
  }

  const addPhotoCancelButtonIndex = {
    ios: 2,
    android: 3,
  };

  const addPhotoOptions =
    Platform.OS === 'android' ? androidAddPhotoOptions : iosAddPhotoOptions;

  const onLocationSelectorPress = () => {
    setLocationSelectorVisible(!locationSelectorVisible);
  };

  const onLocationSelectorDone = (address) => {
    setLocationSelectorVisible(!locationSelectorVisible);
    setAddress(address);
    console.log("Add2>>" + address);
    onLocationDidChange(address);
  };

  const onChangeLocation = (address) => {
    //const name = address.substring(0, address.indexOf(','));
    // if(newPost){
    //   setAddress(address);
    //   onLocationDidChange(address);
    // }
  };

  const onChangeText = (value) => {
    const Post = {
      postText: value,
      commentCount: 0,
      reactionsCount: 0,
      reactions: {
        surprised: 0,
        angry: 0,
        sad: 0,
        laugh: 0,
        like: 0,
        cry: 0,
        love: 0,
      },
  };

  setValue(value);
    onPostDidChange(Post);
  };

  const onPhotoUploadDialogDoneIOS = (index) => {
    if (index == 1) {
      onLaunchCamera();
    }

    if (index == 0) {
      onOpenPhotos();
    }
  };

  const onPhotoUploadDialogDoneAndroid = (index) => {
    if (media.length == 5) {
      setError(true);
      setErrorText("You can't upload more than 5 photos!")
    }
    else {
      if (index == 2) {
        onLaunchVideoCamera();
      }

      if (index == 1) {
        onLaunchCamera();
      }

      if (index == 0) {
        onOpenPhotos();
      }
    }
  };

  const onPhotoUploadDialogDone = (index) => {
    const onPhotoUploadDialogDoneSetter = {
      ios: () => onPhotoUploadDialogDoneIOS(index),
      android: () => onPhotoUploadDialogDoneAndroid(index),
    };
    onPhotoUploadDialogDoneSetter[Platform.OS]();
  };

  const onLaunchCamera = () => {
    //setShow(true)
    ImagePicker.openCamera({
      cropping: true,
      width: 400,
      height: 380
    }).then((image) => {
      capturePhoto(image)
    }).catch((err)=> {
    })
  }

  const capturePhoto = (image) => {
    console.log("new>>"+ newPost);
    if (image.path) {
      if(newPost){
        setMedia([...media, { source: image.path, mime: image.mime }]);
        setMediaSources([...mediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
        onSetMedia([...mediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
      }
      else{
        setMedia([...media, { source: image.path, mime: image.mime }]);
        setMediaSources([...mediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
        setNewMediaSources([...newMediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
        onSetMedia([...mediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
        onSetNewMedia([...newMediaSources, { filename: image.path, uploadUri: image.path, mime: image.mime }]);
      }
    }
  }

  const onLaunchVideoCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'video',
    }).then((image) => {
      const { source, mime, filename, uploadUri } = extractSourceFromFile(
        image,
      );

      console.log("VideO>>" + JSON.stringify(source))
      
      if(newPost){
        setMedia([...media, { source, mime }]);
        setMediaSources([...mediaSources, { filename, uploadUri, mime }]);
        onSetMedia([...mediaSources, { filename, uploadUri, mime }]);
      }
      else{
        Media([...media, { source, mime }]);
        setMediaSources([...mediaSources, { filename, uploadUri, mime }]);
        onSetMedia([...mediaSources, { filename, uploadUri, mime }]);
        setNewMediaSources([...newMediaSources, { filename, uploadUri, mime }]);
        onSetNewMedia([...newMediaSources, { filename, uploadUri, mime }]);
      }

/*       RNFetchBlob.fs.stat(source.replace('file:///', '').replace('file://', '').replace('file:/', ''))
        .then((stats) => {
          console.log("file size", stats.size)
          let size1 = stats.size / 1024;
          let size2 = size1 / 2014;
          if (size2 > 650) {
            console.log("video too large...");
            setError(true);
            setErrorText('video size is too large!')
          }
          else {
            setMedia([...media, { source, mime }]);
            setMediaSources([...mediaSources, { filename, uploadUri, mime }]);
            onSetMedia([...mediaSources, { filename, uploadUri, mime }]);
          }
        })
        .catch((err) => {
          console.log("getSize", err)
          error(err)
        }) */

      // setMedia([...media, { source, mime }]);
      // setMediaSources([...mediaSources, { filename, uploadUri, mime }]);
      // onSetMedia([...mediaSources, { filename, uploadUri, mime }]);
    });
  };

  const emptyAddress = () => {
    setAddress('');
    onLocationDidChange('');
  }

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: true,
    }).then((image) => {
      console.log("image 2>>"+ JSON.stringify(image))
      const newPhotos = [];
      let len = media.length + image.length;
      if (len > 10) {
        setError(true);
        setErrorText(IMLocalized('you cant upload more than 10 photos'))
      }
      else {

        let sources = [];

        for (var i = 0; i <= image.length; i++) {
          if (i != image.length) {

            // let sources = image.map((image) => {
            let image2 = image[i];
            const { source, mime, filename, uploadUri } = extractSourceFromFile(
              image2,
            );
            newPhotos.push({ source, mime });
            sources.push({ filename, uploadUri, mime });
          }
          else {
          }
        }

        setTimeout(() => {
          console.log("Sources>>" + JSON.stringify(sources))
          console.log("Media>>" + JSON.stringify([...media, ...newPhotos]));
          console.log("MediaSources>>"+ JSON.stringify([...mediaSources, ...sources]));

          if(newPost){
            setMedia([...media, ...newPhotos]);
            setMediaSources([...mediaSources, ...sources]);
            onSetMedia([...mediaSources, ...sources]);
          }
          else{
            setMedia([...media, ...newPhotos]);
            setMediaSources([...mediaSources, ...sources]);
            onSetMedia([...mediaSources, ...sources]);
            setNewMediaSources([...newMediaSources, ...sources]);
            onSetNewMedia([...newMediaSources, ...sources]);
          }
        }, 1000);
      }
    });

  };

  const onRemovePhotoDialogDone = (index) => {
    if (index === 0) {
      removePhoto();
    } else {
      setSelectedIndex(null);
    }
  };

  const onMediaPress = async (index) => {
    await setSelectedIndex(index);
    removePhotoDialogRef.current.show();
  };

  const removePhoto = async () => {
    const slicedMedia = [...media];
    const slicedMediaSources = [...mediaSources];
    await slicedMedia.splice(selectedIndex, 1);
    await slicedMediaSources.splice(selectedIndex, 1);
    setMedia([...slicedMedia]);
    setMediaSources([...slicedMediaSources]);
    onSetMedia([...slicedMediaSources]);
    onRemoveOldPhoto(selectedIndex)
  };

  const onTextFocus = () => {
    // setIsCameralContainer(false);
  };

  const onToggleImagesContainer = () => {
    blurInput();
    toggleImagesContainer();
  };

  const toggleImagesContainer = () => {
    setIsCameralContainer(!isCameralContainer);
  };

  const onStoryItemPress = (item) => {
    console.log('');
  };

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
  //     <CameraScreen capturePhoto={(f)=> capturePhoto(f)} disableCamera={()=> setShow(false)} />
  //   </Modal>
  //   )
  // }

  if(showPrivacy){
    return(
      <Modal
        transparent={false}
        coverScreen={true}
        isOpen={false}
        animationDuration={500}
        onRequestClose={()=> setShowPrivacy(false)}
        style={styles.container}
        >
        <View style={styles.HeaderBody}>
          <View style={styles.HeaderSideSection}>
            <TouchableOpacity useForeground onPress={()=> setShowPrivacy(false)}>
              <View style={styles.menuButton}>
                <Icon
                  name='arrow-back'
                  color='black'
                  size={Scales.moderateScale(24)}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleText}>{IMLocalized('Post Audience')}</Text>
          </View>
          <View style={styles.HeaderSideSection}></View>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={styles.whocansee}>{IMLocalized('Who can see your post')}</Text>
          <Text style={styles.privacyDesc}>{IMLocalized('Your post will show up in News Feed and on your profile')}</Text>

          {
            privacyOptions.map((option) => {
              return (
                <TouchableOpacity style={styles.privacyOption} onPress={()=> choosePrivacy(option)}>
                  {
                    option.checked?
                      <Icon name='checkmark-circle' size={20} color="#3494c7" />
                    :
                      <View style={styles.emptyCircle} />
                  }
                  <Icon name={option.icon} color='gray' size={24} style={styles.picon} />
                  <View>
                    <Text style={styles.option}>{option.title}</Text>
                    <Text style={styles.optionDesc}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }

          {/* <TouchableOpacity style={styles.privacyOption} onPress={()=> choosePrivacy()}>
            <Icon name='checkmark-circle' size={20} color="#3494c7" />
            <Icon name='earth' color='gray' size={24} style={styles.picon} />
            <View>
              <Text style={styles.option}>Friends</Text>
              <Text style={styles.optionDesc}>Your friends on Nine Chat</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.privacyOption} onPress={()=> choosePrivacy()}>
            <View style={styles.emptyCircle} />
            <Icon name='earth' color='gray' size={24} style={styles.picon} />
            <View>
              <Text style={styles.option}>Friends</Text>
              <Text style={styles.optionDesc}>Your friends on Nine Chat</Text>
            </View>
          </TouchableOpacity> */}

        </View>
      </Modal>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      enabled={false}
      style={styles.container}>

      {loading && <TNActivityIndicator text={IMLocalized('Posting')} appStyles={AppStyles} />}
      <View style={styles.topContainer}>

        <Modal
          transparent={true}
          animationType={'none'}
          visible={error}
          onRequestClose={() => { setError(false) }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <Text style={styles.text}>{errorText}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => setError(false)}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.headerContainer}>
          <TNStoryItem
            onPress={onStoryItemPress}
            item={user}
            appStyles={AppStyles}
            createPost={true}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{user.firstName}</Text>
            {/* <Text style={styles.subtitle}>{address}</Text>  */}
            <TouchableOpacity style={styles.privacyBtn} onPress={()=> setShowPrivacy(true)}>
              <Icon name={privacy.icon} color='#a7a9ab' size={16} style={styles.privacyIcon} />
              <Text style={styles.privacy}>{privacy.title}</Text>
              <Icon name='caret-down' color='#a7a9ab' size={16} style={styles.down} />
            </TouchableOpacity> 
          </View>
        </View>
        <View style={styles.postInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.postInput}
            onChangeText={onChangeText}
            value={value}
            multiline={true}
            onFocus={onTextFocus}
          />
        </View>
      </View>

      <View style={[styles.bottomContainer]}>
        <View style={[styles.postImageAndLocationContainer]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[
              styles.imagesContainer
            ]}>
            {media.map((singleMedia, index) => {
              let source;
              const mime = singleMedia.mime;
              if(singleMedia.source)
                source = singleMedia.source
              else
                source = singleMedia.url
              
              if (mime.startsWith('image')) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(index)}
                    style={styles.imageItemcontainer}>
                    <Image2 style={styles.imageItem} source={{ uri: source }} />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(index)}
                    style={styles.imageItemcontainer}>
                    <Video
                      source={{
                        uri: source,
                      }}
                      resizeMode={'cover'}
                      shouldPlay={false}
                      isMuted={true}
                      style={styles.imageItem}
                    />
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView>

          {/* <TNTouchableIcon
                  containerStyle={styles.iconContainer}
                  imageStyle={[styles.icon, styles.pinpointTintColor]}
                  iconSource={AppStyles.iconSet.pinpoint}
                  onPress={onLocationSelectorPress}
                  appStyles={AppStyles}
                /> */}
            <View style={styles.location}>
              <TNTouchableIcon
                    containerStyle={styles.iconContainer}
                    imageStyle={[styles.icon, styles.pinpointTintColor]}
                    iconSource={AppStyles.iconSet.pinpoint}
                    onPress={onLocationSelectorPress}
                    appStyles={AppStyles}
                  />
              <Text style={styles.subtitle}>{address}</Text>
              <TouchableOpacity style={styles.closeBtn}
              onPress={()=> {
                    setAddress('');
                    onLocationDidChange('');
              }}>
               {address != '' && (
                    <Icon name='md-close' size={22} /> 
                )
               }
               </TouchableOpacity>
            </View>

          <IMLocationSelectorModal
            isVisible={locationSelectorVisible}
            onCancel={onLocationSelectorPress}
            onDone={onLocationSelectorDone}
            onChangeLocation={onChangeLocation}
            appStyles={AppStyles}
            newPost={newPost}
          />

          <View style={styles.modalBackground2}>
            <CustomActionSheet
              title='Upload'
              disableTitle={true}
              actionItems={actionItems}
              pressMenu={pressMenu2}
            />
          </View>
      
        </View>
      </View>

      <ActionSheet
        ref={photoUploadDialogRef}
        title={IMLocalized('Add photo')}
        options={addPhotoOptions}
        cancelButtonIndex={addPhotoCancelButtonIndex[Platform.OS]}
        onPress={onPhotoUploadDialogDone}
      />
      <ActionSheet
        ref={removePhotoDialogRef}
        title={IMLocalized('Remove photo')}
        options={[IMLocalized('Remove'), IMLocalized('CancelRemove')]}
        destructiveButtonIndex={0}
        cancelButtonIndex={1}
        onPress={onRemovePhotoDialogDone}
      />
    </KeyboardAvoidingView>
  );
}

CreatePost.propTypes = {
  user: PropTypes.object,
  onPostDidChange: PropTypes.func,
  onSetMedia: PropTypes.func,
  onSetNewMedia: PropTypes.func,
  onRemoveOldPhoto: PropTypes.func,
  onLocationDidChange: PropTypes.func,
  onPrivacyDidChange: PropTypes.func,
  blurInput: PropTypes.func,
  inputRef: PropTypes.any,
};

export default CreatePost;

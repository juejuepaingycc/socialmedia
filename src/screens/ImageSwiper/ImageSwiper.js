import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import styles from './styles';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Entypo';
import ImageZoom from 'react-native-image-pan-zoom';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import { TNActivityIndicator } from '../../Core/truly-native'
import AppStyles from '../../AppStyles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import FeedImageSlider from '../../components/imageSlider/feedImageSlider';

const ImageSwiper = (props) => {
  const items = props.navigation.getParam('feedItems');
  const [loading, setLoading] = useState(false);
  const { height } = Dimensions.get('window');
  const circleSnailProps = { thickness: 1, color: '#ddd', size: 80 };

  useEffect(()=> {
    setTimeout(()=> {
      setLoading(false);
    }, 500)
  },[])

  
const downloadMedia = (url) => {
  let imgUrl = url;
  let firstImgUri = imgUrl.lastIndexOf('/');
  let lastImgUri = imgUrl.indexOf('?');
  let imageName = imgUrl.substring(firstImgUri, lastImgUri);
  console.log("imageName>>"+ imageName);

  let append = imageName.substring(imageName.indexOf('.'))

  let dirs = RNFetchBlob.fs.dirs;
  let path = dirs.PictureDir + imageName;
  console.log("Path>>"+ path);

  RNFetchBlob.config({
    fileCache: true,
    appendExt: append,
    indicator: true,
    path: path,
    addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Image'
     },
    }).fetch("GET", imgUrl).then(res => { 
           console.log(res, 'end downloaded') 
  });

}

  const renderDownloadButton = (uri) => {
    return (
      <TouchableOpacity
      onPress={() => downloadMedia(uri)}
      style={styles.dButton}>
        <Icon name={'download'} size={40} color='#51585c' />
      </TouchableOpacity>
    )
  }

  const ImageView = ({ uri, index }) => {
    console.log("Img>>"+ uri)
    return (
      <View key={index} style={styles.imageContainer}>
        {renderDownloadButton(uri)}
        {/* <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={calcImgHeight}
        imageWidth={Dimensions.get('window').width}
        imageHeight={calcImgHeight} 
        >   */}
          <Image
            source={{
              uri: uri
            }}
            style={styles.img}
            indicatorProps={circleSnailProps}
            resizeMode={'contain'}
            onLoad={() => console.log('f')
          }
          />

      </View>
    )
  }

  if(loading){
    return (
      <TNActivityIndicator appStyles={AppStyles} />
    )
  }

  else{
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.icon}>
          <IconSimple name='close' size={35} color='#377291' />
        </TouchableOpacity>
        <View style={styles.slideContainer}>
          <FeedImageSlider items={items} />
        </View>
      </View>
    )
  }
  
}

export default ImageSwiper;
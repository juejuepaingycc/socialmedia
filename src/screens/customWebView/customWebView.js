import React, { useEffect } from 'react';
import {
  View, BackHandler
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './customWebView.styles';
import {WebView} from 'react-native-webview';

const CustomWebViewScreen = (props) => {
  let url = props.navigation.getParam('url');

  function backButtonHandler() {
    props.navigation.goBack()
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  return (
    <View style={{flex: 1}}>
      <InnerHeader
        iconLeft={'chevron-left'}
        title={props.navigation.getParam('title')}
        onLeftIconPress={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.container}>
{/* 
        <TouchableOpacity style={styles.selectView} onPress={() => setShowLanguages(!showLanguages)}>
          <Image source={selectedValue.img} style={styles.selectImg} />
          <Icon name='chevron-down' size={23} color='gray' style={{ alignSelf: 'center', paddingLeft: 4 }} />
        </TouchableOpacity>
        {
          showLanguages && (
            <Modal
            visible={true}
            transparent={true}
            style={styles.modalview}
            >
            <View style={styles.modalbg}>
              {languages.map((option) => (
                <TouchableOpacity style={styles.choiceView} onPress={()=> {
                  setSelectedValue(option);
                  setShowLanguages(false);
                }}>
                  <Image source={option.img} style={styles.selectImg2} />
                </TouchableOpacity>
              ))} 
            </View>
            </Modal>
          )
        } */}
        <WebView
          source={{uri: url}}
          style={styles.WebView}
        />
      </View>
    </View>
  );
};

export default CustomWebViewScreen;

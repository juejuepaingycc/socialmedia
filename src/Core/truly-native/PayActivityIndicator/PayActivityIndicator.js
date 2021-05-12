import React from 'react';
import { View, ActivityIndicator, Modal, Text } from 'react-native';
import styles from './styles';

const PayActivityIndicator = (props) => {
  return (
      <Modal
          transparent={true}
          animationType={'none'}
          visible={true}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator size="large" color="#3494c7"
                animating={true} />
              <Text style={styles.text}>Please wait...</Text>
            </View>
          </View>
        </Modal>
  );
};

export default PayActivityIndicator;

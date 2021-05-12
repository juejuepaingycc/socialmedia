/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import LoginManager from '../manager/LoginManager';
import CallButton from '../components/CallButton';
import CallManager from '../manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import COLOR from '../styles/Color';
import { Scales } from '@common';
import InCallManager from 'react-native-incall-manager';

export default class IncomingCallScreen extends React.Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        const callId = params ? params.callId : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.displayName = params ? params.from : null;
        this.call = CallManager.getInstance().getCallById(callId);
        console.log("Video Call>>>>", this.isVideoCall);
        this.state = {
            displayName: null,
        };
    }

    componentDidMount() {
        //InCallManager.startRingtone('_DEFAULT_');
        InCallManager.startRingtone('_BUNDLE_');
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
        }
        LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);
    }

    // _connectionClosed = () => {
    //     console.log("[IncomingCall] Connection Closed $$$$$$$$$$");
    //     AsyncStorage.setItem('voximplantState', 'failed');
    //     this.declineCall();
    //   };


    componentWillUnmount() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            this.call = null;
        }
    }

    async answerCall(withVideo) {
        InCallManager.stop();
        InCallManager.stopRingtone();
        try {
            if (Platform.OS === 'android') {
                let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
                //if (withVideo) {
                permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
                //}
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const recordAudioGranted = granted['android.permission.RECORD_AUDIO'] === 'granted';
                const cameraGranted = granted['android.permission.CAMERA'] === 'granted';
                if (recordAudioGranted) {
                    if (withVideo && !cameraGranted) {
                        console.warn('IncomingCallScreen: answerCall: camera permission is not granted');
                        return;
                    }
                } else {
                    console.warn('IncomingCallScreen: answerCall: record audio permission is not granted');
                    return;
                }
            }
        } catch (e) {
            console.warn('IncomingCallScreen: asnwerCall:' + e);
            return;
        }
        this.props.navigation.navigate('Call', {
            callId: this.call.callId,
            isVideo: withVideo,
            isIncoming: true,
            callName:this.state.displayName,
            startedCall: true
        });
    }

    declineCall() {
        InCallManager.stop();
        InCallManager.stopRingtone();
        if(this.call)
            this.call.decline();
        this.props.navigation.navigate('NavStack')
    }

    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
            }
        });
    }

    _onCallDisconnected = (event) => {
        console.log('IncomingCallScreen: _onCallDisconnected');
        this.declineCall();
        CallManager.getInstance().removeCall(event.call);
       // this.props.navigation.navigate('App'); 
    };

    _onCallEndpointAdded = (event) => {
        console.log('IncomingCallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this.setState({ displayName: event.endpoint.displayName });
    };

    render() {
        return (
            < SafeAreaView style={styles2.ss}>
                <Image source={require('../assets/img/slider3.png')} style={styles2.backgroundImage} />
                <View style={styles2.topView}>
                    <Image source={require('../assets/img/slider3.png')} style={styles2.avatar} />
                    <Text style={styles2.name}>{this.state.displayName}</Text>
                    <Text style={styles2.desc}>Would like to chat</Text>

                    <View style={styles2.btnView}>
                        <View style={styles2.view2}>
                            {
                                this.isVideoCall ?
                                    <CallButton icon_name="videocam" color={COLOR.ACCENT} buttonPressed={() => this.answerCall(true)} />
                                                                    :
                                    <CallButton icon_name="call" color={COLOR.ACCENT} buttonPressed={() => this.answerCall(false)} />
                            }
                            <CallButton icon_name="call-end" color={COLOR.RED} buttonPressed={() => this.declineCall()} />
                        </View>
                    </View>
                </View>
            </SafeAreaView >
        );
    }
}

const styles2 = StyleSheet.create({
    view2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 300
    },
    btnView: {
        height: 90,
        position: 'absolute',
        bottom: 10,
        width: Scales.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingVertical: 17,
        color: 'white',
        textAlign: 'center'
    },
    ss: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch',
        position: 'absolute'
      },
      topView: {
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.8)'
      },
      avatar: {
          width: 110,
          height: 110,
          borderRadius: 80,
          marginTop: 100,
          alignSelf: 'center'
      }
})
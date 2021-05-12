
'use strict';

import React from 'react';
import {
    Text,
    View,
    Modal,
    TouchableHighlight,
    Platform,
    SafeAreaView,
    Image,
    FlatList,
    PermissionsAndroid,
    ToastAndroid,
    BackHandler
} from 'react-native';
import LoginManager from '../manager/LoginManager';
import { channelManager } from '../Core/chat/firebase';
import { Voximplant } from 'react-native-voximplant';
import CallButton from '../components/CallButton';
import { Keypad } from '../components/Keypad';
import COLOR from '../styles/Color';
import CallManager from '../manager/CallManager';
import styles from '../styles/Styles';
import moment from 'moment';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import InCallManager from 'react-native-incall-manager';
import AsyncStorage from '@react-native-community/async-storage';
import { IMLocalized } from '../Core/localization/IMLocalization';

const CALL_STATES = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
};

export default class CallScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;

        this.callTo = params ? params.callTo : null;
        this.callId = params ? params.callId : null;
        this.callName = params ? params.callName : null;
        this.channel = params ? params.channel : null;
        this.isVideoCall = params ? params.isVideo : false;
        this.isIncoming = params ? params.isIncoming : false;
        this.callState = CALL_STATES.DISCONNECTED;
        this.sendMessageStatus = params ? params.sendMessage : false;
        this.startedCall = params ? params.startedCall : false;
        this.user = params ? params.user : false;;
        if(!this.isIncoming){
            InCallManager.start({ media: 'audio', ringback: '_DTMF_' });
        }
        this.state = {
            isAudioMuted: false,
            isVideoSent: this.isVideoCall,
            isKeypadVisible: false,
            isModalOpen: false,
            modalText: '',
            localVideoStreamId: null,
            remoteVideoStreamId: null,
            audioDeviceSelectionVisible: false,
            audioDevices: [],
            audioDeviceIcon: 'volume-down',
            callstate: this.callState,
            receivevideo: this.isVideoCall,
            sendvideo: this.isVideoCall,
            frontView: true,
            callhold: false,
            callStartTime: '',
            callEndTime: '',
            callAlreadyEnd: false,
            endedCall: false,
            endingCall: false,
            currentPage: true,
            trying: false
        };

        this.call = CallManager.getInstance().getCallById(this.callId);
        this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
            BackHandler.addEventListener(
              'hardwareBackPress',
              this.onBackButtonPressAndroid,
            )
          });
    }

    onBackButtonPressAndroid = () => {
        return true;
      };

    _connectionClosed = () => {
        AsyncStorage.setItem('voximplantState', 'failed');

        if(this.state.currentPage){
            console.log("Connection Closed $$$$$$$$$$");
            console.log("Info>>" + this.startedCall + ' ' + this.state.callhold)
            if(this.state.callhold == true){
                console.log("Connection down while Talking")
                this.setState({ endingCall: false });
                //this.props.navigation.navigate('NavStack');
            }
            else{
                console.log("Connection down while Calling")
                this.setState({ endedCall: true });
                InCallManager.stopRingtone();
                if(this.call){
                    console.log("Call OK")
                    this.call.getEndpoints().forEach(endpoint => {
                        this._setupEndpointListeners(endpoint, false);
                    });
                    this.call.hangup();  
                    //this.props.navigation.navigate('NavStack');
                }  
            }
        }
        else{
            console.log("Not CALL_SCREEN page")
        }
      };

    componentDidMount() {
        Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
            const callbackName = `_onAudio${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                Voximplant.Hardware.AudioDeviceManager.getInstance().on(eventName, this[callbackName]);
            }
        });
        LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);

        const callSettings = {
            video: {
                sendVideo: this.isVideoCall,
                receiveVideo: this.isVideoCall
            },
        };
        if (this.isIncoming) {
            this.call.answer(callSettings);
            this.setupListeners();
        } else {
            this.setState({ trying: true })
            LoginManager.getInstance().loginWithPassword(this.user.id + '@sdk-tutorial-9rtepje.winhtoomyint.n2.voximplant.com', '111111');
            setTimeout(()=> {
                if (Platform.OS === 'ios') {
                    callSettings.setupCallKit = true;
                }
                (async() => {
                    this.setState({ trying: false })
                    this.call = await Voximplant.getInstance().call(this.callTo, callSettings);
                    this.setupListeners();
                    let callManager = CallManager.getInstance();
                    callManager.addCall(this.call);
                    if (callSettings.setupCallKit) {
                        callManager.startOutgoingCallViaCallKit(this.isVideoCall, this.callTo);
                    }
                })();
            }, 3000)
        }
        this.callState = CALL_STATES.CONNECTING;
        (async() => {
            this.setState({callstate: CALL_STATES.CONNECTING})
            let currentAudioDevice = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
            switch (currentAudioDevice) {
                case Voximplant.Hardware.AudioDevice.BLUETOOTH:
                    this.setState({audioDeviceIcon: 'bluetooth-audio'});
                    break;
                case Voximplant.Hardware.AudioDevice.SPEAKER:
                    this.setState({audioDeviceIcon: 'volume-up'});
                    break;
                case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
                    this.setState({audioDeviceIcon: 'headset'});
                    break;
                case Voximplant.Hardware.AudioDevice.EARPIECE:
                default:
                    this.setState({audioDeviceIcon: 'volume-down'});
                    break;
            }
        })();
        
    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        )
      })
    }

    componentWillUnmount() {
        console.log('CallScreen: componentWillUnmount ');
        AsyncStorage.setItem('callToID', '');
        AsyncStorage.setItem('CallDeclineText', ''); 
        this.setState({ currentPage: false })
        // InCallManager.stop();
        // InCallManager.stopRingtone();
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.off(eventName, this[callbackName]);
                }
            });
            Object.keys(Voximplant.Hardware.AudioDeviceEvents).forEach((eventName) => {
                const callbackName = `_onAudio${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    Voximplant.Hardware.AudioDeviceManager.getInstance().off(eventName, this[callbackName]);
                }
            });
        }
    }

    setupListeners() {
        if (this.call) {
            Object.keys(Voximplant.CallEvents).forEach((eventName) => {
                const callbackName = `_onCall${eventName}`;
                if (typeof this[callbackName] !== 'undefined') {
                    this.call.on(eventName, this[callbackName]);
                }
            });
            if (this.isIncoming) {
                this.call.getEndpoints().forEach(endpoint => {
                    this._setupEndpointListeners(endpoint, true);
                });
            }
        }
    }

    async sendVideo(doSend) {
        console.log('CallScreen[' + this.callId + '] sendVideo: ' + doSend);
        try {
            if (doSend && Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('CallScreen[' + this.callId + '] sendVideo: failed due to camera permission is not granted');
                    return;
                }
            }
            await this.call.sendVideo(doSend);
            this.setState({isVideoSent: doSend});
        } catch (e) {
            console.warn(`Failed to sendVideo(${doSend}) due to ${e.code} ${e.message}`);
        }
    }

    async hold(doHold) {
        console.log('CallScreen[' + this.callId + '] hold: ' + doHold);
        try {
            await this.call.hold(doHold);
        } catch (e) {
            console.warn('Failed to hold(' + doHold + ') due to ' + e.code + ' ' + e.message);
        }
    }

    async receiveVideo() {
        console.log('CallScreen[' + this.callId + '] receiveVideo');
        try {
            await this.call.receiveVideo();
        } catch (e) {
            console.warn('Failed to receiveVideo due to ' + e.code + ' ' + e.message);
        }
    }

    endCall() {
        console.log("endcall...")
       // try {
            this.setState({ endedCall: true, endingCall: true });
            InCallManager.stopRingtone();
            if(this.call){
                console.log("Call OK")
                this.call.getEndpoints().forEach(endpoint => {
                    this._setupEndpointListeners(endpoint, false);
                });
                this.call.hangup();  
                if(this.state.callhold){
                    if(this.startedCall){
                        console.log("Condition2: Started Call && Ended Call After Hold")
                        this.sendPhoneCall('END_CALL');  
                    }
                }
                else{
                    console.log("Call didn't hold")
                    //Missed call
                    console.log("StartedCall>>" + this.startedCall + " " + this.user.id)
                    if(this.startedCall && this.user && this.user.id){
                        console.log("Condition1: Started Call && Ended Call Before Hold")
                        this.sendMessage("Missed call", "", true,'END_CALL');
                        //this.sendMessage("missed_call[" + this.user.id + "]", "", true,'END_CALL');
                    }
                }
            }
            else{
                console.log("goBack case2");
                this.props.navigation.navigate('NavStack')
            }
        // }
        // catch (e) {
        //     console.log("End call catch>>" , e);
        // }
        
    }

    sendPhoneCall(type) {
        let ended = moment().format("DD/MM/YYYY HH:mm:ss");
                console.log("Ended>>"+ ended);

                let dif = moment.utc(moment(ended,"DD/MM/YYYY HH:mm:ss").diff(moment(this.state.callStartTime,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                let arr = dif.split(':');
                let duration = '';
                if(parseInt(arr[0]) == 1){
                    duration = '1 hr';
                }
                else if(parseInt(arr[0]) > 1){
                    duration = parseInt(arr[0]) + ' hrs'
                };
                if(parseInt(arr[1]) == 1){
                    duration += ' 1 min';
                }
                else if(parseInt(arr[1]) > 1){
                    duration += ' ' + parseInt(arr[1]) + ' mins'
                };
                if(parseInt(arr[2]) == 1){
                    duration += ' 1 sec';
                }
                else if(parseInt(arr[2]) > 1){
                    duration += ' ' + parseInt(arr[2]) + " secs"
                };
                if(this.user && this.user.id)
                    this.sendMessage("Call ended", duration, true, type);
                    //this.sendMessage("phone_call[" + this.user.id + "]", duration, true, type);
    }

    
    getDifferenceInHours = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
  }
  
  getDifferenceInMinutes= (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }
  
  getDifferenceInSeconds = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000;
  }

sendMessage = (msg, duration, status, type) => {
    console.log("Sending message...")
        channelManager
        .sendMessage(
            this.user,
            this.channel,
            msg,
            '',
            null,
            duration,
            false,
            '',
            ''
        )
        .then((response) => {
            if (response.error) {
                //alert(error);
                if(type == 'END_CALL'){
                    setTimeout(()=> {
                        this.setState({ endingCall: false });
                        this.props.navigation.navigate('NavStack');
                        console.log("goBack case3");                  
                    }, 1000)
                }
                else if(type == 'DECLINE_CALL'){
                            this.callState = CALL_STATES.DISCONNECTED;
                            this.setState({ callstate: CALL_STATES.DISCONNECTED })
                            CallManager.getInstance().removeCall(this.call);
                            InCallManager.stop({busytone: '_DTMF_'});
                            InCallManager.stopRingtone();
                            this.setState({
                                //isModalOpen: true,
                                //modalText: IMLocalized('Call Decline'),
                                remoteVideoStreamId: null,
                                localVideoStreamId: null,
                            });  
                            this.showToast(IMLocalized('Call Decline'));
                }
                else if(type == '_onCallDisconnected'){
                    console.log('Type _onCallDisconnected');
                    this.setState({ endingCall: false });
                    this.props.navigation.navigate('NavStack');               
                }
            } 
            else {
                console.log("Message sent...")
                if(type == 'END_CALL'){
                    setTimeout(()=> {
                        this.setState({ endingCall: false });
                        this.props.navigation.navigate('NavStack');
                        console.log("goBack case4");                   
                    }, 1000)
                }
                else if(type == 'DECLINE_CALL'){
                    this.callState = CALL_STATES.DISCONNECTED;
                            this.setState({ callstate: CALL_STATES.DISCONNECTED })
                            CallManager.getInstance().removeCall(this.call);
                            InCallManager.stop({busytone: '_DTMF_'});
                            InCallManager.stopRingtone();
                            this.setState({
                                //isModalOpen: true,
                                //modalText: IMLocalized('Call Decline'),
                                remoteVideoStreamId: null,
                                localVideoStreamId: null,
                            }); 
                            this.showToast(IMLocalized('Call Decline'));
           
                }
                else if(type == '_onCallDisconnected'){
                    console.log('Type _onCallDisconnected');
                    this.setState({ endingCall: false });
                    this.props.navigation.navigate('NavStack');
                    console.log("goBack case5");               
                }
            }
        
        }).catch(error => {
            console.log("SendMessage catch>>", error)
          })
    }

    showToast = (msg) => {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
        this.props.navigation.navigate('NavStack');
    }

    switchKeypad() {
        let isVisible = this.state.isKeypadVisible;
        this.setState({isKeypadVisible: !isVisible});
    }

    switchCamera(){
        console.log("SWtich.......");
        if(this.state.frontView){
            Voximplant.Hardware.CameraManager.getInstance().switchCamera(Voximplant.Hardware.CameraType.BACK);
            this.setState({ frontView: false })
        }
        else{
            Voximplant.Hardware.CameraManager.getInstance().switchCamera(Voximplant.Hardware.CameraType.FRONT);
            this.setState({ frontView: true })
        }
    }

    muteAudio() {
        const isMuted = this.state.isAudioMuted;
        this.call.sendAudio(isMuted);
        this.setState({isAudioMuted: !isMuted});
    }

    async switchAudioDevice() {
        console.log('CallScreen[' + this.callId + '] switchAudioDevice');
        let devices = await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
        console.log("Devices>>" + JSON.stringify(devices))
        this.setState({audioDevices: devices});
        if(this.state.audioDeviceIcon == 'volume-down'){
            this.setState({ audioDeviceIcon: 'volume-up' })
            Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice('Speaker');
        }
        else if(this.state.audioDeviceIcon == 'volume-up'){
            this.setState({ audioDeviceIcon: 'volume-down' })
            Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice('Earpiece');
        }
        //audioDeviceSelectionVisible: true
    }

    selectAudioDevice(device) {
        Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(device);
        this.setState({audioDeviceSelectionVisible: false});
    }

    _keypadPressed(value) {
        console.log('CallScreen[' + this.callId + '] _keypadPressed(: ' + value);
        this.call.sendTone(value);
    }

    _closeModal() {
        try{
            this.setState({isModalOpen: false, modalText: '' });
            this.props.navigation.navigate('NavStack');
            console.log("goBack case6");
        }
        catch(e) {
            console.log("case6 _closeModal catch>>", e);
        }
    }

    _onCallFailed = (event) => {
            if(event.reason == 'Decline'){
                if(this.startedCall && this.user && this.user.id){
                    console.log("Started Call && Other User Decline");
                    this.sendMessage("Missed call", "", false, 'DECLINE_CALL');
                    //this.sendMessage("missed_call[" + this.user.id + "]", "", false, 'DECLINE_CALL');
                }
            }
            else{
                try{
                    this.callState = CALL_STATES.DISCONNECTED;
                    this.setState({callstate: CALL_STATES.DISCONNECTED})
                    CallManager.getInstance().removeCall(this.call);
                    InCallManager.stopRingtone();
                    InCallManager.stop({busytone: '_DTMF_'});
                    console.log("Condition5: Started Call && can't reach to Receiver")
                    this.setState({
                        //isModalOpen: true,
                        //modalText: IMLocalized('Call Unreachable'),
                        remoteVideoStreamId: null,
                        localVideoStreamId: null,
                    });
                    this.showToast(IMLocalized('Call Unreachable'))
                }
                catch(e){
                    console.log("_onCallFailed Catch>>", e);
                }
            }
    };

    _onCallDisconnected = (event) => {
        console.log("DISCONNECT EVENT>", event)
        InCallManager.stop();
        InCallManager.stopRingtone();
        console.log('CallScreen: _onCallDisconnected: ');
        this.setState({
            remoteVideoStreamId: null,
            localVideoStreamId: null,
            endingCall: true
        });
        if(this.call)
            CallManager.getInstance().removeCall(this.call);
        if (Platform.OS === 'android' && Platform.Version >= 26 && this.callState === CALL_STATES.CONNECTED) {
            (async () => {
                await VIForegroundService.stopService();
            })();
        }
        this.callState = CALL_STATES.DISCONNECTED;
        this.setState({callstate: CALL_STATES.DISCONNECTED})

        if(this.startedCall && this.state.callhold && !this.state.endedCall){
            console.log("Condition4: Started Call && Other User Ended Call After Hold");
            this.sendPhoneCall('_onCallDisconnected');   
        }
        else if(!this.state.endedCall){
            InCallManager.stop();
            InCallManager.stopRingtone();
            this.setState({ endingCall: false })
            this.props.navigation.navigate('NavStack')
            console.log("goBack case1");
        }
    };

    _onCallConnected = (event) => {
        InCallManager.stop();
        InCallManager.stopRingtone();
        console.log('CallScreen: _onCallConnected: ');
        console.log("Other user hold your user...");

        let now = moment().format("DD/MM/YYYY HH:mm:ss");
        this.setState({ 
            callhold: true,
            callStartTime: now
        });

        Voximplant.Hardware.CameraManager.getInstance().switchCamera(Voximplant.Hardware.CameraType.FRONT);
        // this.call.sendMessage('Test message');
        // this.call.sendInfo('rn/info', 'test info');
        this.callState = CALL_STATES.CONNECTED;
        this.setState({callstate: CALL_STATES.CONNECTED})

        if (Platform.OS === 'android' && Platform.Version >= 26) {
            const channelConfig = {
                id: 'ForegroundServiceChannel',
                name: 'In progress calls',
                description: 'Notify the call is in progress',
                enableVibration: false,
            };
            const notificationConfig = {
                channelId: 'ForegroundServiceChannel',
                id: 3456,
                title: 'Voximplant',
                text: 'Call in progress',
                icon: 'ic_vox_notification',
            };
            (async() => {
                await VIForegroundService.createNotificationChannel(channelConfig);
                await VIForegroundService.startService(notificationConfig);
            })();
        }
    };

    _onCallLocalVideoStreamAdded = (event) => {
        //console.log('CallScreen: _onCallLocalVideoStreamAdded: ' + this.call.callId + ', video stream id: ' + event.videoStream.id);
        this.setState({localVideoStreamId: event.videoStream.id});
    };

    _onCallLocalVideoStreamRemoved = (event) => {
        //console.log('CallScreen: _onCallLocalVideoStreamRemoved: ' + this.call.callId);
        this.setState({localVideoStreamId: null});
    };

    _onCallEndpointAdded = (event) => {
        //console.log('CallScreen: _onCallEndpointAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, true);
    };

    _onEndpointRemoteVideoStreamAdded = (event) => {
        // console.log('CallScreen: _onEndpointRemoteVideoStreamAdded: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id +
        //     ', video stream id: ' + event.videoStream.id);
        this.setState({remoteVideoStreamId: event.videoStream.id});
    };

    _onEndpointRemoteVideoStreamRemoved = (event) => {
        // console.log('CallScreen: _onEndpointRemoteVideoStreamRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id +
        //     ', video stream id: ' + event.videoStream.id);
        if (this.state.remoteVideoStreamId === event.videoStream.id) {
            this.setState({remoteVideoStreamId: null});
        }
    };

    _onEndpointRemoved = (event) => {
        //console.log('CallScreen: _onEndpointRemoved: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
        this._setupEndpointListeners(event.endpoint, false);
    };

    _onEndpointInfoUpdated = (event) => {
        //console.log('CallScreen: _onEndpointInfoUpdated: callid: ' + this.call.callId + ' endpoint id: ' + event.endpoint.id);
    };

    _setupEndpointListeners(endpoint, on) {
        Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
            const callbackName = `_onEndpoint${eventName}`;
            if (typeof this[callbackName] !== 'undefined') {
                endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
            }
        });
    }

    _onAudioDeviceChanged = (event) => {
        console.log('CallScreen: _onAudioDeviceChanged:' + event.currentDevice);
        switch (event.currentDevice) {
            case Voximplant.Hardware.AudioDevice.BLUETOOTH:
                this.setState({audioDeviceIcon: 'bluetooth-audio'});
                break;
            case Voximplant.Hardware.AudioDevice.SPEAKER:
                this.setState({audioDeviceIcon: 'volume-up'});
                break;
            case Voximplant.Hardware.AudioDevice.WIRED_HEADSET:
                this.setState({audioDeviceIcon: 'headset'});
                break;
            case Voximplant.Hardware.AudioDevice.EARPIECE:
            default:
                this.setState({audioDeviceIcon: 'volume-down'});
                break;
        }
    };

    _onAudioDeviceListChanged = (event) => {
        (async () => {
            let device = await Voximplant.Hardware.AudioDeviceManager.getInstance().getActiveDevice();
            console.log("Device>>" , device);
        })();
        this.setState({audioDevices: event.newDeviceList});
    };

    flatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#607D8B',
                    marginTop: 10,
                    marginBottom: 10,
                }}
            />
        );
    };

    render() {
        if(this.state.endingCall){
            return(
                <SafeAreaView style={styles.container2}>
                    <SafeAreaView style={styles.ss}>
                            <Image source={require('../assets/img/slider3.png')} style={styles.backgroundImage} />
                                <View style={styles.topView}>
                                    <Image source={require('../assets/img/slider3.png')} style={styles.avatar} />
                                    <Text style={[styles.desc, { paddingTop: 20 }]}>{IMLocalized('Ending call')}...</Text>
                                </View>
                    </SafeAreaView>
                </SafeAreaView>
            )
        }
        else{
            return(
                <SafeAreaView style={styles.container2}>
                    {this.state.callstate == 'connecting' || (this.state.callstate == 'connected' && !this.state.receivevideo && !this.state.sendvideo) ?
                        <SafeAreaView style={styles.ss}>
                            <Image source={require('../assets/img/slider3.png')} style={styles.backgroundImage} />
                                <View style={styles.topView}>
                                    <Image source={require('../assets/img/slider3.png')} style={styles.avatar} />
                                    {
                                        this.state.endingCall ?
                                        <Text style={styles.desc}>{IMLocalized('Ending call')}...</Text>
                                        :
                                        <View>
                                            <Text style={styles.name}>{this.callName}</Text>
                                            {
                                                this.state.trying ?
                                                <Text style={styles.desc}>{IMLocalized('Trying to connect')}...</Text>
                                                :
                                                <Text style={styles.desc}>{IMLocalized(this.state.callstate)}...</Text>
                                            }
                                            
                                        </View>
                                    }
                                    
        
                                    <View style={styles.call_controls2}>
                                        {
                                            !this.state.trying && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-around',
                                                    backgroundColor: 'transparent',
                                                }}>
                                                    {this.state.isAudioMuted ? (
                                                        <CallButton icon_name="mic-off" color={COLOR.ACCENT}
                                                                    buttonPressed={() => this.muteAudio()}/>
                                                    ) : (
                                                        <CallButton icon_name="mic" color={COLOR.ACCENT}
                                                                    buttonPressed={() => this.muteAudio()}/>
                                                    )}
                                                    {
                                                        this.isVideoCall && (
                                                            <CallButton icon_name="switch-camera" color={COLOR.ACCENT}
                                                            buttonPressed={() => this.switchCamera()}/>
                                                        )
                                                    }
                                                    <CallButton icon_name={this.state.audioDeviceIcon} color={COLOR.ACCENT}
                                                                buttonPressed={() => this.switchAudioDevice()}/>
                                                    {/* {this.state.isVideoSent ? (
                                                        <CallButton icon_name="videocam-off" color={COLOR.ACCENT}
                                                                    buttonPressed={() => {
                                                                        this.sendVideo(false);
                                                                        this.setState({sendvideo: false});
                                                                        this.setState({isVideoSent: false});
                                                                    }
                                                                    }/>
                                                    ) : (
                                                        <CallButton icon_name="video-call" color={COLOR.ACCENT}
                                                                    buttonPressed={() => {
                                                                        this.sendVideo(true)
                                                                        this.receiveVideo(true)
                                                                        this.setState({sendvideo: true})
                                                                        this.setState({receivevideo: true})
                                                                    }}/>
                                                    )} */}
                                                    <CallButton icon_name="call-end" color={COLOR.RED} buttonPressed={() => this.endCall()}/>
                                                </View>
                                            )
                                        }
                                 
                                </View>
        
                                </View>
        
                                <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.audioDeviceSelectionVisible}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({audioDeviceSelectionVisible: false})
                                }}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <FlatList
                                            data={this.state.audioDevices}
                                            keyExtractor={(item, index) => item}
                                            ItemSeparatorComponent={this.flatListItemSeparator}
                                            renderItem={({item}) => <Text onPress={() => {
                                                this.selectAudioDevice(item);
                                            }}> {item} </Text>}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>
        
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => {
                               this._closeModal()
                            }}
                            >
                            <TouchableHighlight
                               onPress={(e) => 
                                    this._closeModal()
                                }
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View
                                        style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <Text>{this.state.modalText}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>
        
                        </SafeAreaView >
                        :
                        <SafeAreaView style={styles.safearea}>
                        <View style={styles.useragent}>
                        <View style={styles.videoPanel}>
                                <Voximplant.VideoView style={styles.remotevideo} videoStreamId={this.state.remoteVideoStreamId}
                                scaleType={Voximplant.RenderScaleType.SCALE_FIT}  />
                                <Voximplant.VideoView style={styles.selfview} videoStreamId={this.state.localVideoStreamId}
                                                      scaleType={Voximplant.RenderScaleType.SCALE_FIT} showOnTop />
                        </View>
        
                        {this.state.isKeypadVisible ? (
                            <Keypad keyPressed={(e) => this._keypadPressed(e)}/>
                        ) : null}
        
        
                        <View style={styles.call_controls}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                backgroundColor: 'transparent',
                            }}>
        
                                {this.state.isAudioMuted ? (
                                    <CallButton icon_name="mic-off" color={COLOR.ACCENT}
                                                buttonPressed={() => this.muteAudio()}/>
                                ) : (
                                    <CallButton icon_name="mic" color={COLOR.ACCENT}
                                                buttonPressed={() => this.muteAudio()}/>
                                )}
                                {
                                this.isVideoCall && (
                                    <CallButton icon_name="switch-camera" color={COLOR.ACCENT}
                                            buttonPressed={() => this.switchCamera()}/>
                                                        )}
                                <CallButton icon_name={this.state.audioDeviceIcon} color={COLOR.ACCENT}
                                            buttonPressed={() => this.switchAudioDevice()}/>
                                {/* {this.state.isVideoSent ? (
                                    <CallButton icon_name="videocam-off" color={COLOR.ACCENT}
                                                buttonPressed={() => {
                                                    this.sendVideo(false)
                                                    this.setState({sendvideo: false})
                                                }
                                                }/>
                                ) : (
                                    <CallButton icon_name="video-call" color={COLOR.ACCENT}
                                                buttonPressed={() => {
                                                    this.sendVideo(true)
                                                    this.receiveVideo(true)
                                                    this.setState({sendvideo: true})
                                                    this.setState({receivevideo: true})
                                                }}/>
                                )} */}
                                <CallButton icon_name="call-end" color={COLOR.RED} buttonPressed={() => this.endCall()}/>
                            </View>
                        </View>
        
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.audioDeviceSelectionVisible}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({audioDeviceSelectionVisible: false})
                                }}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <FlatList
                                            data={this.state.audioDevices}
                                            keyExtractor={(item, index) => item}
                                            ItemSeparatorComponent={this.flatListItemSeparator}
                                            renderItem={({item}) => <Text onPress={() => {
                                                this.selectAudioDevice(item);
                                            }}> {item} </Text>}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>
        
                         <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => {
                            }}>
                            <TouchableHighlight
                                onPress={(e) => this._closeModal()}
                                style={styles.container}>
                                <View style={[styles.container, styles.modalBackground]}>
                                    <View
                                        style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                        <Text>{this.state.modalText}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </Modal>   
                    </View>
                </SafeAreaView>
                }
                </SafeAreaView> 
            )
        }   
    }
}

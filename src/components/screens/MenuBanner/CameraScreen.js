import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { IMLocalized } from '../../../Core/localization/IMLocalization'

export default function CameraScreen({navigation, capturePhoto, disableCamera}) {
 const [hasPermission, setHasPermission] = useState(null);
 const [cameraRef, setCameraRef] = useState(null)
 const [type, setType] = useState(Camera.Constants.Type.back);
    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);
 
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
          Alert.alert("", IMLocalized("Please allow permission to access your camera"), [
            {
              text: "Cancel",
              onPress: () => disableCamera(),
              style: "cancel"
            },
            { text: "YES", onPress: () => disableCamera() }
          ]);
    }
    return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'gray' }}>
        <Camera 
        style={{ 
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width * 1.4
         }}
        type={type}
        focusDepth={0}
        ref={ref => {
        setCameraRef(ref);
        }} 
        //autoFocus='on'
        >
            <View
            style={{
            flex: 1,
           // backgroundColor: 'transparent',
            justifyContent: 'flex-end',
            }}>

            <TouchableOpacity
                    style={{
                    alignSelf: 'center',
                    marginRight: 150,
                    marginBottom: -37
                    }}
                    onPress={() => {
                        disableCamera()
                    }}>
                    {/*  <Text style= {{fontSize:18,marginBottom:10,color:'white'}}>Flip</Text> */}
                    <IconFeather name='arrow-left-circle' color='white' size={40} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                // flex: 1,
                    alignSelf: 'center',
                    marginLeft: 150,
                    marginBottom: -37
                    }}
                    onPress={() => {
                    setType(
                    type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                    );
                    }}>
                    {/*  <Text style= {{fontSize:18,marginBottom:10,color:'white'}}>Flip</Text> */}
                    <IconFeather name='refresh-ccw' color='white' size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'center', marginBottom: 20}} onPress={async() => {
                    if(cameraRef){
                        let options = {
                            skipProcessing:true
                        }
                        let photo = await cameraRef.takePictureAsync(options);
                        console.log('photo>>' + JSON.stringify(photo)); 
                        try{
                            ImagePicker.openCropper({
                                path: photo.uri,
                                width: 400,
                                height: 380,
                            }).then((image) => {
                                console.log("image return>>"+ JSON.stringify(image))
                                disableCamera()
                                capturePhoto(image)
                            })
                            .catch((err) => {
                                console.log("openCamera err>>" + JSON.stringify(err))
                            }) 
                        }   
                        catch(err){
                            console.log("Catch>>", err)
                        }
                    }
                    else{
                        console.log("no cameraref")
                    }

                    }}>
                    <View style={{ 
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: 'white',
                        height: 50,
                        width:50,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}}
                    >
                        <View style={{
                            borderWidth: 2,
                            borderRadius: 50,
                            borderColor: 'white',
                            height: 40,
                            width:40,
                            backgroundColor: 'white'}} >
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </Camera>
    </View>
 );
}
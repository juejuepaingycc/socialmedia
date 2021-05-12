
import React, { useState, useEffect } from 'react';
import { Text, Alert, ToastAndroid, BackHandler, ScrollView,
     View, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import AppStyles from '../../AppStyles';
import { useSelector } from 'react-redux';
import { TNActivityIndicator } from '../../Core/truly-native';
import styles from './styles';
import RNRestart from 'react-native-restart';
import { firebaseUser } from '../../Core/firebase';
import * as firebaseFriendship from '../../Core/socialgraph/friendships/firebase/friendship'

const BlockedUsersScreen = (props) => {

    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState()
    const currentUser = useSelector((state) => state.auth.user);
    const [toUser, setToUser] = useState({})

    useEffect(()=> {
        firebaseUser.getBlockedUsers(currentUser.id, setData)
    },[currentUser])

    const setData = (data) => {
        if(data == null || (data && data.length == 0)){
            setNoData(true);
        }
        else{
            setBlockedUsers(data);
        }
        setLoading(false);
    }

    const unBlock = (user) => {
        Alert.alert(
            '',
            IMLocalized('Are you sure you want to unblock this user?'),
            [
              { 
                text: IMLocalized('Cancel') ,
                style: 'cancel'
              },
              { 
                text: IMLocalized('OK'),
                onPress: () => {
                    setLoading(true);
                    firebaseUser.unblockUser(user.blockID, user.id, unblockedData)
                }
              }
          ]
          );
    }

    const unblockedData = async (result) => {
        if(result != null){
            //ToastAndroid.show(IMLocalized("Unblocked user"), ToastAndroid.SHORT
            let user = await firebaseUser.getUserData(result);
            setToUser(user);
            await firebaseFriendship.unfriend(
                currentUser.id,
                user.id,
                true,
                false,
                onSuccess,
              );
        }
        else{
            setLoading(false);
            Alert.alert('Error', IMLocalized("Something went wrong. Try again!"), [
                { text: IMLocalized('OK'), style: 'default' },
              ]);   
        }
    }

    const onSuccess = (res) => {
        firebaseFriendship.cancelFriendRequest(
            currentUser.id,
            res.id,
            true,
            false,
            onFinish
          );
    }

    const onFinish = () => {
        setLoading(false);
        RNRestart.Restart();
    }

    if(loading){
        return <TNActivityIndicator appStyles={AppStyles} />
    }
    else{
    return(
        <KeyboardAvoidingView style={styles.container}>
            <View>
            {
                noData ?
                <Text style={styles.error}>{IMLocalized('No Result Found')}</Text>
                :
                <ScrollView>
                <View style={{ flex: 1 }}>
                    {blockedUsers.length > 0 &&
                    blockedUsers.map((user) => (
                        <View style={styles.card}>
                            <View style={styles.block}>
                                <Image source={{uri: user.profilePictureURL}} style={styles.img} />
                                <View style={styles.rightView}>
                                    <Text style={styles.name}>{user.firstName}</Text>
                                    {/* <Text style={styles.time}>{unblockTimeFormat(user.createdAt)}</Text> */}
                                </View>
                                <TouchableOpacity style={styles.unblockView} onPress={()=> unBlock(user)}>
                                    <Text style={styles.unblock}>{IMLocalized('Unblock')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>       
                </ScrollView>
            }                                                                     
            </View>
        </KeyboardAvoidingView>
        )}
    }

export default BlockedUsersScreen;
          
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  ScrollView,
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,BackHandler,
  Image
} from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import { Colors, Scales } from '@common';
import styles from './contacts.styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Contacts from "react-native-contacts";
import Icon from 'react-native-vector-icons/Feather';
import AppStyles from '../../AppStyles'
import SendSMS from 'react-native-sms'

const ContactsScreen = (props) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [originalContacts, setOriginalContacts] = useState([])
  const [contactsBeforeSearch, setContactsBeforeSearch] = useState([])
  const [contactPage, setContactPage] = useState(0)
  const [moreLoading, setMoreLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    focusListener = props.navigation.addListener("didFocus", () => {
      console.log("didFocus...")
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      )
    });
  }, []);

  useEffect(()=> {
    willBlurSubscription = props.navigation.addListener('willBlur', () => {
      console.log("willBlur...")
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        )
        });
  }, [])

  onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      }).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = () => {
    Contacts.getAll((err, allcontacts) => {
      contacts.sort((a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase());
      if (err === "denied") {
        alert("Permission to access contacts was denied");
        console.warn("Permission to access contacts was denied");
      } else {
        let tempContacts = [];
        for(let i = 0; i <= allcontacts.length; i++){
          if(i == allcontacts.length){
            tempContacts.sort((a, b) => a.contactName.toLowerCase() > b.contactName.toLowerCase());
            //setContacts(tempContacts)
            setOriginalContacts(tempContacts);
            getContactWithPagination(tempContacts, 0);
          }
          else{
            for(let j=0;j<allcontacts[i].phoneNumbers.length;j++){
              let number = allcontacts[i].phoneNumbers[j].number.split(" ").join("");
              let obj = { contactName: allcontacts[i].displayName, phoneNumber: number };
              tempContacts.push(obj);
            }
          }
        }
      }
    });
  }

  
  const getContactWithPagination = (allcontacts, page) => {
    let start,end;
    setContactPage(page);
    if(page == 0){
      start = 0;
      end = 30;
    }
    else{
      let temp = page * 30;
      start = temp;
      end = temp + 30;
      if(end == allcontacts.length){
        setShowMore(false);
      }
    }
    let tempArr = allcontacts.slice(start, end);
    for(let i = 0; i<=tempArr.length;i++){
      if(i != tempArr.length){
        contacts.push(tempArr[i]);
      }
      else{
        setMoreLoading(false);
        setContacts(contacts);
        setContactsBeforeSearch(contacts);
      }
    }
  }

  const Contact = ({ item, chooseContact, goInvite }) => {
    return(
      <TouchableOpacity onPress={chooseContact} style={styles.contactView}>
        <Image source={require('../../assets/img/contact.png')} style={styles.image} />
        <View style={styles.nameView}>
          <Text style={styles.contactName}>{item.contactName}</Text>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.inviteView} onPress={goInvite}>
    <Text style={styles.invite}>{IMLocalized('Invite')}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  const renderFooter = () => {
    return (
      //Footer View with Load More button
 
      <View style={styles.footer}>
        {showMore?
        <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setMoreLoading(true);
          getContactWithPagination(originalContacts, contactPage+1);
        }}
        //On Click of button load more data
        style={styles.loadMoreBtn}>
        <Text style={styles.btnText2}>Load More...</Text>
        {moreLoading ? (
          <ActivityIndicator
            color="white"
            style={{marginLeft: 8}} />
        ) : null}
      </TouchableOpacity>
        :
        null}
      </View>
    );
  };

  const invite = (phoneNO) => {
    SendSMS.send({
      body: "Let's chat on Nine Chat. It's my main app for messaging and free calls.",
      recipients: [phoneNO],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true
  }, (completed, cancelled, error) => {

      console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

  });
  }

  return (
    <View style={{ marginBottom: 60 }}>
       {/* <InnerHeader
        iconLeft={'chevron-left'}
        title='Contacts'
        onLeftIconPress={() => {
          props.navigation.navigate('Chat')
        }}
      /> */}

      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white'
    }}>
        <TouchableOpacity onPress={()=> props.navigation.navigate('Chat')}>
          <Icon
                  name='arrow-left'
                  color='black'
                  size={Scales.moderateScale(23)}
                  style={{ marginLeft: 25 }}
                />
        </TouchableOpacity>

        <Text
        style={{
          fontFamily: AppStyles.customFonts.klavikaMedium,
          paddingLeft: 34,
          fontSize: 19
        }}
        >{IMLocalized('contact')}</Text>
      </View>

            <ScrollView showsVerticalScrollIndicator={false}
                 style={styles.contacts}
                 >

                <FlatList
                  data={contacts}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Contact item={item} goInvite={() => invite(item.phoneNumber)} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ListFooterComponent={renderFooter}
                  />
              </ScrollView>
      </View>
  );
};

export default ContactsScreen;

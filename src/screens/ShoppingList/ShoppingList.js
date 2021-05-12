import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, ScrollView, BackHandler } from 'react-native';
import InnerHeader from '../../components/ui/innerHeader';
import styles from './styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import PayMenuWithoutIcon from '../../components/ui/PayMenuWithoutIcon'
import { PayActivityIndicator } from '../../Core/truly-native'
import billManager from '../billManager'

const ShoppingList = (props) => {

  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);

  function backButtonHandler() {
    props.navigation.navigate('Home');
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(()=> {
    billManager.getShoppingList().then((response) => {
      if(response != null){
        setShoppingList(response)
      }
      setLoading(false);
     });
  })

  const pressShop = (shop) => {
    console.log("Shop>>" , shop);
    props.navigation.navigate('ShoppingTransfer', { data:{ AgentID: shop.AgentID }, shopping: true })
  } 

    return (
      <View style={{ flex: 1 }}>
        <InnerHeader
          iconLeft={'chevron-left'}
          title={IMLocalized('Pay to Shop')}
          onLeftIconPress={() => {
            props.navigation.navigate('Home');
          }}
        />
              {
                loading ?
                  <PayActivityIndicator />
                :
                <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
                  {
                      shoppingList.length > 0 ?
                      <ScrollView>
                        {
                          shoppingList.map((shop) => {
                            return <PayMenuWithoutIcon menu={shop.AName} pressMenu={() => pressShop(shop)} />
                          })
                        }
                      </ScrollView>
                      :
                      <Text style={styles.noresult}>{IMLocalized('No Result Found')}</Text>
                  }
                </KeyboardAvoidingView>
              }
      </View>
    );
};

export default ShoppingList;

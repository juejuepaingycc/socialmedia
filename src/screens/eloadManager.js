
import { links } from '../../StaticData/paymentData';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

  const checkPhoneNoValidation = (phoneNo, selectedOperator) => {
    let prefix = phoneNo.substring(0,4);
    let valid = false;
    console.log("Prefix>>" + prefix);
    if(selectedOperator == 'MPT'){
      if(
        (prefix == '0920' && phoneNo.length == 9) ||
        (prefix == '0921' && phoneNo.length == 9) ||
        (prefix == '0922' && phoneNo.length == 9) ||
        (prefix == '0923' && phoneNo.length == 9) ||
        (prefix == '0924' && phoneNo.length == 9) ||
        (prefix == '0925' && phoneNo.length == 11) ||
        (prefix == '0926' && phoneNo.length == 11) ||
        (prefix == '0940' && phoneNo.length == 11) ||
        (prefix == '0941' && phoneNo.length == 10) ||
        (prefix == '0942' && phoneNo.length == 11) ||
        (prefix == '0943' && phoneNo.length == 10) ||
        (prefix == '0944' && phoneNo.length == 11) ||
        (prefix == '0945' && phoneNo.length == 11) ||
        (prefix == '0947' && phoneNo.length == 10) ||
        (prefix == '0948' && phoneNo.length == 11) ||
        (prefix == '0949' && phoneNo.length == 10) ||
        (prefix == '0950' && phoneNo.length == 9) ||
        (prefix == '0951' && phoneNo.length == 9) ||
        (prefix == '0952' && phoneNo.length == 9) ||
        (prefix == '0953' && phoneNo.length == 9) ||
        (prefix == '0954' && phoneNo.length == 9) ||
        (prefix == '0955' && phoneNo.length == 9) ||
        (prefix == '0956' && phoneNo.length == 9) ||
        (prefix == '0973' && phoneNo.length == 10) ||
        (prefix == '0983' && phoneNo.length == 9) ||
        (prefix == '0985' && phoneNo.length == 9) ||
        (prefix == '0986' && phoneNo.length == 9) ||
        (prefix == '0987' && phoneNo.length == 9) ||
        (prefix == '0988' && phoneNo.length == 11) ||
        (prefix == '0989' && phoneNo.length == 11) ||
        (prefix == '0991' && phoneNo.length == 10)
      ){
        valid = true;
      }
    }
    else if(selectedOperator == 'OOREDOO'){
      if(
        (prefix == '0995' && phoneNo.length == 11) ||
        (prefix == '0996' && phoneNo.length == 11) ||
        (prefix == '0997' && phoneNo.length == 11) ||
        (prefix == '0998' && phoneNo.length == 11)
      ){
        valid = true;
      }
    }
    else if(selectedOperator == 'MECTEL'){
      if(
        (prefix == '0930' && phoneNo.length == 10) ||
        (prefix == '0931' && phoneNo.length == 10) ||
        (prefix == '0932' && phoneNo.length == 10) ||
        (prefix == '0933' && phoneNo.length == 10) ||
        (prefix == '0934' && phoneNo.length == 11) ||
        (prefix == '0935' && phoneNo.length == 11) ||
        (prefix == '0936' && phoneNo.length == 10)
      ){
        valid = true;
      }
    }
    else if(selectedOperator == 'TELENOR'){
      if(
        (prefix == '0975' && phoneNo.length == 11) ||
        (prefix == '0976' && phoneNo.length == 11) ||
        (prefix == '0977' && phoneNo.length == 11) ||
        (prefix == '0978' && phoneNo.length == 11) ||
        (prefix == '0979' && phoneNo.length == 11)
      ){
        valid = true;
      }
    }
    else if(selectedOperator == 'MYTEL'){
      if(
        (prefix == '0966' && phoneNo.length == 11) ||
        (prefix == '0967' && phoneNo.length == 11) ||
        (prefix == '0968' && phoneNo.length == 11) ||
        (prefix == '0969' && phoneNo.length == 11)
      ){
        valid = true;
      }
    }
    return valid; 
  }

  const buyCard = ( cardType, balanceType, currencyCode, orderNo, token ) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('cardType', cardType);
      formData.append('balanceType', balanceType);
      formData.append('currencyCode', currencyCode);
      formData.append('orderNo', orderNo);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');
      formData.append('token', 'Bearer ' + token);

      fetch(links.buyCardLink, {
          method: 'POST',
          body: formData
      }).then((response) => response.json())
          .then((responseData) => {
              console.log('buyCard responseData>>'+ JSON.stringify(responseData));
              resolve(responseData)
          })
          .catch(error => {
            console.log("buyCard error>>"+ JSON.stringify(error));
            resolve(null);
          });  });
  }

  const buyCard2 = ( cardType, balanceType, currencyCode, orderNo, token ) => {
    return new Promise((resolve) => {
    let details = {
      CardTypeSubCategoryCode: cardType,
      BalanceTypeCode: balanceType,
      CurrencyCode: currencyCode,
      OrderNumber: orderNo
  };

  let formBody = [];
  for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch(links.buyCardLink, {
      method: 'POST',
      headers: {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
  }).then((response) => response.json())
      .then((responseData) => {
          console.log('responseData>>'+ JSON.stringify(responseData));
          resolve(responseData)
      })
      .catch(error => {
        console.log("error>>"+ JSON.stringify(error));
        resolve(null);
      });  });
  }

  const eLOADTopUp = (phoneNo, amount, orderNo, token) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('PhoneNumber', phoneNo);
      formData.append('Amount', amount);
      formData.append('OrderNumber', orderNo);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');
      formData.append('token', 'Bearer ' + token);

      fetch(links.eLOADTopUpLink, {
          method: 'POST',
          body: formData
      }).then((response) => response.json())
          .then((responseData) => {
              console.log('eLOADTopUp responseData>>'+ JSON.stringify(responseData));
              resolve(responseData)
          })
          .catch(error => {
            console.log("eLOADTopUp error>>"+ JSON.stringify(error));
            resolve(null);
          });  });
  }

  const eLOADTopUp2 = (phoneNo, amount, orderNo, token) => {
    return new Promise((resolve) => {
    let details = {
      'PhoneNumber': phoneNo,
      'Amount': amount,
      'OrderNumber': orderNo
  };

  let formBody = [];
  for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch(links.eLOADTopUpLink, {
      method: 'POST',
      headers: {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Api-Key': 'yxvrB3OPLWbVTSA8zLVpwHDbMttnNnnSh3rO725k'
      },
      body: formBody
  }).then((response) => response.json())
      .then((responseData) => {
          console.log('responseData>>'+ JSON.stringify(responseData));
          resolve(responseData)
      })
      .catch(error => {
        console.log("error>>"+ JSON.stringify(error));
        resolve(null);
      });  });
  }

  const enquiryBalance = (token,) => {
    const balanceURL = links.enquiryBalanceLink;

    fetch(balanceURL, {
      method: 'post',
      headers: new Headers({
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    })
    .then((resp) => resp.json())
    .then(function(data) {
     console.log("enquiryBalance response>>"+ JSON.stringify(data));
        return data;
    })
    .catch(error => {
      console.log("enquiryBalance error>>"+ JSON.stringify(error));
      return null;
    });
  }

  
  const getBalance = (AgentID) => {
    return new Promise((resolve) => {
    const apiurl = links.apilink + 'ledger?_size=1&_sort=-LedgerID&_where=(from_account,eq,'+ AgentID +')';
    fetch(apiurl)
      .then((resp) => resp.json())
      .then(function (data) {
        if(data.length == 0){
          resolve(0);
        }
        else{
          resolve(data[0].Balance);
        }
      })
    });
  }

  const getPackageList = (token) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('page', 0);
      formData.append('token', 'Bearer ' + token);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');

      fetch(links.packageListLink, {
          method: 'POST',
          body: formData
      }).then((response) => response.json())
          .then((responseData) => {
              //console.log('getPackageList response>>'+ JSON.stringify(responseData));
              resolve(responseData);
      })
          .catch(error => {
            // console.log("getPackageList error>>"+ JSON.stringify(error));
            resolve(null);
      });
    });
  }

  const buyPackage = (phoneNo, PackageCode, orderNo, token) => {
    return new Promise((resolve) => {
    
      let formData = new FormData();
      formData.append('phoneNo', phoneNo);
      formData.append('PackageCode', PackageCode);
      formData.append('orderNo', orderNo);
      formData.append('token', 'Bearer ' + token);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');

    fetch(links.buyPackageLink, {
        method: 'POST',
        body: formData
    }).then((response) => response.json())
        .then((responseData) => {
            console.log('buyPackage response>>'+ JSON.stringify(responseData));
            resolve(responseData);
        })
        .catch(error => {
          console.log("buyPackage error>>"+ JSON.stringify(error));
          resolve(null);
        });
    });
  }

  const getToken = () => {
    return new Promise((resolve) => {
      const url = links.eLOADTokenLink;
      let formData = new FormData();
      formData.append('grant_type', 'password');
      formData.append('username', links.eLOADUserName);
      formData.append('Password', links.eLOADPassword);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');
      console.log("Form>", formData)
      fetch(url, { 
        method: "POST", 
        body: formData
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        if(response){
         // console.log("getToken response>>"+ JSON.stringify(response));
          resolve(response);
        }
        else{
          resolve(null);
        }
      })
      .catch(error => {
        console.log("getToken error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getEPINToken = () => {
    return new Promise((resolve) => {
      const url = links.ePINTokenLink;
      let formData = new FormData();
      formData.append('grant_type', 'password');
      formData.append('username', links.ePINUserName);
      formData.append('Password', links.ePINPassword);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');

      fetch(url, { 
        method: "POST", 
        body: formData
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        if(response){
          console.log("getEPINToken response>>"+ JSON.stringify(response));
          resolve(response);
        }
        else{
          resolve(null);
        }
      })
      .catch(error => {
        console.log("getEPINToken error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getEPINToken2 = (grant_type, username, Password) => {
    return new Promise((resolve) => {
      let details = {
        'grant_type': grant_type,
        'username': username,
        'Password': Password
    };
  
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  
    fetch(links.ePINTokenLink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then((response) => response.json())
        .then((responseData) => {
           // console.log('responseData'+ JSON.stringify(responseData));
            resolve(responseData);
        })
        .catch(error => {
          console.log("getToken error>>"+ JSON.stringify(error));
          resolve(null);
        });
    });
  }

  const insertLedgerForTopUp = (data) => {
    return new Promise((resolve) => {

    fetch(links.apilink + 'ledger', {
      method: "POST", 
      body: JSON.stringify(data), 
      headers: { 
          "Content-type": "application/json; charset=UTF-8"
      } 
    }).then((response) => response.json())
        .then((responseData) => {
         //   console.log('responseData'+ JSON.stringify(responseData));
            resolve(responseData);
        })
        .catch(error => {
          console.log("getToken error>>"+ JSON.stringify(error));
          resolve(null);
        });
    });
  }

  const enquiryTopUpTransaction = (orderNo, token) => {
    const enquiryURL = links.enquiryTopupLink;
    const data = {
      OrderNumber: orderNo
    };

    fetch(enquiryURL, {
      method: 'post',
      headers: new Headers({
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: JSON.stringify(data),
    })
    .then((resp) => resp.json())
    .then(function(data) {
     console.log("enquiryTopUp response>>"+ JSON.stringify(data));
      if(data.StatusCode == 200)
      {
        console.log("Topup transaction for order " + orderNo + " was successful");
        return true;
      }
      else{
        return false;
      }
    })
    .catch(error => {
      console.log("enquiryTopUpTransaction error>>"+ JSON.stringify(error));
      return false;
    });
  }

  const getSellingPriceOfCard = ( CardTypeSubCategoryCode, CurrencyCode, token) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('cardType', CardTypeSubCategoryCode);
      formData.append('currencyCode', CurrencyCode);
      formData.append('token', 'Bearer ' + token);
      formData.append('xapi', 'aFATAdwl3ZRhy0xVb4eLhMj1dLzbZeNNwwZr3Y7w');

      fetch(links.sellingPriceLink, { 
        method: "POST", 
        body: formData
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        if(response){
          console.log("getSellingPriceOfCard response>>"+ JSON.stringify(response));
          resolve(response);
        }
        else{
          resolve(null);
        }
      })
      .catch(error => {
        console.log("getSellingPriceOfCard error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }
  
  const enquiryEPinTransaction = (orderNo, token) => {
    const enquiryEPINURL = links.enquiryEPinLink;
    const data = {
      OrderNumber: orderNo
    };

    fetch(enquiryEPINURL, {
      method: 'post',
      headers: new Headers({
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: JSON.stringify(data),
    })
    .then((resp) => resp.json())
    .then(function(data) {
     console.log("enquiryEPinTransaction response>>"+ JSON.stringify(data));
      if(data.StatusCode == 200)
      {
        console.log("enquiryEPinTransaction transaction for order " + orderNo + " was successful");
        return true;
      }
      else{
        return false;
      }
    })
    .catch(error => {
      console.log("enquiryEPinTransaction error>>"+ JSON.stringify(error));
      return false;
    });
  }


const eloadManager = {
  checkPhoneNoValidation,
  enquiryBalance,
  getToken,
  buyCard,
  enquiryTopUpTransaction,
  enquiryEPinTransaction,
  getSellingPriceOfCard,
  getBalance,
  eLOADTopUp,
  getPackageList,
  buyPackage,
  getEPINToken,
  insertLedgerForTopUp
};

export default eloadManager;

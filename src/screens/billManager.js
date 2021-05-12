
import { links } from '../../StaticData/paymentData';
import axios from 'axios';

  const getAgentWithPhoneNo = (phoneNo) => {
    return new Promise((resolve) => {
      const url = links.apilink + "agentprofile?_where=(Contact_Phone,eq,"+ phoneNo +")";
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        //console.log("checkAgentWithPhoneNo response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("checkAgentWithPhoneNo error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getShoppingList = () => {
    return new Promise((resolve) => {
      const url = links.apilink + "agentprofile?_where=(Category,eq,S)";
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        //console.log("getShoppingList response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        console.log("getShoppingList error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const sendOTP = (link, phone) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('phone', phone);
      axios.post(link, formData)
      .then(response => {
        //console.log("sendOTP response>>"+ JSON.stringify(response));
        resolve(response);
     })
     .catch(err => {
      console.log("sendOTP error>>"+ JSON.stringify(err));
      resolve(null)
    });
  })
  }

  const confirmOTP = (phone, token) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('phone', phone);
      formData.append('token', token);
      axios.post(links.confirmOTPLink, formData)
      .then(response => {
        //console.log("confirmOTP response>>"+ JSON.stringify(response));
        resolve(response);
     })
     .catch(err => {
      console.log("confirmOTP error>>"+ JSON.stringify(err));
      resolve(null)
    });
    });
  }

  const getAllAgents = () => {
    return new Promise((resolve) => {
      const url = links.apilink + "agentprofile";
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
       // //console.log("checkAgentWithPhoneNo response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("checkAgentWithPhoneNo error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getAgentWithAgentID = (AgentID) => {
    return new Promise((resolve) => {
      const url = links.apilink + "agentprofile?_where=(AgentID,eq,"+ AgentID +")";
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        //console.log("getAgentWithAgentID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("getAgentWithAgentID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getBalanceWithAgentID = (AgentID) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_size=1&_sort=-LedgerID&_where=(from_account,eq,'+ AgentID +')';
            fetch(url)
              .then((resp) => resp.json())
              .then(function (data) {
        //console.log("getBalanceWithAgentID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("getBalanceWithAgentID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getBalanceHistoryWithAgentID = (AgentID) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_sort=-RegDate&_where=(from_account,eq,'+ AgentID +')';
            fetch(url)
              .then((resp) => resp.json())
              .then(function (data) {
        ////console.log("getBalanceHistoryWithAgentID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("getBalanceHistoryWithAgentID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getBalanceHistoryWithPagination = (AgentID, page, size) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_p=' + page + '&_size=' + size + '&_sort=-LedgerID&_where=(from_account,eq,'+ AgentID +')';

      fetch(url)
              .then((resp) => resp.json())
              .then(function (data) {
        //console.log("getBalanceHistoryWithAgentID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("getBalanceHistoryWithAgentID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const insertUserLog = (data, tableName) => {
    return new Promise((resolve) => {
      const url = links.apilink + tableName;
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        //console.log("insertUserLog response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        console.log("insertUserLog error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getRecentContacts = (latesetLedger) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'agentprofile?_where=(AgentID,in,'+ latesetLedger[0] + ',' + latesetLedger[0] + ',' + latesetLedger[1] + ',' + latesetLedger[2] + ',' + latesetLedger[3] + ',' + latesetLedger[4] + ')';
      fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        if(data && data.length > 0){     
          resolve(data); 
        }
        else{
          resolve(null); 
        }
      })
      .catch(error => {
        console.log("getRecentContacts error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getRecentTransferLedger = (AgentID, size) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_size=' + size + '&_sort=-LedgerID&_where=(from_account,eq,'+ AgentID +')~and(Service_Code,eq,9990302)';
      fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        if(data && data.length > 0){     
          resolve(data); 
        }
        else{
          resolve(null); 
        }
      })
      .catch(error => {
        console.log("getRecentLedger error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getBalanceHistoryWithPaginationAndDateRange = (AgentID, page, size, startDate, endDate) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_p=' + page + '&_size=' + size + '&_sort=-LedgerID&_where=((from_account,eq,'+ AgentID +')~and(RegDate,gte,'+ startDate +')~and(RegDate,lte,'+ endDate +'))';
      fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        //console.log("getBalanceHistoryWithAgentID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        //console.log("getBalanceHistoryWithAgentID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getLatestTransferID = () => {
    return new Promise((resolve) => {
      const url = links.apilink + 'transfer?_size=1&_sort=-transfer_id';
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        //console.log("getLatestTransferID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        console.log("getLatestTransferID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getLatestUserLogID = (tableName) => {
    return new Promise((resolve) => {
      const url = links.apilink + tableName + '?_size=1&_sort=-id';
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        console.log("getLatestUserLogID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        console.log("getLatestUserLogID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getLatestLogIDOfUser = (id, tableName) => {
    return new Promise((resolve) => {
      const url = links.apilink + tableName + "?_size=1&_sort=-id&_where=(user_id,eq,"+ id +")";
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        console.log("getLatestLogIDOfUser response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        console.log("getLatestLogIDOfUser error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const getLatestLedgerID = () => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger?_size=1&_sort=-LedgerID';
      fetch(url) 
      .then((resp) => resp.json())
      .then(function(data) {
        //console.log("getLatestLedgerID response>>"+ JSON.stringify(data));
        resolve(data); 
      })
      .catch(error => {
        console.log("getLatestLedgerID error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const insertIntoTransfer = (data) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'transfer';
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        //console.log("transferBill response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        //console.log("transferBill error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const transferBill2 = (data, url) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('RegDate', data.RegDate);
      formData.append('from_account', data.from_account);
      formData.append('to_account', data.to_account);
      formData.append('description', data.description);
      formData.append('out_amount', data.out_amount);
      formData.append('reference', data.reference);
      formData.append('from_phone', data.from_phone);
      formData.append('to_phone', data.to_phone);
      formData.append('ServiceCode', data.ServiceCode);
      formData.append('OperatorType', data.OperatorType);
      formData.append('OperatorPackage', data.OperatorPackage);
      formData.append('SellingPrice', data.SellingPrice);
      
      axios.post(url, formData)
      .then(response => {
        console.log("transferBill2 response>>"+ JSON.stringify(response));
        resolve(response);
     })
     .catch(err => {
      console.log("transferBill2 error>>"+ JSON.stringify(err));
      resolve(null)
    });
  })
  }

  const transferBill = (data, url) => {
    return new Promise((resolve) => {
      let formData = new FormData();
      formData.append('RegDate', data.RegDate);
      formData.append('from_account', data.from_account);
      formData.append('to_account', data.to_account);
      formData.append('description', data.description);
      formData.append('out_amount', data.out_amount);
      formData.append('reference', data.reference);
      formData.append('from_phone', data.from_phone);
      formData.append('to_phone', data.to_phone);
      
      axios.post(url, formData)
      .then(response => {
        console.log("transferBill response>>"+ JSON.stringify(response));
        resolve(response);
     })
     .catch(err => {
      console.log("transferBill error>>"+ JSON.stringify(err));
      resolve(null)
    });
  })
  }

  const oldTransferBill = (data) => {
    return new Promise((resolve) => {
      const url = links.apilink + 'ledger';
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        //console.log("transferBill response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        //console.log("transferBill error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const changePassword = (ID, newPassword) => {
    return new Promise((resolve) => {
      const pwURL = links.apilink + 'agentprofile/' + ID;
      
      fetch(pwURL, {
        method: 'PATCH',
        body: JSON.stringify({
          "Password": newPassword
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((resp) => resp.json())
      .then(function(response) {
        //console.log("changePassword response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        //console.log("changePassword error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  const updateUserLog = (ID, time, tableName) => {
    return new Promise((resolve) => {
      let url = links.apilink + tableName + '/' + ID;
      console.log("URL>>"+ url);
      let data = {
        logout_time: time
      }
      fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((resp) => resp.json())
      .then(function(response) {
        console.log("updateUserLog response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        console.log("updateUserLog error>>"+ JSON.stringify(error));
        resolve(null);
      });
    })
  }

  const updateAgentProfile = (ID, token, last_login_time, noti_count, ban, ban_date) => {
    return new Promise((resolve) => {
      const pwURL = links.apilink + 'agentprofile/' + ID;
      let data = {};
      if(token != null){
        data['push_token'] = token;
      }
      if(last_login_time != null)
      {
        data['last_login'] = last_login_time;
      }
      if(noti_count != null){
        data['noti_count'] = noti_count;
      }
      if(ban != null){
        data['ban'] = ban;
        data['ban_date'] = ban_date;
      }
      //console.log("update AgentData>>"+ JSON.stringify(data));
      fetch(pwURL, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then((resp) => resp.json())
      .then(function(response) {
        console.log("updateAgentProfile response>>"+ JSON.stringify(response));
        resolve(response); 
      })
      .catch(error => {
        console.log("updateAgentProfile error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

const billManager = {
  getAgentWithPhoneNo,
  sendOTP,
  confirmOTP,
  getBalanceWithAgentID,
  getLatestLedgerID,
  getLatestTransferID,
  transferBill,
  getBalanceHistoryWithAgentID,
  getBalanceHistoryWithPaginationAndDateRange,
  getAgentWithAgentID,
  getBalanceHistoryWithPagination,
  getShoppingList,
  changePassword,
  updateAgentProfile,
  getAllAgents,
  updateUserLog,
  insertIntoTransfer,
  getLatestUserLogID,
  transferBill2,
  insertUserLog,
  getLatestLogIDOfUser,
  getRecentTransferLedger,
  getRecentContacts
};

export default billManager;

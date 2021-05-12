import moment from 'moment';

export const chatTimeFormat = (timeStamp) => {
  if (timeStamp) {
    let res = {
      date: '',
      time: ''
    }
    if (moment(timeStamp).isValid()) {
      return '';
    }
    if (moment().diff(moment.unix(timeStamp.seconds), 'days') == 0) {

      if(moment.unix(timeStamp.seconds).format('D') == new Date().getDate()){
        res.date = 'Today';
        res.time = moment.unix(timeStamp.seconds).format('hh:mm A');
        return res;
      }
      else{
        res.date = 'Yesterday';
        res.time = moment.unix(timeStamp.seconds).format('hh:mm A');
        return res;
      }
    }
    let diff = moment.unix(timeStamp.seconds).fromNow();
    let arr = diff.split(' ');
    let day = arr[0];
    if (day == 1) {
      res.date = 'Yesterday';
      res.time = moment.unix(timeStamp.seconds).format('hh:mm A');
      return res;
    }
    else{
      res.date = moment.unix(timeStamp.seconds).format('DD MMM YYYY');
      res.time = moment.unix(timeStamp.seconds).format('hh:mm A');
      return res;
    }
  }
  else{
    return '';
  }
};

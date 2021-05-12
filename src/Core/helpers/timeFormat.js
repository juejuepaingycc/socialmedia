import moment from 'moment';

export const timeFormat = (timeStamp) => {
  if (timeStamp) {
    
    //console.log("TS>>"+ moment.unix(timeStamp.seconds).format('MMM Do  YYYY'))
    if (moment(timeStamp).isValid()) {
      return '';
    }
    if (moment().diff(moment.unix(timeStamp.seconds), 'days') == 0) {
      if(moment.unix(timeStamp.seconds).format('D') == new Date().getDate()){
        return moment.unix(timeStamp.seconds).format('hh:mm A');
      }
      else{
        return "a day ago at " + moment.unix(timeStamp.seconds).format('hh:mm A');
      }
    }

    let diff = moment.unix(timeStamp.seconds).fromNow();
    let arr = diff.split(' ');
    let day = arr[0];
    if(diff == 'a day ago'){
      return "a day ago at " + moment.unix(timeStamp.seconds).format('hh:mm A');
    }
    else if (day <= 6) {
      return moment.unix(timeStamp.seconds).fromNow() + " at " + moment.unix(timeStamp.seconds).format('hh:mm A');
    }
    else{
      return moment.unix(timeStamp.seconds).format('DD MMM YYYY') + " at " + moment.unix(timeStamp.seconds).format('hh:mm A');
    }
  }
  return ' ';
};

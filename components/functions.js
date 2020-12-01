function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + a.getMonth() + '/' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  function getDate(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var date = a.getDate();
    var time = date + '/' + a.getMonth() + '/' + year ;
    return time;
  }

  function getHour(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    if(min.toString().length == 1){
        min = '0'+min;
    }
    var time = hour + ':' + min ;
    return time;
  }

  export {
    timeConverter, getDate, getHour
};
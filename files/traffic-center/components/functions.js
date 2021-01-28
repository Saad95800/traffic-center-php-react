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

  function checkPassword(pwd){
    let error = false;
    let msg = '';
    let csp = ['À','Á','Â','Ã','Ä',',','Å','Æ','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Œ','Š','þ','Ù','Ú','Û','Ü','Ý','Ÿ','à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô','õ','ö','ø','œ','š','Þ','ù','ú','û','ü','ý','ÿ','¢','ß','¥','£','™','©','®','ª','×','÷','±','²','³','¼','½','¾','µ','¿','¶','·','¸','º','°','¯','§','…','¤','¦','≠','¬','ˆ','¨','‰'];
    if(typeof pwd == 'string'){
      if(pwd.length > 5){
        for (let cs of csp){
          if(pwd.indexOf(cs) != -1){
            error = true;
            msg = 'Les caractères spéciaux sont interdits';
            break;
          }
        }        
      }else{
        error = true;
        msg = 'Le mot de passe doit faire au moins 6 caratères';  
      }

    }else{
      error = true;
      msg = 'Le format du mot de passe est incorrect';
    }
    if(error == true){
      return [false, msg];
    }
    return true;
  }

  export {
    timeConverter, 
    getDate, 
    getHour, 
    checkPassword
};
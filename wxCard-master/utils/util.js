function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function imgObToList(n,path) {
  var list = new Array();
  if (Array.isArray(n)) {
    for (var i = 0; i < n.length; i++) {
      
      list.push(path + encodeURI(n[i].path + n[i].name));
    }
  }
  return list;
}
function imgObToListWithIndex(n, path) {
  var list = new Array();
  if (Array.isArray(n)) {
    for (var i = 0; i < n.length; i++) {
      var obj ={
        src: path + encodeURI(n[i].path + n[i].name),
        index: i
      }
      list.push(obj);
    }
  }
  return list;
}
function imgObToListDeleteCover(n, path) {
  var list = new Array();
  if (Array.isArray(n)) {
    for (var i = 0; i < n.length; i++) {
      if (n[i].isCover == 'N' || n[i].isCover == null){
        list.push(path + encodeURI(n[i].path + n[i].name));
      }
      
    }
  }
  return list;
}
function imgObToListWithIndexDeleteCover(n, path) {
  var list = new Array();
  
  if (Array.isArray(n)) {
    for (var i = 0; i < n.length; i++) {
      if (n[i].isCover == 'N' || n[i].isCover==null) {
        let checkIcon='';
        switch (n[i].pass){
          case '0':{
            checkIcon ='/images/0a_WPass.png';
            break;
          }
          case '1': {
            checkIcon = '/images/0a_Pass.png';
            break;
          }
          case '2': {
            checkIcon = '/images/0a_NPass.png';
            break;
          }

        }
      var obj = {
        src: path + encodeURI(n[i].path + n[i].name),
        index: i,
        checkIcon: checkIcon
      }
      list.push(obj);
      }
    }
  }
  return list;
}
module.exports = {
  imgObToList: imgObToList,
  imgObToListWithIndex: imgObToListWithIndex,
  imgObToListDeleteCover:imgObToListDeleteCover,
  imgObToListWithIndexDeleteCover: imgObToListWithIndexDeleteCover,
  formatTime: formatTime
}

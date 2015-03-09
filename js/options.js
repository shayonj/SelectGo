chrome.storage.sync.get('selectStatus', function (obj) {
  var status = obj.selectStatus;
  console.log(status);
  $("#"+status).prop( "checked", true );
});
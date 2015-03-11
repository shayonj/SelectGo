chrome.storage.sync.get('selectStatus', function (obj) {
  var status = obj.selectStatus["select"];
  console.log(status);
  $("#"+status).prop( "checked", true );
});

chrome.storage.sync.get('selectStatus', function (obj) {
  var status = obj.selectStatus["tab"];
  console.log(status);
  $("#"+status).prop( "checked", true );
});

$(document).ready(function(){
  $("#versionNum").append("v"+chrome.runtime.getManifest().version);
});
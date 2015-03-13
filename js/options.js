chrome.storage.sync.get('selectStatus', function (obj) {
  var status = obj.selectStatus["select"];
  $("#"+status).prop( "checked", true );
});

chrome.storage.sync.get('selectStatus', function (obj) {
  var status = obj.selectStatus["tab"];
  $("#"+status).prop( "checked", true );
});

$(document).ready(function(){
  // Version number for the footer
  $("#versionNum").append("v"+chrome.runtime.getManifest().version);
  
  // Trigger action on option select settings change
  $("#generalOptionSave").click(function() {
    generalOptionChanges();
  });
});

function addAlert() {
  $("#showAlert").html("<div class=\"alert alert-success\" role=\"alert\">Changes Updated.</div>");
}

// Update select status to local storage API
function generalOptionChanges() {
  var selectStatus = $("input[name='generalOptionVal']:checked").val();
  var tabStatus = $("input[name='addOptionVal']:checked").val();

  chrome.storage.sync.set({'selectStatus': {"select": selectStatus, "tab": tabStatus}}, function() {
    addAlert();
  });
}
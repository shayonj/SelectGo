if(!window.SelectGo){
  SelectGo = {};
}

SelectGo.Selector = {};
SelectGo.Selector.getSelected = function(){
  var text = '';
  if(window.getSelection){
    text = window.getSelection().toString();
  }else if(document.selection){
    text = document.selection.createRange().text;
  }else if(document.getSelection){
    text = document.getSelection().toString();
  }
  return text;
}

SelectGo.Selector.mouseup = function(){
  var text = SelectGo.Selector.getSelected();
  if(text!=''){
    // Get current user defined status set in the storage
    chrome.storage.sync.get('selectStatus', function (obj) {
      // then send the status and text to background
      chrome.runtime.sendMessage({
        status: obj.selectStatus,
        text: text
      });
    });
  }
}

//  Things to do with a document ready function
$(document).ready(function(){
  // Run the text selector on mouseup
  $(document).on("mouseup", SelectGo.Selector.mouseup);

  // Trigger action on option select settings change
  $("#generalOptionSave").click(function() {
    generalOptionChanges();
  });

  // Trigger additional options settings change
  $("#additionalOptionSave").click(function() {
    additionalOptionChanges();
  });

});

function addAlert() {
  $("#showAlert").html("<div class=\"alert alert-success\" role=\"alert\">Changes Updated.</div>");
}

// Update select status to local storage API
function generalOptionChanges() {
  var selectStatus = $("input[name='generalOptionVal']:checked").val();
  
  chrome.storage.sync.set({'selectStatus': selectStatus}, function() {
    addAlert();
    console.log(selectStatus);
  });
}

// Update url open check status to local storage API
function additionalOptionChanges() {
  var urlOpenCheckSatus = $("#urlOpenCheck").is(':checked');

  if(urlOpenCheckSatus){
    chrome.storage.sync.set({'urlOpenCheck': true}, function() {
      addAlert();
      console.log("true");
    });
  } else {
    chrome.storage.sync.set({'urlOpenCheck': false}, function() {
      addAlert();
      console.log("false");
    });
  }
}


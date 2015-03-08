if(!window.SelectGo){
  SelectGo = {};
}

SelectGo.Selector = {};
SelectGo.Selector.getSelected = function(){
  var selection = window.getSelection();
  // Grab the selected text
  var text = selection.toString();
  var id = Math.random().toString(36).substring(7); // Creating random unique id
  // Grab the range of the selection
  var range = selection.getRangeAt(0);
  // Wrap selected text with a span id for pop up
  if(range && text.length > 1){ // Add new node only if something is actually selected
    var newNode = document.createElement("span");
    newNode.setAttribute('id', id);
    range.surroundContents(newNode);
    var content = '<button id="optionBoxCopy" class="btn">Copy</button> | <a href="#" id="optionBoxSearch">Search</a> | <a href="#" id="optionBoxCopy">Ignore (ESC Key)</a>';
    $('#'+id).webuiPopover({placement:'auto',content: content,closeable:true, trigger: "click"});
  }
  return [text, id];
}

SelectGo.Selector.mouseup = function(){
  var sel = SelectGo.Selector.getSelected();
  var text = sel[0];
  var id = sel[1];
  if(text!=''){
    // Get current user defined status set in the storage
    chrome.storage.sync.get('selectStatus', function (obj) {

      if(obj.selectStatus == "optionOnly"){
        // Fire up the popover
        $("#"+id).click();

        // Trigger copy action
        $("#optionBoxCopy").click(function() {
          chrome.runtime.sendMessage({
            status: "clipboardOnly",
            text: text
          });
          disablePopup(id);
        });

        // Trigger Search action
        $("#optionBoxSearch").click(function() {
          chrome.runtime.sendMessage({
            status: "searchOnly",
            text: text
          });
          disablePopup(id);
        });

      } else {
        // Then send the status and text to background
        chrome.runtime.sendMessage({
          status: obj.selectStatus,
          text: text,
          id: id
        });
      }

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

function disablePopup(id){
  $('#'+id).webuiPopover("destroy");
}


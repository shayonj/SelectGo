if(!window.SelectGo){
  SelectGo = {};
}
SelectGo.Selector = {};

SelectGo.Selector.getSelected = function(){
  // Grab Selection
  var selection = window.getSelection();

  var text = selection.toString();
  var id = Math.random().toString(36).substring(7); // Creating random unique id

  if(text.length > !selection.isCollapsed){ // Add new node only if something is actually selected
    var range =  selection.getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.setAttribute('id', id);

    //Insert node for the pop up
    range.insertNode(newNode);
    // Create unique content for each popover
    var content = '<img id="optionBoxCopy'+id+'" style="padding-right:10px" src="chrome-extension://fkaaimpndomdmhfllgemcdondpbilpfo/img/copy.png"/> <img id="optionBoxSearch'+id+'" src="chrome-extension://fkaaimpndomdmhfllgemcdondpbilpfo/img/link.png" />';
    $('#'+id).webuiPopover({placement:'auto',content: content, width: 170, closeable:true, trigger: "click"});
  }
  return [text, id, selection];
}

SelectGo.Selector.mouseup = function(){
  var sel = SelectGo.Selector.getSelected();
  var text = sel[0];
  var id = sel[1];
  if(text!=''){
    // Get current user defined status set in the storage
    chrome.storage.sync.get('selectStatus', function (obj) {
      // Set default status to clipboardOnly if no status found
      if(obj.selectStatus == null){
        chrome.storage.sync.set({'selectStatus': "clipboardOnly"}, function() {
          console.log("clipboardOnly");
        });
      }

      // Then send the status and text to background
      chrome.runtime.sendMessage({
        status: obj.selectStatus,
        text: text,
        id: id
      });

      // Listen for calls from background. Specifically for option box
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if(request.type == "showOptionBox") {

            // Fire up the popover
            $("#"+id).click();
            // Remove selection
            window.getSelection().empty();

            // Trigger copy action
            $("#optionBoxCopy"+id).click(function() {
              chrome.runtime.sendMessage({
                status: "clipboardOnly",
                text: text
              });
              $(".webui-popover").remove();
              // disablePopup(id);
            });

            // Trigger Search action
            $("#optionBoxSearch"+id).click(function() {
              chrome.runtime.sendMessage({
                status: "searchOnly",
                text: text
              });
              disablePopup(id);
            });

            // As title suggests. Ignore
            $("#ignore").click(function() {
              disablePopup(id);
            });
          }
        });

    });
  }
}

//  Things to do with a document ready function
$(document).ready(function(){
  // Run the text selector on mouseup
  // $(document).selection.empty();
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


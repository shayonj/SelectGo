chrome.storage.sync.get('selectStatus', function (obj) {
  if(obj.selectStatus == null){
    chrome.storage.sync.set({'selectStatus': "clipboardOnly"}, function() {
      console.log("SelectGo Setup done.")
    });
  }
});

chrome.runtime.onMessage.addListener(function(request) {
  var status = request.status;
  var text = request.text;

  // Run actions based on current status set in storage
  if(status == "clipboardOnly") {
    copyText(text);
  } else if(status == "searchOnly") {
    runSearch(text);
  } else if(status == "copySearchOnly") {
    copyText(text);
    runSearch(text);
  } else if(status == "optionOnly"){
    showOptionBox(text);
  }

});

function copyText(text) {
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}

function runSearch(t) {
  var text = t.replace(/ /g,"+");
  var newURL = "https://www.google.com/?gws_rd=ssl#q=" + text;
  chrome.tabs.create({ url: newURL });
}

function showOptionBox(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "showOptionBox"}, function(response) {
      // Do something here?
    });
  });
}

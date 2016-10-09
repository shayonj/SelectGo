/*
 Three Status Types/Hash key-value pair for selectStatus

selectStatus :
  select :
    * clipboardOnly
    * searchOnly
    * copySearchOnly
    * optionOnly
  tab :
    * dontChangeTab
    * changeTab
  input :
    * dontSelectText
    * selectText
  highlight :
    * highlightText
    * dontHighlightText
*/

chrome.storage.sync.get('selectStatus', function (obj) {
  if(obj.selectStatus == null || obj.selectStatus && obj.selectStatus["select"] == null){
    chrome.storage.sync.set({ 'selectStatus': {"select": "clipboardOnly", "tab": "dontChangeTab", "input": "dontSelectText", "highlight": "dontHighlightText"} }, function() {
      console.log("SelectGo Setup done.")
    });
  }
  if(obj.selectStatus == null || obj.selectStatus && obj.selectStatus["input"] == null){
    chrome.storage.sync.set({ 'selectStatus': {"select": obj.selectStatus["select"], "tab": obj.selectStatus["tab"], "input": "dontSelectText", "highlight": obj.selectStatus["highlight"]} }, function() {
      console.log("SelectGo Setup done.")
    });
  }
  if(obj.selectStatus == null || obj.selectStatus && obj.selectStatus["highlight"] == null){
    chrome.storage.sync.set({ 'selectStatus': {"select": obj.selectStatus["select"], "tab": obj.selectStatus["tab"], "input": obj.selectStatus["input"], "highlight": "dontHighlightText"} }, function() {
      console.log("SelectGo Setup done.")
    });
  }
});

chrome.runtime.onMessage.addListener(function(request) {
  var selectStatus = request.status["select"];
  var tabStatus = request.status["tab"]
  var highlightStatus = request.status["highlight"]
  var text = request.text;
  // Run actions based on current status set in storage
  if(selectStatus == "clipboardOnly") {
    copyText(text);
  } else if(selectStatus == "searchOnly") {
    runSearch(text, tabStatus);
  } else if(selectStatus == "copySearchOnly") {
    copyText(text);
    runSearch(text, tabStatus);
  } else if(selectStatus == "optionOnly"){
    showOptionBox(text);
  }

  if (highlightStatus == "highlightText") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: highlightStatus});
    });
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

function runSearch(t, tabStatus) {
  var text = t.replace(/ /g,"+");
  var newURL = "https://www.google.com/?gws_rd=ssl#q=" + text;
  if(tabStatus == "dontChangeTab"){
    chrome.tabs.create({url: newURL, selected: false}, function(tab) {});
  }else {
    chrome.tabs.create({url: newURL}, function(tab) {});
  }
}

function showOptionBox(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "showOptionBox"}, function(response) {
      // Do something here?
    });
  });
}

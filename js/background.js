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
  } else if(status == "optionOnly") {
    showOptionBox(text);
  } else if(status == "pause") {
    // Do nothing for now, because status is set to pause. Maybe handle pause behavior some other way?
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
  
}

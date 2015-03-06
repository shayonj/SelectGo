chrome.runtime.onMessage.addListener(function(request) {
  // Open Tab
  if (request && request.type == "tab" && request.text != "") {
    var text = request.text.replace(/ /g,"+");
    var newURL = "https://www.google.com/?gws_rd=ssl#q=" + text;
    chrome.tabs.create({ url: newURL });
  }

  // Copy to clipboard
  if (request && request.type == 'copy') {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = request.text;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
  }

});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
    'Old value was "%s", new value is "%s".',
    key,
    namespace,
    storageChange.oldValue,
    storageChange.newValue);
  }
});


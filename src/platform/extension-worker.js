// Toolbar action opens the bundled full-tab workspace; no tabs/history/host permission needed.
// Multiple open tabs are guarded against stale writes by encrypted storage compare-and-swap.
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({url:chrome.runtime.getURL('index.html')});
});

// Chrome/Firefox compatibility shim
const browserApi = typeof chrome !== "undefined" ? chrome : browser;

// In MV3, use action.onClicked instead of browserAction
browserApi.action.onClicked.addListener(handleIconClick);

function handleIconClick(tab) {
    console.log("Worlde Helper clicked!");
    browserApi.tabs.sendMessage(tab.id, {
        command: "getSuggestions|5"
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("cant send msg to script", chrome.runtime.lastError);
        }
    });
}
// clicked on extension
browser.browserAction.onClicked.addListener(handleIconClick);

function handleIconClick(tab){
    console.log("Worlde Helper clicked!");

    browser.tabs.sendMessage(tab.id, {
        command : "getSuggestions|5"
    }).catch(error => {
        console.error("cant send msg to script", error);
    })
}
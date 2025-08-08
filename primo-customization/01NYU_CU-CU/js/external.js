/* Event handler
   used in html/prm-brief-result-after.html 
*/
function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
}


function injectScriptTagForChatWidget() {
    const COOPER_UNION_CHAT_WIDGET_LOADER_URL = 'https://cooper.libanswers.com/load_chat.php?hash=348801bb326eba314a7204d7663bd50be83f1ede5f5cdfbe82126b466e98ddcfe';

    const scriptElement = document.createElement( 'script' );
    scriptElement.setAttribute( 'src', COOPER_UNION_CHAT_WIDGET_LOADER_URL );
    document.body.appendChild( scriptElement )
}

injectScriptTagForChatWidget();

// Option 2 from:
//     https://thirdiron.atlassian.net/wiki/spaces/BrowZineAPIDocs/pages/79200260/Ex+Libris+Primo+Integration

function configureAndInjectLibKey() {
// Begin BrowZine - Primo Integration...
    window.browzine = {
        api   : 'https://public-api.thirdiron.com/public/v1/libraries/177',
        apiKey: '4997c984-6148-41db-a3d4-f1dc44c5602a',

        journalCoverImagesEnabled: true,

        journalBrowZineWebLinkTextEnabled: true,
        journalBrowZineWebLinkText       : 'View Journal Contents',

        articleBrowZineWebLinkTextEnabled: true,
        articleBrowZineWebLinkText       : 'View Issue Contents',

        articlePDFDownloadLinkEnabled: true,
        articlePDFDownloadLinkText   : 'Download PDF',

        articleLinkEnabled: true,
        articleLinkText   : 'Read Article',

        printRecordsIntegrationEnabled: true,
        showFormatChoice              : true,
        showLinkResolverLink          : true,
        enableLinkOptimizer           : true,

        articleRetractionWatchEnabled: true,
        articleRetractionWatchText   : 'Retracted Article',

        // See https://nyu-lib.monday.com/boards/765008773/pulses/4770873703/posts/2283414551
        // for details on `unpaywallEmailAddressKey`.
        unpaywallEmailAddressKey                               : 'fakeuser@nyu.edu',
        articlePDFDownloadViaUnpaywallEnabled                  : true,
        articlePDFDownloadViaUnpaywallText                     : 'Download PDF (via Unpaywall)',
        articleLinkViaUnpaywallEnabled                         : true,
        articleLinkViaUnpaywallText                            : 'Read Article (via Unpaywall)',
        articleAcceptedManuscriptPDFViaUnpaywallEnabled        : true,
        articleAcceptedManuscriptPDFViaUnpaywallText           : 'Download PDF (Accepted Manuscript via Unpaywall)',
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
        articleAcceptedManuscriptArticleLinkViaUnpaywallText   : 'Read Article (Accepted Manuscript via Unpaywall)',
    };

    browzine.script = document.createElement( 'script' );
    browzine.script.src = 'https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js';
    document.head.appendChild( browzine.script );
}

configureAndInjectLibKey();

function findingAidsLinkClickHandler(event) {
    event.stopPropagation();
}

(function(){
  // determine cdnUrl from current script src
  const customScriptUrl = document.currentScript.src;
  const cdnUrl = customScriptUrl.replace("js/custom.js",'');
  console.log("[DEBUG] REMOTE cdnUrl = " + cdnUrl);
  
  // thanks to https://stackoverflow.com/a/53601942
  function documentReady( func ) {
    // if early to the DOM
    document.addEventListener("DOMContentLoaded", func);
    // if late to the DOM
    if (document.readyState === "interactive" || document.readyState === "complete" ) {
      func();
    }
  }
  
  documentReady(function() {
    // load homepage from CDN
    fetch(`${ cdnUrl }/html/additional/homepage_en.html`)
      .then(function(response){ return response.text(); })
      .then(function(text){ 
        document.querySelector("prm-search md-content prm-static").innerHTML = text;
      });
  });
})();

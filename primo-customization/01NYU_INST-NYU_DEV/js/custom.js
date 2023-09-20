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

// CDN base URL utilities pulled from view package code, since these functions aren't available outside it
// https://github.com/NYULibraries/primo-customization/blob/7081043696143453dbe7caadd238ed0b40ec77ce/custom/00_common/js/01-config.js
const searchParams = new URLSearchParams( window.location.search );
const vid = searchParams.get( 'vid' );
const cdnUrl = getCdnUrl( vid );

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}

function getCdnUrl( vid ) {
    const cdnUrls = {
        '01NYU_INST:NYU'     : 'https://cdn.library.nyu.edu/primo-customization',
        '01NYU_INST:NYU_DEV' : 'https://cdn-dev.library.nyu.edu/primo-customization',
        '01NYU_INST:TESTWS01': 'https://cdn-dev.library.nyu.edu/primo-customization',
    }

    const hostname = window.location.hostname;
    const view = parseViewDirectoryName( vid );

    let baseUrl;
    if ( hostname === 'localhost' ) {
        baseUrl = 'http://localhost:3000/primo-customization';
    } else if ( hostname === 'sandbox02-na.primo.exlibrisgroup.com' ) {
        baseUrl = 'https://d290kawcj1dea9.cloudfront.net/primo-customization';
    } else if ( hostname === 'primo-explore-devenv' ) {
        // Running in the headless browser in the Docker Compose `e2e` service.
        baseUrl = 'http://cdn-server:3000/primo-customization';
    } else {
        baseUrl = cdnUrls[ vid ] ||
                  cdnUrls[ '01NYU_INST:NYU' ];
    }

    return `${ baseUrl }/${ view }`;
}

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
      document.querySelector("prm-search md-content").innerHTML = text;
    });
});

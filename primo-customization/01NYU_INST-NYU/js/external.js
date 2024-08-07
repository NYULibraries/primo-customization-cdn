// =============================================================================
// BEGIN NYU SHARED SECTION
// =============================================================================
//
// Code in this section is identical across all dev and prod NYU views,
// including Abu Dhabi and Shanghai views, but not including the 01NYU_INST test
// view.
// All code changes that need to happen in functionality defined in this
// section should be done and tested in a single NYU view and then copied
// to all other NYU views.  Currently, dev views are merely symlinks to their
// prod counterparts, so this effectively means that code edits should be
// done and tested in a single NYU prod view and then copied to the other NYU
// prod views.
// =============================================================================

// Option 2 from:
//     https://thirdiron.atlassian.net/wiki/spaces/BrowZineAPIDocs/pages/79200260/Ex+Libris+Primo+Integration
function configureAndInjectLibKey() {
// Begin BrowZine - Primo Integration...
    window.browzine = {
        api    : 'https://public-api.thirdiron.com/public/v1/libraries/177',
        apiKey : '4997c984-6148-41db-a3d4-f1dc44c5602a',

        journalCoverImagesEnabled : true,

        journalBrowZineWebLinkTextEnabled : true,
        journalBrowZineWebLinkText        : 'View Journal Contents',

        articleBrowZineWebLinkTextEnabled : true,
        articleBrowZineWebLinkText        : 'View Issue Contents',

        articlePDFDownloadLinkEnabled : true,
        articlePDFDownloadLinkText    : 'Download PDF',

        articleLinkEnabled : true,
        articleLinkText    : 'Read Article',

        printRecordsIntegrationEnabled : true,
        showFormatChoice               : true,
        showLinkResolverLink           : true,
        enableLinkOptimizer            : true,

        articleRetractionWatchEnabled : true,
        articleRetractionWatchText    : 'Retracted Article',

        // See https://nyu-lib.monday.com/boards/765008773/pulses/4770873703/posts/2283414551
        // for details on `unpaywallEmailAddressKey`.
        unpaywallEmailAddressKey                                : 'fakeuser@nyu.edu',
        articlePDFDownloadViaUnpaywallEnabled                   : true,
        articlePDFDownloadViaUnpaywallText                      : 'Download PDF (via Unpaywall)',
        articleLinkViaUnpaywallEnabled                          : true,
        articleLinkViaUnpaywallText                             : 'Read Article (via Unpaywall)',
        articleAcceptedManuscriptPDFViaUnpaywallEnabled         : true,
        articleAcceptedManuscriptPDFViaUnpaywallText            : 'Download PDF (Accepted Manuscript via Unpaywall)',
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled : true,
        articleAcceptedManuscriptArticleLinkViaUnpaywallText    : 'Read Article (Accepted Manuscript via Unpaywall)',
    };

    browzine.script = document.createElement( 'script' );
    browzine.script.src = 'https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js';
    document.head.appendChild( browzine.script );
}

function insertChatWidgetEmbed() {
    // Always use prod URL for all views.
    const CHATWIDGET_EMBED_PROD_URL =
        'https://cdn.library.nyu.edu/chatwidget-embed/index.min.js';
    const scriptTag = document.createElement( 'script' );
    scriptTag.setAttribute( 'src', CHATWIDGET_EMBED_PROD_URL );
    document.body.appendChild( scriptTag )
}

// out-of-the-box script except for siteId var
function injectMatomo( siteId ) {
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push( [ 'trackPageView' ] );
    _paq.push( [ 'enableLinkTracking' ] );
    (
        function () {
            var u = 'https://nyulib.matomo.cloud/';
            _paq.push( [ 'setTrackerUrl', u + 'matomo.php' ] );
            _paq.push( [ 'setSiteId', siteId ] );
            var d = document, g = d.createElement( 'script' ),
                s = d.getElementsByTagName( 'script' )[ 0 ];
            g.async = true;
            g.src = '//cdn.matomo.cloud/nyulib.matomo.cloud/matomo.js';
            s.parentNode.insertBefore( g, s );
        }
    )();
}

function injectStatusEmbed() {
    // Always use prod URL for all views:
    // https://nyu-lib.monday.com/boards/765008773/pulses/5525193850/posts/2571053345
    const STATUS_EMBED_PROD_URL =
        'https://cdn.library.nyu.edu/statuspage-embed/index.min.js';
    const scriptTag = document.createElement( 'script' );
    scriptTag.setAttribute( 'src', STATUS_EMBED_PROD_URL );
    document.body.appendChild( scriptTag )
}

// This function has been made identical for all NYU views in order to make the
// custom JS file as pseudo-DRY as possible, allowing us to make changes to one
// view's JS file and simply copy it as-is into the other views.  Toward this
// end, we need a full map of vids to Matomo siteIds, even though technically
// each view only needs to know about its own 2-3 siteIds.
function installMatomo() {
    // Source:
    //     "Matomo JS Tracking Codes for Primo VE NYU Views"
    //     https://docs.google.com/document/d/1Rmmn1q7zNJxm-Ps0uyxbZ1o_GH4YY8hSUFUgQF9AgmU/edit#heading=h.ovisp1bygp5s
    const SITE_ID = {
        '01NYU_AD:AD'     : '7',
        '01NYU_AD:AD_DEV' : '10',

        '01NYU_INST:NYU'     : '6',
        '01NYU_INST:NYU_DEV' : '9',

        '01NYU_US:SH'     : '8',
        '01NYU_US:SH_DEV' : '11',
    }

    // if we're on localhost or primo-explore-devenv, don't install
    if ( location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'primo-explore-devenv' ) {
        return;
    }

    const siteId = SITE_ID[ vid ];
    if ( !siteId ) {
        console.error( `[ERROR] No siteId found for vid=${ vid }` );
        return;
    }

    console.log( '[DEBUG] matomo siteId = ' + siteId );

    injectMatomo( siteId );
}

// ****************************************
// Customize home page
// ****************************************

const homePageElementTagName = 'prm-static';

function createMutationObserver( homePageHtml ) {
    const callback = ( mutationList, observer ) => {
        for ( const mutation of mutationList ) {
            if ( mutation.type === 'childList' ) {
                setHomePageHtml( mutation.addedNodes[ 0 ], homePageHtml );

                observer.disconnect();
            }
        }
    };

    const homePageElement = document.querySelector( homePageElementTagName );
    const config = { childList : true };

    const observer = new MutationObserver( callback );
    observer.observe( homePageElement, config );
}

async function customizeHomePage() {
    const homePageHtml = await getHomePageHtml();
    if ( ! homePageHtml ) {
        console.error( '[ERROR] customizeHomePage() was called without `homePageHtml`' );

        return;
    }

    // Get the <div> within the rendered home page component.  It may or may not have
    // been created yet.
    const homePageDivElement = getHomePageDivElement();

    if ( homePageDivElement ) {
        // Home page component has been rendered.  This will usually be the case if
        // the page is cached.
        console.log( '[DEBUG] Home page <div> already created, customize immediately' );
        setHomePageHtml( homePageDivElement, homePageHtml );
    } else {
        // Home page component has not rendered yet.  This will often be the case if
        // not loading the page from cache.
        console.log( '[DEBUG] Home page <div> not created yet, create MutationObserver' );
        createMutationObserver( homePageHtml );
    }
}

function getHomePageDivElement() {
    return document.querySelector( `${ homePageElementTagName } div` );
}

async function getHomePageHtml() {
    // See note in Main section about duplicating the package repo `vid` and
    // `view` code here in the CDN repo.  Here we need `view` to construct
    // the CDN base URL for the view and hence for the home page HTML file.
    // An alternate method for getting the HTML file URL would be to remove
    // the part of the path leading up from this file to the common ancestor
    // directory for the HTML files.  This method seems to be more transparent,
    // and might be less brittle than having to know the name of this file
    // for path suffix removal.
    const view = vid.replace( ':', '-' );
    console.log( '[DEBUG] view = ' + view );

    const currentScriptUrl = new URL( document.currentScript.src );
    const cdnBaseUrlForView = `${ currentScriptUrl.origin }/primo-customization/${ view }`;
    const homePageHtmlFile = `${ cdnBaseUrlForView }/html/_static/homepage_en-external.html`;
    console.log( `[DEBUG] homePageHtmlFile = ${ homePageHtmlFile }` );

    let response;
    try {
        response = await fetch( homePageHtmlFile );

        // check if response ok (i.e. status 2xx): fetch does NOT throw error
        // if response received with error status
        if (response.ok)
            return response.text();
        else
            console.error( `[ERROR] Fetch of ${ homePageHtmlFile }: ${ response.status }` );
    } catch ( error ) {
        console.error( `[ERROR] Fetch of ${ homePageHtmlFile }: ${ error }` );
    }
}

function setHomePageHtml( homePageDivElement, homePageHtml ) {
    homePageDivElement.innerHTML = homePageHtml;
}

// ****************************************
// Event handlers
// ****************************************

// used in html/prm-brief-result-after.html
function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
}

// ****************************************
// MAIN
// ****************************************

const vid =
    new URLSearchParams( window.location.search )
        .get( 'vid' );
console.log( '[DEBUG] vid = ' + vid );

configureAndInjectLibKey();
insertChatWidgetEmbed();
injectStatusEmbed();
installMatomo();
customizeHomePage();

// =============================================================================
// END NYU SHARED SECTION
// =============================================================================
//
// All code after this point should be potentially unique to this view,
// and should NOT be copied indiscriminately to the other views.
// =============================================================================


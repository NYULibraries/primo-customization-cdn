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

    // determine vid from querystring
    // note that this will fail in IE 11 and Opera Mini: https://caniuse.com/urlsearchparams
    const vid =
        new URLSearchParams( window.location.search )
            .get( 'vid' );
    console.log( '[DEBUG] vid = ' + vid );

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

function customizeHomePage( homePageHtml ) {
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
        console.log( `[DEBUG] Home page <div> not created yet, create MutationObserver` );
        createMutationObserver( homePageHtml );
    }
}

function getHomePageDivElement() {
    return document.querySelector( `${ homePageElementTagName } div` );
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

configureAndInjectLibKey();
insertChatWidgetEmbed();
injectStatusEmbed();
installMatomo();
customizeHomePage( getHomePageHtml() );

// =============================================================================
// END NYU SHARED SECTION
// =============================================================================
//
// All code after this point should be potentially unique to this view,
// and should NOT be copied indiscriminately to the other views.
// =============================================================================

// ++++++++++++++++++++++++++++++++++++++++
// Home page
// ++++++++++++++++++++++++++++++++++++++++

// In order to have the view-specific home page HTML be defined after the NYU
// shared code section, it needs to be in a function.  If we declare it as a
// `const`, we'll get a "can't use `homePageHtml` before it's
// initialized" ReferenceError when we try to pass it as an argument to
// `customizeHomePage` above.  Likewise, attempting to use it as a global const
// by removing `homePageHtml` and referencing it directly within each function
// that needs it will only work if a MutationObserver is created, because the
// callback runs after the `homePageHtml` is initialized.  In the case where
// a MutationObserver is not created because the home page div already exists,
// we'll get the ReferenceError.
function getHomePageHtml() {
    return `<md-content layout-xs="column" layout="row" class="_md md-primoExplore-theme layout-xs-column layout-row">
    <div flex="60" layout="column" class="layout-column flex-60">
        <!---Harmful Language Card--->
        <md-card class="default-card _md md-primoExplore-theme" data-cy="home-harmful-language">
            <md-card-title>
                <md-card-title-text>
                    <h2 class="md-headline">Help Us! Replace Harmful Language and Outdated Subject Headings in the
                        Catalog</h2>
                </md-card-title-text>
            </md-card-title>
            <md-card-content>
                <p>NYU Libraries has launched the <a href="https://tinyurl.com/nyu-lib-changing-the-subject"
                        target="_blank" class="md-primoExplore-theme">Changing the
                        Subject project (Google Doc)</a> to remove harmful and outdated subject headings in our
                    catalog.</p>
                <p><b><a href="https://tinyurl.com/nyu-lib-harmful-language-form" target="_blank"
                            class="md-primoExplore-theme">Report harmful language via the online form</a>, or
                        through the "Provide Feedback" link in the submenu of every page in the catalog.</b></p>
            </md-card-content>
        </md-card>

        <!---Collection Access Card--->
        <md-card class="default-card _md md-primoExplore-theme" data-cy="home-collections-access">
            <md-card-title>
                <md-card-title-text>
                    <h2 class="md-headline">Collections Access</h2>
                </md-card-title-text>
            </md-card-title>
            <md-card-content>
                <ul class="no-bullet">
                    <li><b>In-person access to library stacks:</b> If an item says "Available" in one of our
                        libraries, you may get items directly from the stacks (does not include "Offsite" items).
                    </li>
                    <li>Requesting for locker pick-up, delivery, or digital scan is available, but may not be your
                        fastest option. For details, visit the <a
                            href="https://library.nyu.edu/nyu-returns/collections-access/" target="_blank"
                            class="md-primoExplore-theme">Collections Access page</a>.</li>
                </ul>
                <h3 class="md-subhead">What option should I choose?</h3>
                <ul>
                    <li><b>If you need your item today</b> and it is "Available" in the catalog, you can go directly
                        to the stacks and get the item off the shelf. <a
                            href="https://library.nyu.edu/about/collections/search-collections/call-numbers/"
                            target="_blank" class="md-primoExplore-theme">Use our maps to help navigate the
                            stacks</a>.</li>
                    <li><b>If you can wait 3-5 days</b>, request locker pick-up.</li>
                    <li>If there is no digital version and you do not need the full item, request a scan of 1-2
                        chapters. </li>
                </ul>
            </md-card-content>
        </md-card>

        <!---Need Help? Card--->
        <md-card class="default-card _md md-primoExplore-theme" data-cy="home-need-help">
            <md-card-title>
                <md-card-title-text>
                    <h2 class="md-headline">Need Help?</h2>
                </md-card-title-text>
            </md-card-title>
            <md-card-content>
                <p>Use <a href="https://library.nyu.edu/ask/" target="_blank" class="md-primoExplore-theme">Ask A
                        Librarian</a> or the "Chat with Us" icon at the bottom right corner for any question you
                    have about the Libraries' services.</p>
                <p>Visit our <a href="https://guides.nyu.edu/online-tutorials/finding-sources" target="_blank"
                        class="md-primoExplore-theme">online tutorials</a> for tips on searching the catalog and
                    getting library resources.</p>
                <h3 class="md-subhead">Additional Resources</h3>
                <ul>
                    <li>Use <a href="https://ezborrow.reshare.indexdata.com/" target="_blank"
                            class="md-primoExplore-theme">EZBorrow</a> or <a
                            href="https://library.nyu.edu/services/borrowing/from-non-nyu-libraries/interlibrary-loan/"
                            target="_blank" class="md-primoExplore-theme">InterLibrary Loan (ILL)</a> for materials
                        unavailable at NYU</li>
                    <li>Discover subject specific resources using <a href="http://guides.nyu.edu" target="_blank"
                            class="md-primoExplore-theme">expert curated research guides</a></li>
                    <li>Explore the <a href="https://library.nyu.edu/services/" target="_blank"
                            class="md-primoExplore-theme">complete list of library services</a></li>
                    <li>Reach out to the Libraries on <a href="https://www.instagram.com/nyulibraries/" target="_blank"
                            class="md-primoExplore-theme">our Instagram</a></li>
                    <li>Search <a href="https://www.worldcat.org/search?qt=worldcat_org_all" target="_blank"
                            class="md-primoExplore-theme">WorldCat</a> for items in nearby libraries</li>
                </ul>
            </md-card-content>
        </md-card>





    </div>
    <div flex-xs="" flex="40" layout="column" class="layout-column flex-xs flex-40">
        <!---Using the Catalog Card--->
        <md-card class="default-card _md md-primoExplore-theme">
            <md-card-title>
                <md-card-title-text>
                    <h2 class="md-headline">Using the Catalog</h2>
                </md-card-title-text>
            </md-card-title>
            <md-card-content>
                <h3 class="md-subhead">What is in Books &amp; More?</h3>
                <p>Using the search bar on this page, you can find:</p>
                <ul>
                    <li>books / e-books</li>
                    <li>journals / e-journals</li>
                    <li>videos and sound recordings</li>
                    <li>offsite materials</li>
                    <li>special collections</li>
                </ul>
                <h3 class="md-subhead">Tools to help with your search:</h3>
                <ul>
                    <li><a href="https://guides.nyu.edu/online-tutorials/finding-sources#s-lg-box-25062803"
                            target="_blank" class="md-primoExplore-theme">online tutorials for using the catalog</a>
                    </li>
                    <li><a href="/discovery/jsearch?vid=01NYU_INST:TESTWS01"
                            class="md-primoExplore-theme">browse journals by title</a></li>
                    <li><a href="/discovery/citationlinker?vid=01NYU_INST:TESTWS01"
                            class="md-primoExplore-theme">find an article by citation</a></li>
                </ul>
                <p>Resources are across all of NYU’s New York and global libraries.</p>
                <h3 class="md-subhead">Looking for Articles or Databases?</h3>
                <p>Use the Articles &amp; Databases tab to find:</p>
                <ul class="bottom-margin">
                    <li>articles from multidisciplinary databases</li>
                    <li>databases by title or by subject area</li>
                </ul>
                <div>
                    <p>Note: For these resources, you must use the Articles &amp; Databases tab, and <b>not</b> the
                        search bar on this screen.</p>
                </div>
            </md-card-content>
        </md-card>
    </div>
</md-content>
`}

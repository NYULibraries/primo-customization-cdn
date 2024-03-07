// ****************************************
// Customize home page
// ****************************************

const homePageHtml =
    `<md-content layout-xs="column" layout="row" class="_md md-primoExplore-theme layout-xs-column layout-row">
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
`;

const homePageElementTagName = 'prm-static';

function createMutationObserver( homePageDivElement ) {
    const callback = ( mutationList, observer ) => {
        for ( const mutation of mutationList ) {
            if ( mutation.type === 'childList' ) {
                customizeHomePage( mutation.addedNodes[ 0 ] );

                observer.disconnect();
            }
        }
    };

    const homePageElement = document.querySelector( homePageElementTagName );
    const config = { childList : true };

    const observer = new MutationObserver( callback );
    observer.observe( homePageElement, config );
}

function customizeHomePage( homePageDivElement ) {
    homePageDivElement.innerHTML = homePageHtml;
}

function getHomePageDivElement() {
    return document.querySelector( `${ homePageElementTagName } div` );
}

// Get the <div> within the rendered home page component.  It may or may not have
// been created yet.
const homePageDivElement = getHomePageDivElement();

if ( homePageDivElement ) {
    // Home page component has been rendered.  This will usually be the case if
    // the page is cached.
    console.log( '[DEBUG] Home page <div> already created, customize immediately' );
    customizeHomePage( homePageDivElement );
} else {
    // Home page component has not rendered yet.  This will often be the case if
    // not loading the page from cache.
    console.log( `[DEBUG] Home page <div> not created yet, create MutationObserver` );
    createMutationObserver();
}

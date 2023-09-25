function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
}

// CDN base URL utilities pulled from view package code, since these functions aren't available outside it
// https://github.com/NYULibraries/primo-customization/blob/7081043696143453dbe7caadd238ed0b40ec77ce/custom/00_common/js/01-config.js
const searchParams = new URLSearchParams( window.location.search );
const vid = searchParams.get( 'vid' );
const cdnUrl = getCdnUrl();

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}

function getCdnUrl() {
    return document.querySelector( '#cdn-url' ).textContent;
}

// thanks to https://stackoverflow.com/a/53601942
function documentReady( func ) {
    // if early to the DOM
    document.addEventListener( 'DOMContentLoaded', func );
    // if late to the DOM
    if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
        func();
    }
}

documentReady( function () {
    // load homepage from CDN
    fetch( `${ cdnUrl }/html/additional/homepage_en.html` )
        .then( function ( response ) {
            return response.text();
        } )
        .then( function ( text ) {
            document.querySelector( 'prm-search md-content' ).innerHTML = text;
        } );
} );

function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
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

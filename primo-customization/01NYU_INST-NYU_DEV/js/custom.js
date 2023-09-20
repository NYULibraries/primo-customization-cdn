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

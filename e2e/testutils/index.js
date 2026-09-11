// Define the allowed values for VIEW
const allowedVids = [
    '01NYU_AD:AD',
    '01NYU_AD:AD_DEV',
    '01NYU_CU:CU',
    '01NYU_CU:CU_DEV',
    '01NYU_INST:NYU',
    '01NYU_INST:NYU_DEV',
    '01NYU_NYHS:NYHS',
    '01NYU_NYHS:NYHS_DEV',
    '01NYU_NYSID:NYSID',
    '01NYU_NYSID:NYSID_DEV',
    '01NYU_US:SH',
    '01NYU_US:SH_DEV',
  ];

// Define "default" scopes for views
// These scopes are NOT the defaults in Primo VE but rather
// contain all results at NYU (default for NYU-NY, not others)
const scopesForViews = {
    '01NYU_INST:NYU':'CI_NYU_CONSORTIA',
    '01NYU_INST:NYU_DEV':'CI_NYU_CONSORTIA',
    '01NYU_AD:AD':'CI_NYUAD_NYU',
    '01NYU_AD:AD_DEV':'CI_NYUAD_NYU',
    '01NYU_US:SH':'CI_NYUSH_NYU_CONSORTIA',
    '01NYU_US:SH_DEV':'CI_NYUSH_NYU_CONSORTIA',
}

function setPathAndQueryVid( pathAndQuery, vid ) {
    if ( !allowedVids.includes( vid ) ) {
      throw new Error(`The provided vid value '${vid}' is not allowed.`);
    }

    let result = pathAndQuery.replace( 'vid=[VID]', `vid=${vid}` );
    
    const scope = scopesForViews[vid];
    if (scope) {
        result = result.replace( 'search_scope=[SCOPE]', `search_scope=${scope}` );
    }

    return result;
  }


function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES?.toLowerCase() === 'true';
}

function removeSourceMappingUrlComments(html) {
    const regex = new RegExp( '/\\*#\\ssourceMappingURL=\\s*\\S+\\s\\*\\/', 'g' );

    return html.replace( regex, '/* E2E TEST EDIT: sourceMappingURL comments elided */' );
  }

module.exports = {
    removeSourceMappingUrlComments,
    setPathAndQueryVid,
    updateGoldenFiles
};


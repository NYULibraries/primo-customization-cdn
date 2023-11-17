const view = process.env.VIEW;
const vid = view.replaceAll('-', ':');

const viewQueryMap = {
    '01NYU_AD-AD': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=default_slot&search_scope=CI_NYUAD_NYU&offset=0`,
    '01NYU_AD-AD_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=default_slot&search_scope=CI_NYUAD_NYU&offset=0`,
    '01NYU_CU-CU': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=LibraryCatalog&search_scope=MyInstitution&offset=0`,
    '01NYU_CU-CU_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=LibraryCatalog&search_scope=MyInstitution&offset=0`,
    '01NYU_INST-NYU': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0`,
    '01NYU_INST-NYU_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0`,
    '01NYU_INST-TESTWS01': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0`,
    '01NYU_NYHS-NYHS': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=unified_slot&search_scope=MyInstitution&offset=0`,
    '01NYU_NYHS-NYHS_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=unified_slot&search_scope=MyInstitution&offset=0`,
    '01NYU_NYSID-NYSID': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=LibraryCatalog&search_scope=MyInstitution&offset=0`,
    '01NYU_NYSID-NYSID_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=LibraryCatalog&search_scope=MyInstitution&offset=0`,
    '01NYU_US-SH': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=default_slot&search_scope=CI_NYUSH_NYU&offset=0`,
    '01NYU_US-SH_DEV': `query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=default_slot&search_scope=CI_NYUSH_NYU&offset=0`,
};

// This function gets the query string for the current view or throws an error if the view is not found.
function getQueryStringForView(view) {
    const queryString = viewQueryMap[view];
    if (!queryString) {
        throw new Error(`Query string not defined for view: ${view}`);
    }
    return queryString;
}

function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
        process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

export {
    getQueryStringForView,
    updateGoldenFiles
};

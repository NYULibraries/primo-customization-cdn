const view = process.env.VIEW;

function setPathAndQueryVid( pathAndQuery, vid ) {
    return pathAndQuery.replace( 'vid=[VID]', `vid=${ vid }` );
}

function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
        process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

export {
    setPathAndQueryVid,
    updateGoldenFiles,
};

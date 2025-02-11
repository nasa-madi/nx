import pkg from 'lodash';
const { set, get } = pkg;


/*******************************
 * MERGING
 *******************************/
function setDeltaProp(delta, deltaParentPath, response, concatenatedPaths, index, key) {
    const deltaProp = delta[key];
    const newConcatPaths = concatenatedPaths.map((v) => v.replace('[*]', `[${index}]`));
    const currentProp = get(response, deltaParentPath);

    if (Array.isArray(deltaProp)) {
        deltaProp.forEach(({ index, ...rest }) => {
            Object.keys(rest).forEach(key =>
                setDeltaProp(rest, `${deltaParentPath}[${index}].${key}`, response, newConcatPaths, index, key));
        });
    } else if (deltaProp && newConcatPaths.includes(deltaParentPath)) {
        set(response, deltaParentPath, (currentProp || '') + deltaProp);
    } else if (deltaProp !== null && typeof deltaProp === 'object') {
        Object.keys(deltaProp).forEach(key =>
            setDeltaProp(deltaProp, `${deltaParentPath}.${key}`, response, newConcatPaths, index, key));
    } else {
        set(response, deltaParentPath, deltaProp);
    }
}

export function handleDeltas(object, response, deltaPaths, concatenatedPaths) {
    const delta = get(object, deltaPaths[0]);
    const deltaParentPath = deltaPaths[0].slice(0, -6);

    if (delta) {
        Object.keys(delta).forEach(key => setDeltaProp(delta, `${deltaParentPath}.${key}`, response, concatenatedPaths, 0, key));
    }
    return response
}
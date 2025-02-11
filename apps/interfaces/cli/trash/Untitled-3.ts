

/*******************************
 * MERGING
 *******************************/
export function mergeDelta(deltaObj, parentKey, response, concatenatedFields = []) {
    const { index, delta = {} } = deltaObj;

    const parentArray = getProperty(response, parentKey) || [];
    let objectToUpdate = parentArray[index] || {};

    for (let key in delta) {
        if (concatenatedFields.includes(key) && objectToUpdate[key]) {
            objectToUpdate[key] += delta[key];
        } else {
            objectToUpdate[key] = delta[key];
        }
    }
    parentArray[index] = objectToUpdate;
    setProperty(response, parentKey, parentArray);
}

export function handleDeltas(object, response, parentKey = '', concatenatedFields = []) {
    if (object?.delta) {
        mergeDelta(object, parentKey, response, concatenatedFields);
    }

    for (let key in object) {
        const newParentKey = parentKey ? `${parentKey}[${key}]` : key; 
        // Important to include square brackets around the key in the path to work well with dot prop getter

        if (Array.isArray(object[key])) {
            for (let [index, obj] of object[key].entries()){ 
                // Addition of .entries() ensures that only objects inside the array get iterated and nested attributes within get processed accurately.
                const newKey = `${newParentKey}.${index}`; 
                // Use . instead of [] to create new key for dot prop getter to work properly

                if(obj.delta){
                    mergeDelta(obj, newKey, response, concatenatedFields);
                }

                if (typeof obj === 'object') {
                  handleDeltas(obj, response, newKey, concatenatedFields);
                }
            }
        } else if (typeof object[key] === 'object') {
            handleDeltas(object[key], response, newParentKey, concatenatedFields);
        }
    }
}

for (const chunk of chunks) {
    let deltaPath = `choices[${chunk.index}]`;
    let tool_callsPath = `${deltaPath}.tool_calls`;
    if(chunk?.delta){
        handleDeltas(chunk, response, deltaPath, ['content']);
    }
    if(chunk?.delta?.tool_calls){
        chunk?.delta?.tool_calls?.forEach((tc,i) => {
            if(tc?.function?.arguments) {
                handleDeltas(tc, response, `${tool_callsPath}[${i}]`, ['arguments'])
            }
        });
    }
}
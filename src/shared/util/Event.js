const _listeners = [];
let countListeners = -1;

/**
 * @param {string} name
 * @param {() => void} callback
 * @returns {number} - event listener ID
 */
function on(name, callback) {
    const id = countListeners++;
    _listeners.push({ name, callback, id });
    return id;
}

function submit(name, data) {
    for (const listener of _listeners) {
        if (listener.name !== name) continue;
        listener.callback(data);
    }
}

function off(id) {
    const index = _listeners.findIndex(listener => listener.id === id);
    if (index === -1) return;
    _listeners.splice(index, 1);
}

module.exports = { on, submit, off };
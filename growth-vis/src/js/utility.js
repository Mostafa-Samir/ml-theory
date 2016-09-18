'use strict';

/**
 * A vanilla alternative for jQuery's $(document).ready
 * @param {function} handler - the event handler
*/
function onDOMReady(handler) {
    if (document.readyState !== "loading") {
        handler()
    }
    else{
        document.addEventListener('DOMContentLoaded', handler);
    }
}

/**
 * takes a crazy floating-point number with a lot of trainling 0s or 9s
 * and returns a proper one with the desired percision
 * @param {Number} num - the crazy float to be put in proper form
 * @param {Number} percision - the proper form's desired percision
 * @return {Number} - the proper float
*/
function properFloat(num, percision) {
    let proper = num.toFixed(percision);
    return parseFloat(proper);
}

export {onDOMReady, properFloat};

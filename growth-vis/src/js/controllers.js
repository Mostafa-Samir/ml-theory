'use strict';

import { datasets } from './datasets';
import { Visualization } from './visualization';
import * as utility from './utility';

// Object containing the hypotheses and the dichotmies encountered so far
// during auto or manual scanning of the hypothesis space
let scanReport = {
    dichotmies: {},
    hypotheses: {}
};

/**
 * updates the counters associated with the UI controls and reports
*/
function updateCounters() {
    let size = document.querySelector("#datset-size").value;
    let slope = document.querySelector("#line-slope").value;
    let intercept = document.querySelector("#line-intercept").value;

    document.querySelector("#dataset-size-display").innerHTML = size;
    document.querySelector("#line-slope-display").innerHTML = slope;
    document.querySelector("#line-intercept-display").innerHTML = intercept;

    let hypothesesCount = Object.keys(scanReport.hypotheses).length;
    let uniqueHypothesesCount = Object.keys(scanReport.dichotmies).length;
    let uniquePercentage = (uniqueHypothesesCount * 100 / hypothesesCount).toFixed(2);

    document.querySelector("#hypotheses-count").innerHTML = hypothesesCount;
    document.querySelector("#unique-hypotheses-count").innerHTML = uniqueHypothesesCount;
    document.querySelector("#unique-percentage").innerHTML = uniquePercentage;
}

/**
 * handles and reflects any changes in UI inputs in the visualization
 * @param {Boolean} noRender - supresses the plot rendering if true
*/
function inputChangeHandler(noRender) {

    let size = parseInt(document.querySelector("#datset-size").value);
    let slope = parseFloat(document.querySelector("#line-slope").value);
    let intercept = parseFloat(document.querySelector("#line-intercept").value);

    let ds = datasets.get(size);

    let bluePoints = {x: [], y: []};
    let redPoints = {x: [], y: []};
    let boundaryLine = { x: [-1, 1], y: [intercept - slope, intercept + slope] };
    let dichotemy = [];

    for(let k = 0; k < size; ++k) {
        let cX = ds.x[k];
        let cY  = ds.y[k];
        let container = null, label = null;

        if(cY >= slope * cX + intercept) {
            container = bluePoints;
            label = "+1";
        }
        else {
            container = redPoints;
            label = "-1";
        }

        container.x.push(cX);
        container.y.push(cY);
        dichotemy.push(label);
    }

    scanReport.hypotheses[slope + "," + intercept] = true;
    scanReport.dichotmies[dichotemy.join(",")] = true;

    if(noRender !== true) {
        let vis = new Visualization();

        vis.addBluePoints(bluePoints);
        vis.addRedPoints(redPoints);
        vis.addBoundaryPoints(boundaryLine);
        vis.render();
    }

    updateCounters();
}

/**
 * runs an automatic scan over the defined hypothesis space to count unique dichotmies
 * @param {function} callback: a function to be called when scan is complete
*/
function autoScan(callback) {
    let slope = {min: -6, max: 6, step:0.1};
    let intercept = {min: -6, max:6, step:0.1};

    let iterator = (cSlope, cIntercept) => {
        let userStopped = document.querySelector("#auto-vis").dataset.state  === "paused";
        let terminate = false;
        if(userStopped || (cSlope === slope.max && cIntercept === intercept.max)) {
            terminate = true;
        }

        let hCount = Object.keys(scanReport.hypotheses).length;
        let forceRender = !document.querySelector("#no-render").checked;
        let noRender = !forceRender && (hCount % 100) !== 0;


        document.querySelector("#line-slope").value = cSlope;
        document.querySelector("#line-intercept").value = cIntercept;
        inputChangeHandler(noRender);

        let newIntercept = utility.properFloat(cIntercept + intercept.step, 2);
        let newSlope = cSlope;

        if(newIntercept > intercept.max) {
            newIntercept = intercept.min;
            newSlope = utility.properFloat(cSlope + slope.step, 2);
        }

        if(!terminate) {
            setTimeout(iterator.bind(this, newSlope, newIntercept), 5);
        }
        else if(!userStopped) {
            callback();
        }
    }

    iterator(slope.min, intercept.min);
}

/**
 * resets the scan report containers
*/
function resetReport() {
    scanReport.dichotmies = {};
    scanReport.hypotheses = {};
}

export {inputChangeHandler, autoScan, resetReport};

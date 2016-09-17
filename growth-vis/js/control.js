'use strict';

function onReady(handler) {
    if (document.readyState !== "loading") {
        handler();
    }
    else{
        document.addEventListener('DOMContentLoaded', handler);
    }
}

function updateDisplys() {
    let dpCount = document.querySelector("#datset-size").value;
    let slope = document.querySelector("#line-slope").value;
    let intercept = document.querySelector("#line-intercept").value;

    document.querySelector("#dataset-size-display").innerHTML = dpCount;
    document.querySelector("#line-slope-display").innerHTML = slope;
    document.querySelector("#line-intercept-display").innerHTML = intercept;

    let hypothesesCount = Object.keys(slidingInfo.hypotheses).length;
    let uniqueHypothesesCount = Object.keys(slidingInfo.dichotmies).length;

    document.querySelector("#hypotheses-count").innerHTML = hypothesesCount;
    document.querySelector("#unique-hypotheses-count").innerHTML = uniqueHypothesesCount;
    document.querySelector("#unique-percentage").innerHTML = (uniqueHypothesesCount * 100 / hypothesesCount).toFixed(2);
}

function properFloat(num, percision) {
    let str = num.toFixed(percision);
    return parseFloat(str);
}

function automatic() {
    let slope = {min: -6, max: 6, step:0.1};
    let intercept = {min: -6, max:6, step:0.1};

    let iterator = (cSlope, cIntercept) => {
        let userStopped = document.querySelector("#auto-vis").dataset.state  === "paused";
        let terminate = false;
        if(userStopped || (cSlope === slope.max && cIntercept === intercept.max)) {
            terminate = true;
        }

        let hCount = Object.keys(slidingInfo.hypotheses).length;
        let noRender = (hCount % 100) !== 0;


        document.querySelector("#line-slope").value = cSlope;
        document.querySelector("#line-intercept").value = cIntercept;
        universalHandler(noRender);

        let newIntercept = properFloat(cIntercept + intercept.step, 2);
        let newSlope = cSlope;

        if(newIntercept > intercept.max) {
            newIntercept = intercept.min;
            newSlope = properFloat(cSlope + slope.step, 2);
        }

        if(!terminate) {
            setTimeout(iterator.bind(this, newSlope, newIntercept), 5);
        }
    }

    iterator(slope.min, intercept.min);
}

let slidingInfo = {
    dichotmies: {},
    hypotheses: {}
};

function universalHandler(stopRendering) {

    let dpCount = document.querySelector("#datset-size").value;
    let slope = document.querySelector("#line-slope").value;
    let intercept = document.querySelector("#line-intercept").value;

    dpCount = parseInt(dpCount);
    slope = parseFloat(slope);
    intercept = parseFloat(intercept);

    let ds = datasets.get(dpCount);

    let bluePoints = {x: [], y: []};
    let redPoints = {x: [], y: []};
    let dichotemy = [];

    for(let k = 0; k < dpCount; ++k) {
        let cX = ds.x[k];
        let cY  = ds.y[k];

        if(cY >= slope * cX + intercept) {
            bluePoints.x.push(cX);
            bluePoints.y.push(cY);
            dichotemy.push("+1");
        }
        else {
            redPoints.x.push(cX);
            redPoints.y.push(cY);
            dichotemy.push("-1");
        }
    }

    slidingInfo.hypotheses[slope + "," + intercept] = true;
    slidingInfo.dichotmies[dichotemy.join(",")] = true;


    let boundaryLine = {
        x: [-1, 1],
        y: [intercept - slope, intercept + slope]
    }

    if(!stopRendering) {
        let vis = new Visualization();

        vis.addBluePoints(bluePoints);
        vis.addRedPoints(redPoints);
        vis.addBoundaryPoints(boundaryLine);
        vis.render();
    }

    updateDisplys();

}

onReady(() => {
    universalHandler();
    document.querySelector("#container").style.display = "flex";
    document.querySelectorAll("input[type='range']").forEach(element => element.addEventListener('input', universalHandler));
    document.querySelector("#auto-vis").addEventListener("click", (e) => {
        let state = e.target.dataset.state;
        if(state === "paused") {
            e.target.dataset.state = "working";
            automatic();
        }
        else {
            e.target.dataset.state = "paused";
        }
    })
});

'use strict';

import 'seedrandom';

let datasets = {
    generatedDataset: null
};

datasets.generate = function(size) {
    let dpRand = new Math.seedrandom('dataset');
    let noiseRand = new Math.seedrandom('noise');
    let dpMax = 1.01, dpMin = -1;
    let noiseMax = 5.00, noiseMin = -5.00;
    let target = x => Math.sin(x) * Math.pow(Math.cos(x), 2) + Math.pow(2, Math.sin(2 * x))
    let xpoints = [], ypoints = [];

    for(let k = 0; k < size; ++k) {
        let x = dpRand() * (dpMax - dpMin) + dpMin;
        let noise = noiseRand() * (noiseMax - noiseMin) + noiseMin;

        x = x > 1 ? 1.0 : x;
        let y = target(x * Math.PI) + noise;

        xpoints.push(x);
        ypoints.push(y);
    }

    this.generatedDataset = {
        x: xpoints,
        y: ypoints
    };

    return this.generatedDataset
};

datasets.get = function(size) {
    return this.generatedDataset || this.generate(size);
};

export { datasets };

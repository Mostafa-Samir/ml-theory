'use strict';

function Visualization() {
    this.plots = [];
}

Visualization.prototype._addPoints = function(data, mode, color) {
    this.plots.push({
        x: data.x,
        y: data.y,
        type: 'scatter',
        mode: mode,
        marker: { color: color },
        line: {
            color: color,
            width: 2
        }
    });
}

Visualization.prototype.addBluePoints = function(data) {
    this._addPoints(data, 'markers', 'blue');
};

Visualization.prototype.addRedPoints = function(data) {
    this._addPoints(data, 'markers', 'red');
};

Visualization.prototype.addBoundaryPoints = function(data) {
    this._addPoints(data, 'lines', 'black');
};

Visualization.prototype.render = function () {
    Plotly.newPlot("chart-area", this.plots, {
        xaxis: {
            showline: false,
            zeroline: false,
            range: [-1, 1],
            dtick: 0.25

        },
        yaxis: {
            showline: false,
            zeroline: false,
            range: [-6, 6]
        },
        showlegend: false
    }, {
        staticPlot: true
    });
};

'use strict';

import { datasets } from './datasets';
import * as utility from './utility';
import * as controllers from './controllers';

utility.onDOMReady(() => {

    controllers.inputChangeHandler();

    document.querySelector("#growth-vis-container").style.display = "flex";

    document.querySelectorAll("input[type='range']")
    .forEach(e => e.id !== "datset-size" ? e.addEventListener('input', controllers.inputChangeHandler) : null);

    document.querySelector("#datset-size").addEventListener('input', (e) => {
        let size = e.target.value;
        datasets.generate(size);

        controllers.resetReport();
        controllers.inputChangeHandler();
    });

    document.querySelector("#auto-vis").addEventListener("click", (e) => {
        let state = e.target.dataset.state;
        if(state === "paused") {
            e.target.dataset.state = "working";
            e.target.innerHTML = "Stop";

            document.querySelectorAll("input")
            .forEach(element => element.disabled = true);

            controllers.autoScan();
        }
        else {
            e.target.dataset.state = "paused";
            e.target.innerHTML = "Scan";

            document.querySelectorAll("input")
            .forEach(element => element.disabled = false);
        }
    });
});

// esbuild (used by Hugo) adds "require" even when we specify dependencies as externals https://esbuild.github.io/api/#external
// but we know these packages are on the `window` so we can just import them like this instead.
const React = window.React;
const ReactDOM = window.ReactDOM;
const { Vitessce, VitessceConfig, hconcat, vconcat } = window.vitessce.index;

function MyVitessce() {

    const vc = new VitessceConfig("My example config", "This demonstrates the JavaScript API");
    // Add a dataset and its files.
    const dataset = vc
        .addDataset("Dries")
        .addFile('https://s3.amazonaws.com/vitessce-data/0.0.31/master_release/dries/dries.cells.json', "cells", "cells.json")
        .addFile('https://s3.amazonaws.com/vitessce-data/0.0.31/master_release/dries/dries.cell-sets.json', "cell-sets", "cell-sets.json");
    // Add components.
    // Use mapping: "UMAP" so that cells are mapped to the UMAP positions from the JSON file.
    const umap = vc.addView(dataset, "scatterplot", { mapping: "UMAP" });
    // Use mapping: "t-SNE" so that cells are mapped to the t-SNE positions from the JSON file.
    const tsne = vc.addView(dataset, "scatterplot", { mapping: "t-SNE" });
    // Add the cell sets controller component.
    const cellSetsManager = vc.addView(dataset, "cellSets");
    // Add the cell set sizes bar plot component.
    const cellSetSizesPlot = vc.addView(dataset, "cellSetSizes");
    // Link the zoom levels of the two scatterplots.
    vc.linkViews([umap, tsne], ["embeddingZoom"], [2.5]);
    // Set the layout of components.
    vc.layout(
        vconcat(
            hconcat(tsne, umap),
            hconcat(cellSetsManager, cellSetSizesPlot)
        )
    );
    
    // Convert the configuration to its JSON format before passing to the config prop.
    const config = vc.toJSON();
    
    // See index.html for the height and width CSS which are added to the .vitessce-app element.
    return (
        <div className="vitessce-app">
            <Vitessce theme="light" config={config} />
        </div>
    );
}

function renderMyVitessce() {
    ReactDOM.render(<MyVitessce />, document.getElementById("vitessce"));
}

renderMyVitessce();
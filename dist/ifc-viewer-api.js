import { IfcContext, IfcManager, IfcGrid, IfcAxes, IfcClipper, DropboxAPI, IfcStats, Edges, SectionFillManager, IfcDimensions, PlanManager } from './components';
import { GLTFManager } from './components/import-export/glTF';
import { ShadowDropper } from './components/display/shadow-dropper';
import { DXFWriter } from './components/import-export/dxf';
import { PDFWriter } from './components/import-export/pdf';
import { EdgesVectorizer } from './components/import-export/edges-vectorizer';
export class IfcViewerAPI {
    constructor(options) {
        /**
         * Adds a clipping plane on the face pointed to by the cursor.
         */
        this.addClippingPlane = () => {
            this.clipper.createPlane();
        };
        /**
         * Removes the clipping plane pointed by the cursor.
         */
        this.removeClippingPlane = () => {
            this.clipper.deletePlane();
        };
        /**
         * Turns on / off all clipping planes.
         */
        this.toggleClippingPlanes = () => {
            this.clipper.active = !this.clipper.active;
        };
        /**
         * @deprecated Use `IfcViewerAPI.IFC.prePickIfcItem()` instead.
         * Highlights the item pointed by the cursor.
         */
        this.prePickIfcItem = () => {
            this.IFC.prePickIfcItem();
        };
        /**
         * @deprecated Use `IfcViewerAPI.IFC.pickIfcItem()` instead.
         * Highlights the item pointed by the cursor and gets is properties.
         */
        this.pickIfcItem = () => {
            return this.IFC.pickIfcItem();
        };
        /**
         * @deprecated Use `IfcViewerAPI.IFC.pickIfcItemsByID()` instead.
         * Highlights the item with the given ID.
         * @modelID ID of the IFC model.
         * @id Express ID of the item.
         */
        this.pickIfcItemsByID = (modelID, ids) => {
            this.IFC.pickIfcItemsByID(modelID, ids);
        };
        if (!options.container)
            throw new Error('Could not get container element!');
        this.context = new IfcContext(options);
        this.IFC = new IfcManager(this.context);
        this.grid = new IfcGrid(this.context);
        this.axes = new IfcAxes(this.context);
        this.clipper = new IfcClipper(this.context, this.IFC);
        this.plans = new PlanManager(this.IFC, this.context, this.clipper);
        this.filler = new SectionFillManager(this.IFC, this.context);
        this.dimensions = new IfcDimensions(this.context);
        this.edges = new Edges(this.context);
        this.shadowDropper = new ShadowDropper(this.context, this.IFC);
        this.edgesVectorizer = new EdgesVectorizer(this.context, this.clipper, this.grid, this.axes);
        this.dxf = new DXFWriter();
        this.pdf = new PDFWriter();
        this.gltf = new GLTFManager(this.context);
    }
    /**
     * Adds [stats](https://github.com/mrdoob/stats.js/) to the scene for testing purposes. For example:
     * ```js
     *     this.loader.addStats('position:fixed;top:6rem;right:0px;z-index:1;');
     * ```
     * @css The css text to control where to locate the stats.
     * @stats The stats.js API object
     */
    addStats(css = '', stats) {
        var _a, _b;
        // @ts-ignore
        this.stats = new IfcStats(this.context);
        (_a = this.stats) === null || _a === void 0 ? void 0 : _a.initializeStats(stats);
        (_b = this.stats) === null || _b === void 0 ? void 0 : _b.addStats(css);
    }
    /**
     * Opens a dropbox window where the user can select their IFC models.
     */
    openDropboxWindow() {
        var _a;
        if (!this.dropbox)
            this.dropbox = new DropboxAPI(this.context, this.IFC);
        (_a = this.dropbox) === null || _a === void 0 ? void 0 : _a.loadDropboxIfc();
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.loadIfc()` instead.
     * Loads the given IFC in the current scene.
     * @file IFC as File.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     */
    async loadIfc(file, fitToFrame = false) {
        await this.IFC.loadIfc(file, fitToFrame);
    }
    /**
     * @deprecated Use `IfcViewerAPI.grid.setGrid()` instead.
     * Adds a base [grid](https://threejs.org/docs/#api/en/helpers/GridHelper) to the scene.
     * @size (optional) Size of the grid.
     * @divisions (optional) Number of divisions in X and Y.
     * @ColorCenterLine (optional) Color of the XY central lines of the grid.
     * @colorGrid (optional) Color of the XY lines of the grid.
     */
    addGrid(size, divisions, colorCenterLine, colorGrid) {
        this.grid.setGrid(size, divisions, colorCenterLine, colorGrid);
    }
    /**
     * @deprecated Use `IfcViewerAPI.axes.setAxes()` instead.
     * Adds base [axes](https://threejs.org/docs/#api/en/helpers/AxesHelper) to the scene.
     * @size (optional) Size of the axes.
     */
    addAxes(size) {
        this.axes.setAxes(size);
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.loadIfcUrl()` instead.
     * Loads the given IFC in the current scene.
     * @file IFC as URL.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     */
    async loadIfcUrl(url, fitToFrame = false) {
        await this.IFC.loadIfcUrl(url, fitToFrame);
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.setWasmPath()` instead.
     * Sets the relative path of web-ifc.wasm file in the project.
     * Beware: you **must** serve this file in your page; this means
     * that you have to copy this files from *node_modules/web-ifc*
     * to your deployment directory.
     *
     * If you don't use this methods,
     * IFC.js assumes that you are serving it in the root directory.
     *
     * Example if web-ifc.wasm is in dist/wasmDir:
     * `ifcLoader.setWasmPath("dist/wasmDir/");`
     *
     * @path Relative path to web-ifc.wasm.
     */
    setWasmPath(path) {
        this.IFC.setWasmPath(path);
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getSpatialStructure()` instead.
     * Gets the spatial structure of the specified model.
     * @modelID ID of the IFC model.
     */
    getSpatialStructure(modelID) {
        return this.IFC.getSpatialStructure(modelID);
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getProperties()` instead.
     * Gets the properties of the specified item.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @indirect If true, also returns psets, qsets and type properties.
     */
    getProperties(modelID, id, indirect) {
        return this.IFC.getProperties(modelID, id, indirect);
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getModelID()` instead.
     * Gets the ID of the model pointed by the cursor.
     */
    getModelID() {
        return this.IFC.getModelID();
    }
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getAllItemsOfType()` instead.
     * Gets all the items of the specified type in the specified IFC model.
     * @modelID ID of the IFC model.
     * @type type of element. You can import the type from web-ifc.
     * @verbose If true, also gets the properties for all the elements.
     */
    getAllItemsOfType(modelID, type, verbose = false) {
        return this.IFC.getAllItemsOfType(modelID, type, verbose);
    }
    /**
     * TODO: Method to delete all data
     * Needs to be implemented yet
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    releaseAllMemory() { }
}
//# sourceMappingURL=ifc-viewer-api.js.map
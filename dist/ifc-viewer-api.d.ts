import { Color } from 'three';
import { IfcContext, IfcManager, ViewerOptions, IfcGrid, IfcAxes, IfcClipper, DropboxAPI, IfcStats, Edges, SectionFillManager, IfcDimensions, PlanManager } from './components';
import { GLTFManager } from './components/import-export/glTF';
import { ShadowDropper } from './components/display/shadow-dropper';
import { DXFWriter } from './components/import-export/dxf';
import { PDFWriter } from './components/import-export/pdf';
import { EdgesVectorizer } from './components/import-export/edges-vectorizer';
export declare class IfcViewerAPI {
    context: IfcContext;
    IFC: IfcManager;
    clipper: IfcClipper;
    plans: PlanManager;
    filler: SectionFillManager;
    dimensions: IfcDimensions;
    edges: Edges;
    shadowDropper: ShadowDropper;
    dxf: DXFWriter;
    pdf: PDFWriter;
    edgesVectorizer: EdgesVectorizer;
    gltf: GLTFManager;
    grid: IfcGrid;
    axes: IfcAxes;
    stats?: IfcStats;
    dropbox?: DropboxAPI;
    constructor(options: ViewerOptions);
    /**
     * Adds [stats](https://github.com/mrdoob/stats.js/) to the scene for testing purposes. For example:
     * ```js
     *     this.loader.addStats('position:fixed;top:6rem;right:0px;z-index:1;');
     * ```
     * @css The css text to control where to locate the stats.
     * @stats The stats.js API object
     */
    addStats(css?: string, stats?: any): void;
    /**
     * Adds a clipping plane on the face pointed to by the cursor.
     */
    addClippingPlane: () => void;
    /**
     * Removes the clipping plane pointed by the cursor.
     */
    removeClippingPlane: () => void;
    /**
     * Turns on / off all clipping planes.
     */
    toggleClippingPlanes: () => void;
    /**
     * Opens a dropbox window where the user can select their IFC models.
     */
    openDropboxWindow(): void;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.loadIfc()` instead.
     * Loads the given IFC in the current scene.
     * @file IFC as File.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     */
    loadIfc(file: File, fitToFrame?: boolean): Promise<void>;
    /**
     * @deprecated Use `IfcViewerAPI.grid.setGrid()` instead.
     * Adds a base [grid](https://threejs.org/docs/#api/en/helpers/GridHelper) to the scene.
     * @size (optional) Size of the grid.
     * @divisions (optional) Number of divisions in X and Y.
     * @ColorCenterLine (optional) Color of the XY central lines of the grid.
     * @colorGrid (optional) Color of the XY lines of the grid.
     */
    addGrid(size?: number, divisions?: number, colorCenterLine?: Color, colorGrid?: Color): void;
    /**
     * @deprecated Use `IfcViewerAPI.axes.setAxes()` instead.
     * Adds base [axes](https://threejs.org/docs/#api/en/helpers/AxesHelper) to the scene.
     * @size (optional) Size of the axes.
     */
    addAxes(size?: number): void;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.loadIfcUrl()` instead.
     * Loads the given IFC in the current scene.
     * @file IFC as URL.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     */
    loadIfcUrl(url: string, fitToFrame?: boolean): Promise<void>;
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
    setWasmPath(path: string): void;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getSpatialStructure()` instead.
     * Gets the spatial structure of the specified model.
     * @modelID ID of the IFC model.
     */
    getSpatialStructure(modelID: number): Promise<any>;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getProperties()` instead.
     * Gets the properties of the specified item.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @indirect If true, also returns psets, qsets and type properties.
     */
    getProperties(modelID: number, id: number, indirect: boolean): Promise<any>;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getModelID()` instead.
     * Gets the ID of the model pointed by the cursor.
     */
    getModelID(): number | null;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.getAllItemsOfType()` instead.
     * Gets all the items of the specified type in the specified IFC model.
     * @modelID ID of the IFC model.
     * @type type of element. You can import the type from web-ifc.
     * @verbose If true, also gets the properties for all the elements.
     */
    getAllItemsOfType(modelID: number, type: number, verbose?: boolean): Promise<any[]>;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.prePickIfcItem()` instead.
     * Highlights the item pointed by the cursor.
     */
    prePickIfcItem: () => void;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.pickIfcItem()` instead.
     * Highlights the item pointed by the cursor and gets is properties.
     */
    pickIfcItem: () => Promise<{
        modelID: number;
        id: number;
    } | null>;
    /**
     * @deprecated Use `IfcViewerAPI.IFC.pickIfcItemsByID()` instead.
     * Highlights the item with the given ID.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     */
    pickIfcItemsByID: (modelID: number, ids: number[]) => void;
    /**
     * TODO: Method to delete all data
     * Needs to be implemented yet
     */
    releaseAllMemory(): void;
}

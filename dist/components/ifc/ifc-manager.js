// @ts-ignore
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { Matrix4 } from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { IfcComponent } from '../../base-types';
import { IfcUnits } from './units';
import { IfcSelector } from './selection/selector';
export class IfcManager extends IfcComponent {
    constructor(context) {
        super(context);
        this.context = context;
        this.loader = new IFCLoader();
        this.setupThreeMeshBVH();
        this.selector = new IfcSelector(context, this);
        this.units = new IfcUnits(this);
    }
    /**
     * Loads the given IFC in the current scene.
     * @file IFC as File.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     * @onError (optional) a callback function to report on loading errors
     */
    async loadIfc(file, fitToFrame = false, onError) {
        const url = URL.createObjectURL(file);
        return this.loadIfcUrl(url, fitToFrame, undefined, onError);
    }
    /**
     * Loads the given IFC in the current scene.
     * @file IFC as URL.
     * @fitToFrame (optional) if true, brings the perspectiveCamera to the loaded IFC.
     * @onProgress (optional) a callback function to report on downloading progress
     * @onError (optional) a callback function to report on loading errors
     */
    async loadIfcUrl(url, fitToFrame = false, onProgress, onError) {
        try {
            const firstModel = Boolean(this.context.items.ifcModels.length === 0);
            const settings = this.loader.ifcManager.state.webIfcSettings;
            const fastBools = (settings === null || settings === void 0 ? void 0 : settings.USE_FAST_BOOLS) || true;
            await this.loader.ifcManager.applyWebIfcConfig({
                COORDINATE_TO_ORIGIN: firstModel,
                USE_FAST_BOOLS: fastBools
            });
            
            const ifcModel = await this.loader.loadAsync(url, onProgress);
            this.addIfcModel(ifcModel);
            if (firstModel) {
                const matrixArr = await this.loader.ifcManager.ifcAPI.GetCoordinationMatrix(ifcModel.modelID);
                const matrix = new Matrix4().fromArray(matrixArr);
                this.loader.ifcManager.setupCoordinationMatrix(matrix);
            }
            if (fitToFrame)
                this.context.fitToFrame();
            return ifcModel;
        }
        catch (err) {
            console.error('Error loading IFC.');
            console.error(err);
            if (onError)
                onError(err);
            return null;
        }
    }
    /**
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
    async setWasmPath(path) {
        await this.loader.ifcManager.setWasmPath(path);
    }
    /**
     * Applies a configuration for [web-ifc](https://ifcjs.github.io/info/docs/Guide/web-ifc/Introduction).
     */
    async applyWebIfcConfig(settings) {
        await this.loader.ifcManager.applyWebIfcConfig(settings);
    }
    /**
     * Gets the spatial structure of the specified model.
     * @modelID ID of the IFC model.
     */
    getSpatialStructure(modelID, includeProperties) {
        return this.loader.ifcManager.getSpatialStructure(modelID, includeProperties);
    }
    /**
     * Gets the properties of the specified item.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @indirect If true, also returns psets, qsets and type properties.
     * @recursive If true, this gets the native properties of the referenced elements recursively.
     */
    async getProperties(modelID, id, indirect, recursive) {
        if (modelID == null || id == null)
            return null;
        const props = await this.loader.ifcManager.getItemProperties(modelID, id, recursive);
        if (indirect) {
            props.psets = await this.loader.ifcManager.getPropertySets(modelID, id, recursive);
            props.mats = await this.loader.ifcManager.getMaterialsProperties(modelID, id, recursive);
            props.type = await this.loader.ifcManager.getTypeProperties(modelID, id, recursive);
        }
        return props;
    }
    /**
     * Gets the ID of the model pointed by the cursor.
     */
    getModelID() {
        const found = this.context.castRayIfc();
        if (!found)
            return null;
        const mesh = found.object;
        if (!mesh || mesh.modelID === undefined || mesh.modelID === null)
            return null;
        return mesh.modelID;
    }
    /**
     * Gets all the items of the specified type in the specified IFC model.
     * @modelID ID of the IFC model.
     * @type type of element. You can import the type from web-ifc.
     * @verbose If true, also gets the properties for all the elements.
     */
    getAllItemsOfType(modelID, type, verbose = false) {
        return this.loader.ifcManager.getAllItemsOfType(modelID, type, verbose);
    }
    /**
     * @deprecated: use IFC.selector.prePickIfcItem() instead.
     */
    async prePickIfcItem() {
        await this.selector.prePickIfcItem();
    }
    /**
     * @deprecated: use IFC.selector.pickIfcItem() instead.
     */
    async pickIfcItem(focusSelection = false) {
        return this.selector.pickIfcItem(focusSelection);
    }
    /**
     * @deprecated: use IFC.selector.highlightIfcItem() instead.
     */
    async highlightIfcItem(focusSelection = false) {
        return this.selector.highlightIfcItem(focusSelection);
    }
    /**
     * @deprecated: use IFC.selector.pickIfcItemsByID() instead.
     */
    async pickIfcItemsByID(modelID, ids, focusSelection = false) {
        await this.selector.pickIfcItemsByID(modelID, ids, focusSelection);
    }
    /**
     * @deprecated: use IFC.selector.prepickIfcItemsByID() instead.
     */
    async prepickIfcItemsByID(modelID, ids, focusSelection = false) {
        await this.selector.prepickIfcItemsByID(modelID, ids, focusSelection);
    }
    /**
     * @deprecated: use IFC.selector.highlightIfcItemsByID() instead.
     */
    async highlightIfcItemsByID(modelID, ids, focusSelection = false) {
        await this.selector.highlightIfcItemsByID(modelID, ids, focusSelection);
    }
    /**
     * @deprecated: use IFC.selector.unpickIfcItems() instead.
     */
    unpickIfcItems() {
        this.selector.unpickIfcItems();
    }
    /**
     * @deprecated: use IFC.selector.unPrepickIfcItems() instead.
     */
    unPrepickIfcItems() {
        this.selector.unPrepickIfcItems();
    }
    /**
     * @deprecated: use IFC.selector.unHighlightIfcItems() instead.
     */
    unHighlightIfcItems() {
        this.selector.unHighlightIfcItems();
    }
    addIfcModel(ifcMesh) {
        this.context.items.ifcModels.push(ifcMesh);
        this.context.items.pickableIfcModels.push(ifcMesh);
        this.context.getScene().add(ifcMesh);
    }
    setupThreeMeshBVH() {
        this.loader.ifcManager.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);
    }
}
//# sourceMappingURL=ifc-manager.js.map
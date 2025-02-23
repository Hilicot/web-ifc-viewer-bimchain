import { DoubleSide, Mesh, MeshLambertMaterial } from 'three';
import { IfcSelection } from './selection';
import { GroupHighlight } from './group-highlight';
export class IfcSelector {
    constructor(context, ifc) {
        this.context = context;
        this.ifc = ifc;
        this.userDataField = 'ifcjsFadedModel';
        this.defSelectMat = this.initializeDefMaterial(0xff33ff, 0.3);
        this.defPreselectMat = this.initializeDefMaterial(0xffccff, 0.5);
        this.defHighlightMat = this.initializeDefMaterial(0xeeeeee, 0.05);
        this.preselection = new IfcSelection(context, this.ifc.loader, this.defPreselectMat);
        this.selection = new IfcSelection(context, this.ifc.loader, this.defSelectMat);
        this.highlight = new IfcSelection(context, this.ifc.loader);
        this.groupHighlights = {};
    }
    /**
     * Highlights the item pointed by the cursor.
     */
    async prePickIfcItem() {
        const found = this.context.castRayIfc();
        if (!found) {
            this.preselection.hideSelection();
            return;
        }
        await this.preselection.pick(found);
    }
    /**
     * Highlights the item pointed by the cursor and gets is properties.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    async pickIfcItem(focusSelection = false) {
        const found = this.context.castRayIfc();
        if (!found)
            return null;
        const result = await this.selection.pick(found, focusSelection);
        if (result == null || result.modelID == null || result.id == null)
            return null;
        return result;
    }

    async colorIfcItem(color) {
        const item = this.context.castRayIfc();
        if (!item)
            return null;
        const mesh = item.object;
        const id = await this.selection.loader.ifcManager.getExpressId(mesh.geometry, item.faceIndex);
        const modelID = mesh.modelID;
        const material = new MeshLambertMaterial({ color: color, side: DoubleSide, transparent: true, opacity: 0.5 });
        await this.selection.colorByID(modelID, [id], material);
        return { modelID: modelID, id: id };
    }

    async createGroupHighlight(modelID, groupName, color, opacity) {
        const material = this.initializeDefMaterial(color, opacity);
        if (!this.groupHighlights[groupName])
            this.groupHighlights[groupName] = {};
        this.groupHighlights[groupName][modelID] = new GroupHighlight(this.context, this.ifc.loader, material, modelID);
        return this.groupHighlights[groupName][modelID];
    }

    getGroupHighlight(groupName, modelID) {
        return this.groupHighlights[groupName][modelID];
    }

    getGroupHighlights() {
        return this.groupHighlights;
    }

    async addRaycastedToHighlightGroup(group) {
        const found = this.context_m.castRayIfc();
        if (!found)
            return null;
        const result = await group.pick(found);
        if (result == null || result.modelID == null || result.id == null)
            return null;
        return result;
    }

    addToHighlightGroup(ids, group) {
        group.selectElements(ids);
    }

    /**
     * Highlights the item pointed by the cursor and gets is properties, without applying any material to it.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    async highlightIfcItem(focusSelection = false) {
        const found = this.context.castRayIfc();
        if (!found)
            return null;
        const model = found.object;
        this.fadeAwayModel(model);
        const result = await this.highlight.pick(found, focusSelection);
        if (result == null || result.modelID == null || result.id == null)
            return null;
        return result;
    }
    /**
     * Highlights the item with the given ID with the picking material.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    async pickIfcItemsByID(modelID, ids, focusSelection = false) {
        await this.selection.pickByID(modelID, ids, focusSelection);
    }
    /**
     * Highlights the item with the given ID with the prepicking material.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    async prepickIfcItemsByID(modelID, ids, focusSelection = false) {
        await this.preselection.pickByID(modelID, ids, focusSelection);
    }
    /**
     * Highlights the item with the given ID and fades away the model.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     * @mesh Mesh to fade away. By default it's the IFCModel
     */
    async highlightIfcItemsByID(modelID, ids, focusSelection = false, mesh) {
        const model = mesh || this.context.items.ifcModels[modelID];
        this.fadeAwayModel(model);
        await this.highlight.pickByID(modelID, ids, focusSelection);
    }
    /**
     * Unapplies the picking material.
     */
    unpickIfcItems() {
        this.selection.unpick();
    }
    /**
     * Unapplies the prepicking material.
     */
    unPrepickIfcItems() {
        this.preselection.unpick();
    }
    /**
     * Unapplies the highlight material, removing the fading of the model
     */
    unHighlightIfcItems() {
        this.context.items.ifcModels.forEach((model) => this.unHighlightItem(model));
        this.highlight.unpick();
    }
    unHighlightItem(model) {
        const fadedModel = model.userData[this.userDataField];
        if (fadedModel && fadedModel.parent) {
            fadedModel.parent.add(model);
            fadedModel.removeFromParent();
        }
    }
    fadeAwayModel(model) {
        if (!model.userData[this.userDataField]) {
            model.userData[this.userDataField] = new Mesh(model.geometry, this.defHighlightMat);
        }
        if (model.parent) {
            model.parent.add(model.userData[this.userDataField]);
            model.removeFromParent();
        }
    }
    initializeDefMaterial(color, opacity) {
        const planes = this.context.getClippingPlanes();
        return new MeshLambertMaterial({
            color,
            opacity,
            transparent: true,
            depthTest: false,
            side: DoubleSide,
            clippingPlanes: planes
        });
    }
}
//# sourceMappingURL=selector.js.map
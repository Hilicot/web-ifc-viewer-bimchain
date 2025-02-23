import { IfcSelection } from './selection.js';

export class GroupHighlight extends IfcSelection {
    constructor(context, loader, material, modelID) {
        super(context, loader, material);
        this.selected_ids = new Set();
        this.modelID = modelID;
    }

    clearSelection() {
        if (this.meshes)
            this.mesh.visible = false;
        this.selected_ids = new Set();
    }



    selectElements = (ids) => {
        ids.forEach(element => this.selected_ids.add(element));
        this.hideSelection(this.mesh);
        this.newSelection(Array.from(this.selected_ids));
    }

    newSelection = (ids) => {
        try {
            const mesh = this.loader.ifcManager.createSubset({
                scene: this.scene,
                modelID: this.modelID,
                ids,
                removePrevious: true,
                material: this.material
            });
            if (mesh) {
                this.mesh = mesh;
                this.mesh.visible = true;
            }
        } catch (e) {
            console.log(e);

        }
    }

}
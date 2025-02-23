import { AxesHelper } from 'three';
import { IfcComponent } from '../../base-types';
export class IfcAxes extends IfcComponent {
    constructor(context) {
        super(context);
        this.context = context;
    }
    setAxes(size) {
        if (this.axes) {
            if (this.axes.parent)
                this.axes.removeFromParent();
            this.axes.geometry.dispose();
        }
        this.axes = new AxesHelper(size);
        this.axes.material.depthTest = false;
        this.axes.renderOrder = 2;
        const scene = this.context.getScene();
        scene.add(this.axes);
    }
}
//# sourceMappingURL=axes.js.map
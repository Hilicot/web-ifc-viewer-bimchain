import { Group } from 'three';
import { IfcComponent } from '../../base-types';
import { IfcContext } from '../context';
export declare class GLTFManager extends IfcComponent {
    private context;
    private loader;
    private GLTFModels;
    constructor(context: IfcContext);
    load(modelID: number, url: string): Promise<void>;
    getModel(modelID: number): Group;
}

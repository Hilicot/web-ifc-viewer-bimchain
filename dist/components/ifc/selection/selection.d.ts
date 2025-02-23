import { Intersection, Material, Mesh } from 'three';
import { IfcMesh } from 'web-ifc-three/IFC/BaseDefinitions';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { IfcComponent } from '../../../base-types';
import { IfcContext } from '../../context';
export declare class IfcSelection extends IfcComponent {
    private context;
    mesh: Mesh | null;
    material?: Material;
    private selected;
    private modelID;
    private loader;
    private readonly scene;
    constructor(context: IfcContext, loader: IFCLoader, material?: Material);
    pick: (item: Intersection, focusSelection?: boolean) => Promise<{
        modelID: number;
        id: number;
    } | null>;
    colorByID: (modelID: number, ids: number[], material:Material) => Promise<void>;
    unpick(): void;
    pickByID: (modelID: number, ids: number[], focusSelection?: boolean) => Promise<void>;
    newSelection: (ids: number[]) => void;
    hideSelection(mesh?: IfcMesh): void;
    private focusSelection;
}

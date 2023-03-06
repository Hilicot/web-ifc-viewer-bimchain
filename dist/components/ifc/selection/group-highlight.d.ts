import { IfcSelection } from './selection.js';
import { Material } from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { IfcContext } from '../../context';

export declare class GroupHighlight extends IfcSelection {
    selected_ids: Set<number>;
    constructor(context: IfcContext, loader: IFCLoader, material?: Material) ;

    clearSelection: () => void;

    selectElements: (ids:number[]) => void
    
    newSelection: (ids:number[]) => void;

}
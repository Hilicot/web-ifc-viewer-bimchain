import { Material, Mesh } from 'three';
import { IfcSelection } from './selection';
import { IfcManager } from '../ifc-manager';
import { IfcContext } from '../../context';
import { GroupHighlight } from './group-highlight';
export declare class IfcSelector {
    private context;
    private ifc;
    preselection: IfcSelection;
    selection: IfcSelection;
    highlight: IfcSelection;
    defHighlightMat: Material;
    private readonly defPreselectMat;
    private readonly defSelectMat;
    private readonly userDataField;
    public groupHighlights: Map<string, Map<number, GroupHighlight>>;
    constructor(context: IfcContext, ifc: IfcManager);
    /**
     * Highlights the item pointed by the cursor.
     */
    prePickIfcItem(): Promise<void>;
    /**
     * Highlights the item pointed by the cursor and gets is properties.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    pickIfcItem(focusSelection?: boolean): Promise<{
        modelID: number;
        id: number;
    } | null>;

    async colorIfcItem(color: any): Promise<{
        modelID: number;
        id: number;
    }>

    async createGroupHighlight(modelID:number, groupName: string, color: any, opacity: number)

    getGroupHighlight(groupName: string, modelID:number)

    getGroupHiglights()

    async addRaycastedToHighlightGroup(group: GroupHighlight)
    addToHighlightGroup(ids: number[], group: GroupHighlight)

    /**
     * Highlights the item pointed by the cursor and gets is properties, without applying any material to it.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    highlightIfcItem(focusSelection?: boolean): Promise<{
        modelID: number;
        id: number;
    } | null>;
    /**
     * Highlights the item with the given ID with the picking material.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    pickIfcItemsByID(modelID: number, ids: number[], focusSelection?: boolean): Promise<void>;
    /**
     * Highlights the item with the given ID with the prepicking material.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     */
    prepickIfcItemsByID(modelID: number, ids: number[], focusSelection?: boolean): Promise<void>;
    /**
     * Highlights the item with the given ID and fades away the model.
     * @modelID ID of the IFC model.
     * @id Express ID of the item.
     * @focusSelection If true, animate the perspectiveCamera to focus the current selection
     * @mesh Mesh to fade away. By default it's the IFCModel
     */
    highlightIfcItemsByID(modelID: number, ids: number[], focusSelection?: boolean, mesh?: Mesh): Promise<void>;
    /**
     * Unapplies the picking material.
     */
    unpickIfcItems(): void;
    /**
     * Unapplies the prepicking material.
     */
    unPrepickIfcItems(): void;
    /**
     * Unapplies the highlight material, removing the fading of the model
     */
    unHighlightIfcItems(): void;
    private unHighlightItem;
    private fadeAwayModel;
    private initializeDefMaterial;
}

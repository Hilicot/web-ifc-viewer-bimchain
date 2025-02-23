import { Mesh, Object3D, Plane, Vector2, Vector3 } from 'three';
import { IfcCamera } from './camera/camera';
import { IfcRenderer } from './renderer/renderer';
import { IfcScene } from './scene';
import { Animator } from './animator';
import { IfcEvents } from './ifcEvent';
import { IfcComponent, Items, ViewerOptions } from '../../base-types';
export declare class IfcContext {
    options: ViewerOptions;
    items: Items;
    ifcCamera: IfcCamera;
    readonly scene: IfcScene;
    readonly renderer: IfcRenderer;
    readonly events: IfcEvents;
    private readonly clippingPlanes;
    private readonly clock;
    private readonly ifcCaster;
    private readonly ifcAnimator;
    constructor(options: ViewerOptions);
    getScene(): import("three").Scene;
    getRenderer(): import("three").WebGLRenderer;
    getRenderer2D(): import("three/examples/jsm/renderers/CSS2DRenderer").CSS2DRenderer;
    getCamera(): import("three").Camera;
    getIfcCamera(): IfcCamera;
    getDomElement(): HTMLCanvasElement;
    getDomElement2D(): HTMLElement;
    getContainerElement(): HTMLElement;
    getDimensions(): Vector2;
    getClippingPlanes(): Plane[];
    getAnimator(): Animator;
    getCenter(mesh: Mesh): Vector3;
    addComponent(component: IfcComponent): void;
    addClippingPlane(plane: Plane): void;
    removeClippingPlane(plane: Plane): void;
    castRay(items: Object3D[]): import("three").Intersection<Object3D<import("three").Event>>[];
    castRayIfc(): import("three").Intersection<Object3D<import("three").Event>> | null;
    fitToFrame(): void;
    toggleCameraControls(active: boolean): void;
    updateAspect(): void;
    private render;
    private updateAllComponents;
    private setupWindowRescale;
    private newItems;
}

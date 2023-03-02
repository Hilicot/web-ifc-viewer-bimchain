import { WebGLRenderer } from 'three';
import { IfcContext } from '../context';
export declare class IfcPostproduction {
    private context;
    ssaoEffect: any;
    renderer: WebGLRenderer;
    composer: any;
    constructor(context: IfcContext, canvas: HTMLElement);
    get domElement(): HTMLCanvasElement;
    render(): void;
    setSize(width: number, height: number): void;
    private setupEvents;
}

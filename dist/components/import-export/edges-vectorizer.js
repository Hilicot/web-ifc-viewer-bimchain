import { BoxGeometry, Mesh, Vector2, Vector3 } from 'three';
export class EdgesVectorizer {
    constructor(
    // eslint-disable-next-line no-undef
    context, clipper, grid, axes) {
        this.context = context;
        this.clipper = clipper;
        this.grid = grid;
        this.axes = axes;
        this.minimumOffset = 0.1;
        this.buckets = [];
        this.bucketsOffset = new Vector3();
        this.polygons = [];
        this.currentBucketIndex = 0;
        this.dims = { pixels: new Vector2(), real: new Vector2() };
        this.bucketMesh = new Mesh(new BoxGeometry(1, 1, 1));
        this.trueCamera = context.ifcCamera.orthographicCamera;
        this.cvCamera = this.trueCamera.clone(false);
        this.controls = context.ifcCamera.cameraControls;
        // Every time the html image is updated, its vertices are processed by opencv
        this.htmlImage = document.createElement('img');
        this.htmlImage.onload = () => this.getEdges2DPoints();
    }
    initializeOpenCV(openCV) {
        this.cv = openCV;
    }
    async vectorize(bucketWidth) {
        this.setupCamera();
        this.updateBucketDimensions(bucketWidth);
        const { size, center } = this.getSizeAndCenter();
        this.computeBucketsOrigin(size, center);
        this.generateAllBuckets(size, center);
        this.toggleVisibility(false);
        await this.renderBucket();
    }
    setupCamera() {
        this.cvCamera.copy(this.trueCamera);
        this.controls.saveState();
        this.controls.camera = this.cvCamera;
    }
    // Some elements don't need to be processed by opencv
    toggleVisibility(visible) {
        if (this.grid.grid)
            this.grid.grid.visible = visible;
        if (this.axes.axes)
            this.axes.axes.visible = visible;
        this.clipper.planes.forEach((plane) => {
            Object.values(plane.edges.edges).forEach((edges) => {
                edges.mesh.visible = visible;
            });
        });
    }
    async renderBucket() {
        const bucket = this.buckets[this.currentBucketIndex];
        const controls = this.context.ifcCamera.cameraControls;
        this.bucketMesh.position.copy(bucket.position);
        await controls.fitToBox(this.bucketMesh, false);
        controls.update(0);
        this.htmlImage.src = this.context.renderer.newScreenshot(false, this.cvCamera);
    }
    computeBucketsOrigin(size, center) {
        this.bucketsOffset.copy(center);
        this.bucketsOffset.x += -size.x / 2 - this.minimumOffset;
        this.bucketsOffset.z += size.z / 2 + this.minimumOffset;
    }
    generateAllBuckets(size, center) {
        this.buckets = [];
        const { xCount, zCount } = this.getBucketCount(size);
        for (let i = 0; i < xCount; i++) {
            for (let j = 0; j < zCount; j++) {
                const position = this.getBucketPosition(size, center, i, j);
                this.buckets.push({ position, row: i, column: j });
            }
        }
    }
    getBucketPosition(size, center, row, column) {
        const xPosition = row * this.dims.real.x;
        const zPosition = column * this.dims.real.y;
        const position = new Vector3();
        position.x = center.x - size.x / 2 + this.dims.real.x / 2 + xPosition - this.minimumOffset;
        position.z = center.z + size.z / 2 - this.dims.real.y / 2 - zPosition + this.minimumOffset;
        return position;
    }
    getBucketCount(size) {
        const xCount = Math.ceil(size.x / this.dims.real.x);
        const zCount = Math.ceil(size.z / this.dims.real.y);
        return { xCount, zCount };
    }
    updateBucketDimensions(bucketWidth) {
        this.resetBucketDimensions();
        this.dims.pixels = this.context.getDimensions();
        // Buckets are proportional to viewport aspect
        this.dims.real.x = bucketWidth;
        this.dims.real.y = (bucketWidth * this.dims.pixels.y) / this.dims.pixels.x;
        this.bucketMesh.geometry.scale(this.dims.real.x, 1, this.dims.real.y);
        this.htmlImage.width = this.dims.pixels.x;
        this.htmlImage.height = this.dims.pixels.y;
    }
    resetBucketDimensions() {
        if (this.dims.real.x !== 0) {
            this.bucketMesh.geometry.scale(1 / this.dims.real.x, 1, 1 / this.dims.real.y);
        }
    }
    getSizeAndCenter() {
        const min = new Vector3();
        const max = new Vector3();
        this.context.items.ifcModels.forEach((model) => this.computeMinAndMax(min, max, model));
        const center = new Vector3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);
        const size = new Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
        return { size, center };
    }
    computeMinAndMax(min, max, model) {
        if (!model.geometry.boundingBox)
            model.geometry.computeBoundingBox();
        min.x = Math.min(min.x, model.geometry.boundingBox.min.x);
        min.y = Math.min(min.y, model.geometry.boundingBox.min.y);
        min.z = Math.min(min.z, model.geometry.boundingBox.min.z);
        max.x = Math.max(max.x, model.geometry.boundingBox.max.x);
        max.y = Math.max(max.y, model.geometry.boundingBox.max.y);
        max.z = Math.max(max.z, model.geometry.boundingBox.max.z);
    }
    async getEdges2DPoints() {
        const src = this.cv.imread(this.htmlImage);
        // https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
        this.cv.cvtColor(src, src, this.cv.COLOR_RGBA2GRAY, 0);
        // this.cv.threshold(src, src, 100, 200, this.cv.THRESH_BINARY);
        this.cv.bitwise_not(src, src);
        const contours = new this.cv.MatVector();
        const hierarchy = new this.cv.Mat();
        const poly = new this.cv.MatVector();
        this.cv.findContours(src, contours, hierarchy, this.cv.RETR_CCOMP, this.cv.CHAIN_APPROX_SIMPLE);
        // Approximates each contour to polygon
        for (let i = 0; i < contours.size(); ++i) {
            const tmp = new this.cv.Mat();
            const cnt = contours.get(i);
            // We can try more different parameters
            this.cv.approxPolyDP(cnt, tmp, 1, true);
            poly.push_back(tmp);
            cnt.delete();
            tmp.delete();
        }
        // Get all polygons
        const bucket = this.buckets[this.currentBucketIndex];
        const size = poly.size();
        for (let i = 0; i < size; i++) {
            const polygon = Array.from(poly.get(i).data32S);
            // Add offset and convert from pixel to real units
            for (let j = 0; j < polygon.length; j++) {
                if (j === 0 || j % 2 === 0) {
                    // x axis
                    // Translate pixels to real units
                    polygon[j] = (polygon[j] * this.dims.real.x) / this.dims.pixels.x;
                    polygon[j] = this.bucketsOffset.x + polygon[j] + this.dims.real.x * bucket.row;
                }
                else {
                    // z axis
                    // Translate pixels to real units
                    polygon[j] = (polygon[j] * this.dims.real.y) / this.dims.pixels.y;
                    const flippedCoord = -(polygon[j] - this.dims.real.y);
                    polygon[j] = -this.bucketsOffset.z + flippedCoord + this.dims.real.y * bucket.column;
                }
            }
            this.polygons.push(polygon);
        }
        this.currentBucketIndex++;
        if (this.currentBucketIndex < this.buckets.length) {
            await this.renderBucket();
        }
        else {
            this.toggleVisibility(true);
            await this.controls.reset(false);
            this.controls.camera = this.trueCamera;
        }
    }
}
//# sourceMappingURL=edges-vectorizer.js.map
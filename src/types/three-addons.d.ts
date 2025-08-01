declare module 'three/addons/loaders/OBJLoader.js' {
  import { Loader, LoadingManager, Group } from 'three';
  export class OBJLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (object: Group) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: string): Group;
    setMaterials(materials: any): this; // If using MTL
  }
}

// If using MTL, add similarly:
declare module 'three/addons/loaders/MTLLoader.js' {
  import { Loader, LoadingManager, Material } from 'three';
  export class MTLLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (materials: MaterialCreator) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(text: string, path: string): MaterialCreator;
  }
  export class MaterialCreator {
    // ... (add if needed)
  }
}
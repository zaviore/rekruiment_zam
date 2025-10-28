declare module 'handsfree' {
  interface HandsfreeOptions {
    hands?: boolean;
    weboji?: boolean;
    pose?: boolean;
    facemesh?: boolean;
  }

  interface HandsData {
    landmarks: any[][];
  }

  interface HandsfreeData {
    hands?: HandsData;
  }

  type HandsfreeCallback = (data: HandsfreeData) => void;

  class Handsfree {
    constructor(options?: HandsfreeOptions);
    start(): void;
    stop(): void;
    use(name: string, callback: HandsfreeCallback): void;
  }

  export default Handsfree;
}
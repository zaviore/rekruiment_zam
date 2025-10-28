declare module 'fingerpose' {
  export type Finger = 'thumb' | 'indexFinger' | 'middleFinger' | 'ringFinger' | 'pinky';
  export type FingerCurl = 'NO_CURL' | 'HALF_CURL' | 'FULL_CURL';
  export type FingerDirection = 'VERTICAL_UP' | 'VERTICAL_DOWN' | 'HORIZONTAL_LEFT' | 'HORIZONTAL_RIGHT' | 'DIAGONAL_UP_RIGHT' | 'DIAGONAL_UP_LEFT' | 'DIAGONAL_DOWN_RIGHT' | 'DIAGONAL_DOWN_LEFT';

  export class FingerPoseEstimator {
    constructor();
    estimate(landmarks: number[][], minConfidence?: number): GestureEstimation;
  }

  export class GestureEstimation {
    poseData: any;
  }

  export class GestureDescription {
    constructor(name: string);
    addCurl(finger: Finger, curl: FingerCurl, weight?: number): GestureDescription;
    addDirection(finger: Finger, direction: FingerDirection, weight?: number): GestureDescription;
  }

  export class GestureEstimator {
    constructor(knownGestures: GestureDescription[]);
    estimate(landmarks: number[][], minConfidence?: number): {
      gestures: Array<{
        name: string;
        score: number;
      }>;
    };
  }

  export const Finger: {
    Thumb: 'thumb';
    Index: 'indexFinger';
    Middle: 'middleFinger';
    Ring: 'ringFinger';
    Pinky: 'pinky';
  };

  export const FingerCurl: {
    NoCurl: 'NO_CURL';
    HalfCurl: 'HALF_CURL';
    FullCurl: 'FULL_CURL';
  };

  export const FingerDirection: {
    VerticalUp: 'VERTICAL_UP';
    VerticalDown: 'VERTICAL_DOWN';
    HorizontalLeft: 'HORIZONTAL_LEFT';
    HorizontalRight: 'HORIZONTAL_RIGHT';
    DiagonalUpRight: 'DIAGONAL_UP_RIGHT';
    DiagonalUpLeft: 'DIAGONAL_UP_LEFT';
    DiagonalDownRight: 'DIAGONAL_DOWN_RIGHT';
    DiagonalDownLeft: 'DIAGONAL_DOWN_LEFT';
  };

  export const GestureDescriptions: {
    Victory: GestureDescription;
    ThumbsUp: GestureDescription;
  };
}
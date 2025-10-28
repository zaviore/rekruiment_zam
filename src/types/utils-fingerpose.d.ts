declare module '@/utils/fingerpose' {
  import { GestureDescription } from 'fingerpose';

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

  export class GestureEstimator {
    constructor(knownGestures: GestureDescription[]);
    estimate(landmarks: number[][], minConfidence?: number): {
      gestures: Array<{
        name: string;
        score: number;
      }>;
    };
  }

  export class GestureDescription {
    constructor(name: string);
    addCurl(finger: string, curl: string, weight?: number): GestureDescription;
    addDirection(finger: string, direction: string, weight?: number): GestureDescription;
  }

  export const Gestures: {
    VictoryGesture: GestureDescription;
    ThumbsUpGesture: GestureDescription;
    ThreeFingerGesture: GestureDescription;
    TwoFingerGesture: GestureDescription;
    OneFingerGesture: GestureDescription;
  };

  const fingerpose: {
    GestureEstimator: typeof GestureEstimator;
    GestureDescription: typeof GestureDescription;
    Finger: typeof Finger;
    FingerCurl: typeof FingerCurl;
    FingerDirection: typeof FingerDirection;
    Gestures: typeof Gestures;
  };

  export default fingerpose;
}
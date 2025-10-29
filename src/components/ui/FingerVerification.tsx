"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "@/utils/drawhand";
import Webcam from "react-webcam";

import "./FingerVerification.css";
import * as fp from "fingerpose";
import { X } from "lucide-react";

const FingerVerification: React.FC<{
  onClose?: () => void;
  onComplete?: (photoData: string) => void;
}> = ({ onClose, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const handposeModelRef = useRef<handpose.HandPose | null>(null);
  const isRunningRef = useRef<boolean>(true);
  const [status, setStatus] = useState<string>("Memuat model...");
  const [isVerified, setIsVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [gesture, setGesture] = useState<string>("Menunggu...");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [stepsCompleted, setStepsCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
  });

  const stepsCompletedRef = useRef({
    step1: false,
    step2: false,
    step3: false,
  });

  const initHandposeModel = async () => {
    try {
      setStatus("🧠 Memuat model handpose...");
      console.log("Mulai memuat model handpose...");

      await tf.ready();
      console.log("TensorFlow.js backend:", tf.getBackend());

      const model = await handpose.load();
      handposeModelRef.current = model;

      setStatus("Model siap!");
      setModelLoaded(true);
    } catch (err) {
      console.error("Gagal memuat model:", err);
      setStatus("Gagal memuat model");
    }
  };

  const initCamera = async () => {
    try {
      setStatus("� Mengaktifkan kamera...");
      console.log("Mengaktifkan kamera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: 15 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          console.log("Video benar-benar siap!");
          console.log("Video readyState:", videoRef.current?.readyState);

          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }

          setCameraActive(true);
          setStatus("Kamera siap. Klik tombol mulai deteksi.");
        };

        videoRef.current.play().catch((err) => {
          console.error("Error saat play video:", err);
        });
      }
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      setStatus("Gagal mengakses kamera");
    }
  };

  const startDetection = async () => {
    if (!handposeModelRef.current || !videoRef.current) {
      setStatus("Model atau kamera belum siap");
      return;
    }

    setStatus("Mendeteksi tangan..");
    console.log("Mulai deteksi tangan dengan model:", handposeModelRef.current);

    const threeFingerGesture = new fp.GestureDescription("three_finger");
    const twoFingerGesture = new fp.GestureDescription("two_finger");
    const oneFingerGesture = new fp.GestureDescription("one_finger");
    threeFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(
      fp.Finger.Index,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    threeFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(
      fp.Finger.Middle,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    threeFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(
      fp.Finger.Ring,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    threeFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

    threeFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);

    twoFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    twoFingerGesture.addDirection(
      fp.Finger.Index,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    twoFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
    twoFingerGesture.addDirection(
      fp.Finger.Middle,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    twoFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
    twoFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    twoFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);

    oneFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    oneFingerGesture.addDirection(
      fp.Finger.Index,
      fp.FingerDirection.VerticalUp,
      1.0
    );

    oneFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.8);

    const gestureEstimator = new fp.GestureEstimator([
      threeFingerGesture,
      twoFingerGesture,
      oneFingerGesture,
    ]);

    console.log("Gesture estimator dibuat dengan gesture kustom");

    try {
      const detect = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          console.log("Video belum siap, menunggu..");
          requestAnimationFrame(detect);
          return;
        }

        try {
          console.log("Mencoba mendeteksi tangan...");
          const hands = await handposeModelRef.current!.estimateHands(
            videoRef.current
          );
          console.log(
            "Hasil deteksi tangan:",
            hands.length > 0 ? "Tangan terdeteksi" : "Tidak ada tangan"
          );

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;

              ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );

              ctx.drawImage(
                videoRef.current,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );

              if (hands.length > 0) {
                drawHand(hands, ctx);
                setHandDetected(true);

                const landmarks = hands[0].landmarks;
                console.log("Landmarks terdeteksi:", landmarks.length);
                const gestureResult = gestureEstimator.estimate(landmarks, 7.5);

                console.log("Gesture results:", gestureResult.gestures);

                if (gestureResult.gestures.length > 0) {
                  const bestGesture = gestureResult.gestures.reduce(
                    (prev, curr) => (prev.score > curr.score ? prev : curr)
                  );

                  if (
                    !stepsCompletedRef.current.step1 &&
                    bestGesture.name === "three_finger"
                  ) {
                    setGesture("three_finger");
                    stepsCompletedRef.current.step1 = true;

                    setStepsCompleted({
                      step1: true,
                      step2: false,
                      step3: false,
                    });

                    setStatus(
                      "Langkah 1 berhasil! Tunjukkan 2 jari (telunjuk dan tengah)"
                    );
                    setVerificationStep(2);
                  } else if (
                    stepsCompletedRef.current.step1 &&
                    !stepsCompletedRef.current.step2 &&
                    bestGesture.name === "two_finger"
                  ) {
                    setGesture("two_finger");
                    stepsCompletedRef.current.step2 = true;
                    setStepsCompleted({
                      step1: true,
                      step2: true,
                      step3: false,
                    });

                    setStatus(
                      "Langkah 2 berhasil! Tunjukkan 1 jari (telunjuk)"
                    );
                    setVerificationStep(3);
                  } else if (
                    stepsCompletedRef.current.step1 &&
                    stepsCompletedRef.current.step2 &&
                    !stepsCompletedRef.current.step3 &&
                    bestGesture.name === "one_finger"
                  ) {
                    console.log("1 jari terdeteksi!");
                    setGesture("one_finger");
                    stepsCompletedRef.current.step3 = true;

                    setStepsCompleted({
                      step1: true,
                      step2: true,
                      step3: true,
                    });

                    setStatus("Verifikasi berhasil! Semua langkah selesai.");
                    setIsVerified(true);

                    isRunningRef.current = false;

                    if (videoRef.current && videoRef.current.srcObject) {
                      const stream = videoRef.current.srcObject as MediaStream;
                      stream.getTracks().forEach((track) => track.stop());
                    }

                    setTimeout(() => {
                      setShowWebcam(true);
                      setStatus(
                        "Verifikasi berhasil! Siap untuk mengambil foto. Klik tombol untuk mengambil foto."
                      );
                    }, 1000);
                  } else {
                    setGesture(
                      `Terdeteksi: ${
                        bestGesture.name
                      } (Skor: ${bestGesture.score.toFixed(2)})`
                    );
                  }
                } else {
                  setGesture("Menunggu pose yang benar...");
                }
              } else {
                setHandDetected(false);
                setGesture("Menunggu tangan...");
              }
            }
          }
        } catch (detectError) {
          console.error("Error dalam loop deteksi:", detectError);
        }

        if (!isVerified && isRunningRef.current) {
          requestAnimationFrame(detect);
        }
      };

      detect();
    } catch (err) {
      console.error("Error saat deteksi:", err);
      setStatus("Error saat deteksi");
    }
  };

  useEffect(() => {
    const init = async () => {
      await initHandposeModel();
      await initCamera();
    };

    init();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setStatus("Foto berhasil diambil. Gunakan atau ambil ulang foto.");
    }
  };

  const cleanupAllResources = useCallback(() => {
    console.log("Cleaning up all camera resources...");
    isRunningRef.current = false;

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Video track stopped:", track.kind);
      });
      videoRef.current.srcObject = null;
    }

    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.srcObject
    ) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Webcam track stopped:", track.kind);
      });
      webcamRef.current.video.srcObject = null;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Force stopped additional track:", track.kind);
        });
      })
      .catch((err) => console.log("No additional tracks to stop"));
  }, []);

  useEffect(() => {
    (window as any).stopFingerVerificationCamera = cleanupAllResources;

    return () => {
      delete (window as any).stopFingerVerificationCamera;
    };
  }, [cleanupAllResources]);

  return (
    <div className="finger-verification">
      <div className="flex w-full justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Raise Your Hand to Capture </h3>
          <p className="text-sm">
            We’ll take the photo once your hand pose is detected.
          </p>
        </div>
        <div>
          <div
            id="closeFingerVerification"
            onClick={(e) => {
              e.preventDefault();
              cleanupAllResources();
              if (onClose) {
                onClose();
              }
            }}
            className="w-full py-2 text-gray-800 rounded-md cursor-pointer "
          >
            <X size={18} />
          </div>
        </div>
      </div>
      <div className="verification-steps">
        <h3>Langkah Verifikasi:</h3>
        <div className="step-item">
          <div
            className={`step-number ${
              stepsCompleted.step1
                ? "completed"
                : verificationStep === 1
                ? "active"
                : ""
            }`}
          >
            1
          </div>
          <div className="step-desc">
            Tunjukkan 3 jari (telunjuk, tengah, manis)
          </div>
        </div>
        <div className="step-item">
          <div
            className={`step-number ${
              stepsCompleted.step2
                ? "completed"
                : verificationStep === 2
                ? "active"
                : ""
            }`}
          >
            2
          </div>
          <div className="step-desc">
            Tunjukkan 2 jari (telunjuk dan tengah)
          </div>
        </div>
        <div className="step-item">
          <div
            className={`step-number ${
              stepsCompleted.step3
                ? "completed"
                : verificationStep === 3
                ? "active"
                : ""
            }`}
          >
            3
          </div>
          <div className="step-desc">Tunjukkan 1 jari (telunjuk)</div>
        </div>
      </div>

      <div className="video-container">
        {!showWebcam && (
          <>
            <video ref={videoRef} className="input-video" playsInline />
            <canvas ref={canvasRef} className="output-canvas" />
          </>
        )}

        {showWebcam && (
          <div className="webcam-container">
            {!capturedImage ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="webcam"
              />
            ) : (
              <div className="captured-image-container">
                <img
                  src={capturedImage}
                  alt="Foto yang diambil"
                  className="captured-image"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="controls">
        {!cameraActive && !showWebcam && (
          <button
            type="button"
            onClick={initCamera}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            Aktifkan Kamera
          </button>
        )}

        {cameraActive && !showWebcam && (
          <button
            type="button"
            onClick={startDetection}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
            disabled={!modelLoaded}
          >
            {modelLoaded ? "Mulai Verifikasi" : "loading..."}
          </button>
        )}

        {showWebcam && !capturedImage && (
          <button
            type="button"
            onClick={captureImage}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
          >
            Ambil Foto
          </button>
        )}

        {showWebcam && capturedImage && (
          <div className="button-group">
            <button
              onClick={() => setCapturedImage(null)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold mr-2"
            >
              Ambil Ulang
            </button>
            <button
              onClick={() => {
                setStatus("Foto berhasil disimpan ke form aplikasi");

                if (onComplete && capturedImage) {
                  onComplete(capturedImage);
                }

                cleanupAllResources();
                setShowWebcam(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            >
              Gunakan Foto Ini
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FingerVerification;

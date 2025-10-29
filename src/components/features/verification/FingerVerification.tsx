"use client";
import React from "react";
import { X } from "lucide-react";
import Webcam from "react-webcam";

import "./FingerVerification.css";
import { useVerification } from "./hooks";

const FingerVerification: React.FC<{
  onClose?: () => void;
  onComplete?: (photoData: string) => void;
}> = ({ onClose, onComplete }) => {
  const {
    captureImage,
    videoRef,
    canvasRef,
    webcamRef,
    cameraActive,
    modelLoaded,
    showWebcam,
    setShowWebcam,
    capturedImage,
    setCapturedImage,
    verificationStep,
    stepsCompleted,
    startDetection,
    cleanupAllResources,
    setStatus,
  } = useVerification();

  return (
    <div className="finger-verification">
      <div className="flex w-full justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Raise Your Hand to Capture </h3>
          <p className="text-sm">
            We'll take the photo once your hand pose is detected.
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
            onClick={() => startDetection()}
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
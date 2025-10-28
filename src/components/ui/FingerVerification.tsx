"use client"
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "@/utils/drawhand";

import "./FingerVerification.css";
import * as fp from "fingerpose";

const FingerVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handposeModelRef = useRef<handpose.HandPose | null>(null);
  const [status, setStatus] = useState<string>("Memuat model...");
  const [isVerified, setIsVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [gesture, setGesture] = useState<string>("Menunggu...");
  
  // State untuk melacak langkah-langkah verifikasi
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [stepsCompleted, setStepsCompleted] = useState({
    step1: false, // 3 jari
    step2: false, // 2 jari
    step3: false  // 1 jari
  });

  // Inisialisasi model handpose
  const initHandposeModel = async () => {
    try {
      setStatus("🧠 Memuat model handpose...");
      console.log("Mulai memuat model handpose...");
      
      // Inisialisasi TensorFlow.js backend
      await tf.ready();
      console.log("TensorFlow.js backend:", tf.getBackend());
      
      // Memuat model handpose
      const model = await handpose.load();
      handposeModelRef.current = model;
      
      console.log("✅ Model Handpose berhasil dimuat!");
      setStatus("✅ Model siap!");
      setModelLoaded(true);
    } catch (err) {
      console.error("❌ Gagal memuat model:", err);
      setStatus("❌ Gagal memuat model");
    }
  };

  // Inisialisasi kamera
  const initCamera = async () => {
    try {
      setStatus("📷 Mengaktifkan kamera...");
      console.log("Mengaktifkan kamera...");
      
      // Coba dengan resolusi lebih rendah untuk performa lebih baik
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: 15 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          console.log("✅ Video benar-benar siap!");
          console.log("Video readyState:", videoRef.current?.readyState);
          
          // Sesuaikan ukuran canvas dengan video
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          
          setCameraActive(true);
          setStatus("✅ Kamera siap. Klik tombol mulai deteksi.");
        };
        
        // Pastikan video dimainkan
        videoRef.current.play().catch(err => {
          console.error("Error saat play video:", err);
        });
      }
    } catch (err) {
      console.error("❌ Gagal mengakses kamera:", err);
      setStatus("❌ Gagal mengakses kamera");
    }
  };

  // Mulai deteksi tangan
  const startDetection = async () => {
    if (!handposeModelRef.current || !videoRef.current) {
      setStatus("Model atau kamera belum siap");
      return;
    }

    setStatus("🔍 Mendeteksi tangan...");
    console.log("Mulai deteksi tangan dengan model:", handposeModelRef.current);
    
    // Buat gesture descriptions untuk 3 jari, 2 jari, dan 1 jari
    const threeFingerGesture = new fp.GestureDescription('three_finger');
    const twoFingerGesture = new fp.GestureDescription('two_finger');
    const oneFingerGesture = new fp.GestureDescription('one_finger');
    
    // Konfigurasi untuk 3 jari (telunjuk, tengah, manis)
    // Telunjuk lurus
    threeFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari tengah lurus
    threeFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari manis lurus
    threeFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
    threeFingerGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari kelingking ditekuk
    threeFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    
    // Jempol ditekuk
    threeFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
    
    // Konfigurasi untuk 2 jari (telunjuk dan tengah)
    // Telunjuk lurus
    twoFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    twoFingerGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari tengah lurus
    twoFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
    twoFingerGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari lainnya ditekuk
    twoFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
    twoFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    twoFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
    
    // Konfigurasi untuk 1 jari (telunjuk)
    // Telunjuk lurus
    oneFingerGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    oneFingerGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    
    // Jari lainnya ditekuk
    oneFingerGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    oneFingerGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.8);
    
    // Inisialisasi gesture estimator dengan pose kustom
    const gestureEstimator = new fp.GestureEstimator([
      threeFingerGesture,
      twoFingerGesture,
      oneFingerGesture,
    ]);
    
    console.log("Gesture estimator dibuat dengan gesture kustom");
    
    try {
      // Loop deteksi
      const detect = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          console.log("Video belum siap, menunggu...");
          requestAnimationFrame(detect);
          return;
        }
        
        try {
          // Deteksi tangan
          console.log("Mencoba mendeteksi tangan...");
          const hands = await handposeModelRef.current!.estimateHands(videoRef.current);
          console.log("Hasil deteksi tangan:", hands.length > 0 ? "Tangan terdeteksi" : "Tidak ada tangan");
          
          // Gambar tangan jika terdeteksi
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              // Sesuaikan ukuran canvas dengan video
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              
              // Bersihkan canvas
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              
              // Gambar video ke canvas untuk debugging
              ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
              
              // Gambar tangan
              if (hands.length > 0) {
                drawHand(hands, ctx);
                setHandDetected(true);
                
                // Estimasi gesture menggunakan fingerpose
                const landmarks = hands[0].landmarks;
                console.log("Landmarks terdeteksi:", landmarks.length);
                const gestureResult = gestureEstimator.estimate(landmarks, 7.5);
                
                console.log("Gesture results:", gestureResult.gestures);
                
                if (gestureResult.gestures.length > 0) {
                  // Ambil gesture dengan skor tertinggi
                  const bestGesture = gestureResult.gestures.reduce((prev, curr) => 
                    prev.score > curr.score ? prev : curr
                  );
                  
                  console.log("Best gesture:", bestGesture.name, "score:", bestGesture.score);
                  
                  // Proses berdasarkan langkah verifikasi
                  console.log("Verifikasi step:", verificationStep, "Gesture terdeteksi:", bestGesture.name);
                  
                  if (verificationStep === 1 && bestGesture.name === 'three_finger') {
                    console.log("3 jari terdeteksi!");
                    setGesture("three_finger");
                    setStepsCompleted(prev => ({ ...prev, step1: true }));
                    setStatus("✅ Langkah 1 berhasil! Tunjukkan 2 jari (telunjuk dan tengah)");
                    setVerificationStep(2);
                  } 
                  else if (verificationStep === 2 && bestGesture.name === 'two_finger') {
                    console.log("2 jari terdeteksi!");
                    setGesture("two_finger");
                    setStepsCompleted(prev => ({ ...prev, step2: true }));
                    setStatus("✅ Langkah 2 berhasil! Tunjukkan 1 jari (telunjuk)");
                    setVerificationStep(3);
                  }
                  else if (verificationStep === 3 && bestGesture.name === 'one_finger') {
                    console.log("1 jari terdeteksi!");
                    setGesture("one_finger");
                    setStepsCompleted(prev => ({ ...prev, step3: true }));
                    setStatus("✅ Verifikasi berhasil! Semua langkah selesai.");
                    setIsVerified(true);
                    // Ambil gambar otomatis setelah semua langkah selesai
                    setTimeout(() => {
                      captureImage();
                    }, 1000);
                  } else {
                    // Tampilkan nama gesture yang terdeteksi
                    setGesture(`Terdeteksi: ${bestGesture.name} (Skor: ${bestGesture.score.toFixed(2)})`);
                    console.log("Gesture tidak sesuai dengan step saat ini:", bestGesture.name, "Step:", verificationStep);
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
        
        // Lanjutkan loop deteksi jika belum terverifikasi
        if (!isVerified) {
          requestAnimationFrame(detect);
        }
      };
      
      // Mulai loop deteksi
      detect();
    } catch (err) {
      console.error("Error saat deteksi:", err);
      setStatus("❌ Error saat deteksi");
    }
  };

  // Inisialisasi saat komponen dimuat
  useEffect(() => {
    const init = async () => {
      await initHandposeModel();
      await initCamera();
    };
    
    init();
    
    // Cleanup saat komponen unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fungsi untuk mengambil gambar dari kamera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Sesuaikan ukuran canvas dengan video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Gambar frame video ke canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Tambahkan overlay teks
        context.font = '20px Arial';
        context.fillStyle = 'green';
        context.fillText('Terverifikasi', 10, 30);
        
        setStatus("Gambar berhasil diambil");
      }
    }
  };

  return (
    <div className="finger-verification">
      <h2>Verifikasi Pengguna</h2>
      
      {/* Instruksi langkah verifikasi */}
      <div className="verification-steps">
        <h3>Langkah Verifikasi:</h3>
        <div className="step-item">
          <div className={`step-number ${stepsCompleted.step1 ? 'completed' : (verificationStep === 1 ? 'active' : '')}`}>1</div>
          <div className="step-desc">Tunjukkan 3 jari (jempol, telunjuk, tengah)</div>
        </div>
        <div className="step-item">
          <div className={`step-number ${stepsCompleted.step2 ? 'completed' : (verificationStep === 2 ? 'active' : '')}`}>2</div>
          <div className="step-desc">Tunjukkan 2 jari (telunjuk dan tengah)</div>
        </div>
        <div className="step-item">
          <div className={`step-number ${stepsCompleted.step3 ? 'completed' : (verificationStep === 3 ? 'active' : '')}`}>3</div>
          <div className="step-desc">Tunjukkan 1 jari (telunjuk)</div>
        </div>
      </div>
      
      <div className="video-container">
        <video 
          ref={videoRef} 
          className="input-video"
          playsInline
        />
        <canvas ref={canvasRef} className="output-canvas" />
      </div>
      
      <div className="controls">
        {!cameraActive && (
          <button 
            onClick={initCamera}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            Aktifkan Kamera
          </button>
        )}
        
        {cameraActive && !isVerified && !handDetected && (
          <button 
            onClick={startDetection}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
          >
            Mulai Deteksi
          </button>
        )}
        
        {isVerified && (
          <button 
            onClick={captureImage}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Ambil Gambar Lagi
          </button>
        )}
      </div>
      
      {gesture && (
        <div className="gesture-info">
          <p>Gesture terdeteksi: <strong>{gesture}</strong></p>
        </div>
      )}
    </div>
  );
};

export default FingerVerification;
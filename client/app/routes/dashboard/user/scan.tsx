import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  QrCode,
  Camera,
  CameraOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import jsQR from "jsqr";
import { useNavigate } from "react-router";

interface QrReaderState {
  isScanning: boolean;
  hasPermission: boolean;
  error: string | null;
  scannedCode: string | null;
}

export default function UserScan() {
  const navigate = useNavigate();
  const [qrState, setQrState] = useState<QrReaderState>({
    isScanning: false,
    hasPermission: false,
    error: null,
    scannedCode: null,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });
      setQrState((prev) => ({ ...prev, hasPermission: true, error: null }));
      return stream;
    } catch (error) {
      console.error("Camera permission denied:", error);
      setQrState((prev) => ({
        ...prev,
        hasPermission: false,
        error:
          "Camera permission denied. Please allow camera access to scan QR codes.",
      }));
      return null;
    }
  };

  const startQrScanning = async () => {
    setQrState((prev) => ({
      ...prev,
      isScanning: true,
      error: null,
      scannedCode: null,
    }));

    const stream = await requestCameraPermission();
    if (!stream) return;

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // Start scanning loop
      const scanQrCode = () => {
        if (!qrState.isScanning || !videoRef.current || !canvasRef.current)
          return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log("QR Code detected:", code.data);
          setQrState((prev) => ({ ...prev, scannedCode: code.data }));
          stopQrScanning();

          // Navigate to room page with the scanned machine code
          navigate(`/room/${code.data}`);
          return;
        }

        if (qrState.isScanning) {
          requestAnimationFrame(scanQrCode);
        }
      };

      scanQrCode();
    }
  };

  const stopQrScanning = () => {
    setQrState((prev) => ({ ...prev, isScanning: false }));

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 text-white mb-4">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Scan QR Code
        </h1>
        <p className="text-gray-500 max-w-xs mx-auto">
          Arahkan kamera ke kode QR pada mesin untuk memulai sesi daur ulang.
        </p>
      </div>

      {/* Main Scanner Area */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl ring-8 ring-gray-100 dark:ring-gray-800 aspect-[3/4] group">
        {/* State: Initial */}
        {!qrState.isScanning && !qrState.scannedCode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                <Camera className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Siap Memindai?
                </h3>
                <p className="text-gray-300 text-sm">
                  Pastikan ruangan cukup cahaya agar QR Code terbaca dengan
                  jelas.
                </p>
              </div>

              {qrState.error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-sm text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {qrState.error}
                </div>
              )}

              <Button
                onClick={startQrScanning}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 border-0 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Mulai Kamera
              </Button>
            </div>
          </div>
        )}

        {/* State: Scanning */}
        {qrState.isScanning && (
          <div className="absolute inset-0 bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanner Overlay UI */}
            <div className="absolute inset-0 z-10">
              {/* Dark corners */}
              <div className="absolute inset-0 bg-gray-900/30"></div>

              {/* Focus Frame */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-emerald-500 rounded-tl-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-emerald-500 rounded-tr-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-emerald-500 rounded-bl-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-emerald-500 rounded-br-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                {/* Scanning Animation Line */}
                <div className="absolute w-full h-1 bg-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite] top-0"></div>

                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
                <Button
                  onClick={stopQrScanning}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full px-6 py-6 h-auto flex flex-col items-center gap-2"
                >
                  <div className="p-2 bg-red-500 rounded-full shadow-lg shadow-red-500/40">
                    <CameraOff className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Stop</span>
                </Button>
              </div>

              <div className="absolute top-8 left-0 right-0 text-center">
                <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-white/10">
                  Scanning...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* State: Success */}
        {qrState.scannedCode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-600 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Berhasil!</h2>
            <p className="text-emerald-100 mb-8 max-w-[200px]">
              QR Code terdeteksi. Mengalihkan Anda sekarang...
            </p>

            <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white font-mono text-lg">
              {qrState.scannedCode}
            </div>

            <div className="mt-8 flex gap-2 justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Guide Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Panduan
          Cepat
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Cahaya", desc: "Pastikan cukup terang" },
            { title: "Jarak", desc: "Jaga jarak 15-30cm" },
            { title: "Posisi", desc: "Tepat di dalam kotak" },
            { title: "Bersih", desc: "Lensa kamera bersih" },
          ].map((guide, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="text-gray-400 text-xs">0{i + 1}</div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {guide.title}
                </p>
                {/* <p className="text-xs text-gray-400">{guide.desc}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

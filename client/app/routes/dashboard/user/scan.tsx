import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
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
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Use back camera on mobile
      });
      setQrState(prev => ({ ...prev, hasPermission: true, error: null }));
      return stream;
    } catch (error) {
      console.error("Camera permission denied:", error);
      setQrState(prev => ({
        ...prev,
        hasPermission: false,
        error: "Camera permission denied. Please allow camera access to scan QR codes."
      }));
      return null;
    }
  };

  const startQrScanning = async () => {
    setQrState(prev => ({ ...prev, isScanning: true, error: null, scannedCode: null }));

    const stream = await requestCameraPermission();
    if (!stream) return;

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      // Start scanning loop
      const scanQrCode = () => {
        if (!qrState.isScanning || !videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          console.log("QR Code detected:", code.data);
          setQrState(prev => ({ ...prev, scannedCode: code.data }));
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
    setQrState(prev => ({ ...prev, isScanning: false }));

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="animate-in slide-in-from-left-4 duration-500">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <QrCode className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          Scan QR Code
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gunakan kamera untuk memindai kode QR pada mesin Replas Bank
        </p>
      </div>

      {/* QR Scanner Card */}
      {!qrState.isScanning && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6" />
              Scan Machine QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Scan Machine QR Code</div>
              <div className="text-sm text-muted-foreground">
                Point your camera at the machine's QR code to start your recycling session
              </div>
            </div>

            {qrState.error && (
              <div className="text-sm text-center text-red-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {qrState.error}
              </div>
            )}

            <Button
              onClick={startQrScanning}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
              disabled={qrState.isScanning}
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Camera Scanner */}
      {qrState.isScanning && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <Camera className="w-6 h-6" />
              Scanning QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-80 bg-black rounded-lg"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-lg"></div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Position the QR code within the frame
            </div>

            <Button
              onClick={stopQrScanning}
              variant="outline"
              className="w-full"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Scanning
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {qrState.scannedCode && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                QR Code Detected!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Code: {qrState.scannedCode}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Redirecting to machine activation...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            How to Scan QR Codes:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li>• Make sure you have good lighting</li>
            <li>• Hold your device steady</li>
            <li>• Position the QR code within the scanning frame</li>
            <li>• The app will automatically detect and process the code</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Clock,
  Package,
  Coins,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  QrCode,
  Camera,
  CameraOff,
  ArrowLeft,
} from "lucide-react";
import jsQR from "jsqr";
import { useParams, useNavigate } from "react-router";
import { websocketService } from "../../lib/websocket";

export function meta() {
  return [
    { title: "Room Session - Replas" },
    {
      name: "description",
      content: "Room session for bottle collection and point conversion.",
    },
  ];
}

interface RoomSession {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  location: string;
  startTime: Date;
  totalBottles: number;
  pointsEarned: number;
  isActive: boolean;
}

interface QrReaderState {
  isScanning: boolean;
  hasPermission: boolean;
  error: string | null;
  scannedCode: string | null;
}

export default function Room() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { machineCode } = useParams<{ machineCode: string }>();
  const defaultCode = machineCode || "banksampah01";
  const [session, setSession] = useState<RoomSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [realTimeBottles, setRealTimeBottles] = useState(0);
  const [realTimePoints, setRealTimePoints] = useState(0);
  const [isActivating, setIsActivating] = useState(false);

  // Get user role from localStorage
  const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleBackToDashboard = async () => {
    // Auto-end session if active before navigating
    if (session?.isActive && session.roomCode) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
          await fetch("/api/iot/session-end", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              machineId: session.roomCode,
              totalBottles: realTimeBottles,
            }),
          });
          // Update session state to reflect ended session
          setSession((prev) =>
            prev
              ? {
                  ...prev,
                  isActive: false,
                  totalBottles: realTimeBottles,
                  pointsEarned: realTimePoints,
                }
              : null
          );
          setMessage(`Session ended! You earned ${realTimePoints} points.`);
        }
      } catch (error) {
        console.error("Failed to end session:", error);
        setMessage("Failed to end session properly");
      } finally {
        setIsLoading(false);
      }
    }

    // Navigate to appropriate dashboard
    const role = getUserRole();
    if (role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/user');
    }
  };

  // QR Code scanning state
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

  // Auto-activate when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login with return URL
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!session && !isActivating && !qrState.isScanning) {
      handleActivate(defaultCode);
    }
  }, [session, isActivating, qrState.isScanning, defaultCode]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (session?.isActive && session.roomCode) {
      // Connect to WebSocket
      websocketService.connect(session.roomCode);

      // Register message handlers
      websocketService.onMessage("bottle_update", (data) => {
        setRealTimeBottles(data.bottleCount);
        setRealTimePoints(data.points);
      });

      websocketService.onMessage("session_update", (data) => {
        if (data.status === "ended") {
          setMessage(data.message || "Session ended");
        }
      });

      // Cleanup on unmount or session end
      return () => {
        websocketService.offMessage("bottle_update");
        websocketService.offMessage("session_update");
        if (!session.isActive) {
          websocketService.disconnect();
        }
      };
    }
  }, [session?.isActive, session?.roomCode]);

  // Auto-end session when navigating away
  useEffect(() => {
    return () => {
      if (session?.isActive && session.roomCode) {
        // Automatically end the session when user navigates away
        const endSessionOnNavigate = async () => {
          try {
            const token = localStorage.getItem("token");
            if (token) {
              await fetch("/api/iot/session-end", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  machineId: session.roomCode,
                  totalBottles: realTimeBottles,
                }),
              });
              // Note: We don't update UI since component is unmounting
            }
          } catch (error) {
            console.error("Failed to auto-end session:", error);
          }
        };
        endSessionOnNavigate();
      }
    };
  }, [session?.isActive, session?.roomCode, realTimeBottles]);

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
          handleActivate(code.data);
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

  const handleActivate = async (machineCode: string) => {
    setIsActivating(true);
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/iot/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ machineId: machineCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setSession({
          id: data.sessionId,
          userId: "current-user", // Would come from JWT
          userName: "Current User", // Would come from JWT
          roomId: data.machine.id,
          roomCode: data.machine.code,
          roomName: data.machine.name || `Room ${data.machine.code}`,
          location: data.machine.location || "Unknown Location",
          startTime: new Date(),
          totalBottles: 0,
          pointsEarned: 0,
          isActive: true,
        });
        setMessage("Machine activated successfully!");
      } else {
        const error = await response.json();
        if (response.status === 409) {
          setMessage(error.details || error.error || "Ruangan sedang digunakan");
        } else {
          setMessage(error.error || "Failed to activate machine");
        }
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setIsLoading(false);
      setIsActivating(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "/api/iot/session-end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            machineId: session.roomCode,
            totalBottles: realTimeBottles,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSession((prev) =>
          prev
            ? {
                ...prev,
                isActive: false,
                totalBottles: realTimeBottles,
                pointsEarned: data.points,
              }
            : null
        );
        setMessage(`Session ended! You earned ${data.points} points.`);
        setRealTimeBottles(0);
        setRealTimePoints(0);
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to end session");
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={handleBackToDashboard}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src="/logo_3.webp"
              alt="Replas Logo"
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground">
            Room Session
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Activate your recycling session and earn points
          </p>
        </div>

        {/* QR Scanner Card */}
        {!session && !qrState.isScanning && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6" />
                Scan QR Code
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
                <div className="text-sm text-center text-red-600">
                  {qrState.error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={startQrScanning}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={qrState.isScanning}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>

                <Button
                  onClick={() => handleActivate(defaultCode)}
                  variant="outline"
                  className="flex-1"
                  disabled={isActivating}
                >
                  {isActivating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    "Manual Entry"
                  )}
                </Button>
              </div>

              {message && (
                <div
                  className={`text-sm text-center ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}
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
                  className="w-full h-64 bg-black rounded-lg"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-lg"></div>
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

        {/* Activation Card (Manual) */}
        {!session && !qrState.isScanning && isActivating && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Activating Machine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Machine Code: {defaultCode}</div>
                <div className="text-sm text-muted-foreground">
                  Activating your recycling session...
                </div>
              </div>

              {message && (
                <div
                  className={`text-sm text-center ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              {isActivating && (
                <div className="flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Session Card */}
        {session && session.isActive && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Session Info */}
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Active Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">User:</span>
                    <span className="text-sm">{session.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Room:</span>
                    <span className="text-sm">{session.roomName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm font-mono">
                      {formatDuration(session.startTime)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Session Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Stats */}
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Real-time Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {realTimeBottles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bottles Detected
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {realTimePoints}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Points Earned
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Points per bottle: 10
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Session Summary (After End) */}
        {session && !session.isActive && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {session.totalBottles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Bottles
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {session.pointsEarned}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Points Earned
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatDuration(session.startTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Session Duration
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">User:</span>
                  <span>{session.userName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Room:</span>
                  <span>{session.roomName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Location:</span>
                  <span>{session.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Start Time:</span>
                  <span>{session.startTime.toLocaleString()}</span>
                </div>
              </div>

              {message && (
                <div className="text-center text-green-600 font-medium">
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSession(null);
                    setMessage("");
                    setRealTimeBottles(0);
                    setRealTimePoints(0);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Start New Session
                </Button>
                <Button
                  onClick={handleBackToDashboard}
                  variant="outline"
                  className="flex-1"
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* End Session Button */}
        {session && session.isActive && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <Button
                onClick={handleEndSession}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
              >
                {isLoading ? "Ending Session..." : "End Session & Claim Points"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

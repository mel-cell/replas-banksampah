import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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

export default function Room() {
  const { t } = useTranslation();
  const hardcodedCode = "banksampah01";
  const [session, setSession] = useState<RoomSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [realTimeBottles, setRealTimeBottles] = useState(0);
  const [realTimePoints, setRealTimePoints] = useState(0);
  const [isActivating, setIsActivating] = useState(false);

  // Auto-activate when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login with return URL
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!session && !isActivating) {
      handleActivate(hardcodedCode);
    }
  }, [session, isActivating]);

  // Real-time bottle count updates via polling
  useEffect(() => {
    if (session?.isActive) {
      const interval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/iot/machine/${session.roomCode}/bottle-count`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setRealTimeBottles(data.bottles);
            setRealTimePoints(data.points);
          }
        } catch (error) {
          console.error("Failed to fetch bottle count:", error);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [session?.isActive, session?.roomCode]);

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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/iot/activate`, {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/iot/session-end`,
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
          <img
            src="/logo_3.webp"
            alt="Replas Logo"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-4xl font-extrabold text-foreground">
            Room Session
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Activate your recycling session and earn points
          </p>
        </div>

        {/* Activation Card */}
        {!session && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-center text-green-600 flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Activating Machine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Machine Code: {hardcodedCode}</div>
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

              <Button
                onClick={() => {
                  setSession(null);
                  setMessage("");
                  setRealTimeBottles(0);
                  setRealTimePoints(0);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Start New Session
              </Button>
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

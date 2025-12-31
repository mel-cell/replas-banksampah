import React, { useState, useEffect } from "react";
import {
  Monitor,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Eye,
  QrCode,
  Download,
  Plus,
  Wifi,
  WifiOff,
  ArrowLeft,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { adminWebSocketService } from "../../../lib/adminWebsocket";
import { useNavigate } from "react-router";

interface Room {
  id: string;
  code: string;
  name: string;
  location: string;
  status: "idle" | "in_use" | "maintenance";
  isActive: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  connected?: boolean;
  issue?: string;
  bottleCount?: number;
  points?: number;
  lastActivity?: string;
  currentUser?: {
    name: string;
    activity: string;
    startTime: string;
  };
  lastMaintenance: string;
}

interface QrModalProps {
  room: Room;
  onClose: () => void;
}

export default function MonitorRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Get user role from localStorage
  const getUserRole = () => {
    const user = localStorage.getItem("user");
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

  const handleBackToDashboard = () => {
    const role = getUserRole();
    if (role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/user");
    }
  };

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/api/web/dashboard/admin/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Merge API data with real-time fields
          const mergedRooms = (data.rooms || []).map((room: any) => ({
            ...room,
            connected: room.isOnline || false, // Use isOnline from database
            bottleCount: 0,
            points: 0,
            lastActivity: room.lastSeen || new Date().toISOString(),
            issue: room.isOnline === false ? "IoT device offline" : undefined,
          }));
          setRooms(mergedRooms);
        } else {
          console.error("Failed to fetch rooms");
          // Use sample room if API fails
          setRooms([sampleRoom]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Use sample room if fetch fails
        setRooms([sampleRoom]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const roomsToShow = rooms.filter(
    (room) => filterStatus === "all" || room.status === filterStatus
  );

  const sampleRoom: Room = {
    id: "R001",
    code: "banksampah01",
    name: "Ruang Monitoring Utama",
    location: "SMKN 6 Malang",
    status: "idle",
    isActive: true,
    connected: true,
    bottleCount: 0,
    points: 0,
    lastActivity: new Date().toISOString(),
    currentUser: {
      name: "Ahmad Surya",
      activity: "Menimbang sampah plastik",
      startTime: "14:30",
    },
    lastMaintenance: "2024-01-15",
  };

  // Use sample if no real data
  const displayRooms = rooms.length > 0 ? roomsToShow : [sampleRoom];

  const getStatusConfig = (status: Room["status"]) => {
    const configs = {
      idle: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Idle",
        icon: CheckCircle,
      },
      in_use: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "In Use",
        icon: Users,
      },
      maintenance: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Maintenance",
        icon: Wrench,
      },
    };
    return configs[status];
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Connect to admin WebSocket
    adminWebSocketService.connect();

    // Register message handlers
    adminWebSocketService.onMessage("room_update", (data) => {
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.code === data.roomCode) {
            return {
              ...room,
              status: data.status,
              isOnline: data.connected, // Map connected to isOnline
              connected: data.connected,
              issue: data.issue,
              bottleCount: data.bottleCount || room.bottleCount,
              points: data.points || room.points,
              lastActivity: data.lastActivity,
              lastSeen: data.lastActivity, // Update lastSeen with latest activity
              currentUser: data.currentUser
                ? {
                    name: data.currentUser,
                    activity:
                      data.status === "in_use" ? "Active session" : "Idle",
                    startTime: new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  }
                : undefined,
              location: data.location || room.location,
            };
          }
          return room;
        });
      });
    });

    // Cleanup on unmount
    return () => {
      adminWebSocketService.offMessage("room_update");
      adminWebSocketService.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl">
                <Monitor className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Monitoring Ruangan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-1">
              Pusat kendali status operasional mesin & ruangan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Live System
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {["all", "idle", "in_use", "maintenance"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filterStatus === status
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {status === "all"
              ? "Semua Ruangan"
              : getStatusConfig(status as any).label}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm animate-pulse">
              Menghubungkan ke satelit...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayRooms.map((room) => {
            const statusConfig = getStatusConfig(room.status);
            const isOnline = room.isOnline;

            return (
              <div
                key={room.id}
                className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 ${
                  isOnline
                    ? "border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
                    : "border-slate-200 dark:border-slate-800 opacity-80 grayscale-[0.5] hover:grayscale-0"
                }`}
              >
                {/* Status Line Top */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${isOnline ? "bg-gradient-to-r from-emerald-400 to-cyan-500" : "bg-slate-700"}`}
                ></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-2xl ${isOnline ? "bg-slate-100 dark:bg-slate-800" : "bg-slate-100 dark:bg-slate-800"}`}
                      >
                        {room.status === "in_use" ? (
                          <Activity className="w-6 h-6 text-indigo-500 animate-bounce" />
                        ) : (
                          <Monitor
                            className={`w-6 h-6 ${isOnline ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          <span>ID: {room.code.substring(0, 6)}...</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {isOnline ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            )}
                            {isOnline ? "ONLINE" : "OFFLINE"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">Total Botol</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        {room.bottleCount || 0}
                        <span className="text-xs font-normal text-slate-400">
                          pcs
                        </span>
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">Poin</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        +{room.points || 0}
                      </p>
                    </div>
                  </div>

                  {/* Current Activity / Status */}
                  <div className="space-y-3">
                    {room.currentUser ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {room.currentUser.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {room.currentUser.name}
                          </p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Sedang Menggunakan
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                          {room.currentUser.startTime}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-xl border ${
                          statusConfig.label === "Maintenance"
                            ? "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            : "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-500"
                        }`}
                      >
                        {React.createElement(statusConfig.icon, {
                          className: "w-4 h-4",
                        })}
                        <span className="text-sm font-medium">
                          {getStatusConfig(room.status).label} Mode
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowQrModal(true);
                      }}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Show QR
                    </button>
                    {room.issue && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Error
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRoom && !showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedRoom.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>{" "}
                    {selectedRoom.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Connection Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Status Koneksi
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${selectedRoom.isOnline ? "bg-emerald-500" : "bg-red-500"}`}
                      ></span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedRoom.isOnline
                          ? "Terhubung (Online)"
                          : "Terputus (Offline)"}
                      </span>
                    </div>
                  </div>
                  {selectedRoom.isOnline ? (
                    <Wifi className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <WifiOff className="w-6 h-6 text-red-500" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Last Seen</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {selectedRoom.lastSeen
                        ? new Date(selectedRoom.lastSeen).toLocaleTimeString(
                            "id-ID"
                          )
                        : "-"}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Maintenance</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {selectedRoom.lastMaintenance
                        ? new Date(
                            selectedRoom.lastMaintenance
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Realtime Stats */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Statistik
                    Sesi Ini
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl text-center">
                      <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedRoom.bottleCount || 0}
                      </span>
                      <span className="text-xs text-emerald-700/60 dark:text-emerald-400/60 font-medium">
                        Botol Masuk
                      </span>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl text-center">
                      <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        +{selectedRoom.points || 0}
                      </span>
                      <span className="text-xs text-indigo-700/60 dark:text-indigo-400/60 font-medium">
                        Poin Diberikan
                      </span>
                    </div>
                  </div>
                </div>

                {selectedRoom.issue && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-700 dark:text-red-300 text-sm">
                        Terdeteksi Masalah
                      </p>
                      <p className="text-red-600/80 dark:text-red-400/80 text-xs mt-1">
                        {selectedRoom.issue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedRoom && showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="p-8 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Device QR Code
              </h3>

              <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mb-6 border border-slate-100">
                <QRCodeCanvas
                  value={`${window.location.origin}/room/${selectedRoom.code}`}
                  size={200}
                  level="H"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Room Code
                </p>
                <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tracking-widest">
                  {selectedRoom.code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const canvas = document.querySelector("canvas");
                    if (canvas) {
                      const link = document.createElement("a");
                      link.download = `qr-${selectedRoom.code}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                  className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

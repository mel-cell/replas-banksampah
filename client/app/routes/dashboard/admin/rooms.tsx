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

  const handleBackToDashboard = () => {
    const role = getUserRole();
    if (role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/user');
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
            issue: room.isOnline === false ? "IoT device offline" : undefined
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

  const roomsToShow = rooms.filter(room => 
    filterStatus === "all" || room.status === filterStatus
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
      setRooms(prevRooms => {
        return prevRooms.map(room => {
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
              currentUser: data.currentUser ? {
                name: data.currentUser,
                activity: data.status === "in_use" ? "Active session" : "Idle",
                startTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              } : undefined,
              location: data.location || room.location
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Monitor className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              Monitoring Ruangan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Pantau status ruangan dan aktivitas pengguna
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            Live Monitoring
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="idle">Idle</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRooms.map((room) => (
            <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500">{room.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Code: {room.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(room.status).color}`}
                  >
                    {React.createElement(getStatusConfig(room.status).icon, {
                      className: "w-3 h-3",
                    })}
                    {getStatusConfig(room.status).label}
                  </span>
                  {/* Connection status indicator */}
                  <div className="flex items-center gap-1" title={room.isOnline ? "IoT Online" : "IoT Offline"}>
                    {room.isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Current User */}
              {room.currentUser ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {room.currentUser.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {room.currentUser.activity}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {room.currentUser.startTime}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No active user</p>
                  </div>
                </div>
              )}

              {/* Real-time Stats */}
              {room.bottleCount !== undefined && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Bottles: {room.bottleCount}</span>
                  <span>Points: {room.points || 0}</span>
                </div>
              )}

              {/* Issue Alert */}
              {room.issue && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700 dark:text-red-400">
                      {room.issue}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowQrModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                  title="Generate QR Code with URL"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
                <button
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      // Simple QR code generation (you might want to use a library)
                      canvas.width = 200;
                      canvas.height = 200;
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, 200, 200);
                      ctx.fillStyle = 'black';
                      ctx.font = '16px monospace';
                      ctx.textAlign = 'center';
                      ctx.fillText(room.code, 100, 100);
                      
                      const link = document.createElement('a');
                      link.download = `qr-${room.code}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRoom && !showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Detail Ruangan {selectedRoom.name}
                </h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Lokasi</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedRoom.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getStatusConfig(selectedRoom.status).label}
                    </p>
                    {selectedRoom.isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {selectedRoom.lastSeen && (
                  <div>
                    <p className="text-sm text-gray-500">Last Seen</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedRoom.lastSeen).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">
                    Maintenance Terakhir
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(
                      selectedRoom.lastMaintenance
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>
                {selectedRoom.bottleCount !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Real-time Stats</p>
                    <div className="flex gap-4">
                      <span className="text-sm">Bottles: {selectedRoom.bottleCount}</span>
                      <span className="text-sm">Points: {selectedRoom.points || 0}</span>
                    </div>
                  </div>
                )}
                {selectedRoom.lastActivity && (
                  <div>
                    <p className="text-sm text-gray-500">Last Activity</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedRoom.lastActivity).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
                {selectedRoom.issue && (
                  <div>
                    <p className="text-sm text-gray-500">Issue</p>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      {selectedRoom.issue}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedRoom && showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  QR Code - {selectedRoom.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    setShowQrModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg inline-block">
                    <QRCodeCanvas
                      value={`${window.location.origin}/room/${selectedRoom.code}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    URL: <span className="font-mono font-semibold break-all">{`${window.location.origin}/room/${selectedRoom.code}`}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const canvas = document.querySelector('canvas');
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = `qr-${selectedRoom.code}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/room/${selectedRoom.code}`);
                      // You could add a toast notification here
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Copy URL
                  </button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Scan this QR code or use the code directly to access the room
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

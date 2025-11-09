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
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance" | "error";
  currentUser?: {
    name: string;
    activity: string;
    startTime: string;
  };
  lastMaintenance: string;
}

export default function MonitorRooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const room: Room = {
    id: "R001",
    name: "Ruang Monitoring Utama",
    location: "Lantai 1 - Blok A",
    status: "online",
    currentUser: {
      name: "Ahmad Surya",
      activity: "Menimbang sampah plastik",
      startTime: "14:30",
    },
    lastMaintenance: "2024-01-15",
  };

  const getStatusConfig = (status: Room["status"]) => {
    const configs = {
      online: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Online",
        icon: CheckCircle,
      },
      offline: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Offline",
        icon: XCircle,
      },
      maintenance: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Maintenance",
        icon: Wrench,
      },
      error: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Error",
        icon: AlertTriangle,
      },
    };
    return configs[status];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing room status...");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {room.name}
            </h3>
            <p className="text-sm text-gray-500">{room.location}</p>
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
        {room.currentUser && (
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
        )}
      </div>

      {/* Detail Modal */}
      {selectedRoom && (
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
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getStatusConfig(selectedRoom.status).label}
                  </p>
                </div>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

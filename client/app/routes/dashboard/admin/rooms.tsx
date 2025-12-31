import { useState, useEffect } from "react";
import {
  Monitor,
  Wifi,
  WifiOff,
  Signal,
  MapPin,
  Activity,
  Box,
  CreditCard,
  QrCode,
  User,
  Clock,
  AlertTriangle,
  Terminal,
  Cpu,
  RefreshCw,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

interface MonitoringData {
  device: {
    id: string;
    name: string;
    code: string;
    location: string;
    status: "active" | "maintenance" | "error";
    isOnline: boolean;
    ipAddress: string;
    firmware: string;
    temperature: number;
    uptime: string;
  };
  liveSession: {
    isActive: boolean;
    user?: {
      name: string;
      email: string;
      avatar?: string;
    };
    startTime?: string;
    duration?: string; // Calculated
    bottlesInserted: number;
    currentTransactionId?: string;
  };
  metrics: {
    totalBottlesToday: number;
    dailyActiveUsers: number;
    storageLevel: number; // Percentage
  };
  logs: Array<{
    id: string;
    timestamp: string;
    type: "info" | "warning" | "error" | "success";
    message: string;
  }>;
}

export default function AdminRooms() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Timer for duration calculation
  const [sessionDuration, setSessionDuration] = useState("00:00:00");

  useEffect(() => {
    // Initial Mock Data
    const mockData: MonitoringData = {
      device: {
        id: "DEV-001",
        name: "Smart Reverse Vending 01",
        code: "RM-001",
        location: "Lobby Utama - Gedung A",
        status: "active",
        isOnline: true,
        ipAddress: "192.168.1.105",
        firmware: "v2.1.0-stable",
        temperature: 42,
        uptime: "14d 2h 15m",
      },
      liveSession: {
        isActive: false,
        bottlesInserted: 0,
      },
      metrics: {
        totalBottlesToday: 124,
        dailyActiveUsers: 45,
        storageLevel: 68,
      },
      logs: [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          type: "info",
          message: "System startup sequence completed",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          type: "success",
          message: "Batch upload: 12 transactions synced",
        },
      ],
    };

    setData(mockData);
    setIsLoading(false);

    // Simulation Loop
    const interval = setInterval(() => {
      setData((prev) => {
        if (!prev) return prev;

        // Randomly toggle session state for demo purposes (every ~20s)
        const shouldToggleSession = Math.random() > 0.95;
        let newSession = { ...prev.liveSession };
        let newLogs = [...prev.logs];

        if (shouldToggleSession) {
          if (!newSession.isActive) {
            // Start new session
            newSession = {
              isActive: true,
              user: {
                name: "Budi Santoso",
                email: "budi.s@example.com",
              },
              startTime: new Date().toISOString(),
              bottlesInserted: 0,
              currentTransactionId: "TRX-" + Math.floor(Math.random() * 10000),
            };
            newLogs.unshift({
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              type: "info",
              message: "User login detected: Budi Santoso via QR Scan",
            });
          } else {
            // End session
            newLogs.unshift({
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              type: "success",
              message: `Session ended. ${newSession.bottlesInserted} bottles processed.`,
            });
            newSession = { isActive: false, bottlesInserted: 0 };
          }
        } else if (newSession.isActive) {
          // Simulate bottle insertion
          if (Math.random() > 0.7) {
            newSession.bottlesInserted += 1;
            // Occasionally log a warning
            if (Math.random() > 0.95) {
              newLogs.unshift({
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                type: "warning",
                message: "Object detected but classification low confidence",
              });
            }
          }
        }

        // Limit logs to 10
        if (newLogs.length > 10) newLogs = newLogs.slice(0, 10);

        return {
          ...prev,
          liveSession: newSession,
          logs: newLogs,
          metrics: {
            ...prev.metrics,
            storageLevel: Math.min(
              100,
              prev.metrics.storageLevel + (Math.random() > 0.98 ? 1 : 0)
            ),
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate Duration
  useEffect(() => {
    if (!data?.liveSession.isActive || !data.liveSession.startTime) {
      setSessionDuration("00:00:00");
      return;
    }

    const timer = setInterval(() => {
      const start = new Date(data.liveSession.startTime!).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setSessionDuration(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.liveSession.isActive, data?.liveSession.startTime]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading || !data)
    return (
      <div className="p-8 text-center">Initializing Dashboard Link...</div>
    );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Monitor className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            Device Command Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time telemetry and control for {data.device.name}
          </p>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Show Pairing QR
          </button>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm ${
              data.device.isOnline
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${data.device.isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            ></div>
            <span className="font-semibold">
              {data.device.isOnline ? "Online via MQTT" : "Connection Lost"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Live Status & User */}
        <motion.div variants={item} className="space-y-6">
          {/* Session Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {data.liveSession.isActive && (
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"></div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity
                    className={`w-5 h-5 ${data.liveSession.isActive ? "text-indigo-500" : "text-gray-400"}`}
                  />
                  Live Session
                </h3>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    data.liveSession.isActive
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {data.liveSession.isActive ? "IN USE" : "IDLE"}
                </span>
              </div>

              {data.liveSession.isActive ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                      {data.liveSession.user?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Current User
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {data.liveSession.user?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {data.liveSession.user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <div className="text-blue-600 dark:text-blue-400 mb-1">
                        <Clock className="w-5 h-5 mx-auto" />
                      </div>
                      <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                        {sessionDuration}
                      </div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                      <div className="text-emerald-600 dark:text-emerald-400 mb-1">
                        <Box className="w-5 h-5 mx-auto" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.liveSession.bottlesInserted}
                      </div>
                      <div className="text-xs text-gray-500">Bottles</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <User className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No user is currently using the device
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Waiting for scan...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Daily Total
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.metrics.totalBottlesToday}
              </div>
              <div className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3" /> +12% vs yesterday
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Storage Bin
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.metrics.storageLevel}%
                </div>
                <span className="text-xs text-gray-400 mb-1">Full</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                <div
                  className={`h-full rounded-full ${data.metrics.storageLevel > 90 ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${data.metrics.storageLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Column 2: Device Health & Details */}
        <motion.div variants={item} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-gray-500" />
              Device Diagnostics
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Location
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.device.location}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    IP Address
                  </span>
                </div>
                <span className="text-sm font-mono text-gray-500">
                  {data.device.ipAddress}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Firmware
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.device.firmware}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    CPU Temp
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${data.device.temperature > 60 ? "text-red-500" : "text-emerald-500"}`}
                >
                  {data.device.temperature}°C
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Uptime
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.device.uptime}
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance Mode Toggle - Visual Only */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">
                  Maintenance Mode
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-500/80 mt-1">
                  Device is operating normally. Unauthorized physical access
                  detected will trigger lockdown.
                </p>
                <button className="mt-3 text-xs font-semibold text-yellow-800 dark:text-yellow-400 hover:underline">
                  Configure Security &rarr;
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Column 3: Live Logs */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="bg-gray-900 text-gray-200 rounded-xl shadow-lg border border-gray-700 overflow-hidden h-[500px] flex flex-col">
            <div className="p-3 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> System Logs
              </h3>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {data.logs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <div className="text-gray-500 shrink-0">
                    [
                    {new Date(log.timestamp).toLocaleTimeString("id-ID", {
                      hour12: false,
                    })}
                    ]
                  </div>
                  <div
                    className={`${
                      log.type === "error"
                        ? "text-red-400"
                        : log.type === "warning"
                          ? "text-yellow-400"
                          : log.type === "success"
                            ? "text-green-400"
                            : "text-blue-300"
                    }`}
                  >
                    <span className="font-bold uppercase mr-2 text-[10px] border border-current px-1 rounded-sm opacity-70">
                      {log.type}
                    </span>
                    {log.message}
                  </div>
                </div>
              ))}
              {data.logs.length === 0 && (
                <div className="text-gray-600 italic">
                  No logs generated yet...
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal for Device Pairing */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Device Pairing
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Scan this generic provisioning code to connect any new
                    hardware to this dashboard channel.
                  </p>

                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 inline-block mb-6 shadow-xs">
                    <QRCodeSVG
                      value={JSON.stringify({
                        server: window.location.origin,
                        action: "provision",
                        channel: "admin-main",
                      })}
                      size={180}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-gray-400">
                      Code: {data.device.code}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

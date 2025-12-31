import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  RefreshCw,
  Filter,
  Clock,
  Package,
  Recycle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: "0",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Pengguna aktif sistem",
    },
    {
      title: "Total Konversi",
      value: "0",
      change: "+24%",
      changeType: "positive",
      icon: Recycle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Total sampah dikonversi",
    },
    {
      title: "Revenue Today",
      value: "Rp 0",
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      description: "Pendapatan hari ini",
    },
  ]);

  const [activities, setActivities] = useState([]);

  const loadDashboardData = async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/web/dashboard/admin", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Update stats
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.title === "Total Users") {
              return {
                ...stat,
                value: data.stats.totalUsers?.toLocaleString() || "0",
              };
            }
            if (stat.title === "Total Konversi") {
              return {
                ...stat,
                value: data.stats.totalConversions?.toLocaleString() || "0",
              };
            }
            if (stat.title === "Revenue Today") {
              return {
                ...stat,
                value: `Rp ${(data.stats.revenueToday || 0).toLocaleString()}`,
              };
            }
            return stat;
          })
        );

        // Update activities
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => loadDashboardData(true), 10000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 text-white">
              <Activity className="w-8 h-8" />
            </div>
            Dashboard Statistik
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Monitor performa sistem bank sampah secara realtime.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl shadow-sm">
            <Clock className="w-4 h-4 text-teal-500" />
            Last updated:{" "}
            <span className="font-mono">
              {new Date().toLocaleTimeString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-3 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800 rounded-xl transition-all shadow-sm active:scale-95"
            disabled={isLoading}
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin text-teal-500" : ""}`}
            />
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Filter className="w-4 h-4 text-gray-500 ml-3" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500`}
              >
                <Icon className={`w-24 h-24 ${stat.color}`} />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.changeType === "positive" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700"}`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-400 mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section (Visual Only) */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Simple Bar Chart Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-600" />
              Transaksi Mingguan
            </h3>
            <span className="text-xs text-gray-500">Live Data</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-full bg-teal-100 dark:bg-teal-900/20 rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/40"
                  style={{ height: `${h}%` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute bottom-0 left-0 w-full bg-linear-to-t from-teal-500 to-emerald-400 opacity-80"
                  />
                </div>
                <span className="text-xs text-gray-400 font-medium font-mono">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            Live Feed Aktivitas
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {activities.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500">Belum ada aktivitas terekam</p>
              </div>
            ) : (
              activities.map((activity: any, index: number) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20"></div>
                    <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-800 -my-1 group-last:hidden"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {activity.user}
                      </span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.details}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

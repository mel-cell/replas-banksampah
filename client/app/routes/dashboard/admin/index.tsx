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

export default function AdminDashboardIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Sample data - in real app, this would come from API
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Pengguna aktif sistem",
    },
    {
      title: "Total Konversi",
      value: "280 X",
      change: "+18%",
      changeType: "positive",
      icon: Recycle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Total sampah dikonversi",
    },
    {
      title: "Revenue Today",
      value: "Rp 2.4M",
      change: "+15%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      description: "Pendapatan hari ini",
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Activity className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            Dashboard Statistik
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ringkasan performa sistem bank sampah
          </p>
        </div>
        <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString("id-ID")}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} transition-transform hover:scale-110`}
                >
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-2 flex items-center gap-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {stat.change} dari bulan lalu
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4 duration-500 delay-500">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-emerald-600" />
          Aktivitas Terbaru
        </h3>

        <div className="space-y-4">
          {[
            {
              id: "1",
              user: "Ahmad Surya",
              action: "Menukarkan botol",
              details: "Botol plastik 25 botol - Poin: +250",
              timestamp: "2024-01-15 14:30:00",
              type: "conversion",
            },
            {
              id: "2",
              user: "Siti Rahayu",
              action: "Login ke sistem",
              details: "Login berhasil dari aplikasi mobile",
              timestamp: "2024-01-15 14:25:00",
              type: "login",
            },
            {
              id: "3",
              user: "Budi Santoso",
              action: "Menukarkan botol",
              details: "Botol plastik 15 botol - Poin: +150",
              timestamp: "2024-01-15 14:20:00",
              type: "conversion",
            },
            {
              id: "4",
              user: "Maya Sari",
              action: "Login ke sistem",
              details: "Login berhasil dari browser Chrome",
              timestamp: "2024-01-15 14:15:00",
              type: "login",
            },
            {
              id: "5",
              user: "Rudi Hartono",
              action: "Menukarkan botol",
              details: "Botol plastik 10 botol - Poin: +100",
              timestamp: "2024-01-15 14:10:00",
              type: "conversion",
            },
          ].map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  <span className="font-semibold">{activity.user}</span> -{" "}
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.details}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(activity.timestamp).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow animate-in slide-in-from-left-4 duration-500 delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Transaksi Bulanan
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {selectedPeriod === "today"
                ? "Hari Ini"
                : selectedPeriod === "week"
                  ? "Minggu Ini"
                  : selectedPeriod === "month"
                    ? "Bulan Ini"
                    : "Tahun Ini"}
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 animate-pulse"></div>
            <div className="text-center relative z-10">
              <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Chart akan ditampilkan di sini
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Data real-time tersedia
              </p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow animate-in slide-in-from-right-4 duration-500 delay-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Recycle className="w-5 h-5 text-blue-600" />
              Distribusi Jenis Sampah
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              Live Data
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 animate-pulse"></div>
            <div className="text-center relative z-10">
              <PieChart className="w-12 h-12 text-blue-600 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Pie chart akan ditampilkan di sini
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Visualisasi data sampah
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

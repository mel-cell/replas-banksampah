import React, { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  Filter,
  Eye,
  Clock,
  Package,
  Recycle,
  BarChart3,
  PieChart,
  Users,
  Scale,
  Truck,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";

interface SalesData {
  id: string;
  date: string;
  wasteType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalRevenue: number;
  customerName: string;
  collectorName: string;
  status: "completed" | "pending" | "cancelled";
}

export default function LaporanPenjualanSampah() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedWasteType, setSelectedWasteType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SalesData | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    wasteType: "",
    quantity: "",
    pricePerUnit: "",
    customerName: "",
    collectorName: "",
    status: "pending",
  });
  const [salesData, setSalesData] = useState<SalesData[]>([
    {
      id: "S001",
      date: "2024-01-15",
      wasteType: "Plastik",
      quantity: 25.5,
      unit: "kg",
      pricePerUnit: 2000,
      totalRevenue: 51000,
      customerName: "Ahmad Surya",
      collectorName: "Budi Santoso",
      status: "completed",
    },
    {
      id: "S002",
      date: "2024-01-15",
      wasteType: "Kertas",
      quantity: 18.2,
      unit: "kg",
      pricePerUnit: 1500,
      totalRevenue: 27300,
      customerName: "Siti Rahayu",
      collectorName: "Maya Lestari",
      status: "completed",
    },
    {
      id: "S003",
      date: "2024-01-14",
      wasteType: "Logam",
      quantity: 12.8,
      unit: "kg",
      pricePerUnit: 8000,
      totalRevenue: 102400,
      customerName: "Budi Kusuma",
      collectorName: "Ahmad Surya",
      status: "completed",
    },
    {
      id: "S004",
      date: "2024-01-14",
      wasteType: "Plastik",
      quantity: 32.1,
      unit: "kg",
      pricePerUnit: 2000,
      totalRevenue: 64200,
      customerName: "Maya Lestari",
      collectorName: "Siti Rahayu",
      status: "pending",
    },
    {
      id: "S005",
      date: "2024-01-13",
      wasteType: "Kaca",
      quantity: 15.6,
      unit: "kg",
      pricePerUnit: 500,
      totalRevenue: 7800,
      customerName: "Rudi Hartono",
      collectorName: "Budi Santoso",
      status: "completed",
    },
  ]);

  const wasteTypes = [
    { value: "all", label: "Semua Jenis" },
    { value: "Plastik", label: "Plastik" },
    { value: "Kertas", label: "Kertas" },
    { value: "Logam", label: "Logam" },
    { value: "Kaca", label: "Kaca" },
    { value: "Organik", label: "Organik" },
  ];

  const filteredData = salesData.filter((item) => {
    if (selectedWasteType === "all") return true;
    return item.wasteType === selectedWasteType;
  });

  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const totalQuantity = filteredData.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const completedTransactions = filteredData.filter(
    (item) => item.status === "completed"
  ).length;

  const getStatusConfig = (status: SalesData["status"]) => {
    const configs = {
      completed: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Selesai",
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Pending",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Dibatalkan",
      },
    };
    return configs[status];
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale: SalesData = {
      id: `S${String(salesData.length + 1).padStart(3, "0")}`,
      date: formData.date,
      wasteType: formData.wasteType,
      quantity: parseFloat(formData.quantity),
      unit: "kg",
      pricePerUnit: parseInt(formData.pricePerUnit),
      totalRevenue:
        parseFloat(formData.quantity) * parseInt(formData.pricePerUnit),
      customerName: formData.customerName,
      collectorName: formData.collectorName,
      status: formData.status as SalesData["status"],
    };
    setSalesData([...salesData, newSale]);
    setFormData({
      date: "",
      wasteType: "",
      quantity: "",
      pricePerUnit: "",
      customerName: "",
      collectorName: "",
      status: "pending",
    });
    setShowAddModal(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item: SalesData) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      wasteType: item.wasteType,
      quantity: item.quantity.toString(),
      pricePerUnit: item.pricePerUnit.toString(),
      customerName: item.customerName,
      collectorName: item.collectorName,
      status: item.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus penjualan ini?")) {
      setSalesData(salesData.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            Laporan Penjualan Sampah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ringkasan penjualan dan pendapatan dari bank sampah
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
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
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {wasteTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Penjualan
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Pendapatan
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Dari penjualan sampah
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 transition-transform hover:scale-110">
              <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
            <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              +12% dari bulan lalu
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in-0 delay-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Berat Sampah
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Yang berhasil dijual
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 transition-transform hover:scale-110">
              <Scale className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalQuantity.toFixed(1)} kg
            </p>
            <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              +8% dari bulan lalu
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in-0 delay-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transaksi Selesai
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Penjualan yang berhasil
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 transition-transform hover:scale-110">
              <Package className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedTransactions}
            </p>
            <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              +15% dari bulan lalu
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow animate-in slide-in-from-left-4 duration-500 delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Tren Pendapatan
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
                Chart tren pendapatan
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Data real-time tersedia
              </p>
            </div>
          </div>
        </div>

        {/* Waste Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow animate-in slide-in-from-right-4 duration-500 delay-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Distribusi Jenis Sampah
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Recycle className="w-4 h-4" />
              Berdasarkan Penjualan
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 animate-pulse"></div>
            <div className="text-center relative z-10">
              <PieChart className="w-12 h-12 text-blue-600 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Distribusi jenis sampah
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Berdasarkan volume penjualan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 delay-500">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Detail Penjualan
            </h3>
            <div className="text-sm text-gray-500">
              Menampilkan {filteredData.length} transaksi
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jenis Sampah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Berat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Harga/kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kolektor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((item, index) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.wasteType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Rp {item.pricePerUnit.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Rp {item.totalRevenue.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.collectorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada data penjualan untuk filter yang dipilih
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  Tambah Penjualan Baru
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleAddSale} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jenis Sampah
                  </label>
                  <select
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jenis</option>
                    {wasteTypes
                      .filter((type) => type.value !== "all")
                      .map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Berat (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Harga/kg (Rp)
                  </label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Kolektor
                </label>
                <input
                  type="text"
                  name="collectorName"
                  value={formData.collectorName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

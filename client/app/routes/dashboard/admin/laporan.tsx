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
  Loader2,
  AlertCircle,
} from "lucide-react";

interface SalesReport {
  id: string;
  saleDate: string;
  totalBottles: number;
  totalAmount: string;
  adminId: string;
  notes: string;
  createdAt: string;
  adminName: string;
}

export default function LaporanPenjualanSampah() {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SalesReport | null>(null);
  const [formData, setFormData] = useState({
    saleDate: new Date().toISOString().split('T')[0],
    totalBottles: '',
    totalAmount: '',
    notes: '',
  });

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch("/api/web/dashboard/admin/sales-reports", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      } else {
        setError('Failed to load sales reports');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const totalRevenue = reports.reduce((sum, report) => sum + parseFloat(report.totalAmount), 0);
  const totalBottles = reports.reduce((sum, report) => sum + report.totalBottles, 0);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/web/dashboard/admin/sales-reports", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saleDate: formData.saleDate,
          totalBottles: parseInt(formData.totalBottles),
          totalAmount: parseFloat(formData.totalAmount),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        alert('Laporan penjualan berhasil dibuat!');
        setShowCreateModal(false);
        setFormData({
          saleDate: new Date().toISOString().split('T')[0],
          totalBottles: '',
          totalAmount: '',
          notes: '',
        });
        await loadReports();
      } else {
        alert('Failed to create sales report');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleEditReport = (report: SalesReport) => {
    setSelectedReport(report);
    setFormData({
      saleDate: new Date(report.saleDate).toISOString().split('T')[0],
      totalBottles: report.totalBottles.toString(),
      totalAmount: report.totalAmount,
      notes: report.notes || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/web/dashboard/admin/sales-reports/${selectedReport.id}", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saleDate: formData.saleDate,
          totalBottles: parseInt(formData.totalBottles),
          totalAmount: parseFloat(formData.totalAmount),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        alert('Laporan penjualan berhasil diupdate!');
        setShowEditModal(false);
        setSelectedReport(null);
        await loadReports();
      } else {
        alert('Failed to update sales report');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan penjualan ini?')) {
      try {
        const token = localStorage.getItem('token');
      const response = await fetch("/api/web/dashboard/admin/sales-reports/${reportId}", {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

        if (response.ok) {
          alert('Laporan penjualan berhasil dihapus!');
          await loadReports();
        } else {
          alert('Failed to delete sales report');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleViewReport = (report: SalesReport) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            onClick={loadReports}
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Periode: Semua Waktu
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Tambah Laporan
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
                Total Botol Terjual
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Dari semua laporan
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 transition-transform hover:scale-110">
              <Scale className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalBottles.toLocaleString()}
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
                Jumlah Laporan
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Total laporan penjualan
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 transition-transform hover:scale-110">
              <Package className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {reports.length}
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
              Semua Waktu
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
              Detail Laporan Penjualan
            </h3>
            <div className="text-sm text-gray-500">
              Menampilkan {reports.length} laporan
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
                  Botol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pendapatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(report.saleDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {report.totalBottles.toLocaleString()} botol
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Rp {parseFloat(report.totalAmount).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.adminName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditReport(report)}
                        className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reports.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada data laporan penjualan
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  Tambah Laporan Penjualan
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Penjualan
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Botol
                </label>
                <input
                  type="number"
                  name="totalBottles"
                  value={formData.totalBottles}
                  onChange={handleFormChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Pendapatan (Rp)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-emerald-600" />
                  Edit Laporan Penjualan
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Penjualan
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Botol
                </label>
                <input
                  type="number"
                  name="totalBottles"
                  value={formData.totalBottles}
                  onChange={handleFormChange}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Pendapatan (Rp)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  Detail Laporan Penjualan
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Penjualan
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(selectedReport.saleDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.adminName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Botol
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.totalBottles.toLocaleString()} botol
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Pendapatan
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    Rp {parseFloat(selectedReport.totalAmount).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedReport.notes || 'Tidak ada catatan'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dibuat Pada
                </label>
                <p className="text-sm text-gray-500">
                  {new Date(selectedReport.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

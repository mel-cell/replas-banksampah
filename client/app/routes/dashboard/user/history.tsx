import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface TransactionItem {
  id: string;
  type: string;
  date: string;
  details: string;
  points: number;
}

export default function UserHistory() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/web/dashboard/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.history || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load transaction history');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'collection':
        return 'Setor Sampah';
      case 'transaction':
        return 'Transaksi';
      default:
        return type;
    }
  };

  const getPointsDisplay = (points: number) => {
    return points > 0 ? `+${points}` : points.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat riwayat transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={loadTransactionHistory}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">History Transaksi</h1>
        <button
          onClick={loadTransactionHistory}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Belum ada riwayat transaksi</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Jenis Transaksi</th>
                <th className="px-4 py-2 text-left">Detail</th>
                <th className="px-4 py-2 text-right">Poin</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">{formatDate(item.date)}</td>
                  <td className="px-4 py-2">{getTransactionTypeLabel(item.type)}</td>
                  <td className="px-4 py-2">{item.details}</td>
                  <td className={`px-4 py-2 text-right font-medium ${
                    item.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getPointsDisplay(item.points)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Loader2, CheckCircle, Clock, XCircle, AlertCircle, Eye, Check, X } from "lucide-react";

interface ConversionRequest {
  id: string;
  userId: number;
  pointsAmount: number;
  moneyAmount: string;
  status: "pending" | "approved" | "rejected" | "paid";
  accountNumber: string;
  accountName: string;
  notes?: string;
  requestAt: string;
  processedAt?: string;
  methodName: string;
  methodType: string;
  userName?: string;
  userEmail?: string;
}

export default function AdminConversionsPage() {
  const [conversions, setConversions] = useState<ConversionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadConversions();
  }, []);

  const loadConversions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:3000/api/web/dashboard/admin/conversions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversions(data.conversions || []);
      } else {
        setError('Failed to load conversions');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (conversionId: string, newStatus: "approved" | "rejected" | "paid") => {
    try {
      setProcessingId(conversionId);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/web/dashboard/admin/conversions/${conversionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Reload conversions
        await loadConversions();
        alert(`Status berhasil diubah menjadi ${getStatusLabel(newStatus)}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'paid':
        return 'Dibayar';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'paid':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
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

  const getActionButtons = (conversion: ConversionRequest) => {
    if (processingId === conversion.id) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Memproses...</span>
        </div>
      );
    }

    switch (conversion.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusUpdate(conversion.id, 'approved')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Setujui
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate(conversion.id, 'rejected')}
            >
              <X className="w-4 h-4 mr-1" />
              Tolak
            </Button>
          </div>
        );
      case 'approved':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleStatusUpdate(conversion.id, 'paid')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Tandai Dibayar
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat data penukaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <Button onClick={loadConversions} className="mt-4">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            Manajemen Penukaran Poin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola permintaan penukaran poin pengguna
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Permintaan</p>
                <p className="text-2xl font-bold">{conversions.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {conversions.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-blue-600">
                  {conversions.filter(c => c.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">
                  {conversions.filter(c => c.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Penukaran</CardTitle>
          <CardDescription>
            Semua permintaan penukaran poin dari pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          {conversions.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada permintaan penukaran
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversions.map((conversion) => (
                <div key={conversion.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(conversion.status)}
                      <div>
                        <h3 className="font-semibold">Permintaan #{conversion.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(conversion.requestAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(conversion.status)}>
                      {getStatusLabel(conversion.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Poin:</span>
                      <p className="font-semibold">{conversion.pointsAmount}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nominal:</span>
                      <p className="font-semibold">Rp {parseFloat(conversion.moneyAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Metode:</span>
                      <p>{conversion.methodName} ({conversion.methodType.toUpperCase()})</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">User:</span>
                      <p>{conversion.userName || `User ${conversion.userId}`}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">No. Rekening:</span>
                      <p>{conversion.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Nama Rekening:</span>
                      <p>{conversion.accountName}</p>
                    </div>
                  </div>

                  {conversion.notes && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-600">Catatan:</span>
                      <p className="text-sm mt-1">{conversion.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {getActionButtons(conversion)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

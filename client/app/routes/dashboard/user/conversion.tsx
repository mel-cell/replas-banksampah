import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2, ArrowRightLeft, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface PaymentMethod {
  id: string;
  methodName: string;
  type: "cash" | "dana" | "ovo" | "gopay";
  accountNumber?: string;
  accountName?: string;
}

interface ConversionRequest {
  id: string;
  pointsAmount: number;
  moneyAmount: string;
  status: "pending" | "approved" | "rejected" | "paid";
  accountNumber?: string;
  accountName?: string;
  notes?: string;
  requestAt: string;
  processedAt?: string;
  methodName: string;
  methodType: string;
}

export default function ConversionPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [conversions, setConversions] = useState<ConversionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  const [formData, setFormData] = useState({
    methodId: "",
    pointsAmount: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Load dashboard data for current points
      const dashboardResponse = await fetch('http://localhost:3000/api/web/dashboard/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setPaymentMethods(dashboardData.paymentMethods || []);
        setCurrentPoints(dashboardData.wallet?.pointsBalance || 0);
      }

      // Load conversion history
      const conversionsResponse = await fetch('http://localhost:3000/api/web/dashboard/user/conversions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (conversionsResponse.ok) {
        const conversionsData = await conversionsResponse.json();
        setConversions(conversionsData.conversions || []);
      }

    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateMoneyAmount = (points: number) => {
    return points * 100; // 1 point = Rp 100
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pointsAmount = parseInt(formData.pointsAmount);
    if (!pointsAmount || pointsAmount <= 0) {
      alert('Masukkan jumlah poin yang valid');
      return;
    }

    if (pointsAmount > currentPoints) {
      alert('Poin tidak mencukupi');
      return;
    }

    if (!formData.methodId) {
      alert('Pilih metode pembayaran');
      return;
    }

    if (!formData.accountNumber || !formData.accountName) {
      alert('Masukkan nomor rekening dan nama rekening');
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/web/dashboard/user/conversion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          methodId: formData.methodId,
          pointsAmount: pointsAmount,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Permintaan penukaran berhasil dibuat!');
        setFormData({
          methodId: "",
          pointsAmount: "",
          accountNumber: "",
          accountName: "",
          notes: "",
        });
        // Reload data
        await loadData();
      } else {
        alert(data.error || 'Gagal membuat permintaan penukaran');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ArrowRightLeft className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            Tukar Poin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tukar poin Anda menjadi uang tunai
          </p>
        </div>
      </div>

      {/* Current Points */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {currentPoints.toLocaleString()} Poin
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Poin tersedia untuk ditukar
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Form Penukaran Poin</CardTitle>
            <CardDescription>
              Tukar poin Anda menjadi uang tunai (1 poin = Rp 100)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="pointsAmount">Jumlah Poin</Label>
                <Input
                  id="pointsAmount"
                  type="number"
                  value={formData.pointsAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('pointsAmount', e.target.value)}
                  placeholder="Masukkan jumlah poin"
                  min="1"
                  max={currentPoints}
                  required
                />
                {formData.pointsAmount && (
                  <p className="text-sm text-gray-600 mt-1">
                    Nominal: Rp {calculateMoneyAmount(parseInt(formData.pointsAmount) || 0).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="methodId">Metode Pembayaran</Label>
                <Select value={formData.methodId} onValueChange={(value: string) => handleInputChange('methodId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.methodName} ({method.type.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountNumber">Nomor Rekening</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Masukkan nomor rekening"
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountName">Nama Rekening</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('accountName', e.target.value)}
                  placeholder="Masukkan nama rekening"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Tambahkan catatan jika diperlukan"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || currentPoints === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  'Ajukan Penukaran'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Conversion History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Riwayat Penukaran</CardTitle>
            <CardDescription>
              Status permintaan penukaran poin Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conversions.length === 0 ? (
              <div className="text-center py-8">
                <ArrowRightLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Belum ada riwayat penukaran
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversions.map((conversion) => (
                  <div key={conversion.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(conversion.status)}
                        <span className="font-medium">{getStatusLabel(conversion.status)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(conversion.requestAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Poin:</span>
                        <span className="ml-2 font-medium">{conversion.pointsAmount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nominal:</span>
                        <span className="ml-2 font-medium">Rp {parseFloat(conversion.moneyAmount).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Metode:</span>
                        <span className="ml-2">{conversion.methodName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rekening:</span>
                        <span className="ml-2">{conversion.accountNumber}</span>
                      </div>
                    </div>

                    {conversion.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Catatan:</span> {conversion.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

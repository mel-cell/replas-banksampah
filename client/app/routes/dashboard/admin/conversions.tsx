import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface ConversionRequest {
  id: string;
  pointsAmount: number;
  moneyAmount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  accountNumber?: string;
  accountName?: string;
  notes?: string;
  requestAt: string;
  processedAt?: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    email: string;
  };
  method: {
    id: string;
    methodName: string;
    type: string;
  };
}

interface ExchangeRate {
  id: string;
  pointsPerBottle: number;
  rupiahPerPoint: number;
  updatedAt: string;
  updatedBy?: string;
}

export default function AdminConversions() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Exchange rate form state
  const [rateForm, setRateForm] = useState({
    pointsPerBottle: "1",
    rupiahPerPoint: "75.00",
  });

  // Processing state for individual requests
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Load conversion requests
      const requestsResponse = await fetch("/api/admin/conversion-requests", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData.requests || []);
      }

      // Load current exchange rate
      const rateResponse = await fetch("/api/admin/exchange-rate", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        setExchangeRate(rateData);
        setRateForm({
          pointsPerBottle: rateData.pointsPerBottle.toString(),
          rupiahPerPoint: rateData.rupiahPerPoint.toString(),
        });
      }

    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    filterStatus === "all" || req.status === filterStatus
  );

  const handleApprove = async (requestId: string) => {
    setProcessingRequests(prev => new Set([...prev, requestId]));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/conversion-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          notes: 'Approved by admin',
        }),
      });

      if (response.ok) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved', processedAt: new Date().toISOString() }
            : req
        ));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to approve request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    setProcessingRequests(prev => new Set([...prev, requestId]));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/conversion-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          notes: 'Rejected by admin',
        }),
      });

      if (response.ok) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected', processedAt: new Date().toISOString() }
            : req
        ));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/admin/exchange-rate", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pointsPerBottle: parseInt(rateForm.pointsPerBottle),
          rupiahPerPoint: parseFloat(rateForm.rupiahPerPoint),
        }),
      });

      if (response.ok) {
        const rateData = await response.json();
        setExchangeRate(rateData.rate);
        alert('Exchange rate updated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update exchange rate');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
          <p className="text-gray-600 dark:text-gray-400">Loading conversion requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              Manajemen Penukaran Poin
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelola permintaan penukaran poin dan atur nilai tukar
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Requests Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Permintaan Penukaran</CardTitle>
            <CardDescription>
              Kelola permintaan konversi poin ke Rupiah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Label htmlFor="filterStatus" className="text-sm font-medium">Filter Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Tidak ada permintaan penukaran
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <span className="font-medium">{request.user.fullname}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(request.requestAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Poin:</span>
                        <span className="ml-2 font-medium">{request.pointsAmount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Nominal:</span>
                        <span className="ml-2 font-medium">Rp {request.moneyAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Metode:</span>
                        <span className="ml-2">{request.method.methodName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rekening:</span>
                        <span className="ml-2">{request.accountNumber}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Email: {request.user.email}
                    </div>

                    {request.notes && (
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Catatan:</span> {request.notes}
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingRequests.has(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {processingRequests.has(request.id) ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Menyetujui...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Setujui
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          disabled={processingRequests.has(request.id)}
                          className="flex-1"
                        >
                          {processingRequests.has(request.id) ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Menolak...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Tolak
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exchange Rate Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Pengaturan Nilai Tukar</CardTitle>
            <CardDescription>
              Atur nilai tukar poin ke Rupiah dan poin per botol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exchangeRate && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Nilai Tukar Saat Ini</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Poin per Botol:</span>
                    <span className="ml-2 font-medium">{exchangeRate.pointsPerBottle}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rp per Poin:</span>
                    <span className="ml-2 font-medium">Rp {exchangeRate.rupiahPerPoint.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Terakhir diupdate: {formatDate(exchangeRate.updatedAt)}
                </div>
              </div>
            )}

            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <Label htmlFor="pointsPerBottle">Poin per Botol</Label>
                <Input
                  id="pointsPerBottle"
                  type="number"
                  value={rateForm.pointsPerBottle}
                  onChange={(e) => setRateForm(prev => ({ ...prev, pointsPerBottle: e.target.value }))}
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rupiahPerPoint">Rupiah per Poin</Label>
                <Input
                  id="rupiahPerPoint"
                  type="number"
                  step="0.01"
                  value={rateForm.rupiahPerPoint}
                  onChange={(e) => setRateForm(prev => ({ ...prev, rupiahPerPoint: e.target.value }))}
                  placeholder="75.00"
                  min="0.01"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Memperbarui...
                  </>
                ) : (
                  'Perbarui Nilai Tukar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

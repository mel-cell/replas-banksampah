import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import {
  Loader2,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  methodName: string;
  type: "cash" | "dana" | "ovo" | "gopay";
  accountNumber?: string;
  accountName?: string;
}

const PAYMENT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "dana", label: "Dana" },
  { value: "ovo", label: "OVO" },
  { value: "gopay", label: "GoPay" },
] as const;

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

  const [showAccountFields, setShowAccountFields] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Set default to cash if available
    if (paymentMethods.length > 0) {
      const cashMethod = paymentMethods.find(
        (method) => method.type === "cash"
      );
      if (cashMethod) {
        setFormData((prev) => ({ ...prev, methodId: cashMethod.id }));
        setShowAccountFields(false);
      } else {
        // If no cash, use first method and show fields
        setFormData((prev) => ({ ...prev, methodId: paymentMethods[0].id }));
        setShowAccountFields(paymentMethods[0].type !== "cash");
      }
    }
  }, [paymentMethods]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // Load dashboard data for current points
      const dashboardResponse = await fetch("/api/web/dashboard/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setPaymentMethods(dashboardData.paymentMethods || []);
        setCurrentPoints(dashboardData.wallet?.pointsBalance || 0);
      }

      // Load current exchange rate
      const rateResponse = await fetch("/api/admin/exchange-rate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (rateResponse.ok) {
        const rateData = await rateResponse.json();
        setExchangeRate({ rupiahPerPoint: rateData.rupiahPerPoint });
      }

      // Load conversion history
      const conversionsResponse = await fetch("/api/conversion/request", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (conversionsResponse.ok) {
        const conversionsData = await conversionsResponse.json();
        setConversions(conversionsData.requests || []);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
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

  const handleMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, methodId: value }));
    const selectedMethod = paymentMethods.find((method) => method.id === value);
    if (selectedMethod) {
      setShowAccountFields(selectedMethod.type !== "cash");
      // Clear account fields if switching to cash
      if (selectedMethod.type === "cash") {
        setFormData((prev) => ({
          ...prev,
          accountNumber: "",
          accountName: "",
        }));
      }
    }
  };

  const [exchangeRate, setExchangeRate] = useState({ rupiahPerPoint: 75 });

  const calculateMoneyAmount = (points: number) => {
    return points * exchangeRate.rupiahPerPoint;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pointsAmount = parseInt(formData.pointsAmount);
    if (!pointsAmount || pointsAmount <= 0) {
      alert("Masukkan jumlah poin yang valid");
      return;
    }

    if (pointsAmount > currentPoints) {
      alert("Poin tidak mencukupi");
      return;
    }

    if (!formData.methodId) {
      alert("Pilih metode pembayaran");
      return;
    }

    if (
      showAccountFields &&
      (!formData.accountNumber || !formData.accountName)
    ) {
      alert("Masukkan nomor rekening dan nama rekening");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/conversion/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
        alert("Permintaan penukaran berhasil dibuat!");
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
        alert(data.error || "Gagal membuat permintaan penukaran");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "approved":
        return "Disetujui";
      case "paid":
        return "Dibayar";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Memuat data penukaran...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500 max-w-5xl mx-auto">
      {/* Header with Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <ArrowRightLeft className="w-8 h-8" />
            </div>
            Tukar Poin
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nikmati hasil daur ulangmu dengan menukarkan poin ke saldo e-wallet.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-2xl ring-1 ring-white/10">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowRightLeft className="w-32 h-32" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">
            Saldo Poin Anda
          </p>
          <div className="text-4xl font-bold mb-4 tracking-tight">
            {currentPoints.toLocaleString()}{" "}
            <span className="text-lg text-emerald-400 font-normal">pts</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-xs border border-white/10">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Siap ditukarkan
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Conversion Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                Form Penukaran
              </CardTitle>
              <CardDescription>
                Estimasi terima:{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Rp{" "}
                  {calculateMoneyAmount(
                    parseInt(formData.pointsAmount) || 0
                  ).toLocaleString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Points Input */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="pointsAmount" className="text-base">
                      Jumlah Poin
                    </Label>
                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      MAX: {currentPoints}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="pointsAmount"
                      type="number"
                      value={formData.pointsAmount}
                      onChange={(e) =>
                        handleInputChange("pointsAmount", e.target.value)
                      }
                      placeholder="0"
                      min="1"
                      max={currentPoints}
                      className="text-2xl font-bold py-6 px-4 pl-12 border-gray-200 dark:border-gray-700 focus:ring-emerald-500"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      💎
                    </div>
                  </div>

                  {/* Quick Select Percentages */}
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "pointsAmount",
                            Math.floor(
                              currentPoints * (percent / 100)
                            ).toString()
                          )
                        }
                        className="py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method Selection */}
                <div className="space-y-4">
                  <Label className="text-base">Metode Pembayaran</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => {
                      const isSelected = formData.methodId === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => handleMethodChange(method.id)}
                          className={`relative cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-sm"
                              : "border-transparent bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                        >
                          {/* Simple Icon Placeholder based on type */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                              method.type === "dana"
                                ? "bg-blue-500"
                                : method.type === "ovo"
                                  ? "bg-purple-500"
                                  : method.type === "gopay"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                          >
                            {method.methodName.substring(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`text-xs font-semibold ${isSelected ? "text-emerald-700 dark:text-emerald-300" : "text-gray-600 dark:text-gray-400"}`}
                          >
                            {method.methodName}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {showAccountFields && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">
                        Nomor{" "}
                        {
                          paymentMethods.find((m) => m.id === formData.methodId)
                            ?.methodName
                        }
                      </Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) =>
                          handleInputChange("accountNumber", e.target.value)
                        }
                        placeholder="Contoh: 08123456789"
                        className="bg-gray-50 dark:bg-gray-800/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Atas Nama</Label>
                      <Input
                        id="accountName"
                        value={formData.accountName}
                        onChange={(e) =>
                          handleInputChange("accountName", e.target.value)
                        }
                        placeholder="Nama pemilik akun"
                        className="bg-gray-50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ada pesan tambahan?"
                    className="resize-none bg-gray-50 dark:bg-gray-800/50"
                    rows={2}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || currentPoints === 0}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses Transaksi...
                      </span>
                    ) : (
                      "Ajukan Penukaran Sekarang"
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Transaksi akan diproses dalam 1x24 jam kerja.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Riwayat Penukaran
            </h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500">
              {conversions.length} Transaksi
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {conversions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada riwayat</p>
                <p className="text-xs text-gray-400 mt-1">
                  Mulai tukar poinmu sekarang!
                </p>
              </div>
            ) : (
              conversions.map((conversion) => (
                <div
                  key={conversion.id}
                  className="group bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-900"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          conversion.status === "paid" ||
                          conversion.status === "approved"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                            : conversion.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                        }`}
                      >
                        {getStatusIcon(conversion.status)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          {conversion.methodName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(conversion.requestAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        conversion.status === "paid" ||
                        conversion.status === "approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : conversion.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {getStatusLabel(conversion.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                        Nominal
                      </p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {parseFloat(conversion.moneyAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                        Tukar Poin
                      </p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        - {conversion.pointsAmount} pts
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

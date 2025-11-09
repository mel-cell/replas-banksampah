import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from "react-i18next";
import { User, Wallet, History, Coins, TrendingUp } from "lucide-react";

export function meta() {
  return [
    { title: "Dashboard - Replas" },
    { name: "description", content: "User dashboard for Replas recycling services." },
  ];
}

export default function UserDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/web/dashboard/user');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">No data</div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Pengguna</h1>
          <p className="text-muted-foreground">Pantau aktivitas dan poin Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Nama:</strong> {data.profile?.fullname}</p>
                <p><strong>Email:</strong> {data.profile?.email}</p>
                <p><strong>Role:</strong> <Badge variant="secondary">{data.profile?.role}</Badge></p>
                <p><strong>Status:</strong> <Badge variant={data.profile?.isActive ? "default" : "destructive"}>
                  {data.profile?.isActive ? "Aktif" : "Tidak Aktif"}
                </Badge></p>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Dompet Poin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {data.wallet?.pointsBalance || 0}
                </div>
                <p className="text-muted-foreground">Poin Tersedia</p>
                <Button className="mt-4 w-full" variant="outline">
                  <Coins className="mr-2 h-4 w-4" />
                  Tukar Poin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Statistik Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total Koleksi:</strong> {data.history?.filter((h: any) => h.type === 'collection').length || 0}</p>
                <p><strong>Total Transaksi:</strong> {data.history?.filter((h: any) => h.type === 'transaction').length || 0}</p>
                <p><strong>Poin Hari Ini:</strong> 0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Riwayat Aktivitas
            </CardTitle>
            <CardDescription>Aktivitas terbaru Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.history?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.details}</p>
                    <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={item.points > 0 ? "default" : "secondary"}>
                    {item.points > 0 ? '+' : ''}{item.points} poin
                  </Badge>
                </div>
              )) || <p className="text-muted-foreground">Belum ada aktivitas</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

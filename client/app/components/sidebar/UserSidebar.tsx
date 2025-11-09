import React from "react";
import { User, QrCode, History, LogOut } from "lucide-react";

export default function UserSidebar() {
  return (
    <aside className="w-64 h-screen bg-green-700 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-green-600">
        User Dashboard
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <a href="/dashboard/user" className="flex items-center gap-3 hover:bg-green-600 px-3 py-2 rounded-md">
          <User className="w-5 h-5" /> Profil
        </a>
        <a href="/dashboard/user/scan" className="flex items-center gap-3 hover:bg-green-600 px-3 py-2 rounded-md">
          <QrCode className="w-5 h-5" /> Scan QR
        </a>
        <a href="/dashboard/user/history" className="flex items-center gap-3 hover:bg-green-600 px-3 py-2 rounded-md">
          <History className="w-5 h-5" /> History Transaksi
        </a>
      </nav>

      <button className="m-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </aside>
  );
}

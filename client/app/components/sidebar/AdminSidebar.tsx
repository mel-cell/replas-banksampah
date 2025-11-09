import React from "react";
import { User, ClipboardList, Building2, BarChart3, Settings, LogOut } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <a href="/dashboard/admin" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-md">
          <User className="w-5 h-5" /> Dashboard
        </a>
        <a href="/dashboard/admin/users" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-md">
          <ClipboardList className="w-5 h-5" /> Management User
        </a>
        <a href="/dashboard/admin/rooms" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-md">
          <Building2 className="w-5 h-5" /> Monitoring Room
        </a>
        <a href="/dashboard/admin/laporan" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-md">
          <BarChart3 className="w-5 h-5" /> Laporan Penjualan
        </a>
        <a href="/dashboard/admin/profile" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-md">
          <Settings className="w-5 h-5" /> Profil Admin
        </a>
      </nav>

      <button className="m-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </aside>
  );
}

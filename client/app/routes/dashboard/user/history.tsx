import React from "react";

export default function UserHistory() {
  const data = [
    { id: 1, tanggal: "2025-11-07", jenis: "Tukar Poin", poin: 250, status: "Selesai" },
    { id: 2, tanggal: "2025-11-02", jenis: "Setor Sampah", poin: 120, status: "Selesai" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">History Transaksi</h1>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Jenis Transaksi</th>
              <th className="px-4 py-2 text-right">Poin</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2 text-right">{item.poin}</td>
                <td className="px-4 py-2 text-center text-green-600">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

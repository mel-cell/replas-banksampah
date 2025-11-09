import React from "react";

export default function UserScan() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Scan QR</h1>
      <p className="text-muted-foreground mb-6">
        Gunakan kamera kamu untuk memindai kode QR pada mesin Replas Bank.
      </p>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          [Area kamera / scanner QR akan tampil di sini]
        </p>
      </div>
    </div>
  );
}

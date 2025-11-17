# --- STAGE 1: Build Frontend (Client) ---
# Kita sebut stage ini "client-builder"
FROM oven/bun:latest AS client-builder

# Tentukan folder kerja di dalam container
WORKDIR /app

# Salin package.json dan lockfile dari folder client
COPY client/package.json ./client/
COPY client/bun.lock ./client/

# Install dependencies HANYA untuk client
RUN cd client && bun install

# Salin sisa kode dari folder client
COPY client/ ./client/

# Jalankan perintah build dari client (ini akan membuat client/build)
RUN cd client && bun run build

# --- STAGE 2: Build Server (Final) ---
# Kita mulai dari image Bun yang baru dan bersih
FROM oven/bun:latest

WORKDIR /app

# Salin package.json dan lockfile dari server (root)
COPY package.json ./
COPY bun.lock ./

# Install dependencies HANYA untuk server (produksi)
RUN bun install --production

# Salin client package.json untuk SSR deps
COPY client/package.json ./client/
COPY client/bun.lock ./client/

# Install client dependencies for SSR
RUN cd client && bun install 

# Salin kode server Hono Anda
COPY server/ ./server/

# Ambil hasil build client dari Stage 1
# Ini adalah bagian "sihir"-nya
COPY --from=client-builder /app/client/build ./client/build

# Expose port yang digunakan Hono (port internal)
EXPOSE 3004

# Perintah untuk menjalankan server Hono Anda
# Ini akan menjalankan "bun run start"
CMD ["bun", "run", "start"]

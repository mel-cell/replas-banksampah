# API List for Replas Banksampah

This document contains a comprehensive list of all APIs available in the replas-banksampah application.

## Direct Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/welcome` - Welcome message endpoint
- `GET /api/conection` - Database connection test endpoint
- `GET /api/mqtt-status` - MQTT connection status endpoint

## Auth APIs (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user information

## Web APIs (`/api/web`) - User-facing endpoints
- `GET /profile` - Get user profile
- `GET /wallet` - Get user wallet balance
- `GET /history` - Get user conversion history
- `GET /rooms` - Get available rooms
- `GET /waste-types` - Get waste types
- `GET /conversion-rates` - Get conversion rates
- `POST /convert` - Create waste conversion
- `GET /leaderboard` - Get points leaderboard
- `GET /report/monthly` - Get monthly user report

## IoT APIs (`/api/iot`) - Machine/IoT integration
- `POST /activate` - Activate machine session
- `POST /session-end` - End machine session manually
- `GET /machine/:code/bottle-count` - Get bottle count for specific machine
- `GET /status` - Get IoT/MQTT status

## Admin APIs (`/api/admin`) - Administrative endpoints
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /rooms` - Get all rooms
- `POST /rooms` - Create room
- `PUT /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room
- `GET /conversions` - Get all conversions
- `GET /conversions/:id` - Get conversion by ID
- `GET /bottle-collections` - Get all bottle collections
- `GET /bottle-collections/:id` - Get bottle collection by ID
- `GET /waste-types` - Get waste types
- `POST /waste-types` - Create waste type
- `PUT /waste-types/:id` - Update waste type
- `DELETE /waste-types/:id` - Delete waste type
- `GET /conversion-rates` - Get conversion rates
- `POST /conversion-rates` - Create conversion rate
- `PUT /conversion-rates/:id` - Update conversion rate
- `DELETE /conversion-rates/:id` - Delete conversion rate
- `GET /exchange-rate-settings` - Get exchange rate settings
- `POST /exchange-rate-settings` - Create exchange rate setting
- `PUT /exchange-rate-settings/:id` - Update exchange rate setting
- `DELETE /exchange-rate-settings/:id` - Delete exchange rate setting
- `GET /wallet-transactions` - Get wallet transactions
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /reports/monthly` - Get monthly admin report

## Conversion APIs (`/api/conversion`) - Points to money conversion
- `POST /request` - Create conversion request (points to money)
- `GET /request` - Get user's conversion requests
- `GET /payment-methods` - Get available payment methods

## Docs API (`/api/docs`)
- API documentation endpoints (detailed content in docs.ts)

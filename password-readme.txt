================================================================================
                    THRIFT AURA ATELIER - CREDENTIALS & ACCESS GUIDE
================================================================================
Repository: https://github.com/ahmad-majid/zain-store.git
Local Dev Server: http://127.0.0.1:5173 / http://localhost:5173
Production Domain: https://thrift-aura.netlify.app (or custom domain)
================================================================================

--------------------------------------------------------------------------------
1. MASTER ADMIN & CURATOR PORTAL
--------------------------------------------------------------------------------
Portal Access URLs:
  - Admin Dashboard:    http://localhost:5173/admin
  - Admin Direct Gate: http://localhost:5173/admin-access

Master Credentials (Bypasses external DB, always works locally and on web):
  - Email:    admin@thriftaura.com
  - Password: ThriftAura@2026

Secondary Admin Email:
  - Email:    u06626982@gmail.com
  - Password: ThriftAura@2026

Admin Capabilities & Modules:
  - Inventory & Stock Management (add, edit, toggle availability, tag "1 of 1")
  - Live Orders CRM (view all client orders, dispatch statuses, update waybill tracking)
  - Courier Status Flow (Pending -> Confirmed -> Packing -> Dispatched -> Out for Delivery -> Delivered)
  - Courier Service assignment (TCS, Leopard, PostEx, Trax, DHL, FedEx) + Tracking Waybill ID
  - Registered Clients Directory & Promo Broadcasts
  - Financial & Analytics Dashboard (Net Revenue, Average Order Value, Conversion Metrics)
  - Email Notification History & Archival Packing Slips Generator

--------------------------------------------------------------------------------
2. PRE-REGISTERED DEMO CLIENT ACCOUNT
--------------------------------------------------------------------------------
Client Access URLs:
  - Client Portal / Sign In: http://localhost:5173/auth
  - Order History:          http://localhost:5173/my-orders
  - Shopping Bag / Cart:    http://localhost:5173/cart
  - Live Tracking Portal:   http://localhost:5173/track/:orderId

Demo Client Credentials:
  - Full Name: Elena Rostova
  - Email:     collector@gmail.com
  - Password:  Collector@2026
  - Phone:     +92 300 8472910
  - Address:   House 42, Street 11, Sector F-7/2, Islamabad
  - Status:    Verified VIP Collector

How to Sign In as Demo Client:
  1. Open http://localhost:5173/auth
  2. Select "Sign In" mode
  3. Enter email: collector@gmail.com
  4. Enter password: Collector@2026 (or click "Sign In with Gmail Code" to use OTP)
  5. Click "Sign In" -> Instant access to collector account, order history, and express checkout.

--------------------------------------------------------------------------------
3. NEW CLIENT REGISTRATION & 10-MINUTE EXPIRING OTP WORKFLOW
--------------------------------------------------------------------------------
How New Clients Register:
  1. Navigate to http://localhost:5173/auth (or click "Sign In" from header/cart).
  2. Switch to the "Create Account" tab.
  3. Required Registration Fields:
     - Full Name (e.g. Zain Malik)
     - Gmail / Email Address (e.g. client@gmail.com)
     - Password (Minimum 6 characters, eye toggle for show/hide)
     - Phone Number (Optional, for courier SMS updates)
  4. Click "Generate Verification Code".
  5. A 6-digit OTP code is dispatched via Gmail SMTP:
     - 10-Minute Expiration: A live countdown timer tracks the 10-minute window.
     - If the code is not entered within 10 minutes (600s), the code automatically expires.
     - An expiry alert appears with a 1-click "Dispatch New Code" button.
     - Offline / Testing Mode: If SMTP email delivery has any network delay, the 6-digit code is also displayed directly on screen for testing convenience.
  6. Enter the 6-digit code and submit.
  7. Client is immediately logged in, profile saved in client registry, and redirected back to their shopping cart or home.
  8. For future logins, the client can use their Email + Password OR request a fresh OTP code anytime.

--------------------------------------------------------------------------------
4. STORE OWNER & NOTIFICATION GMAIL SETTINGS
--------------------------------------------------------------------------------
Notifications are automatically dispatched whenever an order is placed, an order status changes, or an OTP verification code is requested:
  - Owner Email:         u06626982@gmail.com
  - Gmail App Password:  rsvo yzkh ohzk dhoa (or: rsvoyzkhohzkdhoa)
  - SMTP Service:        Google Gmail via Netlify Serverless Functions (nodemailer)
  - Trigger Events:
     1. New Order Placement (Sends confirmation to client + instant alert to store owner)
     2. Status Update / Waybill Dispatched (Sends courier tracking link to client)
     3. Registration Verification Code (Sends 6-digit 10-minute OTP code to client)
     4. Welcome Email (Dispatches warm atelier welcome upon successful registration)

--------------------------------------------------------------------------------
5. QUICK REFERENCE TEST MATRIX
--------------------------------------------------------------------------------
Role      | Email                  | Password         | URL
----------|------------------------|------------------|-------------------------
Admin     | admin@thriftaura.com   | ThriftAura@2026  | /admin or /admin-access
Admin Alt | u06626982@gmail.com    | ThriftAura@2026  | /admin or /admin-access
Client    | collector@gmail.com    | Collector@2026   | /auth
New Reg   | Any valid email        | Min 6 chars      | /auth (Create Account)

================================================================================
Generated for Thrift Aura Luxury Vintage Atelier - All rights reserved.
================================================================================

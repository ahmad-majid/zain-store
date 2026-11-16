import nodemailer from 'nodemailer';

const OWNER_EMAIL = 'u06626982@gmail.com';
const OWNER_PASS = 'rsvoyzkhohzkdhoa';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: OWNER_EMAIL,
    pass: OWNER_PASS,
  },
});

function formatCurrency(amount) {
  return 'Rs. ' + Number(amount || 0).toLocaleString();
}

function buildItemsHtml(items) {
  if (!items || !items.length) return '<p style="color: #666;">No items recorded.</p>';

  const rows = items.map((it) => {
    const img = it.colors?.[0]?.images?.[0] || it.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop';
    const color = it.selectedColor || 'Standard';
    const size = it.selectedSize || 'Std';
    const lineTotal = formatCurrency(Number(it.price || 0) * (it.quantity || 1));

    return `
      <tr style="border-bottom: 1px solid #2d261e;">
        <td style="padding: 12px 8px; vertical-align: middle; width: 60px;">
          <img src="${img}" alt="${it.name}" style="width: 50px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #3d3429;" />
        </td>
        <td style="padding: 12px 8px; vertical-align: middle;">
          <div style="font-weight: 600; color: #f5f3ef; font-size: 14px;">${it.name}</div>
          <div style="color: #9e9382; font-size: 12px; margin-top: 2px;">
            Color: ${color} &bull; Size: ${size}
          </div>
        </td>
        <td style="padding: 12px 8px; vertical-align: middle; text-align: center; color: #cfc8be; font-size: 13px; font-family: monospace;">
          x${it.quantity || 1}
        </td>
        <td style="padding: 12px 8px; vertical-align: middle; text-align: right; color: #d4af37; font-weight: 600; font-size: 14px; font-family: monospace;">
          ${lineTotal}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 18px;">
      <thead>
        <tr style="border-bottom: 1px solid #3d3429; color: #9e9382; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
          <th style="padding: 8px; text-align: left;">Piece</th>
          <th style="padding: 8px; text-align: left;">Details</th>
          <th style="padding: 8px; text-align: center;">Qty</th>
          <th style="padding: 8px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function buildClientConfirmationEmail(order) {
  const itemsHtml = buildItemsHtml(order.items);
  const paymentText = order.paymentMethod === 'cod' ? 'Cash on Delivery (Courier Handover)' : 'Direct Card / Electronic';

  return `
    <div style="background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e7e3dc; padding: 32px 16px;">
      <div style="max-width: 620px; margin: 0 auto; background-color: #141517; border: 1px solid #2d261e; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background: linear-gradient(180deg, #1f1d1a 0%, #141517 100%); padding: 32px 28px 24px; text-align: center; border-bottom: 1px solid #2d261e;">
          <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal; letter-spacing: 4px; color: #f5f3ef; text-transform: uppercase;">
            Thrift <span style="color: #d4af37; font-style: italic;">Aura</span>
          </h1>
          <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #a39c91;">
            Official Atelier Acquisition Confirmation
          </p>
        </div>

        <!-- Order Hero Banner -->
        <div style="padding: 24px 28px; background-color: #1a1a1c; border-bottom: 1px solid #2d261e; text-align: center;">
          <div style="display: inline-block; background-color: rgba(212, 175, 55, 0.12); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.35); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 4px 14px; border-radius: 20px; margin-bottom: 10px;">
            Order Authenticated
          </div>
          <h2 style="margin: 0; font-family: Georgia, serif; font-size: 22px; color: #ffffff;">
            Thank you, ${order.client.fullName || 'Collector'}
          </h2>
          <p style="margin: 8px 0 0; font-size: 13px; color: #b5ad9e; line-height: 1.5;">
            Your vintage selection has been reserved. Our atelier concierge is conducting quality inspection and archival wrapping before courier dispatch.
          </p>
          <div style="margin-top: 14px; font-family: monospace; font-size: 16px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">
            Order ID: ${order.id}
          </div>
        </div>

        <!-- Body Content -->
        <div style="padding: 28px;">
          <!-- Items List -->
          <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #d4af37;">
            Archival Pieces in Order
          </h3>
          ${itemsHtml}

          <!-- Financial Summary -->
          <div style="background-color: #1a1917; border: 1px solid #2d261e; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a39c91; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <span style="font-family: monospace; color: #f5f3ef;">${formatCurrency(order.subtotal)}</span>
            </div>
            ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 13px; color: #48bb78; margin-bottom: 6px;">
                <span>Discount (${order.couponCode || 'Promo'}):</span>
                <span style="font-family: monospace;">- ${formatCurrency(order.discount)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a39c91; margin-bottom: 6px;">
              <span>Insured Courier Transit:</span>
              <span style="font-family: monospace; color: #f5f3ef;">${order.shipping === 0 ? 'Complimentary' : formatCurrency(order.shipping)}</span>
            </div>
            <div style="border-top: 1px solid #3d3429; padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
              <span style="color: #f5f3ef;">Total Payable:</span>
              <span style="font-family: monospace; color: #d4af37; font-size: 18px;">${formatCurrency(order.total)}</span>
            </div>
          </div>

          <!-- Shipping & Client Info -->
          <div style="background-color: #17181a; border: 1px solid #2d261e; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d4af37;">
              Courier Dispatch Destination
            </h4>
            <div style="font-size: 13px; color: #d0c8bd; line-height: 1.6;">
              <div><strong>Recipient:</strong> ${order.client.fullName}</div>
              <div><strong>Address:</strong> ${order.client.address}, ${order.client.city}</div>
              <div><strong>Phone:</strong> ${order.client.phone}</div>
              <div><strong>Payment Mode:</strong> ${paymentText}</div>
              ${order.client.notes ? `<div><strong>Notes:</strong> ${order.client.notes}</div>` : ''}
            </div>
          </div>

          <!-- Tracking Assurance -->
          <div style="text-align: center; padding: 16px; background-color: rgba(212, 175, 55, 0.05); border: 1px dashed rgba(212, 175, 55, 0.3); border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #a39c91; line-height: 1.5;">
              You will receive an automated tracking notification as soon as your parcel is dispatched from our atelier.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0f1011; border-top: 1px solid #2d261e; padding: 20px 28px; text-align: center; font-size: 11px; color: #6b6459;">
          <p style="margin: 0 0 4px;">Thrift Aura Atelier &bull; Curated Vintage &amp; Archival Fashion</p>
          <p style="margin: 0;">For inquiries or sizing assistance, contact our concierge at <a href="mailto:${OWNER_EMAIL}" style="color: #d4af37; text-decoration: none;">${OWNER_EMAIL}</a></p>
        </div>

      </div>
    </div>
  `;
}

function buildAdminAlertEmail(order) {
  const itemsHtml = buildItemsHtml(order.items);
  const paymentText = order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Electronic';

  return `
    <div style="background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e7e3dc; padding: 24px;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #141517; border: 2px solid #d4af37; border-radius: 12px; overflow: hidden;">
        
        <div style="background-color: #d4af37; color: #0c0d0e; padding: 16px 24px; font-weight: bold; font-size: 15px; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center;">
          <span>⚡ NEW ORDER RECEIVED • THRIFT AURA CRM</span>
          <span style="font-family: monospace; font-size: 16px;">${order.id}</span>
        </div>

        <div style="padding: 24px;">
          <div style="background-color: #1f1d19; border: 1px solid #3d3429; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <div style="font-size: 20px; color: #f5f3ef; font-weight: bold; margin-bottom: 6px;">
              ${order.client.fullName} placed an order for <span style="color: #d4af37;">${formatCurrency(order.total)}</span>
            </div>
            <div style="font-size: 13px; color: #a39c91;">
              Placed on: ${new Date(order.createdAt).toLocaleString()} &bull; Payment: <strong>${paymentText}</strong>
            </div>
          </div>

          <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #d4af37;">
            Customer & Delivery Particulars
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background-color: #191a1d; border-radius: 6px;">
            <tr>
              <td style="padding: 8px 12px; color: #8e877a; width: 130px; border-bottom: 1px solid #262422;">Client Name:</td>
              <td style="padding: 8px 12px; color: #f5f3ef; font-weight: 600; border-bottom: 1px solid #262422;">${order.client.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #8e877a; border-bottom: 1px solid #262422;">Phone (Courier):</td>
              <td style="padding: 8px 12px; color: #d4af37; font-family: monospace; font-weight: bold; border-bottom: 1px solid #262422;">
                <a href="tel:${order.client.phone}" style="color: #d4af37; text-decoration: none;">${order.client.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #8e877a; border-bottom: 1px solid #262422;">Email:</td>
              <td style="padding: 8px 12px; color: #cfc8be; font-family: monospace; border-bottom: 1px solid #262422;">${order.client.email || 'None provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #8e877a; border-bottom: 1px solid #262422;">Street Address:</td>
              <td style="padding: 8px 12px; color: #f5f3ef; border-bottom: 1px solid #262422;">${order.client.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #8e877a; border-bottom: 1px solid #262422;">City:</td>
              <td style="padding: 8px 12px; color: #f5f3ef; font-weight: 600; border-bottom: 1px solid #262422;">${order.client.city}</td>
            </tr>
            ${order.client.notes ? `
              <tr>
                <td style="padding: 8px 12px; color: #8e877a;">Special Notes:</td>
                <td style="padding: 8px 12px; color: #e2d9cc;">${order.client.notes}</td>
              </tr>
            ` : ''}
          </table>

          <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #d4af37;">
            Items Ordered (${order.items?.length || 0})
          </h3>
          ${itemsHtml}

          <div style="background-color: #1a1a1c; border: 1px solid #2d261e; padding: 14px; border-radius: 8px; text-align: right; font-size: 15px;">
            Total Payable: <strong style="color: #d4af37; font-family: monospace; font-size: 18px;">${formatCurrency(order.total)}</strong>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <p style="color: #8e877a; font-size: 12px; margin-bottom: 8px;">Log into the Thrift Aura Admin CRM to fulfill and dispatch this order:</p>
            <div style="display: inline-block; background-color: #d4af37; color: #0c0d0e; font-size: 13px; font-weight: bold; padding: 10px 20px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase;">
              Action: Open Admin CRM &bull; Orders Tab
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function buildStatusUpdateEmail(order, newStatus, trackingInfo) {
  const isDispatched = newStatus.toLowerCase().includes('dispatch');
  const isDelivered = newStatus.toLowerCase().includes('deliver');
  const isCancelled = newStatus.toLowerCase().includes('cancel');

  let statusHeadline = `Order Status: ${newStatus}`;
  let statusColor = '#d4af37';
  let statusMessage = `Your order #${order.id} status has been updated to "${newStatus}".`;

  if (isDispatched) {
    statusHeadline = 'Your Archival Order Has Been Dispatched!';
    statusColor = '#48bb78';
    statusMessage = 'Great news! Your archival garment has passed atelier quality checks, has been enveloped in tissue wrapping, and is now with our insured courier partner.';
  } else if (isDelivered) {
    statusHeadline = 'Your Archival Order Has Been Delivered';
    statusColor = '#d4af37';
    statusMessage = 'Our courier partner reports that your parcel has been successfully delivered. We hope you cherish this curated vintage piece.';
  } else if (isCancelled) {
    statusHeadline = 'Order Status: Cancelled';
    statusColor = '#e53e3e';
    statusMessage = 'Your order has been marked as cancelled. If this is unexpected, please contact our concierge.';
  }

  return `
    <div style="background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e7e3dc; padding: 32px 16px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141517; border: 1px solid #2d261e; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        
        <div style="background: linear-gradient(180deg, #1f1d1a 0%, #141517 100%); padding: 30px 24px 20px; text-align: center; border-bottom: 1px solid #2d261e;">
          <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: normal; letter-spacing: 4px; color: #f5f3ef; text-transform: uppercase;">
            Thrift <span style="color: #d4af37; font-style: italic;">Aura</span>
          </h1>
          <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #a39c91;">
            Order Fulfillment &amp; Dispatch Update
          </p>
        </div>

        <div style="padding: 28px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: rgba(212,175,55,0.12); color: ${statusColor}; border: 1px solid ${statusColor}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 6px 16px; border-radius: 20px; margin-bottom: 12px;">
              ${newStatus}
            </div>
            <h2 style="margin: 0; font-family: Georgia, serif; font-size: 22px; color: #ffffff;">
              ${statusHeadline}
            </h2>
            <p style="margin: 10px 0 0; font-size: 14px; color: #b5ad9e; line-height: 1.5;">
              ${statusMessage}
            </p>
            <div style="margin-top: 12px; font-family: monospace; font-size: 15px; font-weight: bold; color: #d4af37;">
              Order Identifier: ${order.id}
            </div>
          </div>

          ${isDispatched && trackingInfo && trackingInfo.trackingNumber ? `
            <div style="background-color: #1a1a1c; border: 1px solid #3d3429; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d4af37;">
                Courier Dispatch &amp; Tracking Waybill
              </h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #8e877a; width: 140px;">Courier Partner:</td>
                  <td style="padding: 6px 0; color: #f5f3ef; font-weight: bold;">${trackingInfo.courier || 'Express Courier'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8e877a;">Waybill / Tracking #:</td>
                  <td style="padding: 6px 0; color: #d4af37; font-family: monospace; font-size: 15px; font-weight: bold;">
                    ${trackingInfo.trackingNumber}
                  </td>
                </tr>
                ${trackingInfo.notes ? `
                  <tr>
                    <td style="padding: 6px 0; color: #8e877a;">Concierge Notes:</td>
                    <td style="padding: 6px 0; color: #d0c8bd;">${trackingInfo.notes}</td>
                  </tr>
                ` : ''}
              </table>
            </div>
          ` : ''}

          <!-- Delivery Address Recap -->
          <div style="background-color: #17181a; border: 1px solid #2d261e; border-radius: 10px; padding: 16px; margin-bottom: 20px; font-size: 13px; color: #b5ad9e;">
            <strong style="color: #f5f3ef;">Delivering To:</strong> ${order.client.fullName} &bull; ${order.client.address}, ${order.client.city}
            <br />
            <strong style="color: #f5f3ef;">Payable at Door:</strong> <span style="color: #d4af37; font-family: monospace; font-weight: bold;">${formatCurrency(order.total)}</span>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 12px; color: #7d7568;">
              Questions regarding this delivery? Simply reply to this email or contact <a href="mailto:${OWNER_EMAIL}" style="color: #d4af37; text-decoration: none;">${OWNER_EMAIL}</a>.
            </p>
          </div>
        </div>

        <div style="background-color: #0f1011; border-top: 1px solid #2d261e; padding: 18px 24px; text-align: center; font-size: 11px; color: #6b6459;">
          Thrift Aura Atelier &bull; Curated Vintage &amp; Archival Fashion
        </div>

      </div>
    </div>
  `;
}

export async function handler(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
    const { type, order, newStatus, trackingInfo } = payload;

    if (!order) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing order data' }) };
    }

    const dispatches = [];

    // --- Scenario 1: New Order Placed ---
    if (type === 'new_order') {
      // 1. Notify Store Owner / Admin
      dispatches.push(
        transporter.sendMail({
          from: `"Thrift Aura Atelier" <${OWNER_EMAIL}>`,
          to: OWNER_EMAIL,
          subject: `⚡ NEW ORDER • ${order.id} - ${formatCurrency(order.total)} (${order.client.fullName})`,
          html: buildAdminAlertEmail(order),
        })
      );

      // 2. Notify Client if email provided
      if (order.client?.email && order.client.email.includes('@')) {
        dispatches.push(
          transporter.sendMail({
            from: `"Thrift Aura Atelier" <${OWNER_EMAIL}>`,
            to: order.client.email,
            subject: `Thrift Aura Atelier • Order Confirmed #${order.id}`,
            html: buildClientConfirmationEmail(order),
          })
        );
      }
    }

    // --- Scenario 2: Admin Advances Order Status ---
    else if (type === 'status_update') {
      const statusLabel = newStatus || order.status || 'Updated';

      // 1. Send update to client
      if (order.client?.email && order.client.email.includes('@')) {
        dispatches.push(
          transporter.sendMail({
            from: `"Thrift Aura Atelier" <${OWNER_EMAIL}>`,
            to: order.client.email,
            subject: `Thrift Aura Atelier • Order Update: ${statusLabel} (#${order.id})`,
            html: buildStatusUpdateEmail(order, statusLabel, trackingInfo),
          })
        );
      }

      // 2. Send status confirmation copy to Admin
      dispatches.push(
        transporter.sendMail({
          from: `"Thrift Aura Atelier" <${OWNER_EMAIL}>`,
          to: OWNER_EMAIL,
          subject: `Status Updated: #${order.id} ➔ ${statusLabel} (${order.client.fullName})`,
          html: buildStatusUpdateEmail(order, statusLabel, trackingInfo),
        })
      );
    }

    const results = await Promise.allSettled(dispatches);
    const sentCount = results.filter((r) => r.status === 'fulfilled').length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sentCount,
        results,
      }),
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to send email notifications',
      }),
    };
  }
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendOrderConfirmationEmail = async (email, name, order) => {
  if (!process.env.EMAIL_USER) return; // skip if not configured

  const itemsList = order.items
    .map((i) => `<li>${i.product.name} x${i.quantity} — ₹${i.price * i.quantity}</li>`)
    .join('');

  await transporter.sendMail({
    from: `"Flipkart Clone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed! Order ID: ${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:24px">
        <h2 style="color:#2874f0">🎉 Order Placed Successfully!</h2>
        <p>Hi <strong>${name}</strong>, your order has been confirmed.</p>
        <p><strong>Order ID:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
        <h3>Items Ordered:</h3>
        <ul>${itemsList}</ul>
        <hr/>
        <p><strong>Total Amount: ₹${order.totalAmount.toFixed(2)}</strong></p>
        <p>Payment Method: ${order.paymentMethod}</p>
        <p style="color:#388e3c">Estimated Delivery: 3-5 business days</p>
        <hr/>
        <p style="color:#888;font-size:12px">Thank you for shopping with Flipkart Clone!</p>
      </div>
    `,
  });
};

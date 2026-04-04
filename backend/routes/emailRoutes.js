import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ POST /api/email/send-confirmation
router.post("/send-confirmation", async (req, res) => {
  try {
    const { name, email, amount, orderId, paymentId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    // 🧩 Email transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🧾 Email content
    const mailOptions = {
      from: `"GlassVision Orders" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🧾 GlassVision Payment Confirmation",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;background:#f9f9f9;border-radius:10px;">
          <h2 style="color:#0d9488;">Payment Successful ✅</h2>
          <p>Dear <strong>${name || "Customer"}</strong>,</p>
          <p>Thank you for your payment! Your transaction has been successfully processed.</p>
          <table style="border-collapse:collapse;margin:20px 0;width:100%;">
            <tr><td><strong>Order ID:</strong></td><td>${orderId}</td></tr>
            <tr><td><strong>Payment ID:</strong></td><td>${paymentId}</td></tr>
            <tr><td><strong>Amount Paid:</strong></td><td>₹${amount}</td></tr>
          </table>
          <p>Your order is being processed. We’ll notify you once it’s shipped.</p>
          <p style="color:#555;">Best regards,<br/>Team GlassVision</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);

    res.status(200).json({ success: true, message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});

export default router;

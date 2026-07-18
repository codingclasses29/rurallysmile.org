import { Router } from "express";
import authRoutes from "./auth.routes.js";
import studentRoutes from "./student.routes.js";
import adminRoutes from "./admin.routes.js";
import registrationRoutes from "./registration.routes.js";
import admitRoutes from "./admit.routes.js";
import resultRoutes from "./result.routes.js";
import marksheetRoutes from "./marksheet.routes.js";
import examCenterRoutes from "./examCenter.routes.js";
import noticeRoutes from "./notice.routes.js";
import galleryRoutes from "./gallery.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import uploadRoutes from "./upload.routes.js";
import settingRoutes from "./setting.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);
router.use("/registration", registrationRoutes);
router.use("/admit", admitRoutes);
router.use("/result", resultRoutes);
router.use("/marksheet", marksheetRoutes);
router.use("/center", examCenterRoutes);
router.use("/exam", examCenterRoutes); // alias
router.use("/notice", noticeRoutes);
router.use("/gallery", galleryRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/settings", settingRoutes);
router.use("/ai", aiRoutes);

router.get("/health", (req, res) => {
  const emailSmtp = Boolean(
    process.env.EMAIL || process.env.NODEMAILER_EMAIL
  );
  const emailHttps = Boolean(process.env.RESEND_API_KEY);
  const sms = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
  );

  res.json({
    success: true,
    message: "Server Running",
    time: new Date(),
    data: {
      version: "v1",
      otpDelivery: {
        resendHttps: emailHttps,
        smtpConfigured: emailSmtp,
        twilioSms: sms,
      },
    },
    errors: null,
  });
});

export default router;

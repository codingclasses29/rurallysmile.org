/**
 * Google Apps Script — Gmail OTP mailer (HTTPS, works from Vercel/Render free)
 *
 * SETUP (2 minutes):
 * 1) https://script.google.com → New project
 * 2) Paste this whole file into Code.gs
 * 3) Set Script property MAIL_SECRET to the same value as Vercel env GMAIL_WEBAPP_SECRET
 *    (Project Settings → Script properties)
 * 4) Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5) Copy the Web app URL → Vercel env GMAIL_WEBAPP_URL
 * 6) Redeploy Vercel
 *
 * Emails are sent from the Google account that owns this script
 * (use codingclasses29@gmail.com).
 */

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("MAIL_SECRET") || "";
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (!secret || data.secret !== secret) {
      return json_({ ok: false, error: "Unauthorized" }, 401);
    }

    var to = String(data.to || "").trim();
    var subject = String(data.subject || "OTP");
    var html = String(data.html || "");
    var text = String(data.text || "");

    if (!to || !html) {
      return json_({ ok: false, error: "to and html required" }, 400);
    }

    GmailApp.sendEmail(to, subject, text || "Please view this email in HTML.", {
      htmlBody: html,
      name: "Pratibha Khoj 2026",
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  return json_({ ok: true, service: "pratibha-khoj-gmail-otp" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

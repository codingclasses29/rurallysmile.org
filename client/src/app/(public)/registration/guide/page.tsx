import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Registration User Guide",
  description:
    "Pratibha Khoj Competition 2026 — step-by-step student registration guide / छात्र पंजीकरण गाइड",
};

const BEFORE = [
  {
    hi: "सक्रिय ईमेल आईडी (OTP के लिए)",
    en: "Active email ID (for OTP)",
  },
  {
    hi: "मोबाइल नंबर (माता/पिता का भी)",
    en: "Mobile number (parent optional)",
  },
  {
    hi: "पासपोर्ट साइज़ फोटो (JPG/PNG, अधिकतम 2 MB)",
    en: "Passport photo (JPG/PNG, max 2 MB)",
  },
  {
    hi: "हस्ताक्षर (JPG/PNG, अधिकतम 1 MB)",
    en: "Signature (JPG/PNG, max 1 MB)",
  },
  {
    hi: "स्कूल आईडी कार्ड / प्रमाण (JPG/PNG/PDF)",
    en: "School ID proof (JPG/PNG/PDF)",
  },
  {
    hi: "आधार कार्ड (वैकल्पिक)",
    en: "Aadhaar card (optional)",
  },
];

const FORM_STEPS = [
  {
    n: 1,
    titleHi: "व्यक्तिगत विवरण",
    titleEn: "Personal Details",
    points: [
      "नाम, पिता का नाम, माता का नाम",
      "जन्म तिथि, लिंग, श्रेणी (General/OBC/SC/ST/EWS)",
      "कक्षा चुनें: 7, 8, 9 या 10",
    ],
  },
  {
    n: 2,
    titleHi: "पता विवरण",
    titleEn: "Address Details",
    points: [
      "राज्य, जिला, ब्लॉक, गाँव",
      "पिन कोड और पूरा पता",
    ],
  },
  {
    n: 3,
    titleHi: "स्कूल विवरण",
    titleEn: "School Details",
    points: [
      "स्कूल का पूरा नाम",
      "माध्यम: हिन्दी या English",
    ],
  },
  {
    n: 4,
    titleHi: "संपर्क विवरण",
    titleEn: "Contact Details",
    points: [
      "विद्यार्थी मोबाइल (10 अंक)",
      "ईमेल (OTP यहीं आएगा — सही लिखें)",
      "WhatsApp नंबर (खाली छोड़ें तो मोबाइल लगेगा)",
    ],
  },
  {
    n: 5,
    titleHi: "फोटो और दस्तावेज़",
    titleEn: "Photo & Documents",
    points: [
      "साफ पासपोर्ट फोटो अपलोड करें",
      "सफेद पृष्ठभूमि पर हस्ताक्षर",
      "स्कूल आईडी अनिवार्य · आधार वैकल्पिक",
    ],
  },
  {
    n: 6,
    titleHi: "समीक्षा (Review)",
    titleEn: "Review Form",
    points: [
      "सारी जानकारी एक बार फिर पढ़ें",
      "गलती हो तो Previous से सुधारें",
      "ठीक हो तो Next दबाएँ",
    ],
  },
  {
    n: 7,
    titleHi: "ईमेल OTP",
    titleEn: "Email OTP Verify",
    points: [
      "Send OTP दबाएँ — ईमेल इनबॉक्स/Spam चेक करें",
      "6 अंकों का OTP भरें और Verify करें",
      "Verify के बाद Submit हो जाएगा",
    ],
  },
  {
    n: 8,
    titleHi: "पंजीकरण पूर्ण",
    titleEn: "Registration Complete",
    points: [
      "Registration Number स्क्रीन पर दिखेगा — सेव कर लें",
      "Receipt PDF डाउनलोड करें",
      "स्थिति बाद में Status पेज से देख सकते हैं",
    ],
  },
];

const AFTER = [
  {
    titleHi: "स्थिति जाँचें",
    titleEn: "Check Status",
    href: "/registration/status",
    desc: "Registration Number या Mobile से Pending / Approved देखें",
  },
  {
    titleHi: "प्रवेश पत्र",
    titleEn: "Admit Card",
    href: "/admit-card",
    desc: "Approve होने के बाद Admit Card डाउनलोड करें (लगभग 02 Sep 2026)",
  },
  {
    titleHi: "परीक्षा दिन",
    titleEn: "Exam Day",
    href: "/registration/documents",
    desc: "Admit Card + फोटो ID लेकर केन्द्र पर समय से पहुँचें",
  },
  {
    titleHi: "परिणाम / मार्कशीट",
    titleEn: "Result / Marksheet",
    href: "/result",
    desc: "परिणाम घोषणा के बाद Roll Number से Result और Marksheet लें",
  },
];

const TIPS = [
  "ईमेल सही लिखें — गलत ईमेल पर OTP नहीं मिलेगा।",
  "फोटो धुँधली / बहुत बड़ी न हो; JPG/PNG ही अपलोड करें।",
  "एक मोबाइल से एक ही आवेदन करें।",
  "फॉर्म बीच में बंद हो जाए तो Draft से फिर शुरू कर सकते हैं।",
  "OTP 5 मिनट में Expire हो जाता है — दोबारा Send OTP करें।",
  "Helpline: " + SITE.phones.join(" / "),
];

export default function RegistrationGuidePage() {
  return (
    <>
      <PageHeader
        title="Registration User Guide"
        description="प्रतिभा खोज 2026 — छात्र पंजीकरण की पूरी प्रक्रिया, चरण-दर-चरण (हिन्दी + English)"
      />

      <div className="container-page section-pad pt-0">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card className="!p-6 border-teal-100 bg-gradient-to-br from-teal-50/80 to-white">
            <h2 className="font-heading text-xl font-extrabold text-brand-primary">
              कैसे शुरू करें? / How to start
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700 md:text-base">
              <li>
                वेबसाइट खोलें:{" "}
                <Link href="/" className="font-semibold text-brand-primary underline">
                  Home
                </Link>
              </li>
              <li>
                मेनू से <strong>Registration → Student Registration</strong> चुनें
                या सीधा{" "}
                <Link
                  href="/registration"
                  className="font-semibold text-brand-primary underline"
                >
                  /registration
                </Link>{" "}
                खोलें — पंजीकरण <strong>05 अगस्त 2026</strong> से शुरू
              </li>
              <li>नीचे दिए 8 चरण पूरे करें → Registration Number प्राप्त करें</li>
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/registration">
                <Button variant="success">Start Registration</Button>
              </Link>
              <Link href="/registration/documents">
                <Button variant="outline">Required Documents</Button>
              </Link>
              <Link href="/registration/status">
                <Button variant="outline">Check Status</Button>
              </Link>
            </div>
          </Card>

          <section>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              1. पहले तैयार रखें / Before you begin
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BEFORE.map((item) => (
                <Card key={item.en} className="!p-4">
                  <p className="font-semibold text-slate-900">{item.hi}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.en}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              2. पंजीकरण के 8 चरण / 8 Registration Steps
            </h2>
            <div className="mt-4 space-y-4">
              {FORM_STEPS.map((step) => (
                <Card key={step.n} className="!p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {step.titleHi}{" "}
                        <span className="text-sm font-medium text-slate-500">
                          / {step.titleEn}
                        </span>
                      </h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {step.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              3. पंजीकरण के बाद / After registration
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {AFTER.map((item) => (
                <Card key={item.href} className="!p-5">
                  <h3 className="font-heading font-bold text-brand-primary">
                    {item.titleHi}{" "}
                    <span className="text-sm font-medium text-slate-500">
                      / {item.titleEn}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-block text-sm font-semibold text-orange-600 underline"
                  >
                    Open page →
                  </Link>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              4. परीक्षा समय सारिणी / Exam schedule
            </h2>
            <Card className="mt-4 !p-5">
              <ul className="space-y-2 text-sm text-slate-700 md:text-base">
                <li>
                  <strong>परीक्षा तिथि:</strong> {SITE.examDateLabel}
                </li>
                <li>
                  <strong>कक्षा 7–8:</strong> 09:00 AM – 10:30 AM (रिपोर्ट 08:30 AM)
                </li>
                <li>
                  <strong>कक्षा 9–10:</strong> 10:00 AM – 11:30 AM (रिपोर्ट 09:30 AM)
                </li>
                <li>
                  <strong>केन्द्र:</strong> {SITE.examCentreEn}, {SITE.district},{" "}
                  {SITE.state}
                </li>
                <li>
                  <strong>पंजीकरण अंतिम तिथि:</strong> {SITE.lastDateLabel}
                </li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="font-heading text-xl font-extrabold text-slate-900">
              5. जरूरी सुझाव / Tips
            </h2>
            <Card className="mt-4 !p-5">
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                {TIPS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-600">
                WhatsApp Support:{" "}
                <a
                  href={SITE.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-primary underline"
                >
                  Join Channel
                </a>
              </p>
            </Card>
          </section>

          <div className="flex flex-wrap justify-center gap-3 pb-6">
            <Link href="/registration">
              <Button variant="success" className="min-w-[200px]">
                Register Now / अभी पंजीकरण करें
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact / संपर्क</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

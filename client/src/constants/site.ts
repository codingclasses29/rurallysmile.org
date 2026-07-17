export const SITE = {
  name: "Pratibha Khoj Competition 2026",
  shortName: "Pratibha Khoj",
  org: "Rurally Smile Foundation",
  orgHindi: "रूरली स्माइल फाउंडेशन",
  titleHindi: "प्रतिभा खोज प्रतियोगिता 2026",
  slogan: "शिक्षा है सशक्त भविष्य | Education is Empowerment",
  mission:
    "इस प्रतियोगिता का उद्देश्य ग्रामीण प्रतिभाओं को राष्ट्रीय स्तर तक पहुँचाना है।",
  vision: "हर ग्रामीण बच्चे को समान शैक्षिक अवसर और राष्ट्रीय मंच प्रदान करना।",
  /** About foundation — admit card / marksheet footer block (from rurallysmile.org) */
  aboutFoundation: {
    title: "About Rurally Smile Foundation",
    titleHi: "रूरली स्माइल फाउंडेशन के बारे में",
    location: "Siwan, Bihar",
    tagline: "Transforming Rural Areas with Joy and Quality Education",
    welcome:
      "At Rurally Smile Foundation, nestled in the heart of Siwan, Bihar, we are dedicated to transforming lives through education. Our mission is empowering children in rural communities with the tools and opportunities they need to thrive academically and beyond.",
    missionEn:
      "Our primary goal is to ensure every child in Siwan has access to quality education — a fundamental right and a catalyst for social change and economic empowerment.",
    managingDirector: "Amritanshu Pandey",
    managingDirectorTitle: "Managing Director",
    /** Digital authorized signature shown on admit / marksheet */
    authorizedSignatory: "Amritanshu Pandey",
    authorizedSignatoryLabel: "अधिकृत हस्ताक्षर",
    authorizedSignatoryLabelEn: "Authorized Signatory",
    founders: [
      { name: "Amritanshu Pandey", role: "Managing Director" },
      { name: "Krishshna Chandra Pandey", role: "Director" },
      { name: "Bhola Yadav", role: "Director" },
      { name: "Sunil Yadav", role: "Director" },
    ],
  },
  website: "https://rurallysmile.org",
  email: "Rurallysmilefoundation@gmail.com",
  emailAlt: "info@rurallysmile.org",
  supportEmail: "support@rurallysmile.org",
  phones: ["9934276672", "7016772619"],
  year: 2026,
  examDate: "2026-09-05T09:00:00+05:30",
  examDateLabel: "05 September 2026 (Saturday)",
  examDateLabelHindi: "05 सितम्बर 2026 (शनिवार)",
  registrationStartLabel: "शीघ्र घोषित किया जाएगा",
  lastDateLabel: "31 August 2026",
  lastDateLabelHindi: "31 अगस्त 2026",
  admitCardDateLabel: "02 September 2026",
  admitCardDateLabelHindi: "02 सितम्बर 2026",
  resultDateLabel: "शीघ्र घोषित किया जाएगा",
  examCentre: "उत्क्रमित उच्च विद्यालय, रतनपुरा",
  examCentreHindi: "उत्क्रमित उच्च विद्यालय, रतनपुरा",
  examCentreEn: "Utkramit Uchch Vidyalaya, Ratnpura",
  examCentreFull: "उत्क्रमित उच्च विद्यालय, रतनपुरा, जिला – सीवान (बिहार)",
  district: "सीवान",
  state: "बिहार",
  medium: "हिन्दी माध्यम",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Ratnpura+Siwan+Bihar",
  announcement:
    "प्रतिभा खोज प्रतियोगिता 2026 · पंजीकरण अंतिम तिथि 31 अगस्त 2026 · परीक्षा 05 सितम्बर 2026 · कक्षा 7–8: 09:00–10:30 · कक्षा 9–10: 10:00–11:30",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/channel/UCkFeoZnvN_jNioynJL17bkw",
    telegram: "https://t.me/",
    whatsapp: "https://wa.me/919934276672",
  },
} as const;

/** Class-wise exam slots (official schedule) */
export const EXAM_SLOTS = {
  junior: {
    classes: "7–8",
    classesLabel: "कक्षा 7 से 8",
    classesLabelEn: "Classes 7 to 8",
    reportingTime: "08:30 AM",
    examTime: "09:00 AM – 10:30 AM",
    examStart: "09:00 AM",
    examEnd: "10:30 AM",
  },
  senior: {
    classes: "9–10",
    classesLabel: "कक्षा 9 से 10",
    classesLabelEn: "Class 9 to 10",
    reportingTime: "09:30 AM",
    examTime: "10:00 AM – 11:30 AM",
    examStart: "10:00 AM",
    examEnd: "11:30 AM",
  },
} as const;

export type ExamSlot = (typeof EXAM_SLOTS)[keyof typeof EXAM_SLOTS];

/** Resolve exam slot from student class (7–8 junior, 9–10 senior) */
export function getExamSlotForClass(cls?: string | number | null): ExamSlot {
  const n = Number(String(cls || "").replace(/\D/g, ""));
  if (n >= 9) return EXAM_SLOTS.senior;
  return EXAM_SLOTS.junior;
}

/** Three official exam instructions — Hindi (website) */
export const EXAM_INSTRUCTIONS = [
  "सभी विद्यार्थियों को परीक्षा प्रारम्भ होने से कम से कम 30 मिनट पहले परीक्षा केन्द्र पर उपस्थित होना अनिवार्य है तथा प्रवेश पत्र (Admit Card) और वैध पहचान पत्र साथ लाना होगा।",
  "मोबाइल फोन, स्मार्ट वॉच, कैलकुलेटर, ब्लूटूथ डिवाइस अथवा किसी भी प्रकार के इलेक्ट्रॉनिक उपकरण परीक्षा कक्ष में पूर्णतः प्रतिबंधित हैं।",
  "परीक्षा समाप्त होने से पहले उत्तर पुस्तिका जमा किए बिना परीक्षा कक्ष छोड़ने की अनुमति नहीं होगी। सभी अभ्यर्थियों को परीक्षा केन्द्र के नियमों एवं निरीक्षकों के निर्देशों का पालन करना अनिवार्य होगा।",
] as const;

export const EXAM_INSTRUCTIONS_SHORT = [
  "परीक्षा प्रारम्भ से कम से कम 30 मिनट पहले केन्द्र पर उपस्थित हों। प्रवेश पत्र एवं वैध पहचान पत्र साथ लाएँ।",
  "मोबाइल फोन, स्मार्ट वॉच एवं अन्य इलेक्ट्रॉनिक उपकरण पूर्णतः प्रतिबंधित हैं।",
  "परीक्षा समाप्त होने से पहले उत्तर पुस्तिका जमा करना अनिवार्य है। सभी निर्देशों का पालन करें।",
] as const;

/** English instructions — Admit Card PDF download */
export const EXAM_INSTRUCTIONS_EN = [
  "All candidates must report to the exam centre at least 30 minutes before the exam starts and must bring the Admit Card along with a valid photo ID.",
  "Mobile phones, smart watches, calculators, Bluetooth devices, or any electronic gadgets are strictly prohibited inside the examination hall.",
  "No candidate shall leave the examination hall before submitting the answer booklet. All candidates must follow centre rules and invigilator instructions.",
] as const;

export type NavChild = { href: string; label: string; description?: string };
export type NavItem = {
  href?: string;
  label: string;
  children?: NavChild[];
};

/** Primary mega / multi-level navigation */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    label: "Registration",
    href: "/registration",
    children: [
      {
        href: "/registration",
        label: "Student Registration",
        description: "ऑनलाइन आवेदन करें",
      },
      {
        href: "/registration/status",
        label: "Registration Status",
        description: "आवेदन स्थिति जाँचें",
      },
      {
        href: "/registration/documents",
        label: "Required Documents",
        description: "आवश्यक दस्तावेज़ सूची",
      },
    ],
  },
  {
    label: "Student Corner",
    href: "/admit-card",
    children: [
      {
        href: "/admit-card",
        label: "Admit Card",
        description: "प्रवेश पत्र डाउनलोड करें",
      },
      { href: "/result", label: "Check Result", description: "परीक्षा परिणाम" },
      {
        href: "/marksheet",
        label: "Download Marksheet",
        description: "डिजिटल मार्कशीट",
      },
      { href: "/merit-list", label: "Merit List", description: "मेरिट सूची" },
      {
        href: "/notice",
        label: "Notice",
        description: "नवीनतम सूचना एवं अपडेट",
      },
      {
        href: "/gallery",
        label: "Gallery",
        description: "कार्यक्रम की तस्वीरें",
      },
    ],
  },
  { href: "/contact", label: "Contact" },
];

/** Flat links (legacy / quick use) */
export const NAV_LINKS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/about", label: "About", icon: "about" },
  { href: "/registration", label: "Registration", icon: "reg" },
  { href: "/admit-card", label: "Admit Card", icon: "admit" },
  { href: "/result", label: "Result", icon: "result" },
  { href: "/marksheet", label: "Marksheet", icon: "mark" },
  { href: "/merit-list", label: "Merit List", icon: "merit" },
  { href: "/notice", label: "Notice", icon: "notice" },
  { href: "/gallery", label: "Gallery", icon: "gallery" },
  { href: "/contact", label: "Contact", icon: "contact" },
] as const;

export const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/registration", label: "Registration" },
  { href: "/admit-card", label: "Admit" },
  { href: "/result", label: "Result" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/login", label: "Admin Login" },
] as const;

export const SEARCH_INDEX = [
  { label: "Home", href: "/", keywords: ["home", "मुखपृष्ठ"] },
  { label: "About", href: "/about", keywords: ["about", "परिचय"] },
  {
    label: "Student Registration",
    href: "/registration",
    keywords: ["registration", "apply", "पंजीकरण"],
  },
  {
    label: "Registration Status",
    href: "/registration/status",
    keywords: ["status", "स्थिति"],
  },
  {
    label: "Admit Card",
    href: "/admit-card",
    keywords: ["admit", "hall ticket", "एडमिट"],
  },
  { label: "Result", href: "/result", keywords: ["result", "परिणाम"] },
  {
    label: "Marksheet",
    href: "/marksheet",
    keywords: ["marksheet", "मार्कशीट"],
  },
  { label: "Merit List", href: "/merit-list", keywords: ["merit", "मेरिट"] },
  { label: "Notice", href: "/notice", keywords: ["notice", "सूचना"] },
  { label: "Gallery", href: "/gallery", keywords: ["gallery", "गैलरी"] },
  { label: "Contact", href: "/contact", keywords: ["contact", "helpline"] },
  { label: "Admin Login", href: "/admin/login", keywords: ["admin", "login"] },
] as const;

export const HEADER_NOTIFICATIONS = [
  {
    id: "1",
    title: "Last Date 31 Aug",
    message: "ऑनलाइन पंजीकरण अंतिम तिथि 31 अगस्त 2026।",
    href: "/registration",
    time: "Important",
  },
  {
    id: "2",
    title: "Exam 05 Sep",
    message: "कक्षा 7–8: 09:00–10:30 · कक्षा 9–10: 10:00–11:30",
    href: "/notice",
    time: "Schedule",
  },
  {
    id: "3",
    title: "Admit Card 02 Sep",
    message: "प्रवेश पत्र 02 सितम्बर 2026 से डाउनलोड।",
    href: "/admit-card",
    time: "Upcoming",
  },
] as const;

export const FOOTER_QUICK = [
  { href: "/registration", label: "Registration" },
  { href: "/admit-card", label: "Admit Card" },
  { href: "/result", label: "Result" },
  { href: "/notice", label: "Notice" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const FOOTER_IMPORTANT = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const QUICK_ACTIONS = [
  {
    href: "/registration",
    title: "Student Registration",
    desc: "ऑनलाइन पंजीकरण करें",
    icon: "📝",
    color: "bg-emerald-500",
  },
  {
    href: "/admit-card",
    title: "Download Admit Card",
    desc: "Admit Card प्राप्त करें",
    icon: "🎫",
    color: "bg-blue-500",
  },
  {
    href: "/result",
    title: "Check Result",
    desc: "परीक्षा परिणाम देखें",
    icon: "📊",
    color: "bg-amber-500",
  },
  {
    href: "/marksheet",
    title: "Download Marksheet",
    desc: "डिजिटल मार्कशीट",
    icon: "📄",
    color: "bg-violet-500",
  },
  {
    href: "/merit-list",
    title: "Merit List",
    desc: "मेरिट सूची देखें",
    icon: "🏆",
    color: "bg-rose-500",
  },
  {
    href: "/notice",
    title: "Latest Notice",
    desc: "महत्वपूर्ण सूचनाएँ",
    icon: "📢",
    color: "bg-slate-700",
  },
] as const;

export const ELIGIBILITY_CLASSES = ["7", "8", "9", "10"] as const;

export const SUBJECTS = [
  { title: "हिन्दी", en: "Hindi", icon: "📘" },
  { title: "गणित", en: "Mathematics", icon: "📗" },
  { title: "सामान्य ज्ञान", en: "General Knowledge", icon: "📙" },
  { title: "सामान्य अध्ययन", en: "General Studies", icon: "📕" },
] as const;

export const PRIZES = [
  {
    title: "प्रथम पुरस्कार",
    titleEn: "First Prize",
    icon: "🥇",
    amount: "₹2,100",
    extras: ["Certificate"],
    highlight: true,
    headerClass: "bg-warning text-dark",
  },
  {
    title: "द्वितीय पुरस्कार",
    titleEn: "Second Prize",
    icon: "🥈",
    amount: "₹1,100",
    extras: ["Certificate"],
    highlight: false,
    headerClass: "bg-secondary text-white",
  },
  {
    title: "तृतीय पुरस्कार",
    titleEn: "Third Prize",
    icon: "🥉",
    amount: "₹501",
    extras: ["Certificate"],
    highlight: false,
    headerClass: "bg-primary text-white",
  },
  {
    title: "Top 10",
    titleEn: "Top 10",
    icon: "🏆",
    amount: "Certificate",
    extras: ["Merit Recognition"],
    highlight: false,
    headerClass: "bg-success text-white",
  },
  {
    title: "Participation",
    titleEn: "Participation",
    icon: "🎖️",
    amount: "Digital Certificate",
    extras: ["All Students"],
    highlight: false,
    headerClass: "bg-info text-white",
  },
] as const;

export const IMPORTANT_DATES = [
  {
    label: "Registration Start",
    labelHi: "ऑनलाइन पंजीकरण प्रारंभ",
    date: "शीघ्र घोषित",
    year: "किया जाएगा",
  },
  {
    label: "Last Date",
    labelHi: "पंजीकरण अंतिम तिथि",
    date: "31 अगस्त",
    year: "2026",
  },
  {
    label: "Admit Card",
    labelHi: "प्रवेश पत्र जारी",
    date: "02 सितम्बर",
    year: "2026",
  },
  {
    label: "Exam Date",
    labelHi: "परीक्षा तिथि",
    date: "05 सितम्बर",
    year: "2026 (शनिवार)",
  },
  {
    label: "Result",
    labelHi: "परिणाम घोषित",
    date: "शीघ्र घोषित",
    year: "किया जाएगा",
  },
] as const;

export const REGISTRATION_STEPS = [
  {
    step: 1,
    title: "Online Registration",
    desc: "वेबसाइट पर फॉर्म भरकर आवेदन करें",
  },
  {
    step: 2,
    title: "Verification",
    desc: "Admin द्वारा दस्तावेज़ सत्यापन",
  },
  {
    step: 3,
    title: "Admit Card",
    desc: "स्वीकृति के बाद Admit Card डाउनलोड",
  },
  {
    step: 4,
    title: "Exam",
    desc: "परीक्षा केन्द्र पर परीक्षा दें",
  },
  {
    step: 5,
    title: "Result",
    desc: "ऑनलाइन परिणाम देखें",
  },
  {
    step: 6,
    title: "Certificate",
    desc: "प्रमाण-पत्र / पुरस्कार प्राप्त करें",
  },
] as const;

/** Placeholder stats — production में Backend API से आएगा */
export const HOME_STATS = [
  { key: "students", label: "Students Registered", value: 0, suffix: "+", prefix: "" },
  { key: "schools", label: "Schools", value: 0, suffix: "+", prefix: "" },
  { key: "districts", label: "Districts", value: 0, suffix: "+", prefix: "" },
  { key: "prize", label: "Prize Amount", value: 0, suffix: "+", prefix: "₹" },
] as const;

export const LATEST_NOTICES = [
  {
    slug: "registration-soon",
    title: "ऑनलाइन पंजीकरण शीघ्र प्रारम्भ",
    excerpt:
      "प्रतिभा खोज प्रतियोगिता 2026 हेतु ऑनलाइन पंजीकरण शीघ्र प्रारम्भ होगा।",
    date: "सूचना",
  },
  {
    slug: "last-date",
    title: "पंजीकरण अंतिम तिथि",
    excerpt: "ऑनलाइन आवेदन की अंतिम तिथि 31 अगस्त 2026 निर्धारित की गई है।",
    date: "31 Aug 2026",
  },
  {
    slug: "admit-card-date",
    title: "प्रवेश पत्र जारी",
    excerpt: "प्रवेश पत्र 02 सितम्बर 2026 से डाउनलोड किए जा सकेंगे।",
    date: "02 Sep 2026",
  },
  {
    slug: "exam-schedule",
    title: "परीक्षा समय-सारिणी",
    excerpt:
      "05 सितम्बर 2026 · कक्षा 7–8: 09:00–10:30 AM · कक्षा 9–10: 10:00–11:30 AM",
    date: "05 Sep 2026",
  },
] as const;

export const GALLERY_ITEMS = [
  { id: "1", title: "प्रतिभा सम्मान समारोह", category: "Awards", imageUrl: "/images/gallery/awards-2021.png" },
  { id: "2", title: "विजेता विद्यार्थी", category: "Winners", imageUrl: "/images/gallery/winners-group.png" },
  { id: "3", title: "सम्मान समारोह", category: "Ceremony", imageUrl: "/images/gallery/ceremony-audience.png" },
  { id: "4", title: "छात्र पुरस्कार वितरण", category: "Awards", imageUrl: "/images/gallery/student-winners.png" },
  { id: "5", title: "Foundation Team", category: "Foundation", imageUrl: "/images/gallery/foundation-team.png" },
  { id: "6", title: "प्रतियोगिता प्रतिभागी", category: "Students", imageUrl: "/images/gallery/student-audience.png" },
  { id: "7", title: "पुरस्कार मंच", category: "Event", imageUrl: "/images/gallery/award-stage.png" },
  { id: "8", title: "प्रतिभा खोज विजेता", category: "Winners", imageUrl: "/images/gallery/award-ceremony.png" },
  { id: "9", title: "पुरस्कार एवं ट्रॉफी", category: "Prizes", imageUrl: "/images/gallery/trophy-display.png" },
  { id: "10", title: "टीम और विजेता", category: "Foundation", imageUrl: "/images/gallery/team-winners.png" },
  { id: "11", title: "विजेता समूह", category: "Students", imageUrl: "/images/gallery/winners-stage.png" },
  { id: "12", title: "प्रतियोगिता सभा", category: "Exam Day", imageUrl: "/images/gallery/competition-crowd.png" },
  { id: "13", title: "Foundation Volunteers", category: "Team", imageUrl: "/images/gallery/volunteer-team.png" },
  { id: "14", title: "ग्रामीण बच्चों की शिक्षा", category: "Education", imageUrl: "/images/gallery/children-study.png" },
  { id: "15", title: "ग्रामीण बाल विकास", category: "Community", imageUrl: "/images/gallery/rural-children.png" },
  { id: "16", title: "कृषि एवं महिला सशक्तिकरण", category: "Social Work", imageUrl: "/images/gallery/foundation-agriculture.png" },
  { id: "17", title: "Volunteers with Winners", category: "Foundation", imageUrl: "/images/gallery/foundation-volunteers.png" },
] as const;

export const FAQS = [
  {
    q: "Registration कैसे करें?",
    a: "Home पेज से Student Registration पर जाएँ, फॉर्म भरें और दस्तावेज़ अपलोड कर Submit करें। अंतिम तिथि: 31 अगस्त 2026।",
  },
  {
    q: "Admit Card कब मिलेगा?",
    a: "प्रवेश पत्र 02 सितम्बर 2026 से डाउनलोड उपलब्ध होंगे। Registration Number से Admit Card पेज पर देखें।",
  },
  {
    q: "परीक्षा का समय क्या है?",
    a: "कक्षा 7–8: रिपोर्टिंग 08:30 AM, परीक्षा 09:00–10:30 AM। कक्षा 9–10: रिपोर्टिंग 09:30 AM, परीक्षा 10:00–11:30 AM। तिथि: 05 सितम्बर 2026 (शनिवार)।",
  },
  {
    q: "Result कैसे देखें?",
    a: "Check Result पेज पर Roll Number डालकर परिणाम देखें। घोषणा तिथि शीघ्र सूचित की जाएगी।",
  },
  {
    q: "Exam कहाँ होगा?",
    a: "परीक्षा उत्क्रमित उच्च विद्यालय, रतनपुरा (जिला सीवान, बिहार) में आयोजित होगी।",
  },
  {
    q: "कौन आवेदन कर सकता है?",
    a: "केवल कक्षा 7, 8, 9 और 10 के विद्यार्थी (हिन्दी माध्यम) आवेदन कर सकते हैं। विषय: हिन्दी, गणित, सामान्य ज्ञान, सामान्य अध्ययन।",
  },
] as const;

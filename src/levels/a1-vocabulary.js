// A1 vocabulary reference list — reuses the same English/Arabic word pairs already
// validated in the A1 quiz generators (a1.js), just restructured for browsing/study
// rather than as multiple-choice questions.

export const VOCABULARY = [
  {
    category: "Animals",
    categoryAr: "الحيوانات",
    words: [
      { en: "dog", ar: "كلب" }, { en: "cat", ar: "قطة" }, { en: "lion", ar: "أسد" },
      { en: "elephant", ar: "فيل" }, { en: "tiger", ar: "نمر" }, { en: "horse", ar: "حصان" },
      { en: "cow", ar: "بقرة" }, { en: "sheep", ar: "خروف" }, { en: "bird", ar: "طائر" },
      { en: "fish", ar: "سمكة" }, { en: "rabbit", ar: "أرنب" }, { en: "monkey", ar: "قرد" },
      { en: "bear", ar: "دب" }, { en: "duck", ar: "بطة" }, { en: "frog", ar: "ضفدع" },
    ],
  },
  {
    category: "Food",
    categoryAr: "الطعام",
    words: [
      { en: "apple", ar: "تفاحة" }, { en: "bread", ar: "خبز" }, { en: "rice", ar: "أرز" },
      { en: "cheese", ar: "جبنة" }, { en: "chicken", ar: "دجاج" }, { en: "banana", ar: "موزة" },
      { en: "potato", ar: "بطاطا" }, { en: "egg", ar: "بيضة" }, { en: "milk", ar: "حليب" },
      { en: "pizza", ar: "بيتزا" }, { en: "soup", ar: "حساء" }, { en: "cake", ar: "كعكة" },
      { en: "meat", ar: "لحم" }, { en: "orange", ar: "برتقالة" }, { en: "carrot", ar: "جزرة" },
    ],
  },
  {
    category: "Family",
    categoryAr: "العائلة",
    words: [
      { en: "mother", ar: "أم" }, { en: "father", ar: "أب" }, { en: "sister", ar: "أخت" },
      { en: "brother", ar: "أخ" }, { en: "grandmother", ar: "جدة" }, { en: "grandfather", ar: "جد" },
      { en: "aunt", ar: "عمة/خالة" }, { en: "uncle", ar: "عم/خال" }, { en: "son", ar: "ابن" },
      { en: "daughter", ar: "ابنة" }, { en: "cousin", ar: "ابن العم" }, { en: "baby", ar: "طفل رضيع" },
      { en: "parent", ar: "والد/والدة" }, { en: "husband", ar: "زوج" }, { en: "wife", ar: "زوجة" },
    ],
  },
  {
    category: "Clothes",
    categoryAr: "الملابس",
    words: [
      { en: "shirt", ar: "قميص" }, { en: "shoes", ar: "حذاء" }, { en: "hat", ar: "قبعة" },
      { en: "dress", ar: "فستان" }, { en: "jacket", ar: "سترة" }, { en: "socks", ar: "جوارب" },
      { en: "pants", ar: "بنطال" }, { en: "skirt", ar: "تنورة" }, { en: "coat", ar: "معطف" },
      { en: "gloves", ar: "قفازات" }, { en: "scarf", ar: "وشاح" }, { en: "sweater", ar: "كنزة صوفية" },
      { en: "jeans", ar: "جينز" }, { en: "tie", ar: "ربطة عنق" }, { en: "belt", ar: "حزام" },
    ],
  },
  {
    category: "Colors",
    categoryAr: "الألوان",
    words: [
      { en: "red", ar: "أحمر" }, { en: "blue", ar: "أزرق" }, { en: "yellow", ar: "أصفر" },
      { en: "green", ar: "أخضر" }, { en: "black", ar: "أسود" }, { en: "white", ar: "أبيض" },
      { en: "brown", ar: "بني" }, { en: "orange", ar: "برتقالي" },
    ],
  },
  {
    category: "Numbers",
    categoryAr: "الأرقام",
    words: [
      { en: "one", ar: "واحد" }, { en: "two", ar: "اثنان" }, { en: "three", ar: "ثلاثة" },
      { en: "four", ar: "أربعة" }, { en: "five", ar: "خمسة" }, { en: "six", ar: "ستة" },
      { en: "seven", ar: "سبعة" }, { en: "eight", ar: "ثمانية" }, { en: "nine", ar: "تسعة" },
      { en: "ten", ar: "عشرة" }, { en: "eleven", ar: "أحد عشر" }, { en: "twelve", ar: "اثنا عشر" },
      { en: "thirteen", ar: "ثلاثة عشر" }, { en: "fourteen", ar: "أربعة عشر" }, { en: "fifteen", ar: "خمسة عشر" },
      { en: "sixteen", ar: "ستة عشر" }, { en: "seventeen", ar: "سبعة عشر" }, { en: "eighteen", ar: "ثمانية عشر" },
      { en: "nineteen", ar: "تسعة عشر" }, { en: "twenty", ar: "عشرون" }, { en: "thirty", ar: "ثلاثون" },
      { en: "forty", ar: "أربعون" }, { en: "fifty", ar: "خمسون" }, { en: "sixty", ar: "ستون" },
      { en: "seventy", ar: "سبعون" }, { en: "eighty", ar: "ثمانون" }, { en: "ninety", ar: "تسعون" },
      { en: "hundred", ar: "مئة" },
    ],
  },
  {
    category: "Days of the Week",
    categoryAr: "أيام الأسبوع",
    words: [
      { en: "Monday", ar: "الاثنين" }, { en: "Tuesday", ar: "الثلاثاء" }, { en: "Wednesday", ar: "الأربعاء" },
      { en: "Thursday", ar: "الخميس" }, { en: "Friday", ar: "الجمعة" }, { en: "Saturday", ar: "السبت" },
      { en: "Sunday", ar: "الأحد" },
    ],
  },
  {
    category: "Months",
    categoryAr: "الأشهر",
    words: [
      { en: "January", ar: "يناير" }, { en: "February", ar: "فبراير" }, { en: "March", ar: "مارس" },
      { en: "April", ar: "أبريل" }, { en: "May", ar: "مايو" }, { en: "June", ar: "يونيو" },
      { en: "July", ar: "يوليو" }, { en: "August", ar: "أغسطس" }, { en: "September", ar: "سبتمبر" },
      { en: "October", ar: "أكتوبر" }, { en: "November", ar: "نوفمبر" }, { en: "December", ar: "ديسمبر" },
    ],
  },
  {
    category: "Everyday Verbs",
    categoryAr: "أفعال يومية",
    words: [
      { en: "play", ar: "يلعب" }, { en: "like", ar: "يحب" }, { en: "work", ar: "يعمل" },
      { en: "study", ar: "يدرس" }, { en: "watch", ar: "يشاهد" }, { en: "read", ar: "يقرأ" },
      { en: "eat", ar: "يأكل" }, { en: "drink", ar: "يشرب" }, { en: "run", ar: "يجري" },
      { en: "walk", ar: "يمشي" }, { en: "sing", ar: "يغني" }, { en: "dance", ar: "يرقص" },
      { en: "cook", ar: "يطبخ" }, { en: "swim", ar: "يسبح" }, { en: "write", ar: "يكتب" },
    ],
  },
  {
    category: "Everyday Objects",
    categoryAr: "أشياء يومية",
    words: [
      { en: "book", ar: "كتاب" }, { en: "chair", ar: "كرسي" }, { en: "table", ar: "طاولة" },
      { en: "box", ar: "صندوق" }, { en: "bus", ar: "حافلة" }, { en: "glass", ar: "كوب" },
      { en: "city", ar: "مدينة" }, { en: "man", ar: "رجل" }, { en: "woman", ar: "امرأة" },
      { en: "child", ar: "طفل" }, { en: "tooth", ar: "سن" }, { en: "foot", ar: "قدم" },
      { en: "person", ar: "شخص" }, { en: "photo", ar: "صورة" }, { en: "pen", ar: "قلم" },
      { en: "car", ar: "سيارة" }, { en: "house", ar: "منزل" }, { en: "window", ar: "نافذة" },
      { en: "door", ar: "باب" }, { en: "phone", ar: "هاتف" }, { en: "key", ar: "مفتاح" },
      { en: "ball", ar: "كرة" }, { en: "watch", ar: "ساعة" }, { en: "dish", ar: "طبق" },
      { en: "family", ar: "عائلة" },
    ],
  },
  {
    category: "Countries",
    categoryAr: "الدول",
    words: [
      { en: "Spain", ar: "إسبانيا" }, { en: "France", ar: "فرنسا" }, { en: "Italy", ar: "إيطاليا" },
      { en: "Japan", ar: "اليابان" }, { en: "Brazil", ar: "البرازيل" }, { en: "Egypt", ar: "مصر" },
      { en: "Canada", ar: "كندا" }, { en: "Mexico", ar: "المكسيك" }, { en: "Germany", ar: "ألمانيا" },
      { en: "Russia", ar: "روسيا" }, { en: "China", ar: "الصين" }, { en: "India", ar: "الهند" },
      { en: "Kenya", ar: "كينيا" }, { en: "Peru", ar: "بيرو" }, { en: "Norway", ar: "النرويج" },
    ],
  },
  {
    category: "Prepositions",
    categoryAr: "حروف الجر",
    words: [
      { en: "in", ar: "في" }, { en: "on", ar: "على" }, { en: "under", ar: "تحت" },
      { en: "behind", ar: "خلف" }, { en: "next to", ar: "بجانب" }, { en: "in front of", ar: "أمام" },
    ],
  },
  {
    category: "Question Words",
    categoryAr: "أدوات الاستفهام",
    words: [
      { en: "what", ar: "ماذا" }, { en: "where", ar: "أين" }, { en: "when", ar: "متى" },
      { en: "who", ar: "من" }, { en: "how", ar: "كيف" },
    ],
  },
  {
    category: "Opposites",
    categoryAr: "الأضداد",
    words: [
      { en: "big / small", ar: "كبير / صغير" }, { en: "hot / cold", ar: "حار / بارد" },
      { en: "fast / slow", ar: "سريع / بطيء" }, { en: "happy / sad", ar: "سعيد / حزين" },
      { en: "good / bad", ar: "جيد / سيء" }, { en: "new / old", ar: "جديد / قديم" },
      { en: "easy / difficult", ar: "سهل / صعب" }, { en: "clean / dirty", ar: "نظيف / متسخ" },
      { en: "full / empty", ar: "ممتلئ / فارغ" }, { en: "open / closed", ar: "مفتوح / مغلق" },
      { en: "long / short", ar: "طويل / قصير" }, { en: "strong / weak", ar: "قوي / ضعيف" },
      { en: "rich / poor", ar: "غني / فقير" }, { en: "near / far", ar: "قريب / بعيد" },
      { en: "cheap / expensive", ar: "رخيص / غالي" }, { en: "wet / dry", ar: "مبلل / جاف" },
      { en: "heavy / light", ar: "ثقيل / خفيف" }, { en: "loud / quiet", ar: "صاخب / هادئ" },
      { en: "day / night", ar: "نهار / ليل" }, { en: "left / right", ar: "يسار / يمين" },
    ],
  },
];

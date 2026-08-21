// A1 (beginner) — 500 questions from fixed word lists (no randomness at the
// content level; option order is seeded-shuffled by the shared engine).
import { withRotatedOptions, uniqueDistractors, buildLevel } from "./engine.js";

const subjectAr = {
  I: "أنا", You: "أنت", He: "هو", She: "هي", It: "هو", We: "نحن", They: "هم",
  Tom: "توم", Anna: "آنا", Maria: "ماريا", John: "جون", Sara: "سارة",
  Lisa: "ليزا", Peter: "بيتر", Emma: "إيما", David: "ديفيد", Nora: "نورا",
};

const placeAr = {
  Spain: "إسبانيا", France: "فرنسا", Italy: "إيطاليا", Japan: "اليابان",
  Brazil: "البرازيل", Egypt: "مصر", Canada: "كندا", Mexico: "المكسيك",
  Germany: "ألمانيا", Russia: "روسيا", China: "الصين", India: "الهند",
  Kenya: "كينيا", Peru: "بيرو", Norway: "النرويج",
};

function generateToBe(count) {
  const subjects = [
    "I", "You", "He", "She", "It", "We", "They",
    "Tom", "Anna", "Maria", "John", "Sara", "Lisa", "Peter", "Emma", "David", "Nora",
  ];
  const places = [
    "Spain", "France", "Italy", "Japan", "Brazil", "Egypt", "Canada", "Mexico",
    "Germany", "Russia", "China", "India", "Kenya", "Peru", "Norway",
  ];
  const options = ["am", "is", "are"];
  const verbFor = (s) => (s === "I" ? "am" : ["You", "We", "They"].includes(s) ? "are" : "is");

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const place = places[Math.floor(i / subjects.length) % places.length];
    const correct = verbFor(subject);
    const explanation =
      subject === "I"
        ? `'I' always takes 'am'.`
        : ["You", "We", "They"].includes(subject)
        ? `'${subject}' is plural (or 'you'), so it takes 'are'.`
        : `'${subject}' is singular (he/she/it), so it takes 'is'.`;
    const explanationAr =
      subject === "I"
        ? `'I' تُستخدم دائماً مع 'am'.`
        : ["You", "We", "They"].includes(subject)
        ? `'${subject}' جمع (أو "أنتَ")، لذلك تُستخدم مع 'are'.`
        : `'${subject}' مفرد (هو/هي)، لذلك تُستخدم مع 'is'.`;
    const questionAr = `أكمل الجملة بالفعل الصحيح (am / is / are)، ومعناها: "${subjectAr[subject]} من ${placeAr[place]}."`;
    list.push(
      withRotatedOptions(`Complete: '${subject} ___ from ${place}.'`, options, correct, i, explanation, questionAr, explanationAr)
    );
  }
  return list;
}

function generateSimplePresent(count) {
  const subjects = ["I", "You", "He", "She", "It", "We", "They", "Tom", "Anna", "Maria", "John", "Sara"];
  const thirdPersonSubjects = new Set(["He", "She", "It", "Tom", "Anna", "Maria", "John", "Sara"]);
  const verbs = [
    ["play", "plays", "playing", "played", "يلعب"],
    ["like", "likes", "liking", "liked", "يحب"],
    ["work", "works", "working", "worked", "يعمل"],
    ["study", "studies", "studying", "studied", "يدرس"],
    ["watch", "watches", "watching", "watched", "يشاهد"],
    ["read", "reads", "reading", "read", "يقرأ"],
    ["eat", "eats", "eating", "ate", "يأكل"],
    ["drink", "drinks", "drinking", "drank", "يشرب"],
    ["run", "runs", "running", "ran", "يجري"],
    ["walk", "walks", "walking", "walked", "يمشي"],
    ["sing", "sings", "singing", "sang", "يغني"],
    ["dance", "dances", "dancing", "danced", "يرقص"],
    ["cook", "cooks", "cooking", "cooked", "يطبخ"],
    ["swim", "swims", "swimming", "swam", "يسبح"],
    ["write", "writes", "writing", "wrote", "يكتب"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const [base, third, ing, past, verbArWord] = verbs[Math.floor(i / subjects.length) % verbs.length];
    const isThird = thirdPersonSubjects.has(subject);
    const correct = isThird ? third : base;
    const options = [base, third, ing, past];
    const explanation = isThird
      ? `'${subject}' is he/she/it, so the verb needs '-s': '${third}'.`
      : `'${subject}' uses the base form '${base}' (no -s) in the simple present.`;
    const explanationAr = isThird
      ? `'${subject}' ضمير مفرد (هو/هي)، لذلك يحتاج الفعل إلى '-s': '${third}'.`
      : `'${subject}' يُستخدم مع الشكل الأساسي '${base}' (بدون -s).`;
    const questionAr = `أكمل الجملة بالشكل الصحيح للفعل '${base}'، ومعناها: "${subjectAr[subject]} ${verbArWord} كل يوم."`;
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ___ every day.' (verb: '${base}')`,
        options,
        correct,
        i,
        explanation,
        questionAr,
        explanationAr
      )
    );
  }
  return list;
}

function pluralExplanation(singular, plural) {
  if (singular.endsWith("y") && !/[aeiou]y$/.test(singular) && plural === `${singular.slice(0, -1)}ies`) {
    return `A consonant + 'y' changes to '-ies'.`;
  }
  if ((singular.endsWith("f") || singular.endsWith("fe")) && plural.endsWith("ves")) {
    return `Words ending in '-f/-fe' often change to '-ves'.`;
  }
  if (/(s|x|ch|sh)$/.test(singular) && plural === `${singular}es`) {
    return `Words ending in -s, -x, -ch or -sh add '-es'.`;
  }
  if (singular.endsWith("o") && plural === `${singular}es`) {
    return `Some words ending in '-o' add '-es'.`;
  }
  if (plural === `${singular}s`) {
    return `Regular plural: just add '-s'.`;
  }
  return `'${singular}' has an irregular plural form: '${plural}'.`;
}

function pluralExplanationAr(singular, plural) {
  if (singular.endsWith("y") && !/[aeiou]y$/.test(singular) && plural === `${singular.slice(0, -1)}ies`) {
    return "الكلمة المنتهية بحرف ساكن ثم 'y' تتحول إلى '-ies'.";
  }
  if ((singular.endsWith("f") || singular.endsWith("fe")) && plural.endsWith("ves")) {
    return "الكلمات المنتهية بـ '-f' أو '-fe' غالباً تتحول إلى '-ves'.";
  }
  if (/(s|x|ch|sh)$/.test(singular) && plural === `${singular}es`) {
    return "الكلمات المنتهية بـ -s أو -x أو -ch أو -sh تُضاف لها '-es'.";
  }
  if (singular.endsWith("o") && plural === `${singular}es`) {
    return "بعض الكلمات المنتهية بحرف '-o' تُضاف لها '-es'.";
  }
  if (plural === `${singular}s`) {
    return "جمع منتظم: أضف '-s' فقط.";
  }
  return `لكلمة "${singular}" جمع غير منتظم: "${plural}".`;
}

function generatePlurals(count) {
  const nouns = [
    ["cat", "cats", "قطة"], ["dog", "dogs", "كلب"], ["book", "books", "كتاب"], ["chair", "chairs", "كرسي"],
    ["table", "tables", "طاولة"], ["box", "boxes", "صندوق"], ["bus", "buses", "حافلة"], ["glass", "glasses", "كوب"],
    ["city", "cities", "مدينة"], ["baby", "babies", "طفل"], ["man", "men", "رجل"], ["woman", "women", "امرأة"],
    ["child", "children", "طفل"], ["mouse", "mice", "فأر"], ["tooth", "teeth", "سن"], ["foot", "feet", "قدم"],
    ["person", "people", "شخص"], ["leaf", "leaves", "ورقة شجر"], ["knife", "knives", "سكين"], ["life", "lives", "حياة"],
    ["photo", "photos", "صورة"], ["potato", "potatoes", "بطاطا"], ["tomato", "tomatoes", "طماطم"], ["pen", "pens", "قلم"],
    ["car", "cars", "سيارة"], ["house", "houses", "منزل"], ["apple", "apples", "تفاحة"], ["orange", "oranges", "برتقالة"],
    ["window", "windows", "نافذة"], ["door", "doors", "باب"], ["phone", "phones", "هاتف"], ["key", "keys", "مفتاح"],
    ["ball", "balls", "كرة"], ["shoe", "shoes", "حذاء"], ["hat", "hats", "قبعة"], ["shirt", "shirts", "قميص"],
    ["watch", "watches", "ساعة"], ["dish", "dishes", "طبق"], ["fox", "foxes", "ثعلب"], ["family", "families", "عائلة"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [singular, plural, singularAr] = nouns[i % nouns.length];
    const naive = `${singular}s`;
    const candidates = [singular, naive, `${plural}es`, `${plural}s`];
    const distractors = uniqueDistractors(plural, candidates);
    const options = [plural, ...distractors];
    list.push(
      withRotatedOptions(
        `What is the plural of '${singular}'?`,
        options,
        plural,
        i,
        pluralExplanation(singular, plural),
        `ما هو جمع كلمة "${singular}" (${singularAr})؟`,
        pluralExplanationAr(singular, plural)
      )
    );
  }
  return list;
}

function generateOpposites(count) {
  const pairs = [
    ["big", "small", "كبير", "صغير"], ["hot", "cold", "حار", "بارد"], ["fast", "slow", "سريع", "بطيء"],
    ["happy", "sad", "سعيد", "حزين"], ["good", "bad", "جيد", "سيء"], ["new", "old", "جديد", "قديم"],
    ["young", "old", "صغير السن", "كبير السن"], ["easy", "difficult", "سهل", "صعب"], ["clean", "dirty", "نظيف", "متسخ"],
    ["full", "empty", "ممتلئ", "فارغ"], ["open", "closed", "مفتوح", "مغلق"], ["light", "dark", "فاتح", "داكن"],
    ["long", "short", "طويل", "قصير"], ["high", "low", "مرتفع", "منخفض"], ["strong", "weak", "قوي", "ضعيف"],
    ["rich", "poor", "غني", "فقير"], ["early", "late", "مبكر", "متأخر"], ["near", "far", "قريب", "بعيد"],
    ["cheap", "expensive", "رخيص", "غالي"], ["wet", "dry", "مبلل", "جاف"], ["heavy", "light", "ثقيل", "خفيف"],
    ["loud", "quiet", "صاخب", "هادئ"], ["thick", "thin", "سميك", "رفيع"], ["wide", "narrow", "واسع", "ضيق"],
    ["true", "false", "صحيح", "خاطئ"], ["day", "night", "نهار", "ليل"], ["up", "down", "أعلى", "أسفل"],
    ["left", "right", "يسار", "يمين"], ["inside", "outside", "داخل", "خارج"], ["begin", "end", "يبدأ", "ينتهي"],
    ["buy", "sell", "يشتري", "يبيع"], ["push", "pull", "يدفع", "يسحب"], ["win", "lose", "يفوز", "يخسر"],
    ["give", "take", "يعطي", "يأخذ"], ["love", "hate", "يحب", "يكره"], ["remember", "forget", "يتذكر", "ينسى"],
    ["always", "never", "دائماً", "أبداً"], ["same", "different", "نفسه", "مختلف"], ["first", "last", "أول", "أخير"],
    ["safe", "dangerous", "آمن", "خطير"],
  ];
  const flatWords = pairs.flatMap((p) => [p[0], p[1]]);

  const list = [];
  for (let i = 0; i < count; i++) {
    const pairIndex = Math.floor(i / 2) % pairs.length;
    const reversed = i % 2 === 1;
    const [a, b, aAr, bAr] = pairs[pairIndex];
    const word = reversed ? b : a;
    const correct = reversed ? a : b;
    const wordAr = reversed ? bAr : aAr;
    const correctAr = reversed ? aAr : bAr;

    const options = [correct];
    let offset = 3;
    while (options.length < 4) {
      const candidate = flatWords[(pairIndex * 2 + offset) % flatWords.length];
      if (candidate !== correct && candidate !== word && !options.includes(candidate)) {
        options.push(candidate);
      }
      offset += 7;
    }
    list.push(
      withRotatedOptions(
        `What is the opposite of '${word}'?`,
        options,
        correct,
        i,
        `'${correct}' is the opposite of '${word}'.`,
        `ما هو عكس كلمة "${word}" (${wordAr})؟`,
        `"${correct}" (${correctAr}) هي عكس "${word}" (${wordAr}).`
      )
    );
  }
  return list;
}

function generateSynonyms(count) {
  const pairs = [
    ["big", "large", "كبير"], ["small", "little", "صغير"], ["happy", "glad", "سعيد"], ["sad", "unhappy", "حزين"],
    ["fast", "quick", "سريع"], ["begin", "start", "يبدأ"], ["end", "finish", "ينتهي"], ["buy", "purchase", "يشتري"],
    ["look", "see", "ينظر / يرى"], ["talk", "speak", "يتحدث"], ["house", "home", "منزل"], ["car", "automobile", "سيارة"],
    ["smart", "clever", "ذكي"], ["pretty", "beautiful", "جميل"], ["angry", "mad", "غاضب"], ["tired", "sleepy", "متعب"],
    ["scared", "afraid", "خائف"], ["easy", "simple", "سهل"], ["hard", "difficult", "صعب"], ["cold", "chilly", "بارد"],
    ["hot", "warm", "دافئ"], ["nice", "kind", "لطيف"], ["funny", "amusing", "مضحك"], ["job", "work", "عمل"],
    ["food", "meal", "طعام"], ["kid", "child", "طفل"], ["friend", "buddy", "صديق"], ["gift", "present", "هدية"],
    ["shout", "yell", "يصرخ"], ["jump", "leap", "يقفز"],
  ];
  const synonymWords = pairs.map((p) => p[1]);

  const list = [];
  for (let i = 0; i < count; i++) {
    const [word, correct, meaningAr] = pairs[i % pairs.length];
    const options = [correct];
    let offset = 4;
    while (options.length < 4) {
      const candidate = synonymWords[(i + offset) % synonymWords.length];
      if (candidate !== correct && !options.includes(candidate)) options.push(candidate);
      offset += 5;
    }
    list.push(
      withRotatedOptions(
        `Which word means the same as '${word}'?`,
        options,
        correct,
        i,
        `'${correct}' means the same as '${word}'.`,
        `أي كلمة تعني نفس معنى "${word}" (${meaningAr})؟`,
        `"${correct}" تعني نفس معنى "${word}" — وكلاهما يعني "${meaningAr}" بالعربية.`
      )
    );
  }
  return list;
}

function generateColors(count) {
  const items = [
    ["a banana", "Yellow", "الموزة"], ["grass", "Green", "العشب"], ["the sky on a clear day", "Blue", "السماء في يوم صافٍ"],
    ["blood", "Red", "الدم"], ["snow", "White", "الثلج"], ["coal", "Black", "الفحم"], ["a lemon", "Yellow", "الليمون"],
    ["chocolate", "Brown", "الشوكولاتة"], ["a strawberry", "Red", "الفراولة"], ["an orange (the fruit)", "Orange", "البرتقالة"],
    ["a carrot", "Orange", "الجزرة"], ["the ocean", "Blue", "المحيط"], ["a tomato", "Red", "الطماطم"], ["milk", "White", "الحليب"],
    ["a lime", "Green", "الليمون الأخضر"], ["a cherry", "Red", "الكرز"], ["a pumpkin", "Orange", "اليقطين"],
    ["a leaf in summer", "Green", "ورقة الشجر في الصيف"],
  ];
  const allColors = ["Red", "Blue", "Yellow", "Green", "Black", "White", "Brown", "Orange"];
  const colorAr = {
    Red: "أحمر", Blue: "أزرق", Yellow: "أصفر", Green: "أخضر",
    Black: "أسود", White: "أبيض", Brown: "بني", Orange: "برتقالي",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [item, correct, itemAr] = items[i % items.length];
    const options = [correct];
    let offset = 1;
    while (options.length < 4) {
      const candidate = allColors[(allColors.indexOf(correct) + offset) % allColors.length];
      if (!options.includes(candidate)) options.push(candidate);
      offset += 1;
    }
    const itemCapitalized = item.charAt(0).toUpperCase() + item.slice(1);
    list.push(
      withRotatedOptions(
        `What color is ${item}?`,
        options,
        correct,
        i,
        `${itemCapitalized} is usually ${correct.toLowerCase()}.`,
        `ما لون ${itemAr}؟`,
        `${itemAr} عادةً لونها ${colorAr[correct]}.`
      )
    );
  }
  return list;
}

function generateNumbers(count) {
  const numberWords = [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred",
  ];
  const numberValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ];
  const numberWordAr = {
    one: "واحد", two: "اثنان", three: "ثلاثة", four: "أربعة", five: "خمسة",
    six: "ستة", seven: "سبعة", eight: "ثمانية", nine: "تسعة", ten: "عشرة",
    eleven: "أحد عشر", twelve: "اثنا عشر", thirteen: "ثلاثة عشر", fourteen: "أربعة عشر", fifteen: "خمسة عشر",
    sixteen: "ستة عشر", seventeen: "سبعة عشر", eighteen: "ثمانية عشر", nineteen: "تسعة عشر", twenty: "عشرون",
    thirty: "ثلاثون", forty: "أربعون", fifty: "خمسون", sixty: "ستون", seventy: "سبعون",
    eighty: "ثمانون", ninety: "تسعون", hundred: "مئة",
  };

  const list = [];
  const half = Math.floor(count / 2);
  for (let i = 0; i < half; i++) {
    const idx = i % numberWords.length;
    const word = numberWords[idx];
    const correct = numberValues[idx];
    const options = [String(correct), String(correct + 1), String(correct > 0 ? correct - 1 : correct + 2), String(correct + 10)];
    list.push(
      withRotatedOptions(
        `Which number is '${word}'?`,
        options,
        String(correct),
        i,
        `'${word}' is the word for the number ${correct}.`,
        `أي رقم تمثله كلمة "${word}" (${numberWordAr[word]})؟`,
        `كلمة "${word}" (${numberWordAr[word]}) تعني الرقم ${correct}.`
      )
    );
  }
  for (let i = half; i < count; i++) {
    const a = (i % 12) + 1;
    const b = ((i * 3) % 12) + 1;
    const sum = a + b;
    const options = [String(sum), String(sum + 1), String(sum - 1), String(sum + 2)];
    list.push(
      withRotatedOptions(
        `What is ${a} + ${b}?`,
        options,
        String(sum),
        i,
        `${a} + ${b} = ${sum}.`,
        `كم يساوي ${a} + ${b}؟`,
        `${a} + ${b} = ${sum}.`
      )
    );
  }
  return list;
}

const dayAr = {
  Monday: "الاثنين", Tuesday: "الثلاثاء", Wednesday: "الأربعاء", Thursday: "الخميس",
  Friday: "الجمعة", Saturday: "السبت", Sunday: "الأحد",
};
const monthAr = {
  January: "يناير", February: "فبراير", March: "مارس", April: "أبريل", May: "مايو", June: "يونيو",
  July: "يوليو", August: "أغسطس", September: "سبتمبر", October: "أكتوبر", November: "نوفمبر", December: "ديسمبر",
};

function generateDaysMonths(count) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const list = [];
  let i = 0;
  for (let d = 0; d < days.length && list.length < count; d++) {
    const next = days[(d + 1) % days.length];
    const prev = days[(d - 1 + days.length) % days.length];
    const afterDistractors = days.filter((x) => x !== next);
    list.push(
      withRotatedOptions(
        `What day comes after ${days[d]}?`,
        [next, ...afterDistractors.slice(0, 3)],
        next,
        i++,
        `${days[d]} is followed by ${next}.`,
        `ما هو اليوم الذي يأتي بعد ${dayAr[days[d]]}؟`,
        `يأتي بعد ${dayAr[days[d]]} يوم ${dayAr[next]}.`
      )
    );
    const beforeDistractors = days.filter((x) => x !== prev);
    list.push(
      withRotatedOptions(
        `What day comes before ${days[d]}?`,
        [prev, ...beforeDistractors.slice(0, 3)],
        prev,
        i++,
        `${days[d]} comes right after ${prev}.`,
        `ما هو اليوم الذي يأتي قبل ${dayAr[days[d]]}؟`,
        `يأتي ${dayAr[days[d]]} مباشرة بعد ${dayAr[prev]}.`
      )
    );
  }
  for (let m = 0; m < months.length && list.length < count; m++) {
    const next = months[(m + 1) % months.length];
    const prev = months[(m - 1 + months.length) % months.length];
    const afterDistractors = months.filter((x) => x !== next);
    list.push(
      withRotatedOptions(
        `What month comes after ${months[m]}?`,
        [next, afterDistractors[0], afterDistractors[3], afterDistractors[6]],
        next,
        i++,
        `${months[m]} is followed by ${next}.`,
        `ما هو الشهر الذي يأتي بعد ${monthAr[months[m]]}؟`,
        `يأتي بعد ${monthAr[months[m]]} شهر ${monthAr[next]}.`
      )
    );
    const beforeDistractors = months.filter((x) => x !== prev);
    list.push(
      withRotatedOptions(
        `What month comes before ${months[m]}?`,
        [prev, beforeDistractors[0], beforeDistractors[3], beforeDistractors[6]],
        prev,
        i++,
        `${months[m]} comes right after ${prev}.`,
        `ما هو الشهر الذي يأتي قبل ${monthAr[months[m]]}؟`,
        `يأتي ${monthAr[months[m]]} مباشرة بعد ${monthAr[prev]}.`
      )
    );
  }
  const fillers = [
    [
      "How many days are in a week?",
      ["Five", "Six", "Seven", "Eight"],
      "Seven",
      "A week always has seven days.",
      "كم عدد أيام الأسبوع؟",
      "الأسبوع يتكون دائماً من سبعة أيام.",
    ],
    [
      "How many months are in a year?",
      ["Ten", "Eleven", "Twelve", "Thirteen"],
      "Twelve",
      "A year always has twelve months.",
      "كم عدد أشهر السنة؟",
      "السنة تتكون دائماً من اثني عشر شهراً.",
    ],
  ];
  let f = 0;
  while (list.length < count) {
    const [q, opts, correct, explanation, questionAr, explanationAr] = fillers[f % fillers.length];
    list.push(withRotatedOptions(q, opts, correct, i++, explanation, questionAr, explanationAr));
    f++;
  }
  return list;
}

function generatePrepositions(count) {
  const templates = [
    ["The cat is ___ the table.", "under", "القطة ___ الطاولة."],
    ["The book is ___ the table.", "on", "الكتاب ___ الطاولة."],
    ["The keys are ___ my bag.", "in", "المفاتيح ___ حقيبتي."],
    ["The dog is ___ the house.", "in front of", "الكلب ___ المنزل."],
    ["The picture is ___ the wall.", "on", "الصورة ___ الحائط."],
    ["The shoes are ___ the bed.", "under", "الأحذية ___ السرير."],
    ["The car is ___ the garage.", "in", "السيارة ___ المرآب."],
    ["The lamp is ___ the desk.", "on", "المصباح ___ المكتب."],
    ["The ball is ___ the box.", "in", "الكرة ___ الصندوق."],
    ["The tree is ___ the house.", "behind", "الشجرة ___ المنزل."],
    ["The apple is ___ the bowl.", "in", "التفاحة ___ الوعاء."],
    ["The clock is ___ the wall.", "on", "الساعة ___ الحائط."],
    ["The bike is ___ the tree.", "next to", "الدراجة ___ الشجرة."],
    ["The children are ___ the classroom.", "in", "الأطفال ___ الفصل الدراسي."],
    ["The bird is ___ the tree.", "on", "الطائر ___ الشجرة."],
    ["The box is ___ the chair.", "under", "الصندوق ___ الكرسي."],
    ["The teacher is ___ the students.", "in front of", "المعلم ___ الطلاب."],
    ["The garden is ___ the house.", "behind", "الحديقة ___ المنزل."],
    ["The phone is ___ the table.", "on", "الهاتف ___ الطاولة."],
    ["The cup is ___ the shelf.", "on", "الكوب ___ الرف."],
  ];
  const options = ["in", "on", "under", "behind", "in front of", "next to"];
  const prepositionExplanations = {
    in: "'in' is for enclosed spaces (inside something).",
    on: "'on' is for surfaces (on top of something).",
    under: "'under' means below something.",
    behind: "'behind' means at the back of something.",
    "next to": "'next to' means right beside something.",
    "in front of": "'in front of' means before something, facing it.",
  };
  const prepositionExplanationsAr = {
    in: "'in' تُستخدم للأماكن المغلقة (داخل شيء ما).",
    on: "'on' تُستخدم للأسطح (فوق شيء ما).",
    under: "'under' تعني تحت شيء ما.",
    behind: "'behind' تعني خلف شيء ما.",
    "next to": "'next to' تعني بجانب شيء ما مباشرة.",
    "in front of": "'in front of' تعني أمام شيء ما، في مواجهته.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = templates[i % templates.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        prepositionExplanations[correct],
        `أكمل الجملة بحرف الجر الصحيح، ومعناها: "${sentenceAr}"`,
        prepositionExplanationsAr[correct]
      )
    );
  }
  return list;
}

function generateArticles(count) {
  const aWords = [
    ["cat", "قطة"], ["dog", "كلب"], ["book", "كتاب"], ["car", "سيارة"], ["house", "منزل"],
    ["table", "طاولة"], ["chair", "كرسي"], ["pen", "قلم"], ["ball", "كرة"], ["banana", "موزة"],
    ["student", "طالب"], ["teacher", "معلم"], ["phone", "هاتف"], ["bag", "حقيبة"], ["shirt", "قميص"],
    ["shoe", "حذاء"], ["garden", "حديقة"], ["window", "نافذة"], ["door", "باب"], ["computer", "حاسوب"],
  ];
  const anWords = [
    ["apple", "تفاحة"], ["elephant", "فيل"], ["orange", "برتقالة"], ["umbrella", "مظلة"], ["hour", "ساعة (وقت)"],
    ["idea", "فكرة"], ["egg", "بيضة"], ["ant", "نملة"], ["island", "جزيرة"], ["office", "مكتب"],
    ["engineer", "مهندس"], ["artist", "فنان"], ["icon", "أيقونة"], ["onion", "بصلة"], ["ear", "أذن"],
    ["eye", "عين"], ["envelope", "ظرف"], ["author", "مؤلف"], ["animal", "حيوان"], ["x-ray", "أشعة سينية"],
  ];
  const words = [
    ...aWords.map(([w, ar]) => [w, "a", ar]),
    ...anWords.map(([w, ar]) => [w, "an", ar]),
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [word, correct, wordAr] = words[i % words.length];
    const explanation =
      correct === "an"
        ? `'${word}' starts with a vowel sound, so we use 'an'.`
        : `'${word}' starts with a consonant sound, so we use 'a'.`;
    const explanationAr =
      correct === "an"
        ? `"${word}" تبدأ بصوت متحرك، لذلك نستخدم 'an'.`
        : `"${word}" تبدأ بصوت ساكن، لذلك نستخدم 'a'.`;
    list.push(
      withRotatedOptions(
        `Choose the correct article: 'I have ___ ${word}.'`,
        ["a", "an"],
        correct,
        i,
        explanation,
        `اختر أداة التعريف الصحيحة (a/an)، ومعناها: "لدي ${wordAr}."`,
        explanationAr
      )
    );
  }
  return list;
}

function generateVocabCategories(count) {
  const categories = {
    animal: {
      nameAr: "حيوان",
      words: ["dog", "cat", "lion", "elephant", "tiger", "horse", "cow", "sheep", "bird", "fish", "rabbit", "monkey", "bear", "duck", "frog"],
      ar: ["كلب", "قطة", "أسد", "فيل", "نمر", "حصان", "بقرة", "خروف", "طائر", "سمكة", "أرنب", "قرد", "دب", "بطة", "ضفدع"],
    },
    food: {
      nameAr: "طعام",
      words: ["apple", "bread", "rice", "cheese", "chicken", "banana", "potato", "egg", "milk", "pizza", "soup", "cake", "meat", "orange", "carrot"],
      ar: ["تفاحة", "خبز", "أرز", "جبنة", "دجاج", "موزة", "بطاطا", "بيضة", "حليب", "بيتزا", "حساء", "كعكة", "لحم", "برتقالة", "جزرة"],
    },
    family: {
      nameAr: "عائلة",
      words: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "aunt", "uncle", "son", "daughter", "cousin", "baby", "parent", "husband", "wife"],
      ar: ["أم", "أب", "أخت", "أخ", "جدة", "جد", "عمة/خالة", "عم/خال", "ابن", "ابنة", "ابن العم", "طفل رضيع", "والد/والدة", "زوج", "زوجة"],
    },
    clothes: {
      nameAr: "ملابس",
      words: ["shirt", "shoes", "hat", "dress", "jacket", "socks", "pants", "skirt", "coat", "gloves", "scarf", "sweater", "jeans", "tie", "belt"],
      ar: ["قميص", "حذاء", "قبعة", "فستان", "سترة", "جوارب", "بنطال", "تنورة", "معطف", "قفازات", "وشاح", "كنزة صوفية", "جينز", "ربطة عنق", "حزام"],
    },
  };
  const names = Object.keys(categories);

  const list = [];
  for (let i = 0; i < count; i++) {
    const catIndex = i % names.length;
    const catName = names[catIndex];
    const cat = categories[catName];
    const wordIdx = Math.floor(i / names.length) % cat.words.length;
    const correct = cat.words[wordIdx];
    const correctAr = cat.ar[wordIdx];
    const others = names.filter((n) => n !== catName);
    const options = [correct];
    others.forEach((n, k) => {
      const otherCat = categories[n];
      const idx = (Math.floor(i / names.length) + k) % otherCat.words.length;
      options.push(otherCat.words[idx]);
    });
    const article = catName === "animal" ? "an" : "a";
    list.push(
      withRotatedOptions(
        `Which word is ${article} ${catName}?`,
        options,
        correct,
        i,
        `'${correct}' belongs to the ${catName} category.`,
        `أي كلمة تدل على ${cat.nameAr}؟`,
        `"${correct}" (${correctAr}) تنتمي إلى فئة ${cat.nameAr}.`
      )
    );
  }
  return list;
}

function generateDemonstratives(count) {
  const templates = [
    ["___ is my pen.", "This", "هذا قلمي."],
    ["___ is your car over there.", "That", "ذلك سيارتك هناك."],
    ["___ are my books.", "These", "هذه كتبي."],
    ["___ are birds far away.", "Those", "تلك طيور بعيدة."],
    ["___ is my house.", "This", "هذا منزلي."],
    ["___ is your friend across the street.", "That", "ذلك صديقك عبر الشارع."],
    ["___ are my keys.", "These", "هذه مفاتيحي."],
    ["___ are mountains far away.", "Those", "تلك جبال بعيدة."],
    ["___ is my phone in my hand.", "This", "هذا هاتفي في يدي."],
    ["___ is the building over there.", "That", "ذلك المبنى هناك."],
  ];
  const options = ["This", "That", "These", "Those"];
  const demonstrativeExplanations = {
    This: "'This' is used for something singular and close.",
    That: "'That' is used for something singular and far away.",
    These: "'These' is used for several things that are close.",
    Those: "'Those' is used for several things that are far away.",
  };
  const demonstrativeExplanationsAr = {
    This: "'This' تُستخدم لشيء مفرد وقريب.",
    That: "'That' تُستخدم لشيء مفرد وبعيد.",
    These: "'These' تُستخدم لعدة أشياء قريبة.",
    Those: "'Those' تُستخدم لعدة أشياء بعيدة.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = templates[i % templates.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        demonstrativeExplanations[correct],
        `أكمل الجملة بالكلمة الصحيحة (This/That/These/Those)، ومعناها: "${sentenceAr}"`,
        demonstrativeExplanationsAr[correct]
      )
    );
  }
  return list;
}

function generateWhQuestions(count) {
  const templates = [
    ["___ is your name?", "What", "ما اسمك؟"],
    ["___ are you from?", "Where", "من أين أنت؟"],
    ["___ is your birthday?", "When", "متى عيد ميلادك؟"],
    ["___ is that person?", "Who", "من ذلك الشخص؟"],
    ["___ old are you?", "How", "كم عمرك؟"],
    ["___ do you live?", "Where", "أين تسكن؟"],
    ["___ is your favorite color?", "What", "ما لونك المفضل؟"],
    ["___ is your teacher?", "Who", "من هو معلمك؟"],
    ["___ does the class start?", "When", "متى يبدأ الفصل؟"],
    ["___ many brothers do you have?", "How", "كم عدد إخوتك؟"],
  ];
  const options = ["What", "Where", "When", "Who", "How"];
  const whExplanations = {
    What: "'What' asks about a thing or information.",
    Where: "'Where' asks about a place.",
    When: "'When' asks about a time.",
    Who: "'Who' asks about a person.",
    How: "'How' asks about manner, condition, or quantity.",
  };
  const whExplanationsAr = {
    What: "'What' تُستخدم للسؤال عن شيء أو معلومة.",
    Where: "'Where' تُستخدم للسؤال عن مكان.",
    When: "'When' تُستخدم للسؤال عن وقت.",
    Who: "'Who' تُستخدم للسؤال عن شخص.",
    How: "'How' تُستخدم للسؤال عن الطريقة أو الحالة أو الكمية.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = templates[i % templates.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        whExplanations[correct],
        `أكمل السؤال بالكلمة الصحيحة (What/Where/When/Who/How)، ومعناها: "${sentenceAr}"`,
        whExplanationsAr[correct]
      )
    );
  }
  return list;
}

const categoryLists = [
  generateToBe(60),
  generateSimplePresent(60),
  generatePlurals(40),
  generateOpposites(60),
  generateSynonyms(40),
  generateColors(20),
  generateNumbers(40),
  generateDaysMonths(40),
  generatePrepositions(30),
  generateArticles(30),
  generateVocabCategories(40),
  generateDemonstratives(20),
  generateWhQuestions(20),
];

const built = buildLevel(categoryLists);
export const questions = built.questions;
export const STAGE_SIZE = built.STAGE_SIZE;
export const TOTAL_STAGES = built.TOTAL_STAGES;

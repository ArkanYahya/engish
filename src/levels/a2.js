// A2 (elementary) — 500 questions covering past simple, present continuous,
// comparatives/superlatives, countable/uncountable nouns, modal verbs, and more.
import { withRotatedOptions, uniqueDistractors, buildLevel } from "./engine.js";

const subjects7 = ["I", "You", "He", "She", "It", "We", "They"];
const thirdPersonSubjects = new Set(["He", "She", "It"]);
const subjectAr = {
  I: "أنا", You: "أنت", He: "هو", She: "هي", It: "هو", We: "نحن", They: "هم",
};

function regularPastExplanation(base, past) {
  if (base.endsWith("y") && !/[aeiou]y$/.test(base) && past === `${base.slice(0, -1)}ied`) {
    return `A consonant + 'y' changes to '-ied'.`;
  }
  if (base.endsWith("e") && past === `${base}d`) {
    return `Verbs ending in '-e' just add '-d'.`;
  }
  if (past === `${base}${base.slice(-1)}ed`) {
    return `Short verbs ending in one vowel + one consonant often double the consonant before '-ed'.`;
  }
  if (past === `${base}ed`) {
    return `Regular past simple: just add '-ed'.`;
  }
  return `'${base}' has an irregular past form: '${past}'.`;
}

function regularPastExplanationAr(base, past) {
  if (base.endsWith("y") && !/[aeiou]y$/.test(base) && past === `${base.slice(0, -1)}ied`) {
    return "الكلمة المنتهية بحرف ساكن ثم 'y' تتحول إلى '-ied'.";
  }
  if (base.endsWith("e") && past === `${base}d`) {
    return "الأفعال المنتهية بـ '-e' تُضاف لها '-d' فقط.";
  }
  if (past === `${base}${base.slice(-1)}ed`) {
    return "الأفعال القصيرة المنتهية بحرف علة واحد ثم حرف ساكن واحد غالباً يُضاعف حرفها الأخير قبل '-ed'.";
  }
  if (past === `${base}ed`) {
    return "الماضي المنتظم: أضف '-ed' فقط.";
  }
  return `الفعل "${base}" له صيغة ماضٍ غير منتظمة: "${past}".`;
}

function generatePastRegular(count) {
  const verbs = [
    ["play", "played", "يلعب"], ["walk", "walked", "يمشي"], ["watch", "watched", "يشاهد"], ["clean", "cleaned", "ينظف"],
    ["cook", "cooked", "يطبخ"], ["wash", "washed", "يغسل"], ["help", "helped", "يساعد"], ["listen", "listened", "يستمع"],
    ["open", "opened", "يفتح"], ["close", "closed", "يغلق"], ["start", "started", "يبدأ"], ["finish", "finished", "ينهي"],
    ["visit", "visited", "يزور"], ["arrive", "arrived", "يصل"], ["dance", "danced", "يرقص"], ["smile", "smiled", "يبتسم"],
    ["live", "lived", "يعيش"], ["love", "loved", "يحب"], ["like", "liked", "يحب"], ["use", "used", "يستخدم"],
    ["study", "studied", "يدرس"], ["cry", "cried", "يبكي"], ["try", "tried", "يحاول"], ["carry", "carried", "يحمل"],
    ["worry", "worried", "يقلق"], ["stop", "stopped", "يتوقف"], ["plan", "planned", "يخطط"], ["chat", "chatted", "يتحدث"],
    ["shop", "shopped", "يتسوق"], ["travel", "travelled", "يسافر"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [base, past, verbAr] = verbs[Math.floor(i / subjects7.length) % verbs.length];
    const options = uniqueDistractors(past, [base, `${base}ing`, `${base}ed`, `${base}s`]);
    options.unshift(past);
    const questionAr = `أكمل الجملة بالماضي الصحيح للفعل '${base}' (${verbAr})، ومعناها: "${subjectAr[subject]} ${verbAr} أمس."`;
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ___ yesterday.' (verb: '${base}')`,
        options,
        past,
        i,
        regularPastExplanation(base, past),
        questionAr,
        regularPastExplanationAr(base, past)
      )
    );
  }
  return list;
}

function generatePastIrregular(count) {
  const verbs = [
    ["go", "went", "يذهب"], ["see", "saw", "يرى"], ["eat", "ate", "يأكل"], ["drink", "drank", "يشرب"],
    ["have", "had", "يملك"], ["do", "did", "يفعل"], ["make", "made", "يصنع"], ["take", "took", "يأخذ"],
    ["give", "gave", "يعطي"], ["come", "came", "يأتي"], ["know", "knew", "يعرف"], ["think", "thought", "يفكر"],
    ["say", "said", "يقول"], ["tell", "told", "يخبر"], ["find", "found", "يجد"], ["feel", "felt", "يشعر"],
    ["leave", "left", "يغادر"], ["buy", "bought", "يشتري"], ["write", "wrote", "يكتب"], ["run", "ran", "يجري"],
    ["break", "broke", "يكسر"], ["speak", "spoke", "يتحدث"], ["sleep", "slept", "ينام"], ["sit", "sat", "يجلس"],
    ["meet", "met", "يقابل"], ["teach", "taught", "يُدرّس"], ["hear", "heard", "يسمع"], ["lose", "lost", "يخسر"],
    ["win", "won", "يفوز"], ["drive", "drove", "يقود"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [base, past, verbAr] = verbs[Math.floor(i / subjects7.length) % verbs.length];
    const options = uniqueDistractors(past, [base, `${base}ed`, `${base}ing`, `${base}s`]);
    options.unshift(past);
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ___ yesterday.' (verb: '${base}')`,
        options,
        past,
        i,
        `'${base}' is an irregular verb — its past form is '${past}' (not '${base}ed').`,
        `أكمل الجملة بالماضي الصحيح للفعل '${base}' (${verbAr}).`,
        `الفعل '${base}' (${verbAr}) فعل شاذ (irregular) — صيغة الماضي له هي '${past}' وليست '${base}ed'.`
      )
    );
  }
  return list;
}

function ingExplanation(base, ing) {
  if (base.endsWith("e") && !base.endsWith("ee") && ing === `${base.slice(0, -1)}ing`) {
    return `Drop the final '-e' before adding '-ing'.`;
  }
  if (ing === `${base}${base.slice(-1)}ing`) {
    return `Short verbs ending in one vowel + one consonant often double the consonant before '-ing'.`;
  }
  if (ing === `${base}ing`) {
    return `Regular '-ing' form: just add '-ing'.`;
  }
  return `'${base}' has an irregular '-ing' form: '${ing}'.`;
}

function ingExplanationAr(base, ing) {
  if (base.endsWith("e") && !base.endsWith("ee") && ing === `${base.slice(0, -1)}ing`) {
    return "احذف حرف 'e' الأخير قبل إضافة '-ing'.";
  }
  if (ing === `${base}${base.slice(-1)}ing`) {
    return "الأفعال القصيرة المنتهية بحرف علة واحد ثم حرف ساكن واحد غالباً يُضاعف حرفها الأخير قبل '-ing'.";
  }
  if (ing === `${base}ing`) {
    return "صيغة '-ing' المنتظمة: أضف '-ing' فقط.";
  }
  return `الفعل "${base}" له صيغة '-ing' غير منتظمة: "${ing}".`;
}

function generatePresentContinuous(count) {
  const subjects = ["I", "You", "He", "She", "It", "We", "They", "Tom", "Sara", "Anna", "David"];
  const verbFor = (s) => (s === "I" ? "am" : ["You", "We", "They"].includes(s) ? "are" : "is");
  const verbs = [
    ["play", "playing", "يلعب"], ["eat", "eating", "يأكل"], ["read", "reading", "يقرأ"], ["write", "writing", "يكتب"],
    ["run", "running", "يجري"], ["swim", "swimming", "يسبح"], ["sleep", "sleeping", "ينام"], ["watch", "watching", "يشاهد"],
    ["cook", "cooking", "يطبخ"], ["dance", "dancing", "يرقص"], ["sing", "singing", "يغني"], ["study", "studying", "يدرس"],
    ["work", "working", "يعمل"], ["drive", "driving", "يقود"], ["clean", "cleaning", "ينظف"], ["talk", "talking", "يتحدث"],
    ["listen", "listening", "يستمع"], ["walk", "walking", "يمشي"], ["drink", "drinking", "يشرب"], ["ride", "riding", "يركب"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const beVerb = verbFor(subject);
    const [base, ing, verbAr] = verbs[Math.floor(i / subjects.length) % verbs.length];
    const options = uniqueDistractors(ing, [`${base}ing`, base, `${base}s`, `${base}ed`]);
    options.unshift(ing);
    const questionAr = `أكمل الجملة بصيغة '-ing' الصحيحة للفعل '${base}' (${verbAr})، ومعناها: "${subjectAr[subject] || subject} ${verbAr} الآن."`;
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ${beVerb} ___ right now.' (verb: '${base}')`,
        options,
        ing,
        i,
        ingExplanation(base, ing),
        questionAr,
        ingExplanationAr(base, ing)
      )
    );
  }
  return list;
}

const adjectives = [
  ["tall", "taller", "طويل"], ["short", "shorter", "قصير"], ["fast", "faster", "سريع"], ["slow", "slower", "بطيء"],
  ["small", "smaller", "صغير"], ["big", "bigger", "كبير"], ["hot", "hotter", "حار"], ["thin", "thinner", "نحيف"],
  ["cold", "colder", "بارد"], ["old", "older", "قديم"], ["young", "younger", "صغير السن"], ["cheap", "cheaper", "رخيص"],
  ["easy", "easier", "سهل"], ["happy", "happier", "سعيد"], ["busy", "busier", "مشغول"], ["heavy", "heavier", "ثقيل"],
  ["beautiful", "more beautiful", "جميل"], ["expensive", "more expensive", "غالي"], ["comfortable", "more comfortable", "مريح"],
  ["interesting", "more interesting", "مثير للاهتمام"], ["popular", "more popular", "شائع"], ["careful", "more careful", "حذر"],
  ["difficult", "more difficult", "صعب"], ["famous", "more famous", "مشهور"], ["important", "more important", "مهم"],
  ["dangerous", "more dangerous", "خطير"],
];

function comparativeExplanation(base, comp) {
  if (comp === `more ${base}`) {
    return `Longer adjectives use 'more' instead of '-er'.`;
  }
  if (base.endsWith("y") && !/[aeiou]y$/.test(base) && comp === `${base.slice(0, -1)}ier`) {
    return `A consonant + 'y' changes to '-ier'.`;
  }
  if (comp === `${base}${base.slice(-1)}er`) {
    return `Short adjectives ending in one vowel + one consonant often double the consonant before '-er'.`;
  }
  if (comp === `${base}er`) {
    return `Short adjectives just add '-er'.`;
  }
  return `'${base}' has an irregular comparative form: '${comp}'.`;
}

function comparativeExplanationAr(base, comp) {
  if (comp === `more ${base}`) {
    return "الصفات الطويلة تستخدم 'more' بدلاً من '-er'.";
  }
  if (base.endsWith("y") && !/[aeiou]y$/.test(base) && comp === `${base.slice(0, -1)}ier`) {
    return "الكلمة المنتهية بحرف ساكن ثم 'y' تتحول إلى '-ier'.";
  }
  if (comp === `${base}${base.slice(-1)}er`) {
    return "الصفات القصيرة المنتهية بحرف علة واحد ثم حرف ساكن واحد غالباً يُضاعف حرفها الأخير قبل '-er'.";
  }
  if (comp === `${base}er`) {
    return "الصفات القصيرة تُضاف لها '-er' فقط.";
  }
  return `الصفة "${base}" لها صيغة تفضيل غير منتظمة: "${comp}".`;
}

function generateComparatives(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const [base, comp, adjAr] = adjectives[i % adjectives.length];
    const options = uniqueDistractors(comp, [base, `${base}er`, `more ${base}`, `${base}ier`]);
    options.unshift(comp);
    list.push(
      withRotatedOptions(
        `Complete: 'This book is ___ than that one.' (adjective: '${base}')`,
        options,
        comp,
        i,
        comparativeExplanation(base, comp),
        `أكمل الجملة بصيغة المقارنة الصحيحة للصفة '${base}' (${adjAr}).`,
        comparativeExplanationAr(base, comp)
      )
    );
  }
  return list;
}

function deriveSuperlative(comp) {
  return comp.startsWith("more ") ? `the most ${comp.slice(5)}` : `the ${comp.slice(0, -2)}est`;
}

function generateSuperlatives(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const [base, comp, adjAr] = adjectives[i % adjectives.length];
    const superlative = deriveSuperlative(comp);
    const candidates = [`the ${base}`, `the ${base}est`, `the most ${base}`, `the ${base}er`];
    const options = uniqueDistractors(superlative, candidates);
    options.unshift(superlative);
    const explanation = superlative.startsWith("the most")
      ? `Longer adjectives use 'the most' instead of '-est'.`
      : `'${base}' becomes '${superlative}' — short adjectives add '-est'.`;
    const explanationAr = superlative.startsWith("the most")
      ? "الصفات الطويلة تستخدم 'the most' بدلاً من '-est'."
      : `الصفة "${base}" تصبح "${superlative}" — الصفات القصيرة تُضاف لها '-est'.`;
    list.push(
      withRotatedOptions(
        `Complete: 'This is ___ book in the shop.' (adjective: '${base}')`,
        options,
        superlative,
        i,
        explanation,
        `أكمل الجملة بصيغة التفضيل المطلق للصفة '${base}' (${adjAr}).`,
        explanationAr
      )
    );
  }
  return list;
}

function generateCountableUncountable(count) {
  const nouns = [
    ["apples", "تفاح"], ["books", "كتب"], ["chairs", "كراسي"], ["dogs", "كلاب"], ["eggs", "بيض"],
    ["phones", "هواتف"], ["students", "طلاب"], ["cars", "سيارات"], ["bottles", "زجاجات"], ["tables", "طاولات"],
    ["water", "ماء"], ["milk", "حليب"], ["rice", "أرز"], ["bread", "خبز"], ["sugar", "سكر"],
    ["coffee", "قهوة"], ["tea", "شاي"], ["money", "مال"], ["information", "معلومات"], ["furniture", "أثاث"],
  ];
  const templates = [
    { text: (n) => `I have ___ ${n} in my bag.`, correct: "some", kind: "affirmative" },
    { text: (n) => `I don't have ___ ${n} in my bag.`, correct: "any", kind: "negative" },
    { text: (n) => `Do you have ___ ${n}?`, correct: "any", kind: "question" },
  ];
  const options = ["some", "any"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [noun, nounAr] = nouns[i % nouns.length];
    const template = templates[Math.floor(i / nouns.length) % templates.length];
    const correct = template.correct;
    const explanation =
      correct === "some"
        ? `Use 'some' in positive (affirmative) sentences.`
        : `Use 'any' in questions and negative sentences.`;
    const explanationAr =
      correct === "some" ? "استخدم 'some' في الجمل المثبتة (الإيجابية)." : "استخدم 'any' في الأسئلة والجمل المنفية.";
    list.push(
      withRotatedOptions(
        template.text(noun),
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالكلمة الصحيحة (some/any) — الكلمة المتعلقة بـ "${nounAr}".`,
        explanationAr
      )
    );
  }
  return list;
}

function generateCanCant(count) {
  const abilities = [
    ["swim", "يسبح"], ["drive", "يقود"], ["cook", "يطبخ"], ["sing", "يغني"], ["dance", "يرقص"],
    ["paint", "يرسم"], ["ski", "يتزلج"], ["skate", "يتزلج على الجليد"], ["ride a bike", "يركب الدراجة"],
    ["speak English", "يتحدث الإنجليزية"], ["play the guitar", "يعزف الغيتار"], ["run fast", "يجري بسرعة"],
  ];
  const options = ["can", "can't", "cans", "canning"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [ability, abilityAr] = abilities[Math.floor(i / subjects7.length) % abilities.length];
    const isNegative = i % 2 === 1;
    const correct = isNegative ? "can't" : "can";
    const sentence = isNegative
      ? `Complete: '${subject} ___ ${ability}. (not yet!)'`
      : `Complete: '${subject} ___ ${ability}.'`;
    const explanation = isNegative
      ? `Use 'can't' for inability. 'Can' never changes form — no '-s', no matter the subject.`
      : `Use 'can' for ability. 'Can' never changes form — no '-s', no matter the subject.`;
    const explanationAr = isNegative
      ? "استخدم 'can't' لعدم القدرة. الفعل 'can' لا يتغير أبداً — بدون '-s' مهما كان الفاعل."
      : "استخدم 'can' للقدرة. الفعل 'can' لا يتغير أبداً — بدون '-s' مهما كان الفاعل.";
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالكلمة الصحيحة، ومعناها: "${subjectAr[subject]} ${isNegative ? "لا يستطيع" : "يستطيع"} أن ${abilityAr}."`,
        explanationAr
      )
    );
  }
  return list;
}

function generateHaveToMust(count) {
  const obligations = [
    ["wake up early", "يستيقظ مبكراً"], ["wear a uniform", "يرتدي زياً موحداً"], ["study for the exam", "يدرس للامتحان"],
    ["finish the report", "ينهي التقرير"], ["pay the bill", "يدفع الفاتورة"], ["clean the room", "ينظف الغرفة"],
    ["take medicine", "يأخذ الدواء"], ["wear a seatbelt", "يرتدي حزام الأمان"], ["bring a passport", "يحضر جواز السفر"],
    ["arrive on time", "يصل في الوقت المحدد"],
  ];
  const options = ["have to", "has to", "having to", "haves to"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [task, taskAr] = obligations[Math.floor(i / subjects7.length) % obligations.length];
    const isThird = thirdPersonSubjects.has(subject);
    const correct = isThird ? "has to" : "have to";
    const explanation = isThird
      ? `'${subject}' is he/she/it, so use 'has to'.`
      : `'${subject}' uses 'have to' (not 'has to').`;
    const explanationAr = isThird
      ? `'${subject}' ضمير مفرد (هو/هي)، لذلك تُستخدم 'has to'.`
      : `'${subject}' تُستخدم مع 'have to' (وليس 'has to').`;
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ___ ${task}.'`,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالصيغة الصحيحة، ومعناها: "${subjectAr[subject]} يجب أن ${taskAr}."`,
        explanationAr
      )
    );
  }
  return list;
}

function generateGoingTo(count) {
  const subjects = ["I", "You", "He", "She", "It", "We", "They", "Tom", "Sara", "Anna", "David"];
  const verbFor = (s) => (s === "I" ? "am" : ["You", "We", "They"].includes(s) ? "are" : "is");
  const verbs = [
    ["travel", "يسافر"], ["study", "يدرس"], ["visit", "يزور"], ["buy", "يشتري"], ["start", "يبدأ"],
    ["move", "ينتقل"], ["cook", "يطبخ"], ["paint", "يرسم"], ["build", "يبني"], ["play", "يلعب"],
  ];
  const options = ["am", "is", "are"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const [verb, verbAr] = verbs[Math.floor(i / subjects.length) % verbs.length];
    const correct = verbFor(subject);
    const explanation = `'${subject}' takes '${correct}' — use am/is/are + going to + base verb for future plans.`;
    const explanationAr = `'${subject}' تُستخدم مع '${correct}' — نستخدم am/is/are + going to + الفعل الأساسي للحديث عن خطط مستقبلية.`;
    list.push(
      withRotatedOptions(
        `Complete: '${subject} ___ going to ${verb} tomorrow.'`,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالفعل الصحيح (am/is/are)، ومعناها: "${subjectAr[subject] || subject} سوف ${verbAr} غداً."`,
        explanationAr
      )
    );
  }
  return list;
}

function generatePrepositionsOfTime(count) {
  const expressions = [
    ["7 o'clock", "at", "الساعة السابعة"], ["night", "at", "الليل"], ["noon", "at", "الظهر"],
    ["midnight", "at", "منتصف الليل"], ["the weekend", "at", "نهاية الأسبوع"],
    ["Monday", "on", "الاثنين"], ["Friday", "on", "الجمعة"], ["my birthday", "on", "عيد ميلادي"],
    ["New Year's Day", "on", "رأس السنة"], ["Sunday", "on", "الأحد"],
    ["July", "in", "يوليو"], ["2024", "in", "٢٠٢٤"], ["summer", "in", "الصيف"],
    ["the morning", "in", "الصباح"], ["the evening", "in", "المساء"], ["winter", "in", "الشتاء"],
  ];
  const options = ["in", "on", "at"];
  const explanations = {
    at: "Use 'at' for exact times (clock times, night, noon, midnight, the weekend).",
    on: "Use 'on' for days and dates.",
    in: "Use 'in' for months, years, seasons, and parts of the day.",
  };
  const explanationsAr = {
    at: "استخدم 'at' للأوقات المحددة (الساعات، الليل، الظهر، منتصف الليل، نهاية الأسبوع).",
    on: "استخدم 'on' للأيام والتواريخ.",
    in: "استخدم 'in' للأشهر والسنوات والفصول وأجزاء اليوم.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [expr, correct, exprAr] = expressions[i % expressions.length];
    list.push(
      withRotatedOptions(
        `Complete: 'The meeting is ___ ${expr}.'`,
        options,
        correct,
        i,
        explanations[correct],
        `أكمل الجملة بحرف الجر الصحيح (in/on/at)، ومعناها: "الاجتماع في ${exprAr}."`,
        explanationsAr[correct]
      )
    );
  }
  return list;
}

function generateAdverbsOfFrequency(count) {
  const templates = [
    ["I ___ brush my teeth every morning. (100%)", "always", "أنا دائماً أنظف أسناني كل صباح."],
    ["She ___ goes to the gym. (about 80%)", "usually", "هي عادةً تذهب إلى النادي الرياضي."],
    ["We ___ eat pizza on Fridays. (about 60%)", "often", "نحن غالباً نأكل بيتزا يوم الجمعة."],
    ["He ___ drinks coffee. (about 40%)", "sometimes", "هو أحياناً يشرب القهوة."],
    ["They ___ go to the cinema. (about 10%)", "rarely", "هم نادراً يذهبون إلى السينما."],
    ["I ___ eat meat — I'm vegetarian. (0%)", "never", "أنا أبداً لا آكل اللحم — أنا نباتي."],
  ];
  const options = ["always", "usually", "often", "sometimes", "rarely", "never"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = templates[i % templates.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        `'${correct}' matches this frequency. Adverbs of frequency usually go before the main verb (but after 'be').`,
        `أكمل الجملة بظرف التكرار الصحيح، ومعناها: "${sentenceAr}"`,
        `'${correct}' تطابق هذا التكرار. ظروف التكرار عادةً تأتي قبل الفعل الرئيسي (وبعد فعل 'be').`
      )
    );
  }
  return list;
}

function generateThereIsAre(count) {
  const items = [
    ["a lamp", "There is", "مصباح"], ["a chair", "There is", "كرسي"], ["a window", "There is", "نافذة"],
    ["a clock", "There is", "ساعة حائط"], ["a mirror", "There is", "مرآة"],
    ["some books", "There are", "بعض الكتب"], ["two chairs", "There are", "كرسيان"], ["three windows", "There are", "ثلاث نوافذ"],
    ["many students", "There are", "العديد من الطلاب"], ["a lot of cars", "There are", "الكثير من السيارات"],
  ];
  const options = ["There is", "There are"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [noun, correct, nounAr] = items[i % items.length];
    const explanation =
      correct === "There is"
        ? `Use 'There is' with singular/uncountable nouns.`
        : `Use 'There are' with plural nouns.`;
    const explanationAr =
      correct === "There is" ? "استخدم 'There is' مع الأسماء المفردة أو غير المعدودة." : "استخدم 'There are' مع الأسماء الجمع.";
    list.push(
      withRotatedOptions(
        `Complete: '___ ${noun} in the room.'`,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالصيغة الصحيحة (There is/There are)، ومعناها: "يوجد ${nounAr} في الغرفة."`,
        explanationAr
      )
    );
  }
  return list;
}

function generatePossessives(count) {
  const rows = [
    ["I", "my", "mine", "me", "أنا"],
    ["You", "your", "yours", "you", "أنت"],
    ["He", "his", "his", "him", "هو"],
    ["She", "her", "hers", "her", "هي"],
    ["It", "its", "its", "it", "الشيء"],
    ["We", "our", "ours", "us", "نحن"],
    ["They", "their", "theirs", "them", "هم"],
  ];
  const adjectiveOptions = rows.map((r) => r[1]);
  const pronounOptions = rows.map((r) => r[2]);

  const list = [];
  for (let i = 0; i < count; i++) {
    const rowIndex = i % rows.length;
    const [subject, adj, pron, obj, subjectArWord] = rows[rowIndex];
    const isAdjective = Math.floor(i / rows.length) % 2 === 0;

    if (isAdjective) {
      const options = [adj];
      let offset = 1;
      while (options.length < 4) {
        const c = adjectiveOptions[(rowIndex + offset) % adjectiveOptions.length];
        if (!options.includes(c)) options.push(c);
        offset++;
      }
      list.push(
        withRotatedOptions(
          `Complete: 'This book belongs to ${obj}. This is ___ book.'`,
          options,
          adj,
          i,
          `'${adj}' is the possessive adjective for '${subject}' — it goes before a noun.`,
          `أكمل الجملة بصفة الملكية الصحيحة، ومعناها: "هذا الكتاب يخص ${subjectArWord}."`,
          `'${adj}' هي صفة الملكية لـ '${subject}' — تأتي قبل الاسم.`
        )
      );
    } else {
      const options = [pron];
      let offset = 1;
      while (options.length < 4) {
        const c = pronounOptions[(rowIndex + offset) % pronounOptions.length];
        if (!options.includes(c)) options.push(c);
        offset++;
      }
      list.push(
        withRotatedOptions(
          `Complete: 'This book belongs to ${obj}. This book is ___.'`,
          options,
          pron,
          i,
          `'${pron}' is the possessive pronoun for '${subject}' — it stands alone, without a noun.`,
          `أكمل الجملة بضمير الملكية الصحيح، ومعناها: "هذا الكتاب ملك لـ ${subjectArWord}."`,
          `'${pron}' هو ضمير الملكية لـ '${subject}' — يأتي وحده بدون اسم بعده.`
        )
      );
    }
  }
  return list;
}

const categoryLists = [
  generatePastRegular(60),
  generatePastIrregular(60),
  generatePresentContinuous(50),
  generateComparatives(50),
  generateSuperlatives(40),
  generateCountableUncountable(40),
  generateCanCant(30),
  generateHaveToMust(30),
  generateGoingTo(30),
  generatePrepositionsOfTime(30),
  generateAdverbsOfFrequency(30),
  generateThereIsAre(30),
  generatePossessives(20),
];

const built = buildLevel(categoryLists);
export const questions = built.questions;
export const STAGE_SIZE = built.STAGE_SIZE;
export const TOTAL_STAGES = built.TOTAL_STAGES;

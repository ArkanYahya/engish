// B2 (upper-intermediate) — 500 questions covering second/third conditionals,
// present perfect continuous, multi-tense passive voice, modals of deduction,
// non-defining relative clauses, collocations, word formation, and more.
import { withRotatedOptions, uniqueDistractors, buildLevel } from "./engine.js";

function generateSecondConditional(count) {
  const rows = [
    ["I had a million dollars", "I", "buy a house", "يشتري منزلاً", "لو كان لدي مليون دولار"],
    ["I were you", "I", "accept the offer", "يقبل العرض", "لو كنت مكانك"],
    ["she knew the answer", "she", "tell you", "تخبرك", "لو كانت تعرف الإجابة"],
    ["he had more time", "he", "travel more", "يسافر أكثر", "لو كان لديه وقت أكثر"],
    ["they lived closer", "they", "visit more often", "يزورون أكثر", "لو كانوا يعيشون أقرب"],
    ["we won the lottery", "we", "quit our jobs", "نترك وظائفنا", "لو ربحنا اليانصيب"],
    ["I could fly", "I", "travel the world", "يسافر حول العالم", "لو كنت أستطيع الطيران"],
    ["she spoke French", "she", "get the job", "تحصل على الوظيفة", "لو كانت تتحدث الفرنسية"],
    ["it didn't rain", "I", "go for a walk", "أذهب في نزهة", "لو لم تمطر"],
    ["he studied harder", "he", "pass easily", "ينجح بسهولة", "لو درس بجد أكثر"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [ifClause, resultSubject, resultVerb, resultAr, ifClauseAr] = rows[i % rows.length];
    const correct = `would ${resultVerb}`;
    const options = uniqueDistractors(correct, [resultVerb, `will ${resultVerb}`, `${resultVerb}s`, `would ${resultVerb}s`]);
    options.unshift(correct);
    list.push(
      withRotatedOptions(
        `Complete: 'If ${ifClause}, ${resultSubject} ___.' (verb: '${resultVerb}')`,
        options,
        correct,
        i,
        `Second conditional: 'if' + past simple, 'would' + base verb — for hypothetical/unreal situations.`,
        `أكمل الجملة الشرطية بالصيغة الصحيحة، ومعناها: "${ifClauseAr}، ${resultAr}."`,
        `الشرط الثاني: 'if' + الماضي البسيط، 'would' + الفعل الأساسي — لمواقف افتراضية غير حقيقية.`
      )
    );
  }
  return list;
}

function generatePresentPerfectContinuous(count) {
  const subjects7 = ["I", "You", "He", "She", "It", "We", "They"];
  const thirdPersonSubjects = new Set(["He", "She", "It"]);
  const subjectAr = { I: "أنا", You: "أنت", He: "هو", She: "هي", It: "هو", We: "نحن", They: "هم" };
  const verbs = [
    ["work", "working", "يعمل"], ["study", "studying", "يدرس"], ["wait", "waiting", "ينتظر"], ["run", "running", "يجري"],
    ["read", "reading", "يقرأ"], ["talk", "talking", "يتحدث"], ["live", "living", "يعيش"], ["play", "playing", "يلعب"],
    ["learn", "learning", "يتعلم"], ["travel", "travelling", "يسافر"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [base, ing, verbAr] = verbs[Math.floor(i / subjects7.length) % verbs.length];
    const isThird = thirdPersonSubjects.has(subject);
    const testHaveHas = i % 2 === 0;

    if (testHaveHas) {
      const correct = isThird ? "has" : "have";
      const options = ["have", "has", "having", "haves"];
      const explanation = isThird
        ? `'${subject}' is he/she/it, so use 'has been' + '-ing'.`
        : `'${subject}' uses 'have been' (not 'has been') + '-ing'.`;
      const explanationAr = isThird
        ? `'${subject}' ضمير مفرد (هو/هي)، لذلك تُستخدم 'has been' + '-ing'.`
        : `'${subject}' تُستخدم مع 'have been' (وليس 'has been') + '-ing'.`;
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ___ been ${ing} for two hours.'`,
          options,
          correct,
          i,
          explanation,
          `أكمل الجملة بالصيغة الصحيحة (have/has)، ومعناها: "${subjectAr[subject]} ${verbAr} منذ ساعتين."`,
          explanationAr
        )
      );
    } else {
      const haveHas = isThird ? "has" : "have";
      const options = uniqueDistractors(ing, [`${base}ing`, base, `${base}s`, `${base}ed`]);
      options.unshift(ing);
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ${haveHas} been ___ for two hours.' (verb: '${base}')`,
          options,
          ing,
          i,
          `Present perfect continuous: have/has been + '-ing' — an action continuing up to now.`,
          `أكمل الجملة بصيغة '-ing' الصحيحة للفعل '${base}' (${verbAr}).`,
          `المضارع التام المستمر: have/has been + '-ing' — لفعل مستمر حتى الآن.`
        )
      );
    }
  }
  return list;
}

function generatePassiveVariousTenses(count) {
  const objects = [
    ["the room", "clean", "cleaned", "الغرفة"],
    ["the report", "write", "written", "التقرير"],
    ["the cake", "bake", "baked", "الكعكة"],
    ["the car", "repair", "repaired", "السيارة"],
    ["the movie", "watch", "watched", "الفيلم"],
    ["the contract", "sign", "signed", "العقد"],
    ["the door", "lock", "locked", "الباب"],
    ["the email", "send", "sent", "البريد الإلكتروني"],
    ["the problem", "solve", "solved", "المشكلة"],
    ["the package", "deliver", "delivered", "الطرد"],
  ];
  const tenseTypes = [
    {
      label: "present simple",
      labelAr: "المضارع البسيط",
      build: (p) => `is ${p}`,
      distractors: (b, p) => [`was ${p}`, `is ${b}ing`, `are ${p}`],
      explanation: "Present simple passive: is/am/are + past participle.",
      explanationAr: "المبني للمجهول في المضارع البسيط: is/am/are + التصريف الثالث.",
    },
    {
      label: "present perfect",
      labelAr: "المضارع التام",
      build: (p) => `has been ${p}`,
      distractors: (b, p) => [`have been ${p}`, `has ${p}`, `is ${p}`],
      explanation: "Present perfect passive: has/have been + past participle.",
      explanationAr: "المبني للمجهول في المضارع التام: has/have been + التصريف الثالث.",
    },
    {
      label: "future",
      labelAr: "المستقبل",
      build: (p) => `will be ${p}`,
      distractors: (b, p) => [`will ${p}`, `is going ${p}`, `would be ${p}`],
      explanation: "Future passive: will be + past participle.",
      explanationAr: "المبني للمجهول في المستقبل: will be + التصريف الثالث.",
    },
    {
      label: "modal (must)",
      labelAr: "الفعل الناقص (must)",
      build: (p) => `must be ${p}`,
      distractors: (b, p) => [`must ${p}`, `must been ${p}`, `must being ${p}`],
      explanation: "Modal passive: modal verb + be + past participle.",
      explanationAr: "المبني للمجهول مع الأفعال الناقصة: الفعل الناقص + be + التصريف الثالث.",
    },
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [object, base, participle, objectAr] = objects[i % objects.length];
    const tenseType = tenseTypes[Math.floor(i / objects.length) % tenseTypes.length];
    const correct = tenseType.build(participle);
    const options = uniqueDistractors(correct, tenseType.distractors(base, participle));
    options.unshift(correct);
    const objectCap = `${object[0].toUpperCase()}${object.slice(1)}`;
    list.push(
      withRotatedOptions(
        `Complete the passive sentence (${tenseType.label}): '${objectCap} ___.' (verb: '${base}')`,
        options,
        correct,
        i,
        `${tenseType.explanation} '${base}' → '${participle}'.`,
        `أكمل جملة المبني للمجهول (${tenseType.labelAr})، عن "${objectAr}".`,
        `${tenseType.explanationAr} الفعل '${base}' → '${participle}'.`
      )
    );
  }
  return list;
}

function generateReportedQuestionsCommands(count) {
  const rows = [
    { sentence: "He asked me where I ___.", options: ["lived", "live", "living", "lives"], correct: "lived", ar: "سأل أين أسكن.", isCommand: false },
    { sentence: "She asked me what my name ___.", options: ["was", "is", "am", "be"], correct: "was", ar: "سألت ما اسمي.", isCommand: false },
    { sentence: "He asked me if I ___ tired.", options: ["was", "am", "is", "be"], correct: "was", ar: "سأل إن كنت متعباً.", isCommand: false },
    { sentence: "She asked me if I ___ tea.", options: ["liked", "like", "likes", "liking"], correct: "liked", ar: "سألت إن كنت أحب الشاي.", isCommand: false },
    { sentence: "He asked me if I ___ swim.", options: ["could", "can", "will", "should"], correct: "could", ar: "سأل إن كنت أستطيع السباحة.", isCommand: false },
    { sentence: "She told me ___ the door.", options: ["to close", "close", "closing", "closed"], correct: "to close", ar: "قالت لي أن أغلق الباب.", isCommand: true },
    { sentence: "He told me ___ late.", options: ["not to be", "to not be", "don't be", "not being"], correct: "not to be", ar: "قال لي ألا أتأخر.", isCommand: true },
    { sentence: "She told me ___ down.", options: ["to sit", "sit", "sitting", "sat"], correct: "to sit", ar: "قالت لي أن أجلس.", isCommand: true },
    { sentence: "He told me ___ that.", options: ["not to touch", "to not touch", "don't touch", "not touching"], correct: "not to touch", ar: "قال لي ألا ألمس ذلك.", isCommand: true },
    { sentence: "She told me ___ here.", options: ["to wait", "wait", "waiting", "waited"], correct: "to wait", ar: "قالت لي أن أنتظر هنا.", isCommand: true },
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const row = rows[i % rows.length];
    const explanation = row.isCommand
      ? `Reported commands use 'told + object + to + base verb' (or 'not to' for negatives).`
      : `Reported questions use normal word order (no do/does/did), and 'if'/'whether' for yes-no questions.`;
    const explanationAr = row.isCommand
      ? "الأوامر المنقولة تُصاغ بـ 'told + المفعول + to + الفعل الأساسي' (أو 'not to' للنفي)."
      : "الأسئلة المنقولة تستخدم ترتيب الكلمات العادي (بدون do/does/did)، وتستخدم 'if'/'whether' لأسئلة نعم/لا.";
    list.push(
      withRotatedOptions(row.sentence, row.options, row.correct, i, explanation, `أكمل الجملة، ومعناها: "${row.ar}"`, explanationAr)
    );
  }
  return list;
}

function generateModalsOfDeduction(count) {
  const mustRows = [
    ["She's been awake for 20 hours. She ___ be exhausted.", "must", "هي مستيقظة منذ 20 ساعة. لا بد أنها منهكة."],
    ["The ground is wet. It ___ have rained.", "must", "الأرض مبللة. لا بد أنها أمطرت."],
    ["He's wearing a wedding ring. He ___ be married.", "must", "هو يرتدي خاتم زواج. لا بد أنه متزوج."],
    ["The lights are on. Someone ___ be home.", "must", "الأضواء مضاءة. لا بد أن أحداً في المنزل."],
  ];
  const cantRows = [
    ["He just ate a huge meal. He ___ be hungry.", "can't", "هو أكل للتو وجبة كبيرة. لا يُعقل أن يكون جائعاً."],
    ["She's only ten years old. She ___ have a driving license.", "can't", "عمرها عشر سنوات فقط. لا يُعقل أن يكون لديها رخصة قيادة."],
    ["The shop is closed. That ___ be right — it's only 2 pm.", "can't", "المتجر مغلق. هذا غير معقول — الساعة الآن 2 ظهراً فقط."],
    ["He said he's never been to Paris. That ___ be true — I saw a photo of him there.", "can't", "قال إنه لم يزر باريس قط. هذا غير معقول — رأيت صورة له هناك."],
  ];
  const mightRows = [
    ["I'm not sure where she is. She ___ be at work.", "might", "لست متأكداً أين هي. قد تكون في العمل."],
    ["The phone is ringing. It ___ be my mom.", "might", "الهاتف يرن. قد تكون أمي."],
    ["He hasn't replied yet. He ___ be busy.", "might", "لم يرد بعد. قد يكون مشغولاً."],
    ["I heard a noise. It ___ be the cat.", "might", "سمعت صوتاً. قد تكون القطة."],
  ];
  const options = ["must", "can't", "might", "should"];
  const groups = [
    [mustRows, "Use 'must' for a strong positive deduction (you're almost certain it's true).", "استخدم 'must' للاستنتاج القوي المثبت (أنت شبه متأكد أنه صحيح)."],
    [cantRows, "Use 'can't' for a strong negative deduction (you're almost certain it's impossible).", "استخدم 'can't' للاستنتاج القوي المنفي (أنت شبه متأكد أنه مستحيل)."],
    [mightRows, "Use 'might' (or 'could') when you're not sure — it's just a possibility.", "استخدم 'might' (أو 'could') عندما لا تكون متأكداً — إنه مجرد احتمال."],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [rows, explanation, explanationAr] = groups[i % groups.length];
    const [sentence, correct, sentenceAr] = rows[Math.floor(i / groups.length) % rows.length];
    list.push(withRotatedOptions(sentence, options, correct, i, explanation, `أكمل الجملة، ومعناها: "${sentenceAr}"`, explanationAr));
  }
  return list;
}

function generateNonDefiningRelativeClauses(count) {
  const rows = [
    ["My brother, ___ lives in Paris, is visiting us.", "who", "أخي، الذي يعيش في باريس، يزورنا."],
    ["The Eiffel Tower, ___ is in Paris, is very famous.", "which", "برج إيفل، الذي في باريس، مشهور جداً."],
    ["This is Sara, ___ car was stolen yesterday.", "whose", "هذه سارة، التي سُرقت سيارتها أمس."],
    ["My father, ___ is 60 years old, still works.", "who", "أبي، الذي يبلغ 60 عاماً، لا يزال يعمل."],
    ["The book, ___ I bought last week, is excellent.", "which", "الكتاب، الذي اشتريته الأسبوع الماضي، ممتاز."],
    ["That's Mr. Smith, ___ son is my classmate.", "whose", "هذا السيد سميث، الذي ابنه زميلي في الصف."],
    ["London, ___ is the capital of England, is huge.", "which", "لندن، التي هي عاصمة إنجلترا، ضخمة."],
    ["My sister, ___ works as a nurse, helped me.", "who", "أختي، التي تعمل كممرضة، ساعدتني."],
    ["The manager, ___ office is upstairs, is busy.", "whose", "المدير، الذي مكتبه بالأعلى، مشغول."],
    ["Rome, ___ I visited last year, was beautiful.", "which", "روما، التي زرتها العام الماضي، كانت جميلة."],
  ];
  const options = ["who", "which", "whose", "where"];
  const explanations = {
    who: "'who' refers to people (non-defining, set off with commas).",
    which: "'which' refers to things (non-defining, set off with commas).",
    whose: "'whose' shows possession.",
  };
  const explanationsAr = {
    who: "'who' تشير إلى الأشخاص (جملة وصفية غير أساسية، تُفصل بفواصل).",
    which: "'which' تشير إلى الأشياء (جملة وصفية غير أساسية، تُفصل بفواصل).",
    whose: "'whose' تدل على الملكية.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = rows[i % rows.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        explanations[correct],
        `أكمل الجملة بأداة الوصل الصحيحة، ومعناها: "${sentenceAr}"`,
        explanationsAr[correct]
      )
    );
  }
  return list;
}

function generateThirdConditional(count) {
  const rows = [
    ["I had studied harder", "I", "pass", "passed", "أنجح", "لو كنت درست بجد أكثر"],
    ["she had left earlier", "she", "catch the train", "caught the train", "تلحق بالقطار", "لو كانت غادرت مبكراً"],
    ["he had listened to me", "he", "avoid the mistake", "avoided the mistake", "يتجنب الخطأ", "لو كان استمع لي"],
    ["they had booked earlier", "they", "get better seats", "got better seats", "يحصلون على مقاعد أفضل", "لو كانوا حجزوا مبكراً"],
    ["we had known about the traffic", "we", "leave earlier", "left earlier", "نغادر مبكراً", "لو كنا نعرف عن الازدحام"],
    ["I had seen the sign", "I", "stop in time", "stopped in time", "أتوقف في الوقت المناسب", "لو كنت رأيت اللافتة"],
    ["she had saved more money", "she", "buy the house", "bought the house", "تشتري المنزل", "لو كانت ادخرت مالاً أكثر"],
    ["he had apologized", "he", "keep his job", "kept his job", "يحتفظ بوظيفته", "لو كان اعتذر"],
    ["you had told me", "I", "help you", "helped you", "أساعدك", "لو كنت أخبرتني"],
    ["it hadn't rained", "we", "go to the beach", "gone to the beach", "نذهب إلى الشاطئ", "لو لم تكن أمطرت"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [ifClause, resultSubject, resultBase, resultParticiple, resultAr, ifClauseAr] = rows[i % rows.length];
    const correct = `would have ${resultParticiple}`;
    const options = uniqueDistractors(correct, [
      `would ${resultBase}`,
      `will have ${resultParticiple}`,
      `would have ${resultBase}ed`,
      `had ${resultParticiple}`,
    ]);
    options.unshift(correct);
    list.push(
      withRotatedOptions(
        `Complete: 'If ${ifClause}, ${resultSubject} ___.' (verb phrase: '${resultBase}')`,
        options,
        correct,
        i,
        `Third conditional: 'if' + past perfect, 'would have' + past participle — for imagining a different past (regret/hypothetical).`,
        `أكمل الجملة الشرطية بالصيغة الصحيحة، ومعناها: "${ifClauseAr}، كان ${resultAr}."`,
        `الشرط الثالث: 'if' + الماضي التام، 'would have' + التصريف الثالث — لتخيل ماضٍ مختلف (ندم أو افتراض).`
      )
    );
  }
  return list;
}

function generateCollocations(count) {
  const rows = [
    ["decision", "make", "اتخاذ قرار"], ["mistake", "make", "ارتكاب خطأ"], ["progress", "make", "إحراز تقدم"],
    ["effort", "make", "بذل جهد"], ["friends", "make", "تكوين صداقات"],
    ["homework", "do", "أداء الواجب"], ["favor", "do", "تقديم معروف"], ["exercise", "do", "ممارسة الرياضة"],
    ["research", "do", "إجراء بحث"], ["business", "do", "ممارسة الأعمال"],
    ["a break", "take", "أخذ استراحة"], ["a photo", "take", "التقاط صورة"], ["a risk", "take", "المخاطرة"],
    ["a shower", "take", "الاستحمام"], ["an exam", "take", "خوض امتحان"],
    ["a party", "have", "إقامة حفلة"], ["a look", "have", "إلقاء نظرة"], ["breakfast", "have", "تناول الإفطار"],
    ["fun", "have", "الاستمتاع"], ["a headache", "have", "الشعور بصداع"],
  ];
  const options = ["make", "do", "take", "have"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [noun, correct, meaningAr] = rows[i % rows.length];
    list.push(
      withRotatedOptions(
        `Complete: 'I need to ___ ${noun}.'`,
        options,
        correct,
        i,
        `'${correct} ${noun}' is a fixed collocation in English.`,
        `أكمل الجملة بالفعل الصحيح، ومعناها: "${meaningAr}".`,
        `التعبير الثابت الصحيح هو "${correct} ${noun}" (${meaningAr}).`
      )
    );
  }
  return list;
}

function generateAdvancedPhrasalVerbs(count) {
  const rows = [
    ["put up with", "tolerate", "يتحمل", "I can't put up with this noise anymore."],
    ["come across", "find by chance", "يصادف", "I came across an old photo yesterday."],
    ["get over", "recover from", "يتعافى من", "It took her weeks to get over the flu."],
    ["look forward to", "anticipate with pleasure", "يتطلع إلى", "I'm looking forward to the holidays."],
    ["bring up", "raise a topic or a child", "يثير موضوعاً أو يربي", "Don't bring up that subject again."],
    ["figure out", "understand or solve", "يكتشف أو يفهم", "I can't figure out this puzzle."],
    ["hold on", "wait", "ينتظر", "Hold on a second, please."],
    ["call off", "cancel", "يلغي", "They called off the wedding."],
    ["show up", "arrive or appear", "يظهر أو يحضر", "He didn't show up to the meeting."],
    ["deal with", "handle", "يتعامل مع", "I have to deal with this problem."],
    ["cut down on", "reduce", "يقلل من", "I'm trying to cut down on sugar."],
    ["go through", "experience", "يمر بـ", "She went through a difficult time."],
    ["make up", "invent or reconcile", "يختلق أو يتصالح", "He made up a good excuse."],
    ["point out", "indicate", "يشير إلى", "She pointed out my mistake."],
    ["stand for", "represent", "يرمز إلى", "What does 'UN' stand for?"],
  ];
  const meanings = rows.map((r) => r[1]);

  const list = [];
  for (let i = 0; i < count; i++) {
    const [phrasal, meaning, meaningAr, sentence] = rows[i % rows.length];
    const options = [meaning];
    let offset = 4;
    while (options.length < 4) {
      const candidate = meanings[(i + offset) % meanings.length];
      if (candidate !== meaning && !options.includes(candidate)) options.push(candidate);
      offset += 5;
    }
    list.push(
      withRotatedOptions(
        `What does '${phrasal}' mean in: '${sentence}'?`,
        options,
        meaning,
        i,
        `'${phrasal}' means '${meaning}'.`,
        `ماذا يعني '${phrasal}' (${meaningAr}) في الجملة؟`,
        `'${phrasal}' تعني '${meaning}' (${meaningAr}).`
      )
    );
  }
  return list;
}

function generateWordFormation(count) {
  const rows = [
    ["happy", "happiness", "adjective + '-ness' → noun", "السعادة"],
    ["kind", "kindness", "adjective + '-ness' → noun", "اللطف"],
    ["possible", "impossible", "'im-' + adjective → negative", "مستحيل"],
    ["correct", "incorrect", "'in-' + adjective → negative", "غير صحيح"],
    ["happy", "unhappy", "'un-' + adjective → negative", "غير سعيد"],
    ["comfortable", "uncomfortable", "'un-' + adjective → negative", "غير مريح"],
    ["act", "action", "verb + '-ion' → noun", "فعل أو حدث"],
    ["decide", "decision", "verb + '-ion' → noun", "قرار"],
    ["educate", "education", "verb + '-ion' → noun", "تعليم"],
    ["care", "careful", "noun + '-ful' → adjective", "حذر"],
    ["danger", "dangerous", "noun + '-ous' → adjective", "خطير"],
    ["fame", "famous", "noun + '-ous' → adjective", "مشهور"],
    ["accurate", "accurately", "adjective + '-ly' → adverb", "بدقة"],
    ["quick", "quickly", "adjective + '-ly' → adverb", "بسرعة"],
    ["employ", "employment", "verb + '-ment' → noun", "توظيف"],
    ["develop", "development", "verb + '-ment' → noun", "تطوير"],
    ["responsible", "irresponsible", "'ir-' + adjective → negative", "غير مسؤول"],
    ["legal", "illegal", "'il-' + adjective → negative", "غير قانوني"],
    ["patient", "impatient", "'im-' + adjective → negative", "غير صبور"],
    ["logical", "illogical", "'il-' + adjective → negative", "غير منطقي"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [base, transformed, rule, meaningAr] = rows[i % rows.length];
    const options = uniqueDistractors(transformed, [base, `${base}ness`, `${base}ly`, `un${base}`]);
    options.unshift(transformed);
    list.push(
      withRotatedOptions(
        `What is the correct word formed from '${base}'? (${rule})`,
        options,
        transformed,
        i,
        `'${base}' → '${transformed}' (${rule}).`,
        `ما هي الكلمة الصحيحة المشتقة من '${base}'؟ ومعناها: "${meaningAr}".`,
        `'${base}' تتحول إلى '${transformed}' (${rule}).`
      )
    );
  }
  return list;
}

function generateWishIfOnly(count) {
  const rows = [
    { sentence: "I wish I ___ a car.", options: ["had", "have", "having", "has"], correct: "had", ar: "أتمنى لو كان لدي سيارة." },
    { sentence: "I wish I ___ speak French.", options: ["could", "can", "will", "should"], correct: "could", ar: "أتمنى لو كنت أستطيع التحدث بالفرنسية." },
    { sentence: "I wish she ___ here.", options: ["were", "was", "is", "be"], correct: "were", ar: "أتمنى لو كانت هنا." },
    { sentence: "I wish I ___ studied for the exam.", options: ["had", "have", "has", "did"], correct: "had", ar: "أتمنى لو كنت درست للامتحان." },
    { sentence: "I wish he ___ interrupt me.", options: ["wouldn't", "doesn't", "didn't", "won't"], correct: "wouldn't", ar: "أتمنى لو أنه لا يقاطعني." },
    { sentence: "I wish it ___ raining.", options: ["would stop", "stopped", "stops", "will stop"], correct: "would stop", ar: "أتمنى لو توقف المطر." },
    { sentence: "I wish I ___ the answer.", options: ["knew", "know", "known", "knows"], correct: "knew", ar: "أتمنى لو كنت أعرف الإجابة." },
    { sentence: "I wish we ___ missed the flight.", options: ["hadn't", "didn't", "haven't", "wouldn't"], correct: "hadn't", ar: "أتمنى لو أننا لم نفوت الرحلة." },
    { sentence: "I wish I ___ taller.", options: ["were", "am", "was", "be"], correct: "were", ar: "أتمنى لو كنت أطول." },
    { sentence: "I wish she ___ call me.", options: ["would", "will", "can", "does"], correct: "would", ar: "أتمنى لو أنها تتصل بي." },
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const row = rows[i % rows.length];
    list.push(
      withRotatedOptions(
        row.sentence,
        row.options,
        row.correct,
        i,
        `Use 'wish' + past simple/past perfect/'would' to express a present wish, a past regret, or a complaint about someone's behavior.`,
        `أكمل الجملة، ومعناها: "${row.ar}"`,
        "تُستخدم 'wish' + الماضي البسيط/الماضي التام/'would' للتعبير عن أمنية حاضرة، أو ندم على الماضي، أو شكوى من تصرف شخص ما."
      )
    );
  }
  return list;
}

function generateCausative(count) {
  const rows = [
    ["my hair", "cut", "cut", "شعري"],
    ["the car", "repair", "repaired", "السيارة"],
    ["my house", "paint", "painted", "منزلي"],
    ["the windows", "clean", "cleaned", "النوافذ"],
    ["my photo", "take", "taken", "صورتي"],
    ["my teeth", "check", "checked", "أسناني"],
    ["the document", "translate", "translated", "المستند"],
    ["the package", "deliver", "delivered", "الطرد"],
    ["my computer", "fix", "fixed", "حاسوبي"],
    ["the report", "print", "printed", "التقرير"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [object, base, participle, objectAr] = rows[i % rows.length];
    const options = uniqueDistractors(participle, [base, `${base}ing`, `${base}s`, `${base}ed`]);
    options.unshift(participle);
    list.push(
      withRotatedOptions(
        `Complete: 'I had ${object} ___ yesterday.' (verb: '${base}')`,
        options,
        participle,
        i,
        `Causative 'have something done': have + object + past participle (someone else does it for you). '${base}' → '${participle}'.`,
        `أكمل الجملة بالتصريف الثالث الصحيح للفعل '${base}'، عن "${objectAr}".`,
        `تركيب 'have something done': have + المفعول + التصريف الثالث (شخص آخر ينجز الفعل نيابةً عنك). الفعل '${base}' → '${participle}'.`
      )
    );
  }
  return list;
}

function generateLinkingWords(count) {
  const rows = [
    ["___ it was raining, we went out.", "Although", "على الرغم من أنها كانت تمطر، خرجنا."],
    ["___ the rain, we went out.", "Despite", "على الرغم من المطر، خرجنا."],
    ["He studied hard. ___, he failed the exam.", "However", "درس بجد. ومع ذلك، رسب في الامتحان."],
    ["She saved money ___ she could buy a car.", "so that", "ادخرت المال حتى تستطيع شراء سيارة."],
    ["___ he is rich, he is not happy.", "Although", "على الرغم من أنه غني، إلا أنه غير سعيد."],
    ["___ his wealth, he is not happy.", "Despite", "على الرغم من ثروته، إلا أنه غير سعيد."],
    ["It was cold. ___, we enjoyed the trip.", "However", "كان الجو بارداً. ومع ذلك، استمتعنا بالرحلة."],
    ["I left early ___ I wouldn't be late.", "so that", "غادرت مبكراً حتى لا أتأخر."],
  ];
  const options = ["Although", "Despite", "However", "so that"];
  const explanations = {
    Although: "'Although' + subject + verb (a full clause).",
    Despite: "'Despite' + noun/gerund (not a full clause).",
    However: "'However' starts a new sentence to show contrast.",
    "so that": "'so that' + subject + verb shows purpose.",
  };
  const explanationsAr = {
    Although: "'Although' + فاعل + فعل (جملة كاملة).",
    Despite: "'Despite' + اسم أو مصدر (وليست جملة كاملة).",
    However: "'However' تبدأ جملة جديدة للتعبير عن التناقض.",
    "so that": "'so that' + فاعل + فعل تُستخدم للتعبير عن الغرض.",
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = rows[i % rows.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        explanations[correct],
        `أكمل الجملة بأداة الربط الصحيحة، ومعناها: "${sentenceAr}"`,
        explanationsAr[correct]
      )
    );
  }
  return list;
}

const categoryLists = [
  generateSecondConditional(50),
  generatePresentPerfectContinuous(50),
  generatePassiveVariousTenses(50),
  generateReportedQuestionsCommands(40),
  generateModalsOfDeduction(40),
  generateNonDefiningRelativeClauses(30),
  generateThirdConditional(40),
  generateCollocations(40),
  generateAdvancedPhrasalVerbs(40),
  generateWordFormation(40),
  generateWishIfOnly(30),
  generateCausative(30),
  generateLinkingWords(20),
];

const built = buildLevel(categoryLists);
export const questions = built.questions;
export const STAGE_SIZE = built.STAGE_SIZE;
export const TOTAL_STAGES = built.TOTAL_STAGES;

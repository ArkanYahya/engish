// B1 (intermediate) — 500 questions covering present perfect, past continuous,
// conditionals, passive voice, relative clauses, reported speech, phrasal verbs,
// gerunds/infinitives, question tags, used to, and quantifiers.
import { withRotatedOptions, uniqueDistractors, buildLevel } from "./engine.js";

const subjects7 = ["I", "You", "He", "She", "It", "We", "They"];
const thirdPersonSubjects = new Set(["He", "She", "It"]);
const subjectAr = {
  I: "أنا", You: "أنت", He: "هو", She: "هي", It: "هو", We: "نحن", They: "هم",
};

function generatePresentPerfect(count) {
  const verbs = [
    ["go", "gone", "يذهب", "there", "إلى هناك"], ["see", "seen", "يرى", "the movie", "الفيلم"],
    ["eat", "eaten", "يأكل", "breakfast", "الفطور"], ["drink", "drunk", "يشرب", "my coffee", "قهوتي"],
    ["do", "done", "يفعل", "the work", "العمل"], ["make", "made", "يصنع", "dinner", "العشاء"],
    ["take", "taken", "يأخذ", "the exam", "الامتحان"], ["give", "given", "يعطي", "my answer", "إجابتي"],
    ["come", "come", "يأتي", "home", "إلى المنزل"], ["know", "known", "يعرف", "the answer", "الإجابة"],
    ["write", "written", "يكتب", "the report", "التقرير"], ["break", "broken", "يكسر", "the rules", "القواعد"],
    ["speak", "spoken", "يتحدث", "to him", "معه"], ["buy", "bought", "يشتري", "the tickets", "التذاكر"],
    ["find", "found", "يجد", "the keys", "المفاتيح"], ["lose", "lost", "يخسر", "my keys", "مفاتيحي"],
    ["win", "won", "يفوز", "the game", "المباراة"], ["drive", "driven", "يقود", "there", "إلى هناك"],
    ["forget", "forgotten", "ينسى", "his name", "اسمه"], ["wear", "worn", "يرتدي", "that shirt", "ذلك القميص"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [base, participle, verbAr, object, objectAr] = verbs[Math.floor(i / subjects7.length) % verbs.length];
    const isThird = thirdPersonSubjects.has(subject);
    const testHaveHas = i % 2 === 0;

    if (testHaveHas) {
      const correct = isThird ? "has" : "have";
      const options = ["have", "has", "having", "haves"];
      const explanation = isThird
        ? `'${subject}' is he/she/it, so use 'has' + past participle.`
        : `'${subject}' uses 'have' (not 'has') + past participle.`;
      const explanationAr = isThird
        ? `'${subject}' ضمير مفرد (هو/هي)، لذلك تُستخدم 'has' مع التصريف الثالث للفعل.`
        : `'${subject}' تُستخدم مع 'have' (وليس 'has') مع التصريف الثالث للفعل.`;
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ___ already ${participle} ${object}.'`,
          options,
          correct,
          i,
          explanation,
          `أكمل الجملة بالصيغة الصحيحة (have/has)، ومعناها: "${subjectAr[subject]} قد ${verbAr} ${objectAr} بالفعل."`,
          explanationAr
        )
      );
    } else {
      const haveHas = isThird ? "has" : "have";
      const options = uniqueDistractors(participle, [base, `${base}ed`, `${base}ing`, `${base}s`]);
      options.unshift(participle);
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ${haveHas} just ___.' (verb: '${base}')`,
          options,
          participle,
          i,
          `The past participle of '${base}' is '${participle}' — used with have/has in the present perfect.`,
          `أكمل الجملة بالتصريف الثالث الصحيح للفعل '${base}' (${verbAr}).`,
          `التصريف الثالث للفعل '${base}' هو '${participle}' — يُستخدم مع have/has في زمن المضارع التام.`
        )
      );
    }
  }
  return list;
}

function generatePastContinuous(count) {
  const verbs = [
    ["play", "playing", "يلعب"], ["eat", "eating", "يأكل"], ["read", "reading", "يقرأ"], ["write", "writing", "يكتب"],
    ["run", "running", "يجري"], ["swim", "swimming", "يسبح"], ["sleep", "sleeping", "ينام"], ["watch", "watching", "يشاهد"],
    ["cook", "cooking", "يطبخ"], ["dance", "dancing", "يرقص"], ["work", "working", "يعمل"], ["drive", "driving", "يقود"],
    ["study", "studying", "يدرس"], ["talk", "talking", "يتحدث"], ["walk", "walking", "يمشي"],
  ];
  const verbFor = (s) => (["You", "We", "They"].includes(s) ? "were" : "was");

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [base, ing, verbAr] = verbs[Math.floor(i / subjects7.length) % verbs.length];
    const testWasWere = i % 2 === 0;

    if (testWasWere) {
      const correct = verbFor(subject);
      const options = ["was", "were"];
      const explanation =
        correct === "were"
          ? `'${subject}' is plural (or 'you'), so it takes 'were'.`
          : `'${subject}' is singular (I/he/she/it), so it takes 'was'.`;
      const explanationAr =
        correct === "were"
          ? `'${subject}' جمع (أو "أنتَ")، لذلك تُستخدم 'were'.`
          : `'${subject}' مفرد (أنا/هو/هي)، لذلك تُستخدم 'was'.`;
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ___ ${ing} when the phone rang.'`,
          options,
          correct,
          i,
          explanation,
          `أكمل الجملة بالفعل الصحيح (was/were)، ومعناها: "كان ${subjectAr[subject]} ${verbAr} عندما رن الهاتف."`,
          explanationAr
        )
      );
    } else {
      const wasWere = verbFor(subject);
      const options = uniqueDistractors(ing, [`${base}ing`, base, `${base}s`, `${base}ed`]);
      options.unshift(ing);
      list.push(
        withRotatedOptions(
          `Complete: '${subject} ${wasWere} ___ when the phone rang.' (verb: '${base}')`,
          options,
          ing,
          i,
          `Past continuous: was/were + '-ing'. '${base}' → '${ing}'.`,
          `أكمل الجملة بصيغة '-ing' الصحيحة للفعل '${base}' (${verbAr}).`,
          `الماضي المستمر: was/were + '-ing'. الفعل '${base}' يصبح '${ing}'.`
        )
      );
    }
  }
  return list;
}

function generateFirstConditional(count) {
  const rows = [
    ["it rains tomorrow", "stay", "يبقى", "إذا أمطرت غداً"],
    ["you study hard", "pass the exam", "ينجح في الامتحان", "إذا ذاكرت بجد"],
    ["she finishes early", "call", "يتصل", "إذا انتهت مبكراً"],
    ["they arrive late", "miss the bus", "يفوت الحافلة", "إذا وصلوا متأخرين"],
    ["he saves money", "buy a car", "يشتري سيارة", "إذا ادخر المال"],
    ["we don't hurry", "be late", "يتأخر", "إذا لم نسرع"],
    ["you don't eat", "feel hungry", "يشعر بالجوع", "إذا لم تأكل"],
    ["it snows", "close the school", "تُغلق المدرسة", "إذا تساقط الثلج"],
    ["I have time", "help you", "يساعدك", "إذا كان لدي وقت"],
    ["she wins the race", "be happy", "يكون سعيداً", "إذا فازت بالسباق"],
    ["the weather improves", "go to the beach", "يذهب إلى الشاطئ", "إذا تحسن الطقس"],
    ["you press this button", "start the machine", "يشغل الآلة", "إذا ضغطت هذا الزر"],
    ["he doesn't apologize", "stay angry", "يبقى غاضباً", "إذا لم يعتذر"],
    ["they don't leave now", "be late", "يتأخرون", "إذا لم يغادروا الآن"],
    ["I finish my homework", "watch a movie", "يشاهد فيلماً", "إذا أنهيت واجبي"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [ifClause, resultVerb, resultAr, ifClauseAr] = rows[i % rows.length];
    const correct = `will ${resultVerb}`;
    const options = uniqueDistractors(correct, [resultVerb, `${resultVerb}s`, `would ${resultVerb}`, `is ${resultVerb}ing`]);
    options.unshift(correct);
    list.push(
      withRotatedOptions(
        `Complete: 'If ${ifClause}, we ___.' (verb: '${resultVerb}')`,
        options,
        correct,
        i,
        `First conditional: 'if' + present simple, 'will' + base verb — so '${resultVerb}' becomes 'will ${resultVerb}'.`,
        `أكمل الجملة الشرطية بالصيغة الصحيحة، ومعناها: "${ifClauseAr}، سوف ${resultAr}."`,
        `الشرط الأول: 'if' + المضارع البسيط، 'will' + الفعل الأساسي — لذلك '${resultVerb}' تصبح 'will ${resultVerb}'.`
      )
    );
  }
  return list;
}

function generateAsAsComparisons(count) {
  const adjectives = [
    ["tall", "طويل"], ["short", "قصير"], ["fast", "سريع"], ["slow", "بطيء"], ["big", "كبير"],
    ["small", "صغير"], ["old", "قديم"], ["young", "صغير السن"], ["cheap", "رخيص"], ["expensive", "غالي"],
    ["strong", "قوي"], ["heavy", "ثقيل"], ["light", "خفيف"], ["easy", "سهل"], ["difficult", "صعب"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [base, adjAr] = adjectives[i % adjectives.length];
    const correct = `as ${base} as`;
    const options = uniqueDistractors(correct, [`${base}er than`, `more ${base} than`, `as ${base}`, `so ${base} as`]);
    options.unshift(correct);
    list.push(
      withRotatedOptions(
        `Complete: 'This car is ___ that one.' (adjective: '${base}', equal)`,
        options,
        correct,
        i,
        `Use 'as + adjective + as' to say two things are equal.`,
        `أكمل الجملة بصيغة المساواة الصحيحة للصفة '${base}' (${adjAr}).`,
        "استخدم 'as + الصفة + as' للتعبير عن تساوي شيئين."
      )
    );
  }
  return list;
}

function generateModalAdviceOrPossibility(count) {
  const adviceRows = [
    ["You look tired. You ___ get some rest.", "should", "أنت تبدو متعباً. يجب أن تحصل على قسط من الراحة."],
    ["Your room is messy. You ___ clean it.", "should", "غرفتك فوضوية. يجب أن تنظفها."],
    ["You have a headache. You ___ take a break.", "should", "لديك صداع. يجب أن تأخذ استراحة."],
    ["The test is tomorrow. You ___ study tonight.", "should", "الاختبار غداً. يجب أن تدرس الليلة."],
    ["You feel sick. You ___ see a doctor.", "should", "أنت تشعر بالمرض. يجب أن تذهب إلى الطبيب."],
    ["Your car is broken. You ___ fix it soon.", "should", "سيارتك معطلة. يجب أن تصلحها قريباً."],
    ["You are hungry. You ___ eat something.", "should", "أنت جائع. يجب أن تأكل شيئاً."],
    ["It's cold outside. You ___ wear a coat.", "should", "الجو بارد بالخارج. يجب أن ترتدي معطفاً."],
    ["You have a job interview. You ___ prepare well.", "should", "لديك مقابلة عمل. يجب أن تستعد جيداً."],
    ["Your English needs work. You ___ practice more.", "should", "إنجليزيتك تحتاج إلى تحسين. يجب أن تتدرب أكثر."],
  ];
  const possibilityRows = [
    ["I'm not sure, but it ___ rain later.", "might", "لست متأكداً، لكن قد تمطر لاحقاً."],
    ["She ___ be at home — I'm not certain.", "might", "قد تكون في المنزل — لست متأكداً."],
    ["We ___ go to the beach if the weather is good.", "might", "قد نذهب إلى الشاطئ إذا كان الجو جيداً."],
    ["He ___ come to the party — he hasn't decided.", "might", "قد يأتي إلى الحفلة — لم يقرر بعد."],
    ["They ___ arrive late — the traffic is bad.", "might", "قد يصلون متأخرين — الازدحام سيء."],
    ["It ___ snow tonight, according to the forecast.", "might", "قد تتساقط الثلوج الليلة، وفقاً للتوقعات."],
    ["I ___ take the later train instead.", "might", "قد آخذ القطار المتأخر بدلاً من ذلك."],
    ["She ___ know the answer — let's ask her.", "might", "قد تعرف الإجابة — لنسألها."],
    ["We ___ need more time to finish.", "might", "قد نحتاج إلى مزيد من الوقت لننهي."],
    ["He ___ be tired after the long trip.", "might", "قد يكون متعباً بعد الرحلة الطويلة."],
  ];
  const adviceOptions = ["should", "must", "can", "will"];
  const possibilityOptions = ["might", "must", "should", "will"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const isAdvice = i % 2 === 0;
    const rows = isAdvice ? adviceRows : possibilityRows;
    const [sentence, correct, sentenceAr] = rows[Math.floor(i / 2) % rows.length];
    const options = isAdvice ? adviceOptions : possibilityOptions;
    const explanation = isAdvice
      ? `Use 'should' to give advice.`
      : `Use 'might' (or 'could') to talk about possibility — something that isn't certain.`;
    const explanationAr = isAdvice
      ? "استخدم 'should' لتقديم النصيحة."
      : "استخدم 'might' (أو 'could') للتعبير عن الاحتمال — شيء غير مؤكد.";
    list.push(withRotatedOptions(sentence, options, correct, i, explanation, `أكمل الجملة، ومعناها: "${sentenceAr}"`, explanationAr));
  }
  return list;
}

function generatePassiveVoice(count) {
  const rows = [
    ["Tom", "توم", "write", "written", "the letter", "الرسالة", "كُتبت"],
    ["Maria", "ماريا", "clean", "cleaned", "the house", "المنزل", "نُظف"],
    ["the workers", "العمال", "build", "built", "the bridge", "الجسر", "بُني"],
    ["the chef", "الطاهي", "cook", "cooked", "the meal", "الوجبة", "طُهيت"],
    ["the teacher", "المعلم", "check", "checked", "the homework", "الواجب", "رُوجع"],
    ["the artist", "الفنان", "paint", "painted", "the picture", "اللوحة", "رُسمت"],
    ["the company", "الشركة", "make", "made", "the product", "المنتج", "صُنع"],
    ["the police", "الشرطة", "catch", "caught", "the thief", "اللص", "قُبض عليه"],
    ["the students", "الطلاب", "break", "broken", "the window", "النافذة", "كُسرت"],
    ["the author", "المؤلف", "publish", "published", "the book", "الكتاب", "نُشر"],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [agent, agentAr, base, participle, object, objectAr, participleAr] = rows[i % rows.length];
    const correct = `was ${participle}`;
    const options = uniqueDistractors(correct, [`is ${participle}`, `was ${base}ed`, `were ${participle}`, `was ${base}`]);
    options.unshift(correct);
    list.push(
      withRotatedOptions(
        `Complete the passive sentence: '${object[0].toUpperCase()}${object.slice(1)} ___ by ${agent}.' (verb: '${base}')`,
        options,
        correct,
        i,
        `Passive voice: object + was/were + past participle (+ by + agent). '${base}' → past participle '${participle}'.`,
        `أكمل الجملة بصيغة المبني للمجهول الصحيحة، ومعناها: "${objectAr} ${participleAr} بواسطة ${agentAr}."`,
        `المبني للمجهول: المفعول + was/were + التصريف الثالث (+ by + الفاعل). الفعل '${base}' → التصريف الثالث '${participle}'.`
      )
    );
  }
  return list;
}

function generateRelativeClauses(count) {
  const rows = [
    ["The man ___ lives next door is a doctor.", "who", "الرجل الذي يسكن بجانبنا طبيب."],
    ["The book ___ I read was amazing.", "which", "الكتاب الذي قرأته كان رائعاً."],
    ["This is the restaurant ___ we had dinner.", "where", "هذا هو المطعم الذي تناولنا فيه العشاء."],
    ["The woman ___ called you is my sister.", "who", "المرأة التي اتصلت بك هي أختي."],
    ["I lost the keys ___ you gave me.", "which", "فقدت المفاتيح التي أعطيتني إياها."],
    ["That's the school ___ I studied.", "where", "هذه هي المدرسة التي درست فيها."],
    ["The people ___ live here are friendly.", "who", "الأشخاص الذين يعيشون هنا ودودون."],
    ["The car ___ he bought is expensive.", "which", "السيارة التي اشتراها غالية."],
    ["This is the park ___ we play football.", "where", "هذه هي الحديقة التي نلعب فيها كرة القدم."],
    ["The doctor ___ treated me was kind.", "who", "الطبيب الذي عالجني كان لطيفاً."],
  ];
  const options = ["who", "which", "where", "that"];
  const explanations = {
    who: "'who' refers to people.",
    which: "'which' refers to things.",
    where: "'where' refers to places.",
  };
  const explanationsAr = {
    who: "'who' تشير إلى الأشخاص.",
    which: "'which' تشير إلى الأشياء.",
    where: "'where' تشير إلى الأماكن.",
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
        `أكمل الجملة بأداة الوصل الصحيحة (who/which/where)، ومعناها: "${sentenceAr}"`,
        explanationsAr[correct]
      )
    );
  }
  return list;
}

function generateReportedSpeech(count) {
  const rows = [
    ["She said (that) she ___ tired.", ["was", "is", "am", "be"], "was", "قالت إنها كانت متعبة."],
    ["He said (that) he ___ coffee.", ["liked", "likes", "like", "liking"], "liked", "قال إنه يحب القهوة."],
    ["She said (that) she ___ TV.", ["was watching", "is watching", "watches", "watched"], "was watching", "قالت إنها كانت تشاهد التلفاز."],
    ["He said (that) he ___ finished.", ["had", "has", "have", "was"], "had", "قال إنه قد انتهى."],
    ["She said (that) she ___ call him.", ["would", "will", "can", "should"], "would", "قالت إنها ستتصل به."],
    ["He said (that) he ___ swim.", ["could", "can", "will", "should"], "could", "قال إنه يستطيع السباحة."],
    ["She said (that) she ___ home.", ["had gone", "has gone", "goes", "was going"], "had gone", "قالت إنها ذهبت إلى المنزل."],
    ["He said (that) he ___ here.", ["worked", "works", "working", "work"], "worked", "قال إنه يعمل هنا."],
    ["She said (that) she ___ know.", ["didn't", "doesn't", "don't", "not"], "didn't", "قالت إنها لا تعرف."],
    ["He said (that) he ___ happy.", ["was", "is", "am", "be"], "was", "قال إنه كان سعيداً."],
  ];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, options, correct, sentenceAr] = rows[i % rows.length];
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        `In reported speech, present tense usually shifts back to past tense: → '${correct}'.`,
        `أكمل جملة الكلام المنقول بالصيغة الصحيحة، ومعناها: "${sentenceAr}"`,
        `في الكلام المنقول (reported speech)، يتحول الفعل من المضارع إلى الماضي عادةً: ← '${correct}'.`
      )
    );
  }
  return list;
}

function generatePhrasalVerbs(count) {
  const rows = [
    ["give up", "stop trying", "يستسلم", "Don't give up on your dreams."],
    ["look after", "take care of", "يعتني بـ", "Can you look after my dog?"],
    ["find out", "discover", "يكتشف", "I need to find out the truth."],
    ["turn off", "switch off", "يطفئ", "Please turn off the lights."],
    ["turn on", "switch on", "يشغّل", "Turn on the TV, please."],
    ["put off", "postpone", "يؤجل", "We had to put off the meeting."],
    ["pick up", "collect", "يلتقط أو يستلم", "I'll pick up the kids from school."],
    ["run out of", "have no more of", "ينفد منه", "We ran out of milk."],
    ["get up", "rise from bed", "يستيقظ", "I get up at 7 am."],
    ["look for", "search for", "يبحث عن", "I'm looking for my keys."],
    ["carry on", "continue", "يستمر", "Carry on with your work."],
    ["break down", "stop working (a machine)", "يتعطل", "My car broke down."],
    ["set up", "establish", "يؤسس", "They set up a new company."],
    ["take off", "leave the ground (a plane)", "تُقلع", "The plane will take off soon."],
    ["work out", "exercise or solve", "يتمرن أو يحل", "I work out every morning."],
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

function generateGerundsInfinitives(count) {
  const gerundVerbs = [
    ["enjoy", "يستمتع بـ"], ["avoid", "يتجنب"], ["finish", "ينهي"], ["suggest", "يقترح"], ["mind", "يمانع"],
    ["practice", "يتدرب"], ["consider", "يفكر في"], ["imagine", "يتخيل"], ["keep", "يستمر في"], ["quit", "يترك"],
  ];
  const infinitiveVerbs = [
    ["want", "يريد"], ["decide", "يقرر"], ["plan", "يخطط"], ["hope", "يأمل"], ["promise", "يعد"],
    ["agree", "يوافق"], ["refuse", "يرفض"], ["learn", "يتعلم"], ["offer", "يعرض"], ["need", "يحتاج"],
  ];
  const activities = [
    ["swim", "swimming", "يسبح"], ["read", "reading", "يقرأ"], ["dance", "dancing", "يرقص"], ["cook", "cooking", "يطبخ"],
    ["travel", "travelling", "يسافر"], ["study", "studying", "يدرس"], ["help", "helping", "يساعد"],
    ["write", "writing", "يكتب"], ["sing", "singing", "يغني"], ["run", "running", "يجري"],
  ];
  const rows = [...gerundVerbs.map((v) => [...v, true]), ...infinitiveVerbs.map((v) => [...v, false])];

  const list = [];
  for (let i = 0; i < count; i++) {
    const [precedingVerb, precedingAr, requiresGerund] = rows[i % rows.length];
    const [base, ing, activityAr] = activities[Math.floor(i / rows.length) % activities.length];
    const correct = requiresGerund ? ing : `to ${base}`;
    const candidates = [base, ing, `to ${base}`, `${base}ed`];
    const options = uniqueDistractors(correct, candidates);
    options.unshift(correct);
    const explanation = requiresGerund
      ? `'${precedingVerb}' is followed by the '-ing' form (gerund).`
      : `'${precedingVerb}' is followed by 'to' + base verb (infinitive).`;
    const explanationAr = requiresGerund
      ? `'${precedingVerb}' (${precedingAr}) يليها الفعل بصيغة '-ing' (المصدر الفعلي).`
      : `'${precedingVerb}' (${precedingAr}) يليها 'to' + الفعل الأساسي (المصدر).`;
    list.push(
      withRotatedOptions(
        `Complete: 'I ${precedingVerb} ___.' (activity: '${base}')`,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بالصيغة الصحيحة بعد '${precedingVerb}' (${precedingAr})، عن نشاط '${activityAr}'.`,
        explanationAr
      )
    );
  }
  return list;
}

function generateQuestionTags(count) {
  const rows = [
    ["You are a teacher, ___?", "aren't you", "أنت معلم، أليس كذلك؟"],
    ["She is not here, ___?", "is she", "هي ليست هنا، أليس كذلك؟"],
    ["They can swim, ___?", "can't they", "يستطيعون السباحة، أليس كذلك؟"],
    ["He doesn't like tea, ___?", "does he", "هو لا يحب الشاي، أليس كذلك؟"],
    ["We have finished, ___?", "haven't we", "لقد انتهينا، أليس كذلك؟"],
    ["You didn't call me, ___?", "did you", "أنت لم تتصل بي، أليس كذلك؟"],
    ["It is raining, ___?", "isn't it", "إنها تمطر، أليس كذلك؟"],
    ["She will come, ___?", "won't she", "ستأتي، أليس كذلك؟"],
    ["They aren't ready, ___?", "are they", "هم ليسوا جاهزين، أليس كذلك؟"],
    ["He can't drive, ___?", "can he", "لا يستطيع القيادة، أليس كذلك؟"],
  ];
  const allTags = rows.map((r) => r[1]);

  const list = [];
  for (let i = 0; i < count; i++) {
    const [sentence, correct, sentenceAr] = rows[i % rows.length];
    const options = [correct];
    let offset = 2;
    while (options.length < 4) {
      const candidate = allTags[(i + offset) % allTags.length];
      if (candidate !== correct && !options.includes(candidate)) options.push(candidate);
      offset += 3;
    }
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        `Question tags flip polarity: a positive statement takes a negative tag and vice versa. '${correct}' matches the subject and verb here.`,
        `أكمل السؤال المذيل بالصيغة الصحيحة، ومعناها: "${sentenceAr}"`,
        "أسئلة التذييل تعكس الصيغة: الجملة المثبتة تأخذ تذييلاً منفياً والعكس صحيح، مع مطابقة الفاعل والفعل."
      )
    );
  }
  return list;
}

function generateUsedTo(count) {
  const activities = [
    ["play football", "يلعب كرة القدم"], ["smoke", "يدخن"], ["live in Cairo", "يعيش في القاهرة"],
    ["have long hair", "لديه شعر طويل"], ["eat meat", "يأكل اللحم"], ["ride a bike to school", "يركب الدراجة إلى المدرسة"],
    ["watch cartoons", "يشاهد الرسوم المتحركة"], ["collect stamps", "يجمع الطوابع"],
    ["work as a teacher", "يعمل كمعلم"], ["wear glasses", "يرتدي نظارة"],
  ];

  const wasWereFor = (s) => (["You", "We", "They"].includes(s) ? "were" : "was");
  const wasWereAr = { I: "كنت", You: "كنت", He: "كان", She: "كانت", It: "كان", We: "كنا", They: "كانوا" };

  const list = [];
  for (let i = 0; i < count; i++) {
    const subject = subjects7[i % subjects7.length];
    const [activity, activityAr] = activities[Math.floor(i / subjects7.length) % activities.length];
    const subjectLower = subject === "I" ? "I" : subject.toLowerCase();
    const wasWere = wasWereFor(subject);
    const correct = `used to ${activity}`;
    const options = [correct, `use to ${activity}`, `used ${activity}`, `am used to ${activity}`];
    list.push(
      withRotatedOptions(
        `Complete: 'When ${subject} ${wasWere} young, ${subjectLower} ___.' (activity: '${activity}')`,
        options,
        correct,
        i,
        `'used to' + base verb describes a past habit that isn't true now.`,
        `أكمل الجملة بالصيغة الصحيحة، ومعناها: "عندما ${wasWereAr[subject]} ${subjectAr[subject]} صغيراً، كان ${activityAr}."`,
        "'used to' + الفعل الأساسي تصف عادة في الماضي لم تعد صحيحة الآن."
      )
    );
  }
  return list;
}

function generateQuantifiers(count) {
  const countableNouns = [
    ["books", "كتب"], ["friends", "أصدقاء"], ["people", "أشخاص"], ["cars", "سيارات"], ["students", "طلاب"],
  ];
  const uncountableNouns = [
    ["water", "ماء"], ["time", "وقت"], ["money", "مال"], ["information", "معلومات"], ["sugar", "سكر"],
  ];
  const options = ["many", "much", "a few", "a little"];

  const list = [];
  for (let i = 0; i < count; i++) {
    const isCountable = i % 2 === 0;
    const nouns = isCountable ? countableNouns : uncountableNouns;
    const [noun, nounAr] = nouns[Math.floor(i / 2) % nouns.length];
    const isLargeQuantity = Math.floor(i / (2 * nouns.length)) % 2 === 0;
    const correct = isLargeQuantity ? (isCountable ? "many" : "much") : isCountable ? "a few" : "a little";
    const beVerb = isCountable ? "are" : "is";
    const sentence = isLargeQuantity
      ? `Complete: 'There ${beVerb} ___ ${noun}.'`
      : `Complete: 'There ${beVerb} only ___ ${noun}.'`;
    const explanation = isCountable
      ? `'${correct}' is used with countable (plural) nouns.`
      : `'${correct}' is used with uncountable nouns.`;
    const explanationAr = isCountable
      ? `'${correct}' تُستخدم مع الأسماء المعدودة (الجمع).`
      : `'${correct}' تُستخدم مع الأسماء غير المعدودة.`;
    list.push(
      withRotatedOptions(
        sentence,
        options,
        correct,
        i,
        explanation,
        `أكمل الجملة بمحدد الكمية الصحيح، عن "${nounAr}".`,
        explanationAr
      )
    );
  }
  return list;
}

const categoryLists = [
  generatePresentPerfect(60),
  generatePastContinuous(50),
  generateFirstConditional(50),
  generateAsAsComparisons(30),
  generateModalAdviceOrPossibility(40),
  generatePassiveVoice(40),
  generateRelativeClauses(40),
  generateReportedSpeech(40),
  generatePhrasalVerbs(40),
  generateGerundsInfinitives(30),
  generateQuestionTags(30),
  generateUsedTo(30),
  generateQuantifiers(20),
];

const built = buildLevel(categoryLists);
export const questions = built.questions;
export const STAGE_SIZE = built.STAGE_SIZE;
export const TOTAL_STAGES = built.TOTAL_STAGES;

// B2 grammar reference — the counterpart to b2-vocabulary.js, and the study-side of what
// levels/b2.js already quizzes: each topic here matches one of that file's question
// generators, restated as a plain-English rule with example sentences.

export const GRAMMAR = [
  {
    topic: "Second Conditional",
    topicAr: "الجملة الشرطية الثانية",
    rule: "Use 'if' + past simple, + 'would' + base verb to talk about an unreal or unlikely present/future situation and its imagined result.",
    ruleAr: "استخدم 'if' + الماضي البسيط، + 'would' + الفعل الأساسي للحديث عن موقف غير حقيقي أو غير مرجح في الحاضر أو المستقبل ونتيجته المتخيلة.",
    examples: [
      { en: "If I had more time, I would learn painting.", ar: "لو كان لدي وقت أكثر، لتعلمت الرسم." },
      { en: "If she won the lottery, she would travel the world.", ar: "لو فازت باليانصيب، لسافرت حول العالم." },
      { en: "I would help you if I knew how.", ar: "كنت سأساعدك لو عرفت كيف." },
    ],
  },
  {
    topic: "Present Perfect Continuous",
    topicAr: "المضارع التام المستمر",
    rule: "Use have/has been + verb-ing for an action that started in the past and is still continuing, often with emphasis on duration.",
    ruleAr: "استخدم have/has been + صيغة -ing للفعل للتعبير عن فعل بدأ في الماضي وما زال مستمرًا، غالبًا مع التركيز على المدة.",
    examples: [
      { en: "I have been studying for three hours.", ar: "أدرس منذ ثلاث ساعات." },
      { en: "She has been working here since 2019.", ar: "تعمل هنا منذ عام ٢٠١٩." },
      { en: "They have been waiting for the bus.", ar: "ينتظرون الحافلة." },
    ],
  },
  {
    topic: "Passive Voice (Various Tenses)",
    topicAr: "المبني للمجهول (أزمنة متعددة)",
    rule: "The passive (be + past participle) can be used across different tenses — present, past, future, and perfect — to shift focus from who did the action to what happened.",
    ruleAr: "يمكن استخدام المبني للمجهول (be + التصريف الثالث) عبر أزمنة مختلفة — المضارع والماضي والمستقبل والتام — لتحويل التركيز من فاعل الحدث إلى الحدث نفسه.",
    examples: [
      { en: "The report is being reviewed right now.", ar: "التقرير قيد المراجعة الآن." },
      { en: "The bridge will be finished next year.", ar: "سيتم الانتهاء من الجسر العام القادم." },
      { en: "The documents have been signed.", ar: "تم توقيع المستندات." },
    ],
  },
  {
    topic: "Reported Questions & Commands",
    topicAr: "الأسئلة والأوامر المنقولة",
    rule: "Reported questions drop the question word order (use if/whether for yes/no questions); reported commands use 'told/asked' + object + to-infinitive.",
    ruleAr: "الأسئلة المنقولة تفقد ترتيب جملة السؤال (استخدم if/whether لأسئلة نعم/لا)؛ الأوامر المنقولة تستخدم 'told/asked' + المفعول به + to + الفعل.",
    examples: [
      { en: "\"Where do you live?\" → He asked where I lived.", ar: "\"أين تعيش؟\" ← سألني أين أعيش." },
      { en: "\"Are you coming?\" → She asked if I was coming.", ar: "\"هل أنت قادم؟\" ← سألتني إن كنت قادمًا." },
      { en: "\"Close the door,\" he said. → He told me to close the door.", ar: "\"أغلق الباب،\" قال. ← طلب مني أن أغلق الباب." },
    ],
  },
  {
    topic: "Modals of Deduction",
    topicAr: "أفعال الاستنتاج",
    rule: "Use must for a confident conclusion, might/could for a possibility, and can't for something you're sure is untrue — all based on evidence, not fact.",
    ruleAr: "استخدم must لاستنتاج واثق، وmight/could لاحتمال، وcan't لشيء أنت متأكد أنه غير صحيح — كلها بناءً على دليل وليس حقيقة مؤكدة.",
    examples: [
      { en: "She isn't answering — she must be asleep.", ar: "لا تجيب — لا بد أنها نائمة." },
      { en: "He might be stuck in traffic.", ar: "ربما يكون عالقًا في الازدحام المروري." },
      { en: "That can't be true — I just saw him yesterday.", ar: "لا يمكن أن يكون هذا صحيحًا — لقد رأيته أمس فقط." },
    ],
  },
  {
    topic: "Non-defining Relative Clauses",
    topicAr: "الجمل الموصولة غير التوضيحية",
    rule: "Set off with commas, these clauses add extra (removable) information about something already fully identified — unlike defining clauses, they never use 'that'.",
    ruleAr: "هذه الجمل تُفصل بفواصل وتضيف معلومة إضافية (يمكن حذفها) عن شيء محدد بالفعل — بخلاف الجمل التوضيحية، لا تستخدم أبدًا 'that'.",
    examples: [
      { en: "My brother, who lives in Paris, is visiting us.", ar: "أخي، الذي يعيش في باريس، يزورنا." },
      { en: "The Nile, which is the longest river in Africa, flows through Egypt.", ar: "النيل، وهو أطول نهر في أفريقيا، يمر عبر مصر." },
      { en: "This report, which took weeks to finish, was well received.", ar: "هذا التقرير، الذي استغرق أسابيع لإنجازه، لاقى استحسانًا." },
    ],
  },
  {
    topic: "Third Conditional",
    topicAr: "الجملة الشرطية الثالثة",
    rule: "Use 'if' + past perfect, + 'would have' + past participle to talk about an unreal past situation and how it would have turned out differently.",
    ruleAr: "استخدم 'if' + الماضي التام، + 'would have' + التصريف الثالث للفعل للحديث عن موقف ماضٍ غير حقيقي وكيف كانت نتيجته ستختلف.",
    examples: [
      { en: "If I had studied harder, I would have passed.", ar: "لو كنت درست بجد أكثر، لكنت نجحت." },
      { en: "She would have called if she had known.", ar: "كانت ستتصل لو علمت." },
      { en: "If they had left earlier, they wouldn't have missed the flight.", ar: "لو غادروا مبكرًا، لما فاتتهم الرحلة." },
    ],
  },
  {
    topic: "Collocations",
    topicAr: "التلازم اللفظي",
    rule: "Some words naturally combine in fixed pairs (make a decision, heavy rain, take a risk) — these can't be guessed word-by-word and need to be learned as chunks.",
    ruleAr: "بعض الكلمات تتلازم بشكل طبيعي في أزواج ثابتة (make a decision، heavy rain، take a risk) — لا يمكن تخمينها كلمة بكلمة، ويجب تعلمها كوحدات.",
    examples: [
      { en: "I need to make a decision by tomorrow.", ar: "أحتاج إلى اتخاذ قرار بحلول الغد." },
      { en: "There was heavy rain all weekend.", ar: "كانت هناك أمطار غزيرة طوال نهاية الأسبوع." },
      { en: "He took a risk by investing his savings.", ar: "خاطر باستثمار مدخراته." },
    ],
  },
  {
    topic: "Advanced Phrasal Verbs",
    topicAr: "أفعال مركبة متقدمة",
    rule: "Beyond basic phrasal verbs, B2 learners meet three-part and more idiomatic ones whose meaning is rarely obvious from the individual words.",
    ruleAr: "بعد الأفعال المركبة الأساسية، يتعرف متعلمو المستوى B2 على أفعال مركبة من ثلاثة أجزاء أو أكثر اصطلاحية، حيث نادرًا ما يكون المعنى واضحًا من الكلمات المفردة.",
    examples: [
      { en: "She came up with a great idea.", ar: "توصلت إلى فكرة رائعة." },
      { en: "We need to look into this problem.", ar: "نحتاج إلى النظر بعمق في هذه المشكلة." },
      { en: "He put up with the noise for years.", ar: "تحمّل الضوضاء لسنوات." },
    ],
  },
  {
    topic: "Word Formation",
    topicAr: "تكوين الكلمات",
    rule: "Prefixes and suffixes change a word's meaning or part of speech — like un- for opposites, or -ness/-tion to turn adjectives/verbs into nouns.",
    ruleAr: "السوابق واللواحق تغيّر معنى الكلمة أو نوعها اللغوي — مثل un- للمعنى المعاكس، أو -ness/-tion لتحويل الصفات/الأفعال إلى أسماء.",
    examples: [
      { en: "His decision was unfair to everyone.", ar: "كان قراره غير عادل تجاه الجميع." },
      { en: "Her happiness was obvious to everyone.", ar: "كانت سعادتها واضحة للجميع." },
      { en: "The organization was a success.", ar: "كان التنظيم ناجحًا." },
    ],
  },
  {
    topic: "Wish / If Only",
    topicAr: "wish / if only",
    rule: "Use 'wish' or 'if only' + past simple for a present situation you want to be different, and + past perfect for regret about the past.",
    ruleAr: "استخدم 'wish' أو 'if only' + الماضي البسيط للتعبير عن موقف حالي تتمنى أن يكون مختلفًا، و+ الماضي التام للتعبير عن الندم على أمر في الماضي.",
    examples: [
      { en: "I wish I had more free time.", ar: "أتمنى لو كان لدي وقت فراغ أكثر." },
      { en: "If only she lived closer.", ar: "ليتها تعيش أقرب." },
      { en: "I wish I had told him the truth.", ar: "أتمنى لو كنت أخبرته الحقيقة." },
    ],
  },
  {
    topic: "Causative (have/get something done)",
    topicAr: "صيغة السببية (have/get something done)",
    rule: "Use have/get + object + past participle to say someone else did something for you, rather than doing it yourself.",
    ruleAr: "استخدم have/get + المفعول به + التصريف الثالث للفعل للتعبير عن أن شخصًا آخر قام بشيء نيابةً عنك، بدلاً من قيامك به بنفسك.",
    examples: [
      { en: "I had my car repaired yesterday.", ar: "أصلحت سيارتي (بواسطة شخص آخر) أمس." },
      { en: "She is getting her hair cut this afternoon.", ar: "ستقص شعرها (عند الحلاق) بعد ظهر اليوم." },
      { en: "We had the house painted last month.", ar: "طلينا المنزل (بواسطة عمّال) الشهر الماضي." },
    ],
  },
  {
    topic: "Linking Words",
    topicAr: "أدوات الربط",
    rule: "Words like however, although, therefore, and in addition connect ideas across sentences to show contrast, result, or extra information.",
    ruleAr: "كلمات مثل however وalthough وtherefore وin addition تربط الأفكار بين الجمل لإظهار التناقض أو النتيجة أو معلومة إضافية.",
    examples: [
      { en: "It was raining; however, we still went out.", ar: "كانت السماء تمطر؛ ومع ذلك، خرجنا." },
      { en: "Although he was tired, he finished the work.", ar: "رغم أنه كان متعبًا، أنهى العمل." },
      { en: "The plan failed; therefore, we need a new one.", ar: "فشلت الخطة؛ لذلك، نحتاج إلى خطة جديدة." },
    ],
  },
];

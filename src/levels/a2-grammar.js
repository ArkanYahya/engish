// A2 grammar reference — the counterpart to a2-vocabulary.js, and the study-side of what
// levels/a2.js already quizzes: each topic here matches one of that file's question
// generators, restated as a plain-English rule with example sentences.

export const GRAMMAR = [
  {
    topic: "Past Simple: Regular Verbs",
    topicAr: "الماضي البسيط: الأفعال المنتظمة",
    rule: "Add -ed to the base verb to form the past simple of regular verbs. Spelling can change: 'y' becomes 'ied', and some short verbs double the last letter.",
    ruleAr: "أضف -ed إلى الفعل الأساسي لتكوين الماضي البسيط للأفعال المنتظمة. قد يتغير الإملاء: 'y' تصبح 'ied'، وبعض الأفعال القصيرة تُضاعف حرفها الأخير.",
    examples: [
      { en: "I played football yesterday.", ar: "لعبت كرة القدم أمس." },
      { en: "She studied all night.", ar: "درست طوال الليل." },
      { en: "They stopped at the shop.", ar: "توقفوا عند المحل." },
    ],
  },
  {
    topic: "Past Simple: Irregular Verbs",
    topicAr: "الماضي البسيط: الأفعال الشاذة",
    rule: "Many common verbs don't take -ed — they have their own past form that you have to learn by heart, like 'go' → 'went' and 'eat' → 'ate'.",
    ruleAr: "الكثير من الأفعال الشائعة لا تأخذ -ed — بل لها صيغة ماضٍ خاصة يجب حفظها، مثل 'go' → 'went' و'eat' → 'ate'.",
    examples: [
      { en: "I went to the market.", ar: "ذهبت إلى السوق." },
      { en: "He saw an old friend.", ar: "رأى صديقًا قديمًا." },
      { en: "We had a great time.", ar: "قضينا وقتًا رائعًا." },
    ],
  },
  {
    topic: "Present Continuous",
    topicAr: "المضارع المستمر",
    rule: "Use am/is/are + the verb's -ing form for actions happening right now.",
    ruleAr: "استخدم am/is/are + صيغة -ing للفعل للتعبير عن أفعال تحدث الآن.",
    examples: [
      { en: "I am reading a book right now.", ar: "أنا أقرأ كتابًا الآن." },
      { en: "She is cooking dinner.", ar: "هي تطبخ العشاء." },
      { en: "They are watching a movie.", ar: "هم يشاهدون فيلمًا." },
    ],
  },
  {
    topic: "Comparative Adjectives",
    topicAr: "صيغة المقارنة للصفات",
    rule: "Add -er to short adjectives (or 'more' before longer ones) followed by 'than' to compare two things.",
    ruleAr: "أضف -er للصفات القصيرة (أو 'more' قبل الصفات الطويلة) متبوعة بـ 'than' لمقارنة شيئين.",
    examples: [
      { en: "This car is faster than that one.", ar: "هذه السيارة أسرع من تلك." },
      { en: "She is more careful than her brother.", ar: "هي أكثر حذرًا من أخيها." },
      { en: "Today is colder than yesterday.", ar: "اليوم أبرد من أمس." },
    ],
  },
  {
    topic: "Superlative Adjectives",
    topicAr: "صيغة التفضيل المطلق للصفات",
    rule: "Use 'the' + adjective + -est (or 'the most' + longer adjectives) to say something is the highest degree in a group.",
    ruleAr: "استخدم 'the' + الصفة + -est (أو 'the most' + الصفات الطويلة) للتعبير عن أعلى درجة في مجموعة.",
    examples: [
      { en: "This is the tallest building in the city.", ar: "هذا هو أطول مبنى في المدينة." },
      { en: "She is the most talented singer in the show.", ar: "هي المغنية الأكثر موهبة في العرض." },
      { en: "That was the easiest exam ever.", ar: "كان ذلك أسهل امتحان على الإطلاق." },
    ],
  },
  {
    topic: "Some / Any",
    topicAr: "some / any",
    rule: "Use 'some' in positive sentences and 'any' in questions and negative sentences, with both countable and uncountable nouns.",
    ruleAr: "استخدم 'some' في الجمل المثبتة و'any' في الأسئلة والجمل المنفية، مع الأسماء المعدودة وغير المعدودة.",
    examples: [
      { en: "I have some money with me.", ar: "معي بعض المال." },
      { en: "Do you have any questions?", ar: "هل لديك أي أسئلة؟" },
      { en: "There isn't any milk in the fridge.", ar: "لا يوجد حليب في الثلاجة." },
    ],
  },
  {
    topic: "Can / Can't",
    topicAr: "can / can't",
    rule: "Use 'can' + base verb for ability or permission, and 'can't' for the negative. 'Can' never changes with the subject.",
    ruleAr: "استخدم 'can' + الفعل الأساسي للتعبير عن القدرة أو الإذن، و'can't' للنفي. 'can' لا يتغير أبدًا مع الفاعل.",
    examples: [
      { en: "I can speak two languages.", ar: "أستطيع التحدث بلغتين." },
      { en: "She can't drive yet.", ar: "لا تستطيع القيادة بعد." },
      { en: "Can you help me with this?", ar: "هل يمكنك مساعدتي في هذا؟" },
    ],
  },
  {
    topic: "Have to / Has to",
    topicAr: "have to / has to",
    rule: "Use 'have to' with I/you/we/they and 'has to' with he/she/it to talk about obligation — something is necessary.",
    ruleAr: "استخدم 'have to' مع I/you/we/they و'has to' مع he/she/it للتعبير عن الإلزام — أن شيئًا ما ضروري.",
    examples: [
      { en: "I have to wake up early tomorrow.", ar: "يجب أن أستيقظ مبكرًا غدًا." },
      { en: "She has to finish her report today.", ar: "يجب أن تنهي تقريرها اليوم." },
      { en: "We have to wear a uniform at school.", ar: "يجب أن نرتدي زيًا موحدًا في المدرسة." },
    ],
  },
  {
    topic: "Going to (Future Plans)",
    topicAr: "going to (الخطط المستقبلية)",
    rule: "Use am/is/are + going to + base verb to talk about plans and intentions already decided.",
    ruleAr: "استخدم am/is/are + going to + الفعل الأساسي للحديث عن خطط ونوايا تم تحديدها مسبقًا.",
    examples: [
      { en: "I am going to visit my family this weekend.", ar: "سأزور عائلتي في نهاية هذا الأسبوع." },
      { en: "He is going to start a new job.", ar: "سيبدأ وظيفة جديدة." },
      { en: "They are going to travel to Spain.", ar: "سيسافرون إلى إسبانيا." },
    ],
  },
  {
    topic: "Prepositions of Time",
    topicAr: "حروف الجر الزمنية",
    rule: "Use 'at' for exact times, 'on' for days and dates, and 'in' for months, years, seasons, and parts of the day.",
    ruleAr: "استخدم 'at' للأوقات المحددة، و'on' للأيام والتواريخ، و'in' للأشهر والسنوات والفصول وأجزاء اليوم.",
    examples: [
      { en: "The train leaves at 7 o'clock.", ar: "يغادر القطار في الساعة السابعة." },
      { en: "We are meeting on Friday.", ar: "سنلتقي يوم الجمعة." },
      { en: "School starts in September.", ar: "تبدأ المدرسة في سبتمبر." },
    ],
  },
  {
    topic: "Adverbs of Frequency",
    topicAr: "ظروف التكرار",
    rule: "Words like always, usually, often, sometimes, rarely, and never show how often something happens. They usually go before the main verb, but after 'be'.",
    ruleAr: "كلمات مثل always وusually وoften وsometimes وrarely وnever تُظهر مدى تكرار حدوث شيء ما. تأتي عادةً قبل الفعل الرئيسي، وبعد فعل 'be'.",
    examples: [
      { en: "I always brush my teeth before bed.", ar: "أنظف أسناني دائمًا قبل النوم." },
      { en: "She is usually on time.", ar: "هي عادةً في الوقت المحدد." },
      { en: "We rarely eat fast food.", ar: "نادرًا ما نأكل الوجبات السريعة." },
    ],
  },
  {
    topic: "There is / There are",
    topicAr: "there is / there are",
    rule: "Use 'there is' with singular or uncountable nouns and 'there are' with plural nouns to say something exists.",
    ruleAr: "استخدم 'there is' مع الاسم المفرد أو غير المعدود، و'there are' مع الاسم الجمع للتعبير عن وجود شيء.",
    examples: [
      { en: "There is a bank near my house.", ar: "هناك بنك بالقرب من منزلي." },
      { en: "There are many shops on this street.", ar: "هناك الكثير من المحلات في هذا الشارع." },
      { en: "There isn't any bread left.", ar: "لم يتبقَّ أي خبز." },
    ],
  },
  {
    topic: "Possessive Pronouns",
    topicAr: "ضمائر الملكية",
    rule: "Words like mine, yours, his, hers, ours, and theirs replace 'possessive adjective + noun' and stand alone.",
    ruleAr: "كلمات مثل mine وyours وhis وhers وours وtheirs تحل محل 'صفة الملكية + الاسم' وتأتي وحدها بدون اسم بعدها.",
    examples: [
      { en: "This bag is mine.", ar: "هذه الحقيبة ملكي." },
      { en: "Is that book yours?", ar: "هل ذلك الكتاب ملكك؟" },
      { en: "The red car is theirs.", ar: "السيارة الحمراء ملكهم." },
    ],
  },
];

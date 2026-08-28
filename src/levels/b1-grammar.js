// B1 grammar reference — the counterpart to b1-vocabulary.js, and the study-side of what
// levels/b1.js already quizzes: each topic here matches one of that file's question
// generators, restated as a plain-English rule with example sentences.

export const GRAMMAR = [
  {
    topic: "Present Perfect",
    topicAr: "المضارع التام",
    rule: "Use have/has + past participle for actions with a connection to now — something that happened at an unspecified time, or started in the past and continues now.",
    ruleAr: "استخدم have/has + التصريف الثالث للفعل للأفعال المرتبطة بالحاضر — شيء حدث في وقت غير محدد، أو بدأ في الماضي ولا يزال مستمرًا.",
    examples: [
      { en: "I have finished my homework.", ar: "لقد أنهيت واجبي." },
      { en: "She has visited Paris twice.", ar: "لقد زارت باريس مرتين." },
      { en: "They have lived here since 2015.", ar: "يعيشون هنا منذ عام ٢٠١٥." },
    ],
  },
  {
    topic: "Past Continuous",
    topicAr: "الماضي المستمر",
    rule: "Use was/were + verb-ing for an action in progress at a specific moment in the past, often interrupted by another action.",
    ruleAr: "استخدم was/were + صيغة -ing للفعل للتعبير عن فعل كان مستمرًا في لحظة محددة في الماضي، وغالبًا ما يُقاطعه فعل آخر.",
    examples: [
      { en: "I was reading when he called.", ar: "كنت أقرأ عندما اتصل." },
      { en: "They were playing football at 5 pm.", ar: "كانوا يلعبون كرة القدم في الساعة الخامسة." },
      { en: "She was cooking while I was cleaning.", ar: "كانت تطبخ بينما كنت أنظف." },
    ],
  },
  {
    topic: "First Conditional",
    topicAr: "الجملة الشرطية الأولى",
    rule: "Use 'if' + present simple, + 'will' + base verb to talk about a realistic future possibility and its result.",
    ruleAr: "استخدم 'if' + المضارع البسيط، + 'will' + الفعل الأساسي للحديث عن احتمال مستقبلي واقعي ونتيجته.",
    examples: [
      { en: "If it rains, we will stay home.", ar: "إذا أمطرت، سنبقى في المنزل." },
      { en: "If you study hard, you will pass the exam.", ar: "إذا ذاكرت بجد، ستنجح في الامتحان." },
      { en: "She will call you if she has time.", ar: "ستتصل بك إذا كان لديها وقت." },
    ],
  },
  {
    topic: "As...As Comparisons",
    topicAr: "صيغة المساواة as...as",
    rule: "Use 'as + adjective + as' to say two things are equal, and 'not as...as' to say one is less than the other.",
    ruleAr: "استخدم 'as + الصفة + as' للتعبير عن تساوي شيئين، و'not as...as' للتعبير عن أن أحدهما أقل من الآخر.",
    examples: [
      { en: "This car is as fast as that one.", ar: "هذه السيارة سريعة مثل تلك." },
      { en: "He is not as tall as his brother.", ar: "هو ليس طويلاً مثل أخيه." },
      { en: "The test was as easy as I expected.", ar: "كان الاختبار سهلاً كما توقعت." },
    ],
  },
  {
    topic: "Modals of Advice & Possibility",
    topicAr: "أفعال الوجوب: should وmight/may",
    rule: "Use 'should' + base verb to give advice, and 'might'/'may' + base verb to talk about possibility, not certainty.",
    ruleAr: "استخدم 'should' + الفعل الأساسي لتقديم نصيحة، و'might'/'may' + الفعل الأساسي للتعبير عن احتمال، وليس يقينًا.",
    examples: [
      { en: "You should get some rest.", ar: "يجب أن تحصل على قسط من الراحة." },
      { en: "It might rain later.", ar: "ربما تمطر لاحقًا." },
      { en: "She may join us for dinner.", ar: "قد تنضم إلينا لتناول العشاء." },
    ],
  },
  {
    topic: "Passive Voice",
    topicAr: "المبني للمجهول",
    rule: "Use be + past participle to focus on the action or the receiver, not who did it.",
    ruleAr: "استخدم be + التصريف الثالث للفعل للتركيز على الفعل أو من وقع عليه الفعل، وليس على من قام به.",
    examples: [
      { en: "The house was built in 1990.", ar: "بُني المنزل عام ١٩٩٠." },
      { en: "This bridge is used by thousands of cars every day.", ar: "يُستخدم هذا الجسر من قبل آلاف السيارات يوميًا." },
      { en: "The letters were sent yesterday.", ar: "أُرسلت الرسائل أمس." },
    ],
  },
  {
    topic: "Relative Clauses",
    topicAr: "الجمل الموصولة",
    rule: "Use who/which/that to add extra information about a person or thing without starting a new sentence.",
    ruleAr: "استخدم who/which/that لإضافة معلومة إضافية عن شخص أو شيء دون بدء جملة جديدة.",
    examples: [
      { en: "The man who called you is my uncle.", ar: "الرجل الذي اتصل بك هو عمي." },
      { en: "I read the book that you recommended.", ar: "قرأت الكتاب الذي رشحته." },
      { en: "This is the house which my father built.", ar: "هذا هو المنزل الذي بناه والدي." },
    ],
  },
  {
    topic: "Reported Speech",
    topicAr: "الكلام المنقول (غير المباشر)",
    rule: "When reporting what someone said, the verb tense usually shifts back one step, and pronouns/time words change to fit the new speaker and time.",
    ruleAr: "عند نقل ما قاله شخص ما، عادةً ما يتحول زمن الفعل خطوة للخلف، وتتغير الضمائر وكلمات الزمن لتناسب المتحدث والوقت الجديدين.",
    examples: [
      { en: "\"I am tired,\" she said. → She said (that) she was tired.", ar: "\"أنا متعبة،\" قالت. ← قالت إنها كانت متعبة." },
      { en: "\"I will call you,\" he said. → He said he would call me.", ar: "\"سأتصل بك،\" قال. ← قال إنه سيتصل بي." },
      { en: "\"I have finished,\" they said. → They said they had finished.", ar: "\"لقد انتهينا،\" قالوا. ← قالوا إنهم قد انتهوا." },
    ],
  },
  {
    topic: "Phrasal Verbs",
    topicAr: "الأفعال المركبة",
    rule: "A phrasal verb combines a verb with a particle (up, off, out, etc.) to create a new meaning, often different from the verb alone.",
    ruleAr: "الفعل المركب يجمع فعلاً مع أداة (up, off, out...إلخ) لتكوين معنى جديد، وغالبًا يختلف عن معنى الفعل وحده.",
    examples: [
      { en: "Please turn off the lights.", ar: "من فضلك أطفئ الأنوار." },
      { en: "She gave up smoking last year.", ar: "أقلعت عن التدخين العام الماضي." },
      { en: "Can you look after my cat this weekend?", ar: "هل يمكنك الاعتناء بقطتي في نهاية هذا الأسبوع؟" },
    ],
  },
  {
    topic: "Gerunds & Infinitives",
    topicAr: "المصدر بـ -ing و to",
    rule: "Some verbs are followed by a gerund (verb + -ing), others by a to-infinitive (to + base verb) — it depends on the verb before it.",
    ruleAr: "بعض الأفعال يتبعها المصدر بـ -ing، وبعضها يتبعه to + الفعل الأساسي — يعتمد ذلك على الفعل الذي قبله.",
    examples: [
      { en: "I enjoy reading before bed.", ar: "أستمتع بالقراءة قبل النوم." },
      { en: "She wants to travel next year.", ar: "تريد أن تسافر العام القادم." },
      { en: "He decided to change his job.", ar: "قرر أن يغير وظيفته." },
    ],
  },
  {
    topic: "Question Tags",
    topicAr: "أسئلة التأكيد",
    rule: "A short question added to the end of a statement to check information or confirm agreement — positive statements take a negative tag, and negative statements take a positive tag.",
    ruleAr: "سؤال قصير يُضاف إلى نهاية الجملة للتحقق من معلومة أو تأكيد الاتفاق — الجملة المثبتة تأخذ سؤال تأكيد منفيًا، والجملة المنفية تأخذ سؤال تأكيد مثبتًا.",
    examples: [
      { en: "You live here, don't you?", ar: "أنت تعيش هنا، أليس كذلك؟" },
      { en: "She isn't coming, is she?", ar: "هي لن تأتي، أليس كذلك؟" },
      { en: "They can swim, can't they?", ar: "يستطيعون السباحة، أليس كذلك؟" },
    ],
  },
  {
    topic: "Used to",
    topicAr: "used to",
    rule: "Use 'used to' + base verb for past habits or states that are no longer true.",
    ruleAr: "استخدم 'used to' + الفعل الأساسي للتعبير عن عادات أو حالات كانت في الماضي ولم تعد صحيحة الآن.",
    examples: [
      { en: "I used to live in Cairo.", ar: "كنت أعيش في القاهرة سابقًا." },
      { en: "She used to play tennis every week.", ar: "كانت تلعب التنس كل أسبوع سابقًا." },
      { en: "We didn't use to have a car.", ar: "لم نكن نملك سيارة سابقًا." },
    ],
  },
  {
    topic: "Quantifiers",
    topicAr: "أدوات الكمية",
    rule: "Words like much, many, a lot of, a few, and a little describe amounts — 'many'/'few' for countable nouns, 'much'/'little' for uncountable ones.",
    ruleAr: "كلمات مثل much وmany وa lot of وa few وa little تصف الكميات — many/few مع الأسماء المعدودة، وmuch/little مع الأسماء غير المعدودة.",
    examples: [
      { en: "There are many books on the shelf.", ar: "هناك الكثير من الكتب على الرف." },
      { en: "I don't have much time today.", ar: "ليس لدي الكثير من الوقت اليوم." },
      { en: "She has a few close friends.", ar: "لديها بضعة أصدقاء مقربين." },
    ],
  },
];

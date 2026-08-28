// A1 grammar reference — the counterpart to a1-vocabulary.js. Where the main quiz tests
// grammar through fill-in-the-blank questions, this is the explanation the quiz never
// gives up front: each topic states the rule in plain English, then a few example
// sentences, with Arabic translations shown on demand (not eagerly).
//
// Unlike A2/B1/B2 (each built later, explicitly mirroring their level's quiz generators
// 1:1), A1 predates that convention and includes 5 topics the A1 quiz never actually
// tests: Subject Pronouns, Possessive Adjectives, There is / There are, Can (Ability),
// and Imperatives. Reworking a1.js's question bank to cover them would renumber its
// fixed 500-question set and break every existing user's saved progress (answers are
// stored positionally against that exact set), so they stay here as extra background
// rather than expanding the quiz.

export const GRAMMAR = [
  {
    topic: "Verb 'to be'",
    topicAr: "فعل الكينونة (to be)",
    rule: "Use am with I, is with he/she/it, are with you/we/they.",
    ruleAr: "استخدم am مع I، وis مع he/she/it، وare مع you/we/they.",
    examples: [
      { en: "I am a student.", ar: "أنا طالب." },
      { en: "She is happy.", ar: "هي سعيدة." },
      { en: "They are at home.", ar: "هم في المنزل." },
    ],
  },
  {
    topic: "Subject Pronouns",
    topicAr: "ضمائر الفاعل",
    rule: "Subject pronouns (I, you, he, she, it, we, they) come before the verb and show who is doing the action.",
    ruleAr: "ضمائر الفاعل (I, you, he, she, it, we, they) تأتي قبل الفعل وتوضح من يقوم بالفعل.",
    examples: [
      { en: "He plays football.", ar: "هو يلعب كرة القدم." },
      { en: "We live in Cairo.", ar: "نحن نعيش في القاهرة." },
      { en: "It is a small cat.", ar: "إنها قطة صغيرة." },
    ],
  },
  {
    topic: "Simple Present Tense",
    topicAr: "المضارع البسيط",
    rule: "Use the simple present for habits and facts. Add -s to the verb with he/she/it.",
    ruleAr: "استخدم المضارع البسيط للعادات والحقائق. أضف -s إلى الفعل مع he/she/it.",
    examples: [
      { en: "I work every day.", ar: "أعمل كل يوم." },
      { en: "She works in a bank.", ar: "تعمل في بنك." },
      { en: "The sun rises in the east.", ar: "تشرق الشمس من الشرق." },
    ],
  },
  {
    topic: "Articles: a / an / the",
    topicAr: "أدوات التنكير والتعريف: a / an / the",
    rule: "Use a before consonant sounds, an before vowel sounds, and the for something specific.",
    ruleAr: "استخدم a قبل الأصوات الساكنة، وan قبل الأصوات المتحركة، وthe لشيء محدد.",
    examples: [
      { en: "I have a dog.", ar: "لدي كلب." },
      { en: "She ate an apple.", ar: "أكلت تفاحة." },
      { en: "The book on the table is mine.", ar: "الكتاب الذي على الطاولة لي." },
    ],
  },
  {
    topic: "Plural Nouns",
    topicAr: "جمع الأسماء",
    rule: "Add -s to most nouns to make them plural. Some nouns are irregular.",
    ruleAr: "أضف -s لمعظم الأسماء لجعلها جمعًا. بعض الأسماء شاذة.",
    examples: [
      { en: "I have two brothers.", ar: "لدي أخوان." },
      { en: "There are five books here.", ar: "هناك خمسة كتب هنا." },
      { en: "Children love to play.", ar: "الأطفال يحبون اللعب." },
    ],
  },
  {
    topic: "Possessive Adjectives",
    topicAr: "صفات الملكية",
    rule: "My, your, his, her, its, our, and their show who something belongs to.",
    ruleAr: "my وyour وhis وher وits وour وtheir توضح ملكية الشيء.",
    examples: [
      { en: "This is my book.", ar: "هذا كتابي." },
      { en: "Her name is Sara.", ar: "اسمها سارة." },
      { en: "Their house is big.", ar: "منزلهم كبير." },
    ],
  },
  {
    topic: "This / That / These / Those",
    topicAr: "this / that / these / those",
    rule: "Use this/these for things near you, and that/those for things far away.",
    ruleAr: "استخدم this/these للأشياء القريبة، وthat/those للأشياء البعيدة.",
    examples: [
      { en: "This is my pen.", ar: "هذا قلمي." },
      { en: "Those shoes are nice.", ar: "ذلك الحذاء جميل." },
      { en: "These apples are fresh.", ar: "هذه التفاحات طازجة." },
    ],
  },
  {
    topic: "There is / There are",
    topicAr: "there is / there are",
    rule: "Use there is with singular nouns and there are with plural nouns to say something exists.",
    ruleAr: "استخدم there is مع الاسم المفرد وthere are مع الاسم الجمع للتعبير عن وجود شيء.",
    examples: [
      { en: "There is a cat in the garden.", ar: "هناك قطة في الحديقة." },
      { en: "There are ten students in the class.", ar: "هناك عشرة طلاب في الصف." },
      { en: "There is no milk in the fridge.", ar: "لا يوجد حليب في الثلاجة." },
    ],
  },
  {
    topic: "Prepositions of Place",
    topicAr: "حروف الجر المكانية",
    rule: "In, on, under, next to, and in front of describe where something is.",
    ruleAr: "in وon وunder وnext to وin front of تصف مكان الشيء.",
    examples: [
      { en: "The keys are in the bag.", ar: "المفاتيح في الحقيبة." },
      { en: "The cat is under the table.", ar: "القطة تحت الطاولة." },
      { en: "The school is next to the park.", ar: "المدرسة بجانب الحديقة." },
    ],
  },
  {
    topic: "Question Words",
    topicAr: "أدوات الاستفهام",
    rule: "What, where, when, who, and how start questions asking for information.",
    ruleAr: "what وwhere وwhen وwho وhow تبدأ أسئلة تطلب معلومة.",
    examples: [
      { en: "What is your name?", ar: "ما اسمك؟" },
      { en: "Where do you live?", ar: "أين تعيش؟" },
      { en: "How old are you?", ar: "كم عمرك؟" },
    ],
  },
  {
    topic: "Can (Ability)",
    topicAr: "can (القدرة)",
    rule: "Use can + verb to talk about ability or permission. It doesn't change with the subject.",
    ruleAr: "استخدم can + الفعل للتعبير عن القدرة أو الإذن. لا يتغير مع الفاعل.",
    examples: [
      { en: "I can swim.", ar: "أستطيع السباحة." },
      { en: "She can speak English.", ar: "تستطيع التحدث بالإنجليزية." },
      { en: "Can you help me?", ar: "هل يمكنك مساعدتي؟" },
    ],
  },
  {
    topic: "Imperatives",
    topicAr: "صيغة الأمر",
    rule: "Use the base verb (without a subject) to give orders, instructions, or requests.",
    ruleAr: "استخدم الفعل الأساسي (بدون فاعل) لإعطاء أوامر أو تعليمات أو طلبات.",
    examples: [
      { en: "Open the door, please.", ar: "افتح الباب، من فضلك." },
      { en: "Don't be late.", ar: "لا تتأخر." },
      { en: "Sit down.", ar: "اجلس." },
    ],
  },
];

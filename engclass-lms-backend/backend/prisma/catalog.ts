// Konten katalog LMS: kategori, course, lesson, kuis, dan roadmap.
// Data statis & editorial — semua yang bersifat "perilaku pengguna" (member, enrollment,
// transaksi, review, dst.) dibangkitkan di build-dataset.ts.

export interface CategorySeed {
  name: string;
  slug: string;
}

export interface LessonSeed {
  title: string;
  durationMinutes: number;
  isPreview: boolean;
}

export interface QuestionSeed {
  text: string;
  correct: string;
  wrong: [string, string, string];
}

export interface CourseSeed {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  price: number;
  level: 'Pemula' | 'Menengah' | 'Mahir';
  /** Umur course (hari) relatif terhadap tanggal seed dijalankan. */
  daysAgo: number;
  /** Bobot popularitas untuk membangkitkan enrollment. */
  popularity: number;
  lessons: LessonSeed[];
  quiz: { title: string; passingGrade: number; questions: QuestionSeed[] };
  /** Komentar review khas untuk course ini (nada positif). */
  praise: string[];
}

export interface RoadmapSeed {
  slug: string;
  title: string;
  description: string;
  daysAgo: number;
  courseSlugs: string[];
}

export const CATEGORIES: CategorySeed[] = [
  { name: 'Grammar', slug: 'grammar' },
  { name: 'Vocabulary', slug: 'vocabulary' },
  { name: 'Speaking', slug: 'speaking' },
  { name: 'Listening', slug: 'listening' },
  { name: 'Writing', slug: 'writing' },
  { name: 'Persiapan TOEFL', slug: 'toefl' },
  { name: 'Persiapan IELTS', slug: 'ielts' },
  { name: 'Business English', slug: 'business-english' },
  { name: 'English for Beginners', slug: 'beginners' },
  { name: 'English Conversation', slug: 'conversation' },
];

export const COURSES: CourseSeed[] = [
  {
    slug: 'grammar-dasar-untuk-pemula',
    title: 'Grammar Dasar untuk Pemula',
    description:
      'Membangun fondasi Grammar dari nol: tenses dasar, struktur kalimat, dan kesalahan umum pemula. Cocok untuk kamu yang baru mulai belajar Bahasa Inggris secara serius.',
    categorySlug: 'grammar',
    price: 0,
    level: 'Pemula',
    daysAgo: 68,
    popularity: 9,
    lessons: [
      { title: 'Pengenalan Part of Speech', durationMinutes: 12, isPreview: true },
      { title: 'Simple Present Tense', durationMinutes: 15, isPreview: true },
      { title: 'Simple Past Tense', durationMinutes: 14, isPreview: false },
      { title: 'Kesalahan Grammar yang Sering Terjadi', durationMinutes: 18, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Grammar Dasar',
      passingGrade: 70,
      questions: [
        { text: "Which word is a verb in this sentence: 'The teacher opened the window.'?", correct: 'opened', wrong: ['teacher', 'the', 'window'] },
        { text: 'Choose the correct form: She ___ to school every day.', correct: 'goes', wrong: ['go', 'going', 'gone'] },
        { text: 'Choose the correct past tense: Yesterday, we ___ a movie at the cinema.', correct: 'watched', wrong: ['watch', 'watches', 'watching'] },
        { text: 'Which sentence is correct?', correct: "He doesn't like coffee.", wrong: ["He don't like coffee.", "He doesn't likes coffee.", 'He not like coffee.'] },
        { text: "Which word is an adverb in this sentence: 'The children play happily in the garden.'?", correct: 'happily', wrong: ['children', 'play', 'garden'] },
      ],
    },
    praise: [
      'Penjelasannya pelan dan runtut, akhirnya paham beda simple present dan simple past.',
      'Cocok banget buat yang mau mulai dari nol. Contoh kalimatnya mudah diingat.',
      'Kelas gratis tapi kualitasnya seperti kelas berbayar. Quiz-nya juga membantu mengukur pemahaman.',
    ],
  },
  {
    slug: 'persiapan-toefl-itp',
    title: 'Persiapan TOEFL ITP',
    description:
      'Strategi lengkap menghadapi TOEFL ITP: Listening Comprehension, Structure & Written Expression, dan Reading Comprehension, lengkap dengan latihan soal ala ujian asli.',
    categorySlug: 'toefl',
    price: 150000,
    level: 'Menengah',
    daysAgo: 80,
    popularity: 6,
    lessons: [
      { title: 'Pengenalan Structure & Written Expression', durationMinutes: 15, isPreview: true },
      { title: 'Listening Comprehension: Short Conversations', durationMinutes: 20, isPreview: false },
      { title: 'Reading Comprehension: Skimming & Scanning', durationMinutes: 22, isPreview: false },
      { title: 'Simulasi Soal & Pembahasan', durationMinutes: 30, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Persiapan TOEFL ITP',
      passingGrade: 70,
      questions: [
        { text: 'Which three sections make up the TOEFL ITP?', correct: 'Listening Comprehension, Structure and Written Expression, Reading Comprehension', wrong: ['Listening, Speaking, Reading', 'Reading, Writing, Speaking, Listening', 'Grammar, Vocabulary, Essay'] },
        { text: 'What is the total score range of the TOEFL ITP?', correct: '310–677', wrong: ['0–120', '0–9', '10–990'] },
        { text: 'Choose the best answer: ___ the weather was bad, the match continued.', correct: 'Although', wrong: ['Because', 'Despite', 'Therefore'] },
        { text: "In the 'Written Expression' part, what must you do?", correct: 'Find the underlined part that is grammatically incorrect', wrong: ['Write a 250-word essay', 'Summarize a lecture orally', 'Match headings to paragraphs'] },
        { text: 'Scanning is the best technique to:', correct: 'find a specific detail such as a date or a name', wrong: ['understand the general idea very quickly', 'memorize all vocabulary in the passage', 'translate each sentence into Indonesian'] },
      ],
    },
    praise: [
      'Pembahasan strategi Reading-nya sangat membantu, skor latihan saya naik cukup banyak.',
      'Simulasi soalnya mirip ujian asli, jadi lebih siap secara mental.',
      'Materi Structure-nya ringkas dan langsung ke inti. Recommended untuk persiapan tes kampus.',
    ],
  },
  {
    slug: 'speaking-percaya-diri',
    title: 'Speaking Percaya Diri untuk Kerja',
    description:
      'Latihan Speaking praktis untuk kebutuhan wawancara kerja dan komunikasi profesional sehari-hari, dengan contoh dialog nyata di tempat kerja.',
    categorySlug: 'speaking',
    price: 129000,
    level: 'Menengah',
    daysAgo: 115,
    popularity: 6,
    lessons: [
      { title: 'Self Introduction yang Meyakinkan', durationMinutes: 10, isPreview: true },
      { title: 'Menjawab Pertanyaan Interview Umum', durationMinutes: 18, isPreview: false },
      { title: 'Small Talk di Kantor', durationMinutes: 12, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Speaking untuk Kerja',
      passingGrade: 70,
      questions: [
        { text: "An interviewer says, 'Tell me about yourself.' What is the best way to answer?", correct: 'Present your current role or background, key strengths, and why you want the job', wrong: ['Tell your full life story from childhood', 'Say only your name and age', 'Ask the interviewer to answer first'] },
        { text: 'Which is the most polite way to ask someone to repeat what they said?', correct: 'Could you say that again, please?', wrong: ['What?', 'Say again.', "I don't hear you."] },
        { text: "A colleague asks, \"How's it going?\" Which is a natural response?", correct: 'Pretty good, thanks. How about you?', wrong: ['I will go to the office.', 'It is going on the road.', 'My name is Andi.'] },
        { text: 'Which sentence best describes a strength in a job interview?', correct: "I'm good at organizing tasks and meeting deadlines.", wrong: ['I am the best and nobody is better than me.', 'I have no strengths and no weaknesses.', 'I just do whatever I am told.'] },
        { text: 'Which sentence is grammatically correct?', correct: 'I have worked as a marketing officer for three years.', wrong: ['I am working as marketing officer since three years.', 'I work as marketing officer for three years ago.', 'I worked as marketing officer since 3 year.'] },
      ],
    },
    praise: [
      'Setelah kelas ini saya jauh lebih pede waktu interview kerja pakai Bahasa Inggris.',
      'Contoh dialognya realistis, banyak frasa yang langsung bisa dipakai di kantor.',
      'Latihan self introduction-nya bagus banget. Sekarang tidak gugup lagi memperkenalkan diri.',
    ],
  },
  {
    slug: 'business-english-essentials',
    title: 'Business English Essentials',
    description:
      'Kuasai email profesional, presentasi, dan negosiasi dalam Bahasa Inggris untuk lingkungan kerja korporat.',
    categorySlug: 'business-english',
    price: 199000,
    level: 'Mahir',
    daysAgo: 59,
    popularity: 3,
    lessons: [
      { title: 'Menulis Email Bisnis yang Efektif', durationMinutes: 16, isPreview: true },
      { title: 'Bahasa untuk Presentasi', durationMinutes: 20, isPreview: false },
      { title: 'Frasa Negosiasi Profesional', durationMinutes: 17, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Business English Essentials',
      passingGrade: 70,
      questions: [
        { text: 'Which greeting is most appropriate for a formal business email to Ms. Santoso?', correct: 'Dear Ms. Santoso,', wrong: ['Hey Santoso,', 'Hi guys,', 'Yo Ms. Santoso,'] },
        { text: 'Which closing is appropriate for a formal business email?', correct: 'Kind regards,', wrong: ['See ya!', 'Bye-bye,', 'Cheers mate!!'] },
        { text: 'Which phrase signals that you are moving to your next topic in a presentation?', correct: "Now let's move on to…", wrong: ['Sorry, I lost my place.', 'As I said at the very beginning…', 'In conclusion, thank you.'] },
        { text: 'Which is the most diplomatic way to disagree about a price?', correct: 'I understand your position, but that figure is a little above our budget.', wrong: ['That price is stupid.', 'No. Never.', 'You are wrong about everything.'] },
        { text: "What does 'Please find attached the report' mean?", correct: 'The report is included with this email as an attachment', wrong: ['Please look for the report in the office', 'The report is missing', 'Please print the report'] },
      ],
    },
    praise: [
      'Template email-nya langsung kepakai untuk kerjaan. Komunikasi ke klien luar negeri jadi lebih percaya diri.',
      'Frasa negosiasinya sopan tapi tegas. Sangat membantu untuk meeting dengan vendor.',
      'Materinya padat dan relevan dengan dunia kerja korporat.',
    ],
  },
  {
    slug: 'vocabulary-booster-1000-kata',
    title: 'Vocabulary Booster: 1000 Kata Penting',
    description:
      'Perluas kosakata secara sistematis dengan tema sehari-hari, akademik, dan pekerjaan — lengkap dengan cara pengucapan.',
    categorySlug: 'vocabulary',
    price: 0,
    level: 'Pemula',
    daysAgo: 159,
    popularity: 8,
    lessons: [
      { title: 'Kosakata Kehidupan Sehari-hari', durationMinutes: 14, isPreview: true },
      { title: 'Kosakata Akademik', durationMinutes: 16, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Vocabulary Booster',
      passingGrade: 70,
      questions: [
        { text: "What is the closest meaning of 'reluctant'?", correct: 'unwilling or hesitant', wrong: ['eager', 'angry', 'tired'] },
        { text: "What does 'ubiquitous' mean?", correct: 'found everywhere', wrong: ['extremely rare', 'very old', 'easily broken'] },
        { text: 'Choose the best word: The government plans to ___ the new rules next month.', correct: 'implement', wrong: ['imagine', 'ignore', 'imitate'] },
        { text: "Which word is the opposite of 'scarce'?", correct: 'abundant', wrong: ['limited', 'rare', 'insufficient'] },
        { text: 'Which pair of words are synonyms?', correct: 'enormous – huge', wrong: ['brave – afraid', 'ancient – modern', 'fragile – sturdy'] },
      ],
    },
    praise: [
      'Kosakatanya dikelompokkan per tema, jadi lebih mudah dihafal dan dipakai dalam kalimat.',
      'Gratis dan isinya berbobot. Pengucapannya juga dijelaskan dengan jelas.',
      'Enak dipakai belajar 15 menit per hari. Kosakata akademiknya terpakai untuk tugas kuliah.',
    ],
  },
  {
    slug: 'listening-skill-native-speed',
    title: 'Listening Skill: Native Speed',
    description:
      'Latih telinga memahami Bahasa Inggris dengan kecepatan native speaker lewat podcast, berita, dan percakapan sehari-hari.',
    categorySlug: 'listening',
    price: 99000,
    level: 'Menengah',
    daysAgo: 95,
    popularity: 4,
    lessons: [
      { title: 'Memahami Percakapan Kasual', durationMinutes: 15, isPreview: true },
      { title: 'Mendengarkan Berita Berbahasa Inggris', durationMinutes: 20, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Listening Skill',
      passingGrade: 70,
      questions: [
        { text: "In fast, casual speech, 'going to' is often pronounced as:", correct: 'gonna', wrong: ['goin two', 'gotta', 'wanna'] },
        { text: "What does 'kinda' stand for in casual speech?", correct: 'kind of', wrong: ['kindly', "can't do", 'king of'] },
        { text: 'What should you do before the audio starts in a listening test?', correct: 'Read the questions to predict what information you need', wrong: ['Close your eyes and relax completely', 'Translate every word you expect to hear', 'Skip the instructions'] },
        { text: "What does 'listening for gist' mean?", correct: 'Understanding the main idea without catching every word', wrong: ['Writing down every word you hear', 'Focusing only on numbers', "Memorizing the speaker's accent"] },
        { text: 'What is the best strategy when you miss a word while listening?', correct: 'Keep listening and use the context to follow the meaning', wrong: ['Stop and replay the same sentence again and again', 'Stop listening for the rest of the audio', 'Give up on the whole passage'] },
      ],
    },
    praise: [
      'Latihan dengan kecepatan native awalnya berat, tapi lama-lama telinga terbiasa.',
      'Tips menangkap connected speech-nya sangat membantu untuk nonton film tanpa subtitle.',
      'Materi berita berbahasa Inggrisnya bagus untuk melatih konsentrasi mendengar.',
    ],
  },
  {
    slug: 'writing-academic-essay',
    title: 'Writing Academic Essay',
    description:
      'Pelajari struktur esai akademik Bahasa Inggris: thesis statement, paragraf argumentasi, hingga kesimpulan yang kuat.',
    categorySlug: 'writing',
    price: 139000,
    level: 'Mahir',
    daysAgo: 51,
    popularity: 3,
    lessons: [
      { title: 'Struktur Esai 5 Paragraf', durationMinutes: 18, isPreview: true },
      { title: 'Menulis Thesis Statement', durationMinutes: 14, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Academic Essay',
      passingGrade: 70,
      questions: [
        { text: 'What is a thesis statement?', correct: 'A sentence that states the main argument of the essay', wrong: ['A summary of every paragraph', 'A quotation from a source', 'The title of the essay'] },
        { text: 'Where does the thesis statement usually appear in an academic essay?', correct: 'At the end of the introduction', wrong: ['In the last sentence of the conclusion', 'In the middle of the second body paragraph', 'On the reference page'] },
        { text: 'What does a topic sentence do in a body paragraph?', correct: 'States the main idea of that paragraph', wrong: ['Repeats the thesis word for word', 'Lists all the references', 'Introduces an unrelated idea'] },
        { text: 'Which transition word shows contrast?', correct: 'However', wrong: ['Moreover', 'Therefore', 'For example'] },
        { text: 'What does a standard five-paragraph essay contain?', correct: 'One introduction, three body paragraphs, and one conclusion', wrong: ['Three introduction paragraphs and two conclusions', 'Five body paragraphs without an introduction', 'Two body paragraphs and three reference lists'] },
      ],
    },
    praise: [
      'Akhirnya paham cara menulis thesis statement yang jelas dan bisa diperdebatkan.',
      'Struktur esainya dijelaskan dengan contoh nyata. Nilai tugas esai saya naik.',
      'Cocok untuk persiapan menulis paper atau Writing Task 2 IELTS.',
    ],
  },
  {
    slug: 'persiapan-ielts-academic',
    title: 'Persiapan IELTS Academic',
    description:
      'Strategi lengkap 4 modul IELTS Academic: Listening, Reading, Writing, dan Speaking, dengan target band score 6.5+.',
    categorySlug: 'ielts',
    price: 179000,
    level: 'Mahir',
    daysAgo: 102,
    popularity: 5,
    lessons: [
      { title: 'Overview Format Ujian IELTS', durationMinutes: 12, isPreview: true },
      { title: 'Strategi Reading Passage', durationMinutes: 22, isPreview: false },
    ],
    quiz: {
      title: 'Quiz IELTS Academic',
      passingGrade: 70,
      questions: [
        { text: 'Which four modules make up the IELTS Academic test?', correct: 'Listening, Reading, Writing, and Speaking', wrong: ['Listening, Reading, and Writing only', 'Reading and Writing only', 'Grammar, Vocabulary, Reading, and Speaking'] },
        { text: 'What is the minimum word count for IELTS Writing Task 2?', correct: '250 words', wrong: ['150 words', '100 words', '400 words'] },
        { text: 'What does IELTS Academic Writing Task 1 ask you to do?', correct: 'Describe a graph, chart, table, or diagram', wrong: ['Write a formal complaint letter', 'Write an argumentative essay', 'Summarize a podcast'] },
        { text: 'What is the range of IELTS band scores?', correct: '0 to 9', wrong: ['0 to 100', '1 to 5', '10 to 990'] },
        { text: 'How many parts does the IELTS Speaking test have?', correct: 'Three', wrong: ['One', 'Two', 'Five'] },
      ],
    },
    praise: [
      'Strategi Reading-nya bikin saya lebih efisien membagi waktu 60 menit.',
      'Overview formatnya jelas, jadi tidak kaget lagi saat ikut try-out.',
      'Materi lengkap untuk persiapan IELTS dengan target band 6.5.',
    ],
  },
  {
    slug: 'english-conversation-traveling',
    title: 'English Conversation untuk Traveling',
    description:
      'Frasa dan dialog praktis untuk bandara, hotel, restoran, dan situasi darurat saat bepergian ke luar negeri.',
    categorySlug: 'conversation',
    price: 0,
    level: 'Pemula',
    daysAgo: 139,
    popularity: 8,
    lessons: [
      { title: 'Percakapan di Bandara', durationMinutes: 10, isPreview: true },
      { title: 'Check-in di Hotel', durationMinutes: 11, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Conversation Traveling',
      passingGrade: 70,
      questions: [
        { text: 'Which question would a check-in agent at the airport ask?', correct: 'May I see your passport, please?', wrong: ['How much is the room?', "What's the soup of the day?", 'Where is the nearest pharmacy?'] },
        { text: 'You want to find your boarding gate. What do you say?', correct: 'Excuse me, where is Gate 12?', wrong: ['Excuse me, how long is Gate 12?', 'Excuse me, who is Gate 12?', 'Excuse me, which is the price of Gate 12?'] },
        { text: "What does 'I have a reservation under the name Andi' mean?", correct: "A room has been booked in Andi's name", wrong: ['Andi wants to cancel his flight', 'Andi is asking for a discount', 'Andi has lost his luggage'] },
        { text: 'Which is a polite way to order food in a restaurant?', correct: "I'd like the grilled chicken, please.", wrong: ['Give me chicken.', 'Chicken now!', 'I want chicken, hurry.'] },
        { text: 'You lost your wallet. What do you say to a police officer?', correct: "I'd like to report a lost wallet.", wrong: ["I'd like to order a lost wallet.", 'I want to book a lost wallet.', "I'd like to check in my wallet."] },
      ],
    },
    praise: [
      'Dialog di bandara dan hotelnya persis seperti situasi saat saya liburan ke luar negeri kemarin.',
      'Frasa-frasanya singkat dan gampang diingat. Gratis pula!',
      'Sangat berguna buat yang mau traveling pertama kali. Jadi tidak takut ngobrol dengan petugas.',
    ],
  },
  {
    slug: 'english-for-beginners-start-from-zero',
    title: 'English for Beginners: Start From Zero',
    description:
      'Titik awal yang tepat bila kamu benar-benar baru mulai: alfabet, angka, salam, dan kalimat pertama dalam Bahasa Inggris.',
    categorySlug: 'beginners',
    price: 0,
    level: 'Pemula',
    daysAgo: 180,
    popularity: 10,
    lessons: [
      { title: 'Alfabet & Pengucapan Dasar', durationMinutes: 9, isPreview: true },
      { title: 'Salam & Perkenalan Diri', durationMinutes: 11, isPreview: false },
    ],
    quiz: {
      title: 'Quiz English for Beginners',
      passingGrade: 70,
      questions: [
        { text: 'How many letters are there in the English alphabet?', correct: '26', wrong: ['24', '28', '30'] },
        { text: 'Which greeting do we use in the morning?', correct: 'Good morning', wrong: ['Good night', 'Good evening', 'Good afternoon'] },
        { text: 'Complete the sentence: I ___ a student.', correct: 'am', wrong: ['is', 'are', 'be'] },
        { text: "What is 'twelve' in numbers?", correct: '12', wrong: ['2', '20', '120'] },
        { text: 'Which sentence introduces yourself correctly?', correct: 'My name is Sari.', wrong: ['I name Sari.', 'Name my is Sari.', 'Me is Sari name.'] },
      ],
    },
    praise: [
      'Benar-benar dari nol dan tidak bikin minder. Penjelasannya sabar dan jelas.',
      'Cocok untuk orang tua saya yang baru mulai belajar. Beliau bisa mengikuti dengan nyaman.',
      'Kelas gratis terbaik untuk pemula. Setelah ini lanjut ke Grammar Dasar.',
    ],
  },
  {
    slug: 'grammar-lanjutan-conditional-passive',
    title: 'Grammar Lanjutan: Conditional & Passive Voice',
    description:
      'Untuk kamu yang sudah paham dasar dan ingin naik level: conditional sentences, passive voice, dan reported speech.',
    categorySlug: 'grammar',
    price: 119000,
    level: 'Mahir',
    daysAgo: 44,
    popularity: 3.5,
    lessons: [
      { title: 'Conditional Sentences Type 1-3', durationMinutes: 20, isPreview: true },
      { title: 'Passive Voice dalam Konteks Formal', durationMinutes: 17, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Grammar Lanjutan',
      passingGrade: 70,
      questions: [
        { text: 'Complete the Type 2 conditional: If I ___ more money, I would travel the world.', correct: 'had', wrong: ['have', 'will have', 'would have'] },
        { text: 'Complete the Type 1 conditional: If it rains tomorrow, we ___ at home.', correct: 'will stay', wrong: ['would stay', 'stayed', 'would have stayed'] },
        { text: "What is the passive form of 'The chef cooks the meal.'?", correct: 'The meal is cooked by the chef.', wrong: ['The meal cooked by the chef.', 'The meal is cooking by the chef.', 'The meal was cook by the chef.'] },
        { text: 'Complete the Type 3 conditional: If she ___ harder, she would have passed the exam.', correct: 'had studied', wrong: ['studied', 'would study', 'has studied'] },
        { text: "Reported speech (use standard backshift): He said, 'I am tired.' → He said that he ___ tired.", correct: 'was', wrong: ['is', 'will be', 'has been'] },
      ],
    },
    praise: [
      'Conditional type 1 sampai 3 akhirnya tidak membingungkan lagi berkat tabel perbandingannya.',
      'Penjelasan passive voice untuk konteks formal sangat berguna untuk menulis laporan.',
      'Materi lanjutan yang rapi. Latihannya menantang tapi masih bisa diikuti.',
    ],
  },
  {
    slug: 'business-english-meeting-presentation',
    title: 'Business English: Meeting & Presentation',
    description:
      'Fokus khusus memimpin rapat dan menyampaikan presentasi dalam Bahasa Inggris dengan percaya diri.',
    categorySlug: 'business-english',
    price: 159000,
    level: 'Menengah',
    daysAgo: 37,
    popularity: 2.5,
    lessons: [
      { title: 'Membuka & Memimpin Rapat', durationMinutes: 14, isPreview: true },
      { title: 'Menyampaikan Data dalam Presentasi', durationMinutes: 19, isPreview: false },
    ],
    quiz: {
      title: 'Quiz Meeting & Presentation',
      passingGrade: 70,
      questions: [
        { text: 'Which sentence is a good way for the chair to open a meeting?', correct: "Let's get started. Thank you all for coming.", wrong: ['Okay, bye everyone.', "That's all for today.", 'Sorry, I am late again.'] },
        { text: 'Which is a polite way to interrupt in a meeting?', correct: 'Sorry to interrupt, but may I add something?', wrong: ['Stop talking.', 'Wait, that is wrong!', 'Be quiet, please. I speak.'] },
        { text: "How do you politely ask for a colleague's opinion?", correct: 'What do you think about this proposal?', wrong: ['Why you are here?', 'Tell me your age.', 'Do you eat lunch?'] },
        { text: 'Which sentence summarizes the end of a meeting?', correct: 'To sum up, we agreed to launch the campaign in March.', wrong: ['By the way, I have a new phone.', 'First of all, let me introduce myself.', 'Anyway, who wants coffee?'] },
        { text: "In a presentation, what is 'As you can see from this chart…' used for?", correct: 'To draw attention to a visual', wrong: ['To end the presentation', 'To apologize for a mistake', 'To ask for questions'] },
      ],
    },
    praise: [
      'Frasa untuk memimpin rapat langsung saya pakai di meeting mingguan dengan tim regional.',
      'Cara menyampaikan data di presentasi dijelaskan dengan contoh yang jelas.',
      'Singkat tapi padat. Cocok untuk yang butuh hasil cepat sebelum presentasi penting.',
    ],
  },
];

export const ROADMAPS: RoadmapSeed[] = [
  {
    slug: 'jalur-siap-toefl',
    title: 'Jalur Siap TOEFL',
    description:
      'Mulai dari fondasi Grammar, perkuat dengan Grammar lanjutan, lalu tuntas dengan strategi dan simulasi TOEFL ITP. Cocok untuk kamu yang punya target skor TOEFL dalam waktu dekat.',
    daysAgo: 68,
    courseSlugs: ['grammar-dasar-untuk-pemula', 'grammar-lanjutan-conditional-passive', 'persiapan-toefl-itp'],
  },
  {
    slug: 'jalur-siap-ielts-academic',
    title: 'Jalur Siap IELTS Academic',
    description:
      'Bangun kosakata akademik, kuatkan kemampuan menulis esai, lalu kuasai strategi 4 modul IELTS Academic untuk target band score 6.5+.',
    daysAgo: 59,
    courseSlugs: ['vocabulary-booster-1000-kata', 'writing-academic-essay', 'persiapan-ielts-academic'],
  },
  {
    slug: 'jalur-karier-business-english',
    title: 'Jalur Karier: Business English',
    description:
      'Dari fondasi Grammar, latihan Speaking untuk wawancara kerja, sampai Business English penuh untuk email, presentasi, dan rapat profesional.',
    daysAgo: 37,
    courseSlugs: [
      'grammar-dasar-untuk-pemula',
      'speaking-percaya-diri',
      'business-english-essentials',
      'business-english-meeting-presentation',
    ],
  },
];

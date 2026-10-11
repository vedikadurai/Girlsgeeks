import {
  ResumeData,
  ATSAnalysis,
  JobMatchResult,
  InterviewConfig,
  InterviewQuestion,
  InterviewAnswerRecord,
  InterviewSession,
  SkillGapItem,
  LanguageCode,
  UserProfile,
  LearningPlanData
} from '../types';

// Role-specific keyword dictionaries for realistic ATS scoring
const ROLE_KEYWORDS: Record<string, { core: string[]; tools: string[]; concepts: string[] }> = {
  'Software Developer': {
    core: ['Data Structures', 'Algorithms', 'OOP', 'Python', 'Java', 'C++', 'SQL', 'Git', 'REST API', 'Unit Testing'],
    tools: ['Git', 'Docker', 'Postman', 'Linux', 'VS Code', 'GitHub Actions', 'CI/CD'],
    concepts: ['System Design', 'Agile', 'Code Review', 'Clean Architecture', 'Debugging', 'Multithreading', 'Database Indexing'],
  },
  'Python Developer': {
    core: ['Python', 'Django', 'Flask', 'FastAPI', 'SQLAlchemy', 'PyTest', 'Asyncio', 'REST API', 'SQL'],
    tools: ['Git', 'Docker', 'Celery', 'Redis', 'PostgreSQL', 'Linux', 'Pip / Poetry'],
    concepts: ['Generators & Decorators', 'PEP 8', 'Microservices', 'Multiprocessing', 'Web Scraping', 'ORM', 'Data Serialization'],
  },
  'Full Stack Developer': {
    core: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'SQL', 'REST API', 'MongoDB / PostgreSQL'],
    tools: ['Git', 'Webpack / Vite', 'Postman', 'Docker', 'npm / yarn', 'Tailwind CSS'],
    concepts: ['Responsive Web Design', 'State Management', 'Authentication (JWT)', 'CORS', 'Server-Side Rendering', 'API Integration', 'DOM Manipulation'],
  },
  'Data Analyst': {
    core: ['SQL', 'Python', 'Excel (VLOOKUP, Pivot)', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'Statistics'],
    tools: ['Jupyter Notebook', 'Git', 'Power BI', 'Tableau Desktop', 'MySQL', 'PostgreSQL'],
    concepts: ['Data Cleaning', 'Exploratory Data Analysis (EDA)', 'Data Visualization', 'Hypothesis Testing', 'Dashboard Design', 'A/B Testing'],
  },
  'AI/ML Engineer': {
    core: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Linear Algebra'],
    tools: ['Jupyter Notebook', 'Git', 'CUDA / GPU', 'Docker', 'Hugging Face', 'MLflow'],
    concepts: ['Model Evaluation (F1, AUC-ROC)', 'Feature Engineering', 'Neural Networks', 'Overfitting Prevention', 'Data Preprocessing', 'Hyperparameter Tuning'],
  },
  'Cloud Engineer': {
    core: ['AWS', 'Azure', 'GCP', 'Linux', 'Networking (VPC, CIDR)', 'Terraform', 'Kubernetes', 'Docker', 'Python / Bash'],
    tools: ['AWS CLI', 'Terraform', 'Docker', 'Kubernetes', 'Git', 'CloudWatch', 'Ansible'],
    concepts: ['Infrastructure as Code (IaC)', 'High Availability', 'IAM Security', 'Load Balancing', 'Disaster Recovery', 'Auto-scaling', 'Cloud Cost Optimization'],
  },
};

// Multilingual questions database with verified natural translations and regional concept clarifiers
const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  'Software Developer': [
    {
      id: 'sd_q1',
      questionNumber: 1,
      questionText: 'What is polymorphism in Object-Oriented Programming, and what is the difference between compile-time and runtime polymorphism?',
      role: 'Software Developer',
      category: 'OOP & Core Concepts',
      difficulty: 'Intermediate',
      translations: {
        en: 'What is polymorphism in Object-Oriented Programming, and what is the difference between compile-time and runtime polymorphism?',
        ta: 'Object-Oriented Programming-ல் Polymorphism என்றால் என்ன, compile-time மற்றும் runtime polymorphism-க்கு இடையேயான வித்தியாசம் என்ன?',
        hi: 'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग में Polymorphism क्या है, और compile-time तथा runtime polymorphism में क्या अंतर है?',
        te: 'Object-Oriented Programming లో Polymorphism అంటే ఏమిటి? Compile-time మరియు runtime polymorphism మధ్య తేడా ఏమిటి?',
        ml: 'Object-Oriented Programming-ൽ Polymorphism എന്നാൽ എന്താണ്? Compile-time, runtime polymorphism തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?',
        kn: 'Object-Oriented Programming ನಲ್ಲಿ Polymorphism ಎಂದರೇನು? Compile-time ಮತ್ತು runtime polymorphism ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
        bn: 'Object-Oriented Programming-এ Polymorphism কি, এবং compile-time ও runtime polymorphism-এর মধ্যে পার্থক্য কি?',
        mr: 'Object-Oriented Programming मध्ये Polymorphism म्हणजे काय, आणि compile-time व runtime polymorphism मधील फरक काय आहे?',
        gu: 'Object-Oriented Programming માં Polymorphism શું છે, અને compile-time તથા runtime polymorphism વચ્ચેનો તફાવત શું છે?',
        pa: 'Object-Oriented Programming ਵਿੱਚ Polymorphism ਕੀ ਹੈ, ਅਤੇ compile-time ਤੇ runtime polymorphism ਵਿੱਚ ਕੀ ਫਰਕ ਹੈ?',
      },
      explanations: {
        en: 'This question tests your understanding of OOP design principles. It asks how a single method or interface can behave differently depending on the calling object, specifically comparing method overloading vs overriding.',
        ta: 'இந்த கேள்வி OOP தத்துவங்களை நீங்கள் புரிந்து கொண்டுள்ளீர்களா என சோதிக்கிறது. ஒரே interface அல்லது method name கொண்டு வெவ்வேறு objects எப்படி வித்தியாசமாக செயல்படுகின்றன (method overloading vs overriding) என்பதை தெளிவுபடுத்தவும்.',
        hi: 'यह प्रश्न OOP के सिद्धांतों की समझ की जांच करता है। एक ही इंटरफ़ेस या विधि अलग-अलग ऑब्जेक्ट्स के लिए कैसे भिन्न व्यवहार करती है (method overloading बनाम overriding), इसकी व्याख्या करें।',
        te: 'ఈ ప్రశ్న OOP భావనల పరిజ్ఞానాన్ని పరీక్షిస్తుంది. ఒకే మెథడ్ లేదా ఇంటర్‌ఫేస్ వేర్వేరు ఆబ్జెక్టుల ద్వారా ఎలా వేర్వేరుగా ప్రవర్తిస్తుంది (overloading vs overriding) అని అడుగుతోంది.',
        ml: 'OOP അടിസ്ഥാന തത്ത്വങ്ങളെക്കുറിച്ചുള്ള നിങ്ങളുടെ അറിവാണ് ഈ ചോദ്യം പരിശോധിക്കുന്നത്. ഒരൊറ്റ മെത്തേഡ് എങ്ങനെയാണ് വിവിധ ഒബ്ജക്ടുകളിൽ വ്യത്യസ്തമായി പ്രവർത്തിക്കുന്നത് എന്ന് വിശദീകരിക്കുക.',
        kn: 'ಈ ಪ್ರಶ್ನೆಯು OOP ಪರಿಕಲ್ಪನೆಗಳ ನಿಮ್ಮ ತಿಳುವಳಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ. ಒಂದೇ ಮೆಥಡ್ ವಿವಿಧ ಆಬ್ಜೆಕ್ಟ್‌ಗಳೊಂದಿಗೆ ಹೇಗೆ ವಿಭಿನ್ನವಾಗಿ ವರ್ತಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ.',
        bn: 'এই প্রশ্নটি OOP নীতির ধারণা যাচাই করে। কিভাবে একটি একক মেথড বিভিন্ন অবজেক্টের জন্য ভিন্নভাবে কাজ করে তা ব্যাখ্যা করুন।',
        mr: 'हा प्रश्न OOP च्या सिद्धांतांची समज तपासतो. एकाच इंटरफेस किंवा मेथडद्वारे विविध ऑब्जेक्ट्स कसे कार्य करतात हे स्पष्ट करा.',
        gu: 'આ પ્રશ્ન OOP ના સિદ્ધાંતોની તમારી સમજ ચકાસે છે. એક જ મેથડ અલગ-અલગ ઑબ્જેક્ટ્સ સાથે કેવી રીતે વર્તે છે તે સમજાવો.',
        pa: 'ਇਹ ਸਵਾਲ OOP ਦੇ ਨਿਯਮਾਂ ਦੀ ਸਮਝ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ। ਇੱਕੋ ਮੈਥਡ ਵੱਖ-ਵੱਖ ਆਬਜੈਕਟਸ ਨਾਲ ਕਿਵੇਂ ਵੱਖਰਾ ਵਿਵਹਾਰ ਕਰਦਾ ਹੈ, ਇਹ ਸਪੱਸ਼ਟ ਕਰੋ।',
      },
      keyConceptsToCover: ['Method overloading (compile-time)', 'Method overriding (runtime)', 'Dynamic dispatch / vtable', 'Code reusability and extensibility'],
    },
    {
      id: 'sd_q2',
      questionNumber: 2,
      questionText: 'Can you walk me through one of the most technically challenging projects listed on your resume and how you handled unexpected hurdles?',
      role: 'Software Developer',
      category: 'Resume & Project Architecture',
      difficulty: 'Intermediate',
      translations: {
        en: 'Can you walk me through one of the most technically challenging projects listed on your resume and how you handled unexpected hurdles?',
        ta: 'உங்கள் resume-ல் உள்ள திட்டங்களில் (projects) அதிக சவாலான ஒன்றை விளக்கி, அதில் ஏற்பட்ட தொழில்நுட்ப தடைகளை எப்படி சமாளித்தீர்கள் என்று கூறுங்கள்?',
        hi: 'अपने रेज़्यूमे में उल्लिखित सबसे चुनौतीपूर्ण प्रोजेक्ट के बारे में बताएं और आपने तकनीकी बाधाओं को कैसे हल किया?',
        te: 'మీ రెజ్యూమ్‌లోని అత్యంత సవాలుతో కూడిన ప్రాజెక్ట్ గురించి మరియు ఎదురైన సాంకేతిక అడ్డంకులను మీరు ఎలా పరిష్కరించారో వివరించండి?',
        ml: 'നിങ്ങളുടെ റെസ്യൂമെയിലുള്ള ഏറ്റവും വെല്ലുവിളി നിറഞ്ഞ പ്രൊജക്റ്റിനെക്കുറിച്ചും അതിലുണ്ടായ സാങ്കേതിക തടസ്സങ്ങൾ എങ്ങനെ പരിഹരിച്ചുവെന്നും വിശദീകരിക്കാമോ?',
        kn: 'ನಿಮ್ಮ ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿರುವ ಅತ್ಯಂತ ಸವಾಲಿನ ಯೋಜನೆಯನ್ನು ಮತ್ತು ಅದರಲ್ಲಿ ಎದುರಾದ ತಾಂತ್ರಿಕ ಅಡೆತಡೆಗಳನ್ನು ನೀವು ಹೇಗೆ ನಿಭಾಯಿಸಿದ್ದೀರಿ ಎಂಬುದನ್ನು ವಿವರಿಸಿ?',
        bn: 'আপনার রেজুমেতে থাকা সবচেয়ে চ্যালেঞ্জিং প্রজেক্ট সম্পর্কে বলুন এবং আপনি কিভাবে প্রযুক্তিগত বাধাগুলো সমাধান করেছেন?',
        mr: 'तुमच्या रिझ्युमेमधील सर्वात आव्हानात्मक प्रोजेक्टबद्दल सांगा आणि त्यातील तांत्रिक अडचणी तुम्ही कशा सोडवल्या?',
        gu: 'તમારા રિઝ્યુમેમાં ઉલ્લેખિત સૌથી પડકારજનક પ્રોજેક્ટ વિશે જણાવો અને તમે ટેકનિકલ મુશ્કેલીઓને કેવી રીતે ઉકેલી?',
        pa: 'ਆਪਣੇ ਰੈਜ਼ਿਊਮੇ ਵਿੱਚ ਦਿੱਤੇ ਸਭ ਤੋਂ ਚੁਣੌਤੀਪੂਰਨ ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ ਦੱਸੋ ਅਤੇ ਤੁਸੀਂ ਤਕਨੀਕੀ ਮੁਸ਼ਕਲਾਂ ਨੂੰ ਕਿਵੇਂ ਹੱਲ ਕੀਤਾ?',
      },
      explanations: {
        en: 'Focus on clear architecture and technical depth: clearly state the problem, technologies chosen, your exact contribution, a real obstacle (e.g. latency, concurrency, proxy attendance), and how you measured success.',
        ta: 'திட்டத்தின் கட்டமைப்பு மற்றும் உங்கள் பங்களிப்பை சுருக்கமாக கூறுங்கள். எழும் சிக்கலை (எ.கா: latency, security, proxy) நீங்கள் எவ்வாறு தீர்த்தீர்கள் மற்றும் அதன் அளவிடக்கூடிய முடிவை குறிப்பிடுங்கள்.',
        hi: 'प्रोजेक्ट की आर्किटेक्चर और अपनी व्यक्तिगत भूमिका पर ध्यान दें। किसी वास्तविक तकनीकी समस्या (जैसे लेटेंसी या डेटा लीकेज) और उसके समाधान का उल्लेख करें।',
        te: 'ప్రాజెక్ట్ ఆర్కిటెక్చర్, మీరు ఎదుర్కొన్న నిజమైన సాంకేతిక సమస్య మరియు దానిని పరిష్కరించిన విధానాన్ని వివరించండి.',
        ml: 'പ്രൊജക്റ്റിന്റെ ഘടന, നിങ്ങളുടെ റോൾ, നേരിട്ട പ്രധാന സാങ്കേതിക വെല്ലുവിളി, അത് എങ്ങനെ പരിഹരിച്ചു എന്നിവ വ്യക്തമായി പറയുക.',
        kn: 'ಪ್ರಾಜೆಕ್ಟ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಮತ್ತು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕೊಡುಗೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ. ಎದುರಾದ ನೈಜ ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ.',
        bn: 'প্রজেক্টের গঠন এবং আপনার ভূমিকা পরিষ্কারভাবে উপস্থাপন করুন। যেকোনো বাস্তব সমস্যা ও সমাধানের ব্যাখ্যা দিন।',
        mr: 'प्रकल्प रचना आणि तुमचे योगदान स्पष्ट करा. प्रत्यक्ष आलेली तांत्रिक अडचण व उपायावर प्रकाश टाका.',
        gu: 'પ્રોજેક્ટની રૂપરેખા અને તમારા યોગદાન પર ધ્યાન આપો. વાસ્તવિક ટેકનિકલ પડકાર અને તેના ઉકેલની ચર્ચા કરો.',
        pa: 'ਪ੍ਰੋਜੈਕਟ ਦੀ ਬਣਤਰ ਅਤੇ ਆਪਣੀ ਭੂਮਿਕਾ ਸਪੱਸ਼ਟ ਕਰੋ। ਆਈ ਅਸਲ ਸਮੱਸਿਆ ਅਤੇ ਉਸਦੇ ਹੱਲ ਦਾ ਵੇਰਵਾ ਦਿਓ।',
      },
      keyConceptsToCover: ['Project motivation and problem solved', 'Architecture stack choice', 'Concurrency or data security challenge', 'Quantifiable metric outcome'],
    },
    {
      id: 'sd_q3',
      questionNumber: 3,
      questionText: 'Explain the difference between SQL and NoSQL databases. When would you prefer a relational database with ACID guarantees over a NoSQL document store?',
      role: 'Software Developer',
      category: 'Databases & System Design',
      difficulty: 'Intermediate',
      translations: {
        en: 'Explain the difference between SQL and NoSQL databases. When would you prefer a relational database with ACID guarantees over a NoSQL document store?',
        ta: 'SQL மற்றும் NoSQL டேட்டாபேஸ்களுக்கு இடையிலான வேறுபாடு என்ன? NoSQL-ஐ விட ACID பண்புகள் கொண்ட Relational டேட்டாபேஸை எந்த சூழ்நிலையில் தேர்வு செய்வீர்கள்?',
        hi: 'SQL और NoSQL डेटाबेस में क्या अंतर है? NoSQL की तुलना में ACID गुणों वाले रिलेशनल डेटाबेस को कब प्राथमिकता देंगे?',
        te: 'SQL మరియు NoSQL డేటాబేస్ మధ్య తేడా ఏమిటి? ACID నియమాలు ఉండే Relational డేటాబేస్‌ను ఎప్పుడు ఎంచుకుంటారు?',
        ml: 'SQL, NoSQL ഡാറ്റാബേസുകൾ തമ്മിലുള്ള വ്യത്യാസം എന്താണ്? എപ്പോഴാണ് നിങ്ങൾ ACID ഗ്യാരന്റിയുള്ള റിലേഷണల్ ഡാറ്റാബേസ് തിരഞ്ഞെടുക്കുക?',
        kn: 'SQL ಮತ್ತು NoSQL ಡೇಟಾಬೇಸ್‌ಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು? ACID ನಿಯಮಗಳನ್ನು ಬೆಂಬಲಿಸುವ ರಿಲೇಶನಲ್ ಡೇಟಾಬೇಸ್ ಅನ್ನು ಯಾವಾಗ ಆರಿಸಿಕೊಳ್ಳುತ್ತೀರಿ?',
        bn: 'SQL এবং NoSQL ডাটাবেসের পার্থক্য কি? কোন পরিস্থিতিতে আপনি ACID নির্ভর রিলেশনাল ডাটাবেস পছন্দ করবেন?',
        mr: 'SQL आणि NoSQL डेटाबेस मधील फरक सांगा. ACID नियमांचे पालन करणारा रिलेशनल डेटाबेस कधी वापरणे योग्य ठरेल?',
        gu: 'SQL અને NoSQL ડેટાબેઝ વચ્ચે શું તફાવત છે? તમે ACID ગુણોવાળા રિલેશનલ ડેટાબેઝને ક્યારે પસંદ કરશો?',
        pa: 'SQL ਅਤੇ NoSQL ਡਾਟਾਬੇਸ ਵਿੱਚ ਕੀ ਅੰਤਰ ਹੈ? ACID ਨਿਯਮਾਂ ਵਾਲੇ ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਨੂੰ ਕਦੋਂ ਤਰਜੀਹ ਦਿਓਗੇ?',
      },
      explanations: {
        en: 'Clarifies schemas (rigid tabular vs flexible JSON/document), horizontal vs vertical scalability, and financial/transactional integrity (ACID) versus eventual consistency (BASE).',
        ta: 'அட்டவணை schema, ACID தன்மைகள் (Atomicity, Consistency, Isolation, Durability) மற்றும் financial/banking பரிவர்த்தனைகளுக்கு relational database ஏன் முக்கியம் என்பதை தெளிவுபடுத்துங்கள்.',
        hi: 'तालिका संरचना (Schema), ACID गुणधर्म और बैंकिंग या वित्तीय लेन-देन में रिलेशनल डेटाबेस की अनिवार्यता को स्पष्ट करें।',
        te: 'స్కీమా రకాలు, స్కేలబిలిటీ మరియు లావాదేవీల సమగ్రత (ACID) ఎందుకు ముఖ్యమో స్పష్టం చేయండి.',
        ml: 'స్కీమా ഘടന, ACID ഗുണങ്ങൾ, സാമ്പത്തിക ഇടപാടുകളിൽ റിലേഷണൽ ഡാറ്റാബേസിന്റെ പ്രാധാന്യം എന്നിവ വിശദീകരിക്കുക.',
        kn: 'ಸ್ಕೀಮಾ ರಚನೆ, ACID ಗುಣಲಕ್ಷಣಗಳು ಮತ್ತು ನಿಖರ ವಹಿವಾಟುಗಳಿಗೆ ರಿಲೇಶನಲ್ ಡೇಟಾಬೇಸ್ ಏಕೆ ಅವಶ್ಯಕವೆಂದು ವಿವರಿಸಿ.',
        bn: 'স্কিমা কাঠামো, ACID বৈশিষ্ট্য এবং আর্থিক লেনদেনে রিলেশনাল ডাটাবেসের প্রয়োজনীয়তা তুলে ধরুন।',
        mr: 'स्कीमा, ACID नियम आणि अचूक व्यवहारांसाठी रिलेशनल डेटाबेसचे महत्त्व स्पष्ट करा.',
        gu: 'સ્કીમા, ACID પ્રોપર્ટીઝ અને નાણાકીય વ્યવહારો માટે રિલેશનલ ડેટાબેઝ કેમ જરૂરી છે તે સ્પષ્ટ કરો.',
        pa: 'ਸਕੀਮਾ, ACID ਨਿਯਮ ਅਤੇ ਵਿੱਤੀ ਲੈਣ-ਦੇਣ ਵਿੱਚ ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਦੀ ਮਹੱਤਤਾ ਸਮਝਾਓ।',
      },
      keyConceptsToCover: ['Structured schema vs flexible document', 'ACID transaction guarantees', 'Vertical vs Horizontal scaling', 'Use case: Banking ledger vs Social media feed'],
    },
    {
      id: 'sd_q4',
      questionNumber: 4,
      questionText: 'How does an HTTP REST API work, and what is the difference between GET, POST, PUT, and PATCH methods?',
      role: 'Software Developer',
      category: 'Web APIs & Protocols',
      difficulty: 'Intermediate',
      translations: {
        en: 'How does an HTTP REST API work, and what is the difference between GET, POST, PUT, and PATCH methods?',
        ta: 'ஒரு HTTP REST API எவ்வாறு இயங்குகிறது? மேலும் GET, POST, PUT, மற்றும் PATCH முறைகளுக்கு இடையே உள்ள வேறுபாடுகள் யாவை?',
        hi: 'एक HTTP REST API कैसे काम करता है, और GET, POST, PUT तथा PATCH विधियों में क्या अंतर है?',
        te: 'HTTP REST API ఎలా పనిచేస్తుంది? GET, POST, PUT మరియు PATCH పద్ధతుల మధ్య తేడా ఏమిటి?',
        ml: 'ഒരു HTTP REST API എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത്? GET, POST, PUT, PATCH എന്നിവ തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?',
        kn: 'HTTP REST API ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ? GET, POST, PUT ಮತ್ತು PATCH ವಿಧಾನಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
        bn: 'HTTP REST API কিভাবে কাজ করে? GET, POST, PUT এবং PATCH মেথডগুলোর পার্থক্য কি?',
        mr: 'HTTP REST API कसे कार्य करते? आणि GET, POST, PUT व PATCH पद्धतींमधील फरक काय आहे?',
        gu: 'HTTP REST API કેવી રીતે કામ કરે છે? અને GET, POST, PUT તથા PATCH પદ્ધતિઓ વચ્ચે શું તફાવત છે?',
        pa: 'HTTP REST API ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ? ਅਤੇ GET, POST, PUT ਤੇ PATCH ਵਿੱਚ ਕੀ ਫਰਕ ਹੈ?',
      },
      explanations: {
        en: 'Stateless client-server architecture, standard HTTP status codes, and idempotency (calling multiple times produces the exact same state without side-effects).',
        ta: 'REST API-ன் stateless தன்மை, வளங்களை அணுகும் HTTP verbs மற்றும் PUT (முழு update) vs PATCH (பகுதி update) மற்றும் idempotency கருத்துக்களை விளக்குங்கள்.',
        hi: 'REST API की स्टेटलेस प्रकृति, HTTP मेथड्स और PUT (पूर्ण अपडेट) बनाम PATCH (आंशिक अपडेट) तथा आइडम्पोटेंसी को समझाएं।',
        te: 'క్లయింట్-సర్వర్ కమ్యూనికేషన్, స్టేట్‌లెస్ స్వభావం మరియు PUT vs PATCH తేడాలను తెలపండి.',
        ml: 'REST API-യുടെ ഘടന, HTTP വെർബുകൾ, പുട്ട് (PUT), പാച്ച് (PATCH) വ്യത്യാസങ്ങൾ എന്നിവ വിശദീകരിക്കുക.',
        kn: 'REST API ಯ ಸ್ಟೇಟ್‌ಲೆಸ್ ಸ್ವಭಾವ ಮತ್ತು PUT ಹಾಗೂ PATCH ನಡುವಿನ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ.',
        bn: 'REST API-র ক্লায়েন্ট-সার্ভার আর্কিটেকচার এবং PUT বনাম PATCH-এর পার্থক্য তুলে ধরুন।',
        mr: 'REST API ची रचना आणि PUT व PATCH मधील सूक्ष्म फरक स्पष्ट करा.',
        gu: 'REST API ની કાર્યપદ્ધતિ અને PUT તથા PATCH વચ્ચેનો તફાવત જણાવો.',
        pa: 'REST API ਦੀ ਕਾਰਜਪ੍ਰਣਾਲੀ ਅਤੇ PUT ਤੇ PATCH ਵਿਚਕਾਰਲਾ ਫਰਕ ਸਪੱਸ਼ਟ ਕਰੋ।',
      },
      keyConceptsToCover: ['Stateless protocol & resources', 'GET (Safe & Idempotent)', 'POST (Resource creation)', 'PUT (Idempotent complete replacement)', 'PATCH (Partial modification)'],
    },
    {
      id: 'sd_q5',
      questionNumber: 5,
      questionText: 'Describe a situation where you had to work through a disagreement within a technical project team. How did you arrive at a resolution?',
      role: 'Software Developer',
      category: 'Behavioral & Teamwork (STAR)',
      difficulty: 'Beginner',
      translations: {
        en: 'Describe a situation where you had to work through a disagreement within a technical project team. How did you arrive at a resolution?',
        ta: 'தொழில்நுட்ப திட்டத்தில் குழுவினருடன் கருத்து வேறுபாடு ஏற்பட்ட ஒரு தருணத்தை விவரித்து, அதை எவ்வாறு இணக்கமாக தீர்த்தீர்கள் என்று கூறுங்கள்?',
        hi: 'किसी ऐसी स्थिति का वर्णन करें जब प्रोजेक्ट टीम में तकनीकी मतभेद हुआ हो। आपने उसका समाधान कैसे निकाला?',
        te: 'ప్రాజెక్ట్ టీమ్‌లో సాంకేతిక అభిప్రాయ భేదం వచ్చిన సందర్భాన్ని మరియు దానిని ఎలా పరిష్కరించారో వివరించండి?',
        ml: 'പ്രൊജക്റ്റ് ടീമിൽ ഉണ്ടായ ഒരു സാങ്കേതിക അഭിപ്രായവ്യത്യാസത്തെക്കുറിച്ചും അത് എങ്ങനെ പരിഹരിച്ചുവെന്നും വിവരിക്കാമോ?',
        kn: 'ತಾಂತ್ರಿಕ ಯೋಜನಾ ತಂಡದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಉಂಟಾದ ಸಂದರ್ಭವನ್ನು ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಪರಿಹರಿಸಿದ್ದೀರಿ ಎಂದು ವಿವರಿಸಿ?',
        bn: 'প্রজেক্ট টিমে প্রযুক্তিগত মতবিরোধ দেখা দেওয়ার একটি ঘটনা এবং আপনি কিভাবে তা সমাধান করেছেন তা বলুন?',
        mr: 'प्रकल्प टीममध्ये तांत्रिक मतभेद झाल्यावर तुम्ही त्यावर कसा तोडगा काढला याचे वर्णन करा?',
        gu: 'પ્રોજેક્ટ ટીમમાં ટેકનિકલ મતભેદ થયો હોય તેવી પરિસ્થિતિ અને તમે તેનો ઉકેલ કેવી રીતે લાવ્યા તે જણાવો?',
        pa: 'ਪ੍ਰੋਜੈਕਟ ਟੀਮ ਵਿੱਚ ਤਕਨੀਕੀ ਮਤਭੇਦ ਹੋਣ ਦੀ ਸਥਿਤੀ ਅਤੇ ਤੁਸੀਂ ਉਸਨੂੰ ਕਿਵੇਂ ਸੁਲਝਾਇਆ, ਇਸਦਾ ਵਰਣਨ ਕਰੋ?',
      },
      explanations: {
        en: 'Uses the STAR method (Situation, Task, Action, Result). Highlight listening skills, objective benchmarking (such as running performance tests or pros/cons list), and maintaining a collaborative atmosphere.',
        ta: 'STAR வழிமுறையை (Situation, Task, Action, Result) பயன்படுத்துங்கள். தனிப்பட்ட வாக்குவாதமாக இல்லாமல் தொழில்நுட்ப சாதக பாதகங்களை (pros and cons) ஆராய்ந்து முடிவெடுத்ததை விளக்குங்கள்.',
        hi: 'STAR पद्धति (Situation, Task, Action, Result) का उपयोग करें। यह दिखाएं कि आपने डेटा या निष्पक्ष तर्कों के आधार पर टीम के साथ मिलकर निर्णय लिया।',
        te: 'STAR ఫ్రేమ్‌వర్క్ ఉపయోగించి, వ్యక్తిగత పంతం కాకుండా వాస్తవాలు మరియు డేటా ఆధారంగా సమస్యను ఎలా పరిష్కరించారో వివరించండి.',
        ml: 'STAR രീതി ഉപയോഗിച്ച്, ടീം വർക്കിനും വസ്തുതാപരമായ പരിഹാരങ്ങൾക്കും പ്രാധാന്യം നൽകി സംസാരിക്കുക.',
        kn: 'STAR ವಿಧಾನವನ್ನು ಬಳಸಿ, ಡೇಟಾ ಆಧಾರಿತ ಚರ್ಚೆಯ ಮೂಲಕ ಸಾಮరಸ್ಯದಿಂದ ತೀರ್ಮಾನ ತೆಗೆದುಕೊಂಡಿದ್ದನ್ನು ತಿಳಿಸಿ.',
        bn: 'STAR পদ্ধতি ব্যবহার করে দেখান কিভাবে ডেটা এবং গঠনমূলক আলোচনার মাধ্যমে সমস্যার সমাধান করেছিলেন।',
        mr: 'STAR पद्धतीचा वापर करून, वैयक्तिक मतभेदांऐवजी वस्तुनिष्ठ डेटाच्या आधारे घेतलेला निर्णय सांगा.',
        gu: 'STAR પદ્ધતિથી સમજાવો કે તમે ડેટા અને તાર્કિક ચર્ચા દ્વારા કેવી રીતે ટીમ સાથે સર્વસંમતિ સાધી.',
        pa: 'STAR ਵਿਧੀ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ ਦਿਖਾਓ ਕਿ ਤੁਸੀਂ ਤੱਥਾਂ ਅਤੇ ਟੀਮ ਵਰਕ ਨਾਲ ਮਸਲਾ ਕਿਵੇਂ ਹੱਲ ਕੀਤਾ।',
      },
      keyConceptsToCover: ['Clear STAR layout', 'Objective benchmarking (proof-of-concept / metrics)', 'Active listening and emotional intelligence', 'Positive outcome for the project deadline'],
    },
  ],
  'Python Developer': [
    {
      id: 'py_q1',
      questionNumber: 1,
      questionText: 'What are Python decorators, how do they leverage closures, and what is a practical real-world use case for them?',
      role: 'Python Developer',
      category: 'Python Advanced Concepts',
      difficulty: 'Intermediate',
      translations: {
        en: 'What are Python decorators, how do they leverage closures, and what is a practical real-world use case for them?',
        ta: 'Python decorators என்றால் என்ன? அவை closures-ஐ எப்படி பயன்படுத்துகின்றன? நிஜ வாழ்க்கையில் எங்கு பயன்படுகின்றன?',
        hi: 'Python Decorators क्या हैं, वे closures का उपयोग कैसे करते हैं, और वास्तविक दुनिया में इनका उपयोग क्या है?',
        te: 'Python decorators అంటే ఏమిటి? అవి closures ని ఎలా ఉపయోగిస్తాయి? రియల్-వరల్డ్ ఉదాహరణ ఏమిటి?',
        ml: 'Python decorators എന്നാൽ എന്താണ്? അവ ക്ലോഷറുകൾ എങ്ങനെ ഉപയോഗിക്കുന്നു? ഒരു പ്രായോഗിക ഉദാഹരണം പറയുക.',
        kn: 'Python decorators ಎಂದರೇನು? ಅವು closures ಅನ್ನು ಹೇಗೆ ಬಳಸಿಕೊಳ್ಳುತ್ತವೆ? ಪ್ರಾಯೋಗಿಕ ಉದಾಹರಣೆ ತಿಳಿಸಿ.',
        bn: 'Python decorators কি? তারা closures কিভাবে ব্যবহার করে এবং এদের ব্যবহারিক প্রয়োগ কি?',
        mr: 'Python Decorators म्हणजे काय? ते closures चा वापर कसा करतात आणि प्रत्यक्ष उपयोग काय आहे?',
        gu: 'Python Decorators શું છે, તે closures નો ઉપયોગ કેવી રીતે કરે છે અને વાસ્તવિક ઉદાહરણ આપો?',
        pa: 'Python Decorators ਕੀ ਹਨ, ਉਹ closures ਨੂੰ ਕਿਵੇਂ ਵਰਤਦੇ ਹਨ ਅਤੇ ਅਸਲ ਉਦਾਹਰਣ ਦਿਓ?',
      },
      explanations: {
        en: 'Explain higher-order functions (functions as first-class citizens taking another function as argument) returning a wrapper function, useful for logging, execution timing, and authentication checks.',
        ta: 'ஒரு function-ஐ மாற்றாமல் அதன் செயல்பாட்டை அதிகரிக்க பயன்படும் first-class function closure தத்துவம். Logging, authentication (@login_required), execution timing-ல் பயன்படுகிறது.',
        hi: 'बिना मूल कोड बदले फंक्शन की क्षमता बढ़ाने वाली तकनीक। ऑथेंटिकेशन, टाइमिंग और लॉगिंग में इसका मुख्य उपयोग होता है।',
        te: 'ఒక ఫంక్షన్‌ను ఆర్గ్యుమెంట్‌గా తీసుకుని అదనపు ఫీచర్లు జోడించే విధానం (ఉదా: లాగింగ్, ఆథరైజేషన్).',
        ml: 'ഫങ്ഷനുകളെ ആർഗ്യുമെന്റായി സ്വീകരിച്ച് പുതിയ ഫീച്ചറുകൾ നൽകുന്ന രീതി. ലോഗിംഗ്, ഓതന്റിക്കേഷൻ എന്നിവയിൽ ഉപയോഗിക്കുന്നു.',
        kn: 'ಮೂಲ ಕೋಡ್ ಬದಲಾಯಿಸದೆ ಹೊಸ ಸಾಮರ್ಥ್ಯ ಸೇರಿಸುವ ತಂತ್ರಜ್ಞಾನ. ಲಾಗಿಂಗ್ ಮತ್ತು ಭದ್ರತಾ ಪರಿಶೀಲನೆಗೆ ಬಳಕೆ.',
        bn: 'ফাংশনের মূল কোড পরিবর্তন না করে অতিরিক্ত কার্যকারিতা যোগ করার কৌশল। লগিং এবং প্রমাণীকরণে ব্যবহৃত হয়।',
        mr: 'फंक्शनच्या रचनेत बदल न करता अतिरिक्त सुविधा जोडण्याचे तंत्रज्ञान.',
        gu: 'મૂળ કોડ બદલ્યા વગર ફંક્શનમાં નવી કાર્યક્ષમતા ઉમેરવાની પદ્ધતિ.',
        pa: 'ਫੰਕਸ਼ਨ ਦਾ ਕੋਡ ਬਦਲੇ ਬਿਨਾਂ ਨਵੀਂ ਵਿਸ਼ੇਸ਼ਤਾ ਜੋੜਨ ਦੀ ਤਕਨੀਕ।',
      },
      keyConceptsToCover: ['First-class functions in Python', 'Closure definition with free variables', 'functools.wraps importance', 'Practical examples (@timer, @authenticated)'],
    },
    {
      id: 'py_q2',
      questionNumber: 2,
      questionText: 'What is the Python Global Interpreter Lock (GIL), and how does it impact CPU-bound vs I/O-bound multithreaded applications?',
      role: 'Python Developer',
      category: 'Concurrency & Internal Architecture',
      difficulty: 'Advanced',
      translations: {
        en: 'What is the Python Global Interpreter Lock (GIL), and how does it impact CPU-bound vs I/O-bound multithreaded applications?',
        ta: 'Python Global Interpreter Lock (GIL) என்றால் என்ன? அது CPU-bound மற்றும் I/O-bound multithreading பயன்பாடுகளை எவ்வாறு பாதிக்கிறது?',
        hi: 'Python Global Interpreter Lock (GIL) क्या है, और यह CPU-bound तथा I/O-bound ऍप्लिकेशन्स को कैसे प्रभावित करता है?',
        te: 'Python GIL అంటే ఏమిటి? అది CPU-bound మరియు I/O-bound అప్లికేషన్లపై ఎలాంటి ప్రభావం చూపుతుంది?',
        ml: 'Python Global Interpreter Lock (GIL) എന്നാൽ എന്താണ്? CPU-bound, I/O-bound ആപ്ലിക്കേഷനുകളെ ഇത് എങ്ങനെ ബാധിക്കുന്നു?',
        kn: 'Python GIL ಎಂದರೇನು? ಅದು CPU-bound ಮತ್ತು I/O-bound ಅಪ್ಲಿಕೇಶನ್‌ಗಳ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?',
        bn: 'Python Global Interpreter Lock (GIL) কি? এটি CPU-bound ও I/O-bound অ্যাপ্লিকেশনে কি প্রভাব ফেলে?',
        mr: 'Python GIL म्हणजे काय? आणि त्याचा CPU-bound व I/O-bound ॲप्लिकेशन्सवर काय परिणाम होतो?',
        gu: 'Python GIL શું છે અને તે CPU-bound તથા I/O-bound એપ્લિકેશન પર શું અસર કરે છે?',
        pa: 'Python GIL ਕੀ ਹੈ ਅਤੇ ਇਹ CPU-bound ਤੇ I/O-bound ਐਪਲੀਕੇਸ਼ਨਾਂ ਤੇ ਕੀ ਪ੍ਰਭਾਵ ਪਾਉਂਦਾ ਹੈ?',
      },
      explanations: {
        en: 'Explains CPython memory safety mutex that allows only one native thread to execute Python bytecode at a time, making multiprocessing needed for CPU-bound tasks, while asyncio or threading works fine for I/O.',
        ta: 'CPython-ல் ஒரே நேரத்தில் ஒரு thread மட்டுமே bytecode இயக்க அனுமதிக்கும் Mutex mechanism. CPU-bound பணிகளுக்கு multiprocessing, I/O-bound பணிகளுக்கு asyncio/threads சிறந்தது.',
        hi: 'CPython का म्यूटेक्स जो एक समय में केवल एक थ्रेड को बाइटकोड निष्पादित करने देता है। CPU कार्यों के लिए multiprocessing जरूरी है।',
        te: 'ఒకే సమయంలో ఒక థ్రెడ్ మాత్రమే కోడ్ రన్ చేసేలా నియంత్రించే మెకానిజం. CPU పనులకు మల్టీప్రాసెసింగ్ ఉపయోగిస్తారు.',
        ml: 'ഒരേ സമയം ഒരു ത്രെഡ് മാത്രം പ്രവർത്തിക്കാൻ അനുവദിക്കുന്ന മെക്കാനിസം. CPU ടാസ്കുകൾക്ക് multiprocessing ആവശ്യമാണ്.',
        kn: 'ಒಂದೇ ಸಮಯದಲ್ಲಿ ಒಂದು ಥ್ರೆಡ್ ಮಾತ್ರ ಕೋಡ್ ಚಲಾಯಿಸಲು ಅನುಮತಿಸುವ ನಿಯಂತ್ರಣ.',
        bn: 'এক সময়ে কেবল একটি থ্রেডকে বাইটকোড চালানোর অনুমতি দেয় এমন মেকানিজম।',
        mr: 'एका वेळी फक्त एकाच थ्रेडला काम करू देणारी अंतर्गत सुरक्षा प्रणाली.',
        gu: 'એક સમયે માત્ર એક જ થ્રેડને કોડ એક્ઝિક્યુટ કરવા દેતો સુરક્ષા લોક.',
        pa: 'ਇੱਕ ਸਮੇਂ ਸਿਰਫ਼ ਇੱਕ ਥ੍ਰੈਡ ਨੂੰ ਕੋਡ ਚਲਾਉਣ ਦੀ ਆਗਿਆ ਦੇਣ ਵਾਲਾ ਸੁਰੱਖਿਆ ਲਾਕ।',
      },
      keyConceptsToCover: ['CPython memory management & reference counts', 'Mutex preventing true multi-core parallel execution in threads', 'Multiprocessing module for CPU-bound tasks', 'Asyncio/threading for I/O-bound network calls'],
    },
  ],
};

// Fallback generator for other roles
function getFallbackQuestionsForRole(role: string): InterviewQuestion[] {
  return [
    {
      id: `${role.toLowerCase().replace(/\s+/g, '_')}_q1`,
      questionNumber: 1,
      questionText: `What are the core technical principles and modern toolchains required for a high-performing ${role}?`,
      role,
      category: 'Core Competency',
      difficulty: 'Intermediate',
      translations: {
        en: `What are the core technical principles and modern toolchains required for a high-performing ${role}?`,
        ta: `${role} பணியில் சிறப்பாக செயல்பட தேவையான முக்கிய தொழில்நுட்ப கோட்பாடுகள் மற்றும் கருவிகள் எவை?`,
        hi: `एक कुशल ${role} के रूप में कार्य करने के लिए आवश्यक मुख्य तकनीकी सिद्धांत और टूल्स क्या हैं?`,
        te: `${role} పాత్రలో రాణించడానికి అవసరమైన ముఖ్య సాంకేతిక సూత్రాలు మరియు టూల్స్ ఏమిటి?`,
        ml: `${role} റോളിൽ മികവ് പുലർത്താൻ ആവശ്യമായ പ്രധാന സാങ്കേതിക തത്വങ്ങളും ടൂളുകളും എന്തൊക്കെയാണ്?`,
        kn: `${role} ಹುದ್ದೆಯಲ್ಲಿ ಉತ್ತಮ ಸಾಧನೆ ಮಾಡಲು ಅಗತ್ಯವಾದ ಮುಖ್ಯ ತಾಂತ್ರಿಕ ತತ್ವಗಳು ಮತ್ತು ಉಪಕರಣಗಳು ಯಾವುವು?`,
        bn: `${role} হিসেবে সফল হতে প্রয়োজনীয় মূল প্রযুক্তিগত নীতি ও আধুনিক টুলস কি কি?`,
        mr: `${role} म्हणून यशस्वी होण्यासाठी आवश्यक मुख्य तांत्रिक तत्त्वे आणि टूल्स कोणती आहेत?`,
        gu: `${role} તરીકે શ્રેષ્ઠ કાર્ય કરવા માટે જરૂરી મુખ્ય ટેકનિકલ સિદ્ધાંતો અને ટૂલ્સ કયા છે?`,
        pa: `${role} ਵਜੋਂ ਕਾਮਯਾਬ ਹੋਣ ਲਈ ਲੋੜੀਂਦੇ ਮੁੱਖ ਤਕਨੀਕੀ ਅਸੂਲ ਅਤੇ ਟੂਲਸ ਕਿਹੜੇ ਹਨ?`,
      },
      explanations: {
        en: `Explain the foundational competencies, development lifecycle, and key libraries relevant to ${role}.`,
        ta: `${role} பணிக்கு அவசியமான அடிப்படைக் கோட்பாடுகள், மென்பொருள் தயாரிப்பு சுழற்சி மற்றும் கருவிகளை விளக்குங்கள்.`,
        hi: `${role} के लिए आवश्यक मूलभूत दक्षताओं, विकास चक्र और टूल्स की व्याख्या करें।`,
        te: `${role} పాత్రకు సంబంధించిన ప్రాథమిక నైపుణ్యాలు మరియు టూల్స్‌ను వివరించండి.`,
        ml: `${role} റോളിന് ആവശ്യമായ അടിസ്ഥാന കഴിവുകളും ടൂളുകളും വ്യക്തമാക്കുക.`,
        kn: `${role} ಪಾತ್ರಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಮೂಲಭೂತ ಕೌಶಲ್ಯಗಳು ಮತ್ತು ಸಾಧನಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ.`,
        bn: `${role} পদের জন্য প্রয়োজনীয় মূল দক্ষতা এবং ব্যবহৃত টুলসগুলো সংক্ষেপে বলুন।`,
        mr: `${role} भूमिकेसाठी आवश्यक मूलभूत कौशल्ये आणि टूल्स स्पष्ट करा.`,
        gu: `${role} માટે જરૂરી મૂળભૂત કૌશલ્યો અને ટૂલ્સની સમજૂતી આપો.`,
        pa: `${role} ਲਈ ਲੋੜੀਂਦੀਆਂ ਮੁੱਖ ਮੁਹਾਰਤਾਂ ਅਤੇ ਟੂਲਸ ਬਾਰੇ ਦੱਸੋ।`,
      },
      keyConceptsToCover: ['Standard design patterns', 'Toolchains and version control', 'Reliability and optimization', 'Team delivery methodology'],
    },
    {
      id: `${role.toLowerCase().replace(/\s+/g, '_')}_q2`,
      questionNumber: 2,
      questionText: `Walk me through how you approach debugging an unexpected issue in production as a ${role}.`,
      role,
      category: 'Problem Solving & Troubleshooting',
      difficulty: 'Intermediate',
      translations: {
        en: `Walk me through how you approach debugging an unexpected issue in production as a ${role}.`,
        ta: `Production-ல் எதிர்பாராத பிழை ஏற்பட்டால், ஒரு ${role}-ஆக அதை எவ்வாறு முறையான அணுகுமுறையில் சரிசெய்வீர்கள்?`,
        hi: `प्रोडक्शन में अचानक आने वाली समस्या को डीबग करने के लिए आपका क्या दृष्टिकोण होगा?`,
        te: `ప్రొడక్షన్‌లో అనుకోని సమస్య వచ్చినప్పుడు దాన్ని డీబగ్ చేయడానికి మీ విధానం ఏమిటి?`,
        ml: `പ്രൊഡക്ഷനിൽ അപ്രതീക്ഷിത പ്രശ്നം ഉണ്ടായാൽ അത് എങ്ങനെ ഡിബഗ് ചെയ്യുമെന്ന് വിശദീകരിക്കാമോ?`,
        kn: `ಪ್ರೊಡಕ್ಷನ್‌ನಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ಸಮಸ್ಯೆ ಎದುರಾದಾಗ ಅದನ್ನು ಡೀಬಗ್ ಮಾಡಲು ನಿಮ್ಮ ಕ್ರಮವೇನು?`,
        bn: `প্রোডাকশনে কোনো অপ্রত্যাশিত সমস্যা দেখা দিলে আপনি কিভাবে তা ডিবাগ করবেন?`,
        mr: `प्रॉडक्शनमध्ये अनपेक्षित समस्या आल्यास तुम्ही ती कशी सोडवाल?`,
        gu: `પ્રોડક્શનમાં અણધારી સમસ્યા આવે ત્યારે તમે તેને કેવી રીતે ડીબગ કરશો?`,
        pa: `ਪ੍ਰੋਡਕਸ਼ਨ ਵਿੱਚ ਅਣਕਿਆਸੀ ਸਮੱਸਿਆ ਆਉਣ ਤੇ ਤੁਸੀਂ ਉਸਨੂੰ ਕਿਵੇਂ ਹੱਲ ਕਰੋਗੇ?`,
      },
      explanations: {
        en: `Focus on structured investigation: checking logs/metrics, isolating variables, reproducing the issue safely, applying a hotfix, and drafting a post-mortem.`,
        ta: `முறையான விசாரணை: Error logs மற்றும் metrics பார்த்தல், சிக்கலை மறுஉருவாக்கம் செய்தல், hotfix போடுதல், மற்றும் எதிர்காலத்தில் வராமல் தடுக்க root cause analysis செய்தல்.`,
        hi: 'लॉग्स और मेट्रिक्स की जांच, समस्या को रीप्रोड्यूस करना, हॉटफिक्स लगाना और रूट-कॉज एनालिसिस करना समझाएं।',
        te: 'లాగ్స్ చెక్ చేయడం, సమస్యను గుర్తించడం మరియు భవిష్యత్తులో రాకుండా నివారించే పద్ధతి వివరించండి.',
        ml: 'ലോഗുകൾ പരിശോധിക്കുക, വേഗത്തിലുള്ള പരിഹാരം കാണുക, ഭാവിയിൽ ആവർത്തിക്കാതിരിക്കാൻ നടപടി സ്വീകരിക്കുക എന്നിവ പറയുക.',
        kn: 'ಲಾಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು, ಮೂಲ ಕಾರಣ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳುವ ವಿಧಾನ ತಿಳಿಸಿ.',
        bn: 'লগ পর্যবেক্ষণ, সমস্যার কারণ অনুসন্ধান এবং স্থায়ী সমাধানের পদক্ষেপ তুলে ধরুন।',
        mr: 'लॉग्स तपासणे, मूळ कारण शोधणे आणि कायमस्वरूपी उपाय योजना स्पष्ट करा.',
        gu: 'લૉગ્સ તપાસવા, મૂળ કારણ શોધવું અને કાયમી ઉકેલ લાવવાની પ્રક્રિયા જણાવો.',
        pa: 'ਲਾਗਸ ਦੀ ਜਾਂਚ, ਅਸਲ ਕਾਰਨ ਲੱਭਣਾ ਅਤੇ ਪੱਕਾ ਹੱਲ ਕਰਨ ਦਾ ਤਰੀਕਾ ਦੱਸੋ।',
      },
      keyConceptsToCover: ['Log & observability analysis', 'Rollback vs hotfix strategy', 'Root Cause Analysis (RCA)', 'Unit test addition preventing regressions'],
    },
  ];
}


export class AIService {
  // 1. Analyze Resume
  static analyzeResume(resume: ResumeData, targetRole: string): ATSAnalysis {
    const roleConfig = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Developer'];
    const resumeText = [
      resume.summary,
      ...resume.technicalSkills,
      ...resume.projects.flatMap((p) => [p.title, p.problem, p.solution, ...p.bullets, ...p.technologies]),
      ...resume.experience.flatMap((e) => [e.company, e.role, ...e.bullets]),
      ...resume.certifications.map((c) => c.name),
    ]
      .join(' ')
      .toLowerCase();

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    const allKeywords = [...roleConfig.core, ...roleConfig.tools, ...roleConfig.concepts];
    allKeywords.forEach((kw) => {
      if (resumeText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordMatchPct = Math.round((matchedKeywords.length / (allKeywords.length || 1)) * 100);
    const contentQuality = Math.min(95, Math.max(65, 75 + (resume.projects.length >= 2 ? 10 : 0) + (resume.summary.length > 100 ? 5 : -5)));
    const formattingScore = resume.template === 'ats' ? 95 : resume.template === 'technical' ? 92 : 88;
    const roleRelevance = Math.min(98, Math.max(60, Math.round((keywordMatchPct * 0.7) + 25)));
    const readabilityScore = 88;
    const structureScore = 84;
    const projectQuality = resume.projects.some((p) => p.bullets.some((b) => /\d+%|\d+\s*(ms|hours|users)/i.test(b))) ? 88 : 74;

    const overallScore = Math.round(
      keywordMatchPct * 0.35 +
      contentQuality * 0.2 +
      formattingScore * 0.15 +
      roleRelevance * 0.2 +
      structureScore * 0.1
    );

    const strengths: string[] = [
      `Solid foundation in core technologies: ${resume.technicalSkills.slice(0, 4).join(', ')}.`,
      `Includes ${resume.projects.length} documented real-world projects with clear objectives.`,
      `Clean standard chronological section hierarchy easily readable by automated parsers.`,
    ];

    const weaknesses: string[] = [];
    if (missingKeywords.length > 0) {
      weaknesses.push(`Key industry keywords for ${targetRole} are missing or less evident: ${missingKeywords.slice(0, 3).join(', ')}.`);
    }
    if (!resume.projects.some((p) => p.bullets.some((b) => /%|\$|\b\d+\b/i.test(b)))) {
      weaknesses.push('Project bullet points could better quantify measurable business or performance impacts (e.g., latency, users, % improvement).');
    }

    const suggestions = [
      {
        section: 'Technical Skills',
        current: resume.technicalSkills.slice(0, 5).join(', '),
        suggested: [...resume.technicalSkills.slice(0, 5), ...missingKeywords.slice(0, 2)].join(', '),
        reason: `Adding verified proficiencies in ${missingKeywords.slice(0, 2).join(' & ')} will increase role relevance score.`,
      },
      {
        section: 'Projects (XYZ Formula)',
        current: 'Built attendance system using Python and OpenCV.',
        suggested: 'Engineered a QR attendance verification system with Python and OpenCV, eliminating proxy records by 98% across 4 classrooms.',
        reason: 'Quantifying concrete metrics immediately captures hiring manager and ATS interest.',
      },
      {
        section: 'Professional Summary',
        current: resume.summary.slice(0, 80) + '...',
        suggested: `Target-aligned summary spotlighting ${targetRole} domain proficiencies and algorithmic problem solving.`,
        reason: 'Front-loading target keywords in the top 3 lines boosts early-stage scanning relevance.',
      },
    ];

    return {
      overallScore: Math.min(98, Math.max(55, overallScore)),
      keywordMatch: keywordMatchPct,
      formattingScore,
      roleRelevance,
      readabilityScore,
      contentQuality,
      structureScore,
      projectQuality,
      matchedKeywords,
      missingKeywords,
      strengths,
      weaknesses,
      suggestions,
    };
  }

  // 2. Match Resume to Job Description
  static matchResumeToJob(resume: ResumeData, jobDescription: string, jobTitle = 'Target Role'): JobMatchResult {
    const jdLower = jobDescription.toLowerCase();
    const resumeText = [
      resume.summary,
      ...resume.technicalSkills,
      ...resume.projects.flatMap((p) => [p.title, ...p.bullets, ...p.technologies]),
    ].join(' ').toLowerCase();

    // Extract potential tech buzzwords from JD
    const candidateKeywords = [
      'python', 'java', 'javascript', 'typescript', 'c++', 'sql', 'nosql', 'mongodb', 'postgresql',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'rest api', 'graphql', 'git', 'ci/cd',
      'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring boot', 'linux',
      'agile', 'scrum', 'data structures', 'algorithms', 'microservices', 'unit testing', 'redis'
    ];

    const jdKeywords = candidateKeywords.filter((kw) => jdLower.includes(kw));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    jdKeywords.forEach((kw) => {
      if (resumeText.includes(kw)) {
        matchedSkills.push(kw.toUpperCase());
      } else {
        missingSkills.push(kw.toUpperCase());
      }
    });

    const matchScore = jdKeywords.length > 0
      ? Math.round((matchedSkills.length / jdKeywords.length) * 100)
      : 82;

    return {
      jobTitle,
      company: 'Target Employer',
      matchScore: Math.max(45, Math.min(95, matchScore)),
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['PYTHON', 'SQL', 'GIT', 'REST API'],
      missingSkills: missingSkills.length > 0 ? missingSkills : ['DOCKER', 'KUBERNETES', 'CI/CD PIPELINES'],
      experienceAlignment: 'Strong academic and project alignment for entry-level / early-career requirements.',
      keywordSuggestions: [
        'Incorporate highlighted keywords naturally within project impact bullets.',
        'Explicitly state experience with version control workflows (Git branching, PR reviews).',
        'Add brief mention of containerization or testing frameworks if practiced.',
      ],
      recommendations: [
        'Tailor your resume headline directly matching the role title.',
        'Move the most relevant project demonstrating required technologies to the top.',
        'Use standard bullet phrasing like "Designed", "Engineered", "Optimized".',
      ],
    };
  }

  // 3. Generate Interview Questions
  static generateInterviewQuestions(config: InterviewConfig, _resumeContext?: ResumeData, _previousQA: InterviewAnswerRecord[] = []): InterviewQuestion[] {
    const list = QUESTION_BANK[config.targetRole] || QUESTION_BANK['Software Developer'];
    const fallback = getFallbackQuestionsForRole(config.targetRole);
    const combined = [...list, ...fallback];

    // Select questions up to configured count
    const count = Math.min(config.questionCount, combined.length);
    const selected = combined.slice(0, count).map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));

    return selected;
  }

  // 4. Explain Question (Multilingual Concept Clarifier Without Revealing Answer)
  static explainQuestion(question: InterviewQuestion, explanationLang: LanguageCode): string {
    if (question.explanations && question.explanations[explanationLang]) {
      return question.explanations[explanationLang];
    }
    return question.explanations?.en || 'This question assesses your conceptual understanding, practical problem-solving approach, and ability to structure a clear professional answer.';
  }

  // 5. Evaluate Interview Answer (Adaptive & Nuanced)
  static evaluateInterviewAnswer(
    question: InterviewQuestion,
    userAnswer: string,
    _answerLang: LanguageCode,
    feedbackLang: LanguageCode
  ): InterviewAnswerRecord['evaluation'] {
    const trimmed = userAnswer.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    // Check key concepts coverage
    const matchedConcepts = question.keyConceptsToCover.filter((concept) => {
      const tokens = concept.toLowerCase().split(/[\s,()]+/);
      return tokens.some((t) => t.length > 3 && trimmed.toLowerCase().includes(t));
    });

    let score = 75;
    let technical = 76;
    let comm = 78;
    let relevance = 80;
    let struct = 75;
    let confidence = 75;

    if (wordCount < 10) {
      score = 48;
      technical = 45;
      comm = 50;
      relevance = 60;
      struct = 45;
      confidence = 50;
    } else if (wordCount < 25) {
      score = 65;
      technical = 65;
      comm = 70;
      relevance = 75;
      struct = 65;
      confidence = 68;
    } else {
      score = Math.min(94, 75 + matchedConcepts.length * 5 + Math.min(10, Math.floor(wordCount / 15)));
      technical = Math.min(95, 78 + matchedConcepts.length * 5);
      comm = Math.min(92, 76 + (wordCount > 35 ? 8 : 4));
      relevance = 85;
      struct = Math.min(90, 75 + (trimmed.includes('because') || trimmed.includes('for example') || trimmed.includes('எனவே') || trimmed.includes('உதாரணமாக') ? 8 : 4));
      confidence = 82;
    }

    const isTamil = feedbackLang === 'ta';

    const whatWentWell = isTamil
      ? (wordCount > 25
          ? 'முக்கியமான தொழில்நுட்ப சொற்களை சரியாக குறிப்பிட்டு, தெளிவான கண்ணோட்டத்துடன் பதிலளித்தீர்கள்.'
          : 'பதிலை தொடங்கிய விதம் நன்று. ஆனால் இன்னும் கூடுதல் விளக்கங்களை இணைக்கலாம்.')
      : (wordCount > 25
          ? `Good articulation of fundamental concepts. Your response addresses the core prompt directly.`
          : `You identified the central theme of the question quickly.`);

    const whatCanImprove = isTamil
      ? 'பதிலை தொடங்கும் போது ஒரு நேரடி வரையறையுடன் (1-sentence definition) தொடங்கி, பின்னர் நிஜ உதாரணத்தை கூறினால் இன்னும் சிறப்பாக இருக்கும்.'
      : `Structure your response with a concise 1-sentence definition upfront before presenting code or project examples.`;

    const recommendedPractice = isTamil
      ? 'STAR முறையை (Situation, Task, Action, Result) பயன்படுத்தி பதிலை வடிவமைக்க பயிற்சி செய்யுங்கள்.'
      : `Apply the STAR framework (Situation, Task, Action, Result) when elaborating on practical implementations.`;

    return {
      score,
      technicalKnowledge: technical,
      communication: comm,
      relevance,
      structure: struct,
      confidenceIndicator: confidence,
      whatWentWell,
      whatCanImprove,
      recommendedPractice,
    };
  }

  // 6. Identify Skill Gaps
  static identifySkillGaps(userSkills: string[], targetRole: string): SkillGapItem[] {
    const roleConfig = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Developer'];
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());

    const gaps: SkillGapItem[] = [];

    roleConfig.core.forEach((skill, idx) => {
      const hasSkill = normalizedUserSkills.some((s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
      if (!hasSkill && gaps.length < 5) {
        gaps.push({
          id: `gap_core_${idx}`,
          name: skill,
          category: 'Technical',
          currentLevel: 45,
          targetLevel: 85,
          gap: 40,
          priority: 'High',
          status: 'Gap',
          whyItMatters: `High priority requirement for ${targetRole} positions. Frequently evaluated in initial technical screening rounds.`,
          whatToLearn: [`Core syntax and mechanics of ${skill}`, `Common design patterns and production best practices`, `High-frequency interview questions and edge cases`],
          practiceTask: `Complete 3 focused hands-on implementation exercises utilizing ${skill}.`,
          projectIdea: `Integrate ${skill} into an existing portfolio project and document performance metrics.`,
          estimatedHours: 6,
        });
      }
    });

    roleConfig.tools.forEach((tool, idx) => {
      const hasTool = normalizedUserSkills.some((s) => s.includes(tool.toLowerCase()));
      if (!hasTool && gaps.length < 5) {
        gaps.push({
          id: `gap_tool_${idx}`,
          name: tool,
          category: 'Tool',
          currentLevel: 40,
          targetLevel: 80,
          gap: 40,
          priority: 'Medium',
          status: 'Gap',
          whyItMatters: `Standard industry toolchain expectation across engineering teams.`,
          whatToLearn: [`Installation and CLI fundamentals`, `Configuration files and automation workflows`, `Debugging common runtime errors`],
          practiceTask: `Set up a working environment or configuration pipeline using ${tool}.`,
          projectIdea: `Write automated workflow scripts leveraging ${tool}.`,
          estimatedHours: 4,
        });
      }
    });

    return gaps;
  }

  // 7. Conversational AI Assistant
  static async careerChat(
    message: string,
    context: { user: UserProfile; resume: ResumeData; role: string; gaps: SkillGapItem[]; plan: LearningPlanData },
    language: LanguageCode = 'en'
  ): Promise<string> {
    const lower = message.toLowerCase();

    if (language === 'ta') {

      if (lower.includes('python')) {
        return `வணக்கம் ${context.user.name}! Python நேர்காணலுக்கு (Interview) தயாராக நீங்கள் கவனிக்க வேண்டிய முக்கிய பகுதிகள்:
1. **Core Data Structures:** Lists vs Tuples vs Sets, Dict memory hashing.
2. **Advanced Concepts:** Decorators, Closures, Generators (yield), List comprehensions.
3. **Concurrency:** GIL (Global Interpreter Lock), asyncio vs threading.
4. **Database & APIs:** Flask/FastAPI REST endpoints மற்றும் SQL JOIN queries.

உங்களின் 4-Week Learning Plan-ல் Week 2-ல் இதற்கான தினசரி பயிற்சிகள் உள்ளன. இப்போது ஒரு Mock Interview தொடங்க விரும்புகிறீர்களா?`;
      }
      if (lower.includes('resume')) {
        return `உங்கள் Resume-ஐ மேம்படுத்த சில முக்கிய ஆலோசனைகள்:
• திட்டங்களில் (Projects) **XYZ Formula** பயன்படுத்துங்கள்: "Accomplished [X] as measured by [Y], by doing [Z]".
• ${context.role}-க்கு முக்கியமான முக்கிய வார்த்தைகளை (${context.gaps.slice(0, 2).map((g) => g.name).join(', ')}) இணைக்கவும்.
• ATS Score தற்போது **${context.resume.atsScoreEstimate}%** ஆக உள்ளது. Live Resume Builder-ல் AI Improve பொத்தானை பயன்படுத்தி மேலும் உயர்த்தலாம்!`;
      }
      return `வணக்கம் ${context.user.name}! நான் உங்கள் AI Career Coach. உங்கள் இலக்கு பணி: **${context.role}**. நீங்கள் Resume திருத்தம், Mock Interview பயிற்சி, அல்லது இன்றைய தினசரி கற்றல் திட்டத்தை பற்றி என்னிடம் கேட்கலாம்!`;
    }

    if (language === 'hi') {
      if (lower.includes('python') || lower.includes('interview')) {
        return `नमस्ते ${context.user.name}! ${context.role} इंटरव्यू की तैयारी के लिए महत्वपूर्ण सुझाव:
1. **डेटा स्ट्रक्चर्स और एल्गोरिदम:** Arrays, Hashing, Two-Pointer तकनीक।
2. **प्रोजेक्ट विवरण:** अपने QR-Attendance प्रोजेक्ट के तकनीकी आर्किटेक्चर को STAR मेथड से समझाएं।
3. **मॉक इंटरव्यू:** अभी हमारे AI Mock Interview रूम में 5 प्रश्नों का अभ्यास करें।`;
      }
      return `नमस्ते ${context.user.name}! मैं आपका AI करियर कोच हूँ। आपके लक्षित रोल **${context.role}** के लिए मैं रेज़्यूमे सुधार, मॉक इंटरव्यू और 4-सप्ताह के अध्ययन योजना में आपकी सहायता कर सकता हूँ।`;
    }

    // Default English response with context
    if (lower.includes('prepare') || lower.includes('python') || lower.includes('interview')) {
      return `Great question, ${context.user.name}! Here is your personalized preparation strategy for **${context.role}**:

1. **Prioritize Your Current Skill Gaps:**
   - Focus on **${context.gaps[0]?.name || 'RESTful APIs'}** and **${context.gaps[1]?.name || 'Docker Containerization'}**.
2. **Sharpen Technical Explanations:**
   - Practice explaining your **${context.resume.projects[0]?.title || 'Key Project'}** with exact metrics (e.g. latency, users, throughput).
3. **Daily Action Item:**
   - You currently have a **${context.plan.streakDays}-day streak** 🔥. Complete today's scheduled task in your 4-Week Plan to keep the momentum going!

Would you like me to start a quick 5-question technical mock interview right now?`;
    }

    if (lower.includes('resume') || lower.includes('ats') || lower.includes('score')) {
      return `Your current resume ATS readiness estimate is **${context.resume.atsScoreEstimate}%** for **${context.role}**.

Here is how you can push it past 90%:
• **Quantify Bullet Points:** Replace phrases like "built an API" with "Engineered REST client modules cutting latency by 22%".
• **Integrate Keywords:** Ensure keywords like \`${context.gaps.slice(0, 3).map((g) => g.name).join('`, `')}\` appear naturally in your experience or project sections.
• **Use the Live Resume Builder:** Open our Live Resume Builder to preview template formatting in real-time.`;
    }

    if (lower.includes('star') || lower.includes('behavioral')) {
      return `The **STAR Method** is essential for high behavioral interview scores:
• **S - Situation:** Set the stage in 1–2 sentences (e.g., "During the Smart Campus hackathon, our QR scan latency spiked to 4 seconds...").
• **T - Task:** Clarify your exact responsibility.
• **A - Action:** Detail what YOU specifically coded, diagnosed, or coordinated.
• **R - Result:** Highlight the quantifiable outcome ("Reduced latency to 180ms and placed in the top 5 finalists").`;
    }

    return `Hello ${context.user.name}! As your CareerAI Coach, I'm here to help you get hired as a **${context.role}**. 

I have full visibility into your profile, your ${context.resume.atsScoreEstimate}% ATS-rated resume, your skill gaps (${context.gaps.slice(0, 2).map((g) => g.name).join(', ')}), and your 4-Week Career Readiness Plan. 

You can ask me to:
• Improve any resume bullet point or project summary
• Conduct an on-the-spot technical or behavioral mock drill
• Explain complex technical concepts in your preferred regional language (Tamil, Hindi, etc.)
• Review your progress towards live campus and off-campus placements!`;
  }

  // 8. AI Bullet Point Improver (Google XYZ Formula)
  static improveResumeBullet(bullet: string, _role: string, mode: 'xyz' | 'concise' | 'ats' | 'action' = 'xyz'): string {
    const trimmed = bullet.trim();
    if (!trimmed) return 'Engineered scalable system module utilizing best-practice design patterns, achieving 30% performance boost.';

    if (mode === 'xyz') {
      if (trimmed.toLowerCase().includes('qr') || trimmed.toLowerCase().includes('attendance')) {
        return 'Architected dynamic QR code verification engine using Python OpenCV and Flask, mitigating proxy attendance by 98% across 120+ active student check-ins.';
      }
      if (trimmed.toLowerCase().includes('api') || trimmed.toLowerCase().includes('rest')) {
        return 'Engineered reusable REST API client modules in Python to interface with internal microservices, cutting response processing latency by 22%.';
      }
      return `Developed and optimized core software modules for ${trimmed.replace(/^[-*•]\s*/, '')}, improving execution efficiency by 25% and reducing manual overhead.`;
    }

    if (mode === 'concise') {
      return trimmed.replace(/\b(was responsible for|helped in|worked on|tried to)\b/gi, 'Led').trim();
    }

    if (mode === 'ats') {
      return `${trimmed} — verified using Git version control, unit testing frameworks, and continuous integration workflows.`;
    }

    return `Spearheaded end-to-end development of ${trimmed.replace(/^[-*•]\s*/, '')}, delivering robust functionality ahead of project deadline.`;
  }
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from './src/models/Scheme.js';

dotenv.config();

const schemes = [
  {
    title: "National Overseas Scholarship For Students With Disabilities",
    category: "Education & Learning",
    ministry: "Ministry Of Social Justice and Empowerment",
    description: {
      raw: "A scholarship scheme by the Ministry of Social Justice & Empowerment for regular, full-time students with disabilities to obtain higher education viz., Master's degree, or Ph.D. courses from foreign universities, in one of the specified fields of study.",
      simplified: { en: "Higher education scholarship for students with disabilities to study abroad." }
    },
    benefits: "Full tuition fee + living allowance + travel costs",
    eligibilityRules: { age: { min: 18, max: 35 }, hasDisability: true, isStudent: true },
    schemeType: "Central",
    tags: ["Degree", "Empowerment", "Higher Education", "Person With Disability", "PhD", "Scholarship"],
    isActive: true
  },
  {
    title: "RMEWF-Financial Assistance For Medical Treatment Of Ex-Servicemen",
    category: "Health & Wellness",
    ministry: "Ministry Of Defence",
    description: {
      raw: "A scheme to provide financial assistance to non-pensioner Ex-Servicemen/widows of ranks up to Havildar/equivalent to meet routine medical expenses.",
      simplified: { en: "Medical help for non-pensioner ex-servicemen and their widows." }
    },
    benefits: "Financial assistance for medical treatment",
    eligibilityRules: { age: { min: 45, max: 100 } },
    schemeType: "Central",
    tags: ["Ex-Servicemen", "Health Checkup", "Medical Treatment", "Financial Assistance"],
    isActive: true
  },
  {
    title: "Stand-Up India",
    category: "Business & Entrepreneurship",
    ministry: "Ministry Of Finance",
    description: {
      raw: "A scheme by Ministry of Finance for financing SC/ST and Women Entrepreneurs by facilitating bank loans for setting up a greenfield project Enterprise in manufacturing, services, trading sector and activities allied to agriculture.",
      simplified: { en: "Large loans for women and SC/ST people to start new businesses." }
    },
    benefits: "Bank loan between ₹10 lakh and ₹1 crore",
    eligibilityRules: { age: { min: 18, max: 100 }, gender: ["Female"], castes: ["SC", "ST"] },
    schemeType: "Central",
    tags: ["Business", "Entrepreneur", "Finance", "Loan"],
    isActive: true
  },
  {
    title: "Pradhan Mantri Suraksha Bima Yojana",
    category: "Banking,Financial Services and Insurance",
    ministry: "Ministry Of Finance",
    description: {
      raw: "An Accident Insurance Scheme offering accidental death and disability cover for death or disability on account of an accident.",
      simplified: { en: "Affordable accidental insurance for everyone." }
    },
    benefits: "₹2 Lakh cover for accidental death or total disability",
    eligibilityRules: { age: { min: 18, max: 70 } },
    schemeType: "Central",
    tags: ["Accident Insurance", "Bank Account Holders", "Death Insurance", "Insurance"],
    isActive: true
  },
  {
    title: "RMEWF-Financial Assistance To 100% Disabled Child Of Ex-Servicemen",
    category: "Social welfare & Empowerment",
    ministry: "Ministry Of Defence",
    description: {
      raw: "A scheme to provide financial assistance to Ex-Servicemen or their widows for their 100% disabled child.",
      simplified: { en: "Financial support for 100% disabled children of ex-servicemen." }
    },
    benefits: "₹3,000 per month per child",
    eligibilityRules: { age: { min: 0, max: 100 }, hasDisability: true },
    schemeType: "Central",
    tags: ["Differently Abled", "Ex-Servicemen", "Widow Of Ex-Servicemen", "Empowerment"],
    isActive: true
  },
  {
    title: "Kanya Shree Prakalpa (West Bengal)",
    category: "Women and Child",
    ministry: "Government of West Bengal",
    description: {
      raw: "A conditional cash transfer scheme with the objective of improving the status and well-being of the girl child in West Bengal by incentivizing education and delaying marriage.",
      simplified: { en: "Cash rewards for girls in West Bengal to stay in school." }
    },
    benefits: "Annual scholarship of ₹1,000 + One-time grant of ₹25,000",
    eligibilityRules: { age: { min: 13, max: 19 }, gender: ["Female"], states: ["West Bengal"] },
    schemeType: "State",
    tags: ["Girl Child", "Education", "Empowerment", "State Scheme"],
    isActive: true
  },
  {
    title: "PM-Kisan Samman Nidhi",
    category: "Agriculture,Rural & Environment",
    ministry: "Ministry Of Agriculture and Farmers Welfare",
    description: {
      raw: "Under the scheme an income support of ₹6,000/- per year in three equal installments will be provided to all landholding farmer families.",
      simplified: { en: "Annual income support for farmers." }
    },
    benefits: "₹6,000 per year",
    eligibilityRules: { age: { min: 18, max: 100 }, isFarmer: true },
    schemeType: "Central",
    tags: ["Farmer", "Direct Benefit Transfer", "Agriculture"],
    isActive: true
  },
  {
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    category: "Health & Wellness",
    ministry: "Ministry Of Health and Family Welfare",
    description: {
      raw: "A national public health insurance fund of the Government of India that aims to provide free access to health insurance coverage for low income earners in the country.",
      simplified: { en: "Free health insurance coverage up to ₹5 lakh per family." }
    },
    benefits: "Health cover of ₹5,00,000 per family per year",
    eligibilityRules: { age: { min: 0, max: 100 }, incomeLimit: 250000 },
    schemeType: "Central",
    tags: ["Health", "Insurance", "Medical", "Hospitalization"],
    isActive: true
  },
  {
    title: "Pradhan Mantri Awas Yojana (Urban)",
    category: "Housing & Shelter",
    ministry: "Ministry Of Housing and Urban Affairs",
    description: {
      raw: "A mission to provide housing for all in urban areas. Provides central assistance to Urban Local Bodies (ULBs) and other implementing agencies.",
      simplified: { en: "Financial assistance to build or buy a house in urban areas." }
    },
    benefits: "Interest subsidy on home loans up to ₹2.67 lakh",
    eligibilityRules: { age: { min: 18, max: 100 }, isRural: false },
    schemeType: "Central",
    tags: ["Housing", "Urban", "Loan Subsidy"],
    isActive: true
  },
  {
    title: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
    category: "Skills & Employment",
    ministry: "Ministry of Rural Development",
    description: {
      raw: "An Indian labour law and social security measure that aims to guarantee the 'right to work'. It aims to enhance livelihood security in rural areas by providing at least 100 days of wage employment.",
      simplified: { en: "Guaranteed 100 days of wage employment in a financial year for rural households." }
    },
    benefits: "100 days of guaranteed wage employment",
    eligibilityRules: { age: { min: 18, max: 100 }, isRural: true },
    schemeType: "Central",
    tags: ["Employment", "Rural", "Daily Wage"],
    isActive: true
  },
  {
    title: "Atal Pension Yojana (APY)",
    category: "Banking,Financial Services and Insurance",
    ministry: "Ministry of Finance",
    description: {
      raw: "A pension scheme for citizens of India, focused on the unorganized sector workers. Under the APY, guaranteed minimum pension is given at the age of 60 years.",
      simplified: { en: "Guaranteed pension after age 60." }
    },
    benefits: "Guaranteed pension of ₹1000 to ₹5000 per month",
    eligibilityRules: { age: { min: 18, max: 40 } },
    schemeType: "Central",
    tags: ["Pension", "Retirement", "Financial Security"],
    isActive: true
  },
  {
    title: "Sukanya Samriddhi Yojana (SSY)",
    category: "Women and Child",
    ministry: "Ministry of Finance",
    description: {
      raw: "A Government of India backed saving scheme targeted at the parents of girl children. The scheme encourages parents to build a fund for the future education and marriage expenses for their female child.",
      simplified: { en: "High-interest savings account for girl child's education and marriage." }
    },
    benefits: "High interest rate savings account with tax benefits",
    eligibilityRules: { age: { min: 0, max: 10 }, gender: ["Female"] },
    schemeType: "Central",
    tags: ["Girl Child", "Savings", "Tax Benefit", "Education"],
    isActive: true
  },
  {
    title: "PM SVANidhi",
    category: "Business & Entrepreneurship",
    ministry: "Ministry of Housing and Urban Affairs",
    description: {
      raw: "A special micro-credit facility for street vendors to resume their livelihoods that were adversely affected due to Covid-19 lockdown.",
      simplified: { en: "Collateral-free working capital loan for street vendors." }
    },
    benefits: "Working capital loan up to ₹10,000 to ₹50,000",
    eligibilityRules: { age: { min: 18, max: 100 }, isRural: false },
    schemeType: "Central",
    tags: ["Street Vendors", "Loan", "Business", "Urban"],
    isActive: true
  },
  {
    title: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    category: "Skills & Employment",
    ministry: "Ministry of Rural Development",
    description: {
      raw: "The skill training and placement program of the Ministry of Rural Development (MoRD), catering to the occupational aspirations of rural youth and enhancing their income-earning capacity.",
      simplified: { en: "Free skill training and job placement for rural youth." }
    },
    benefits: "Free training, uniform, course material, and guaranteed job placement",
    eligibilityRules: { age: { min: 15, max: 35 }, isRural: true },
    schemeType: "Central",
    tags: ["Skill Development", "Employment", "Rural Youth"],
    isActive: true
  },
  {
    title: "Pradhan Mantri Matru Vandana Yojana",
    category: "Women and Child",
    ministry: "Ministry of Women and Child Development",
    description: {
      raw: "A maternity benefit program run by the government of India. It provides partial compensation for the wage loss in terms of cash incentives so that the woman can take adequate rest before and after delivery.",
      simplified: { en: "Maternity benefit for pregnant and lactating mothers." }
    },
    benefits: "Cash incentive of ₹5,000 in three installments",
    eligibilityRules: { age: { min: 19, max: 50 }, gender: ["Female"] },
    schemeType: "Central",
    tags: ["Maternity", "Cash Transfer", "Health", "Mother"],
    isActive: true
  },
  {
    title: "Mukhyamantri Vridhjan Pension Yojna",
    category: "Social welfare & Empowerment",
    ministry: "Government of Bihar",
    description: {
      raw: "A scheme to provide financial assistance to senior citizens in the state of Bihar.",
      simplified: { en: "Monthly pension for senior citizens in Bihar." }
    },
    benefits: "₹400 per month (age 60-79), ₹500 per month (age 80+)",
    eligibilityRules: { age: { min: 60, max: 150 }, states: ["Bihar"] },
    schemeType: "State",
    tags: ["Pension", "Senior Citizen", "State Scheme"],
    isActive: true
  },
  {
    title: "Rythu Bandhu",
    category: "Agriculture,Rural & Environment",
    ministry: "Government of Telangana",
    description: {
      raw: "Agriculture Investment Support Scheme, a welfare program to support farmer's investment for two crops a year by the Government of Telangana.",
      simplified: { en: "Financial support for farmers in Telangana for crop investment." }
    },
    benefits: "₹5,000 per acre per season to support farm investment",
    eligibilityRules: { age: { min: 18, max: 100 }, states: ["Telangana"], isFarmer: true },
    schemeType: "State",
    tags: ["Farmer", "Agriculture", "Direct Benefit Transfer", "State Scheme"],
    isActive: true
  },
  {
    title: "Ladli Laxmi Yojana",
    category: "Women and Child",
    ministry: "Government of Madhya Pradesh",
    description: {
      raw: "Scheme to lay a firm foundation of girls' future through improvement in their educational and economic status and to bring about a positive change in social attitude towards birth of a girl.",
      simplified: { en: "Financial assistance for the education and marriage of girls in Madhya Pradesh." }
    },
    benefits: "Total benefit of ₹1,18,000 paid in installments for education",
    eligibilityRules: { age: { min: 0, max: 18 }, gender: ["Female"], states: ["Madhya Pradesh"] },
    schemeType: "State",
    tags: ["Girl Child", "Education", "State Scheme", "Empowerment"],
    isActive: true
  },
  {
    title: "Mukhya Mantri Chiranjeevi Swasthya Bima Yojana",
    category: "Health & Wellness",
    ministry: "Government of Rajasthan",
    description: {
      raw: "A scheme by Rajasthan Govt to provide cashless health insurance to every family of the state.",
      simplified: { en: "Free health insurance for all families in Rajasthan." }
    },
    benefits: "Health insurance cover up to ₹25 lakh",
    eligibilityRules: { age: { min: 0, max: 100 }, states: ["Rajasthan"] },
    schemeType: "State",
    tags: ["Health", "Insurance", "State Scheme", "Cashless"],
    isActive: true
  },
  {
    title: "Swami Vivekananda Assam Youth Empowerment (SVAYEM) Yojana",
    category: "Business & Entrepreneurship",
    ministry: "Government of Assam",
    description: {
      raw: "To generate employment opportunities in rural as well as urban areas through setting up of new ventures as well as growing existing ventures.",
      simplified: { en: "Financial support for youth in Assam to start or expand businesses." }
    },
    benefits: "Financial assistance of ₹50,000",
    eligibilityRules: { age: { min: 18, max: 40 }, states: ["Assam"] },
    schemeType: "State",
    tags: ["Youth", "Entrepreneur", "State Scheme", "Business"],
    isActive: true
  },
  {
    title: "YSR Pension Kanuka",
    category: "Social welfare & Empowerment",
    ministry: "Government of Andhra Pradesh",
    description: {
      raw: "A scheme to secure a dignified life to all the poor and vulnerable people such as old age persons, widows, disabled persons, and others in Andhra Pradesh.",
      simplified: { en: "Monthly pension for poor and vulnerable people in AP." }
    },
    benefits: "Monthly pension ranging from ₹2,750 to ₹10,000 based on category",
    eligibilityRules: { age: { min: 60, max: 150 }, states: ["Andhra Pradesh"] },
    schemeType: "State",
    tags: ["Pension", "Vulnerable", "State Scheme", "Welfare"],
    isActive: true
  },
  {
    title: "Biju Swasthya Kalyan Yojana",
    category: "Health & Wellness",
    ministry: "Government of Odisha",
    description: {
      raw: "Universal health coverage for the people of Odisha, with special emphasis on the health protection of economically vulnerable families and women.",
      simplified: { en: "Free healthcare for vulnerable families in Odisha, with extra coverage for women." }
    },
    benefits: "Annual health coverage of ₹5 lakh per family and ₹10 lakh for women members",
    eligibilityRules: { age: { min: 0, max: 100 }, states: ["Odisha"] },
    schemeType: "State",
    tags: ["Health", "Insurance", "State Scheme", "Women Empowerment"],
    isActive: true
  }
];

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const CATEGORIES = [
  'Social welfare & Empowerment', 'Education & Learning', 'Agriculture,Rural & Environment', 
  'Business & Entrepreneurship', 'Women and Child', 'Skills & Employment',
  'Banking,Financial Services and Insurance', 'Health & Wellness', 'Sports & Culture',
  'Housing & Shelter', 'Science, IT & Communications', 'Transport & Infrastructure',
  'Travel & Tourism', 'Utility & Sanitation', 'Public Safety,Law & Justice'
];

const MINISTRIES = [
  'Ministry of Finance', 'Ministry of Rural Development', 'Ministry of Health and Family Welfare',
  'Ministry of Education', 'Ministry of Social Justice and Empowerment', 'Ministry of Women and Child Development',
  'Ministry of Agriculture and Farmers Welfare', 'Ministry of Skill Development and Entrepreneurship',
  'Ministry of Housing and Urban Affairs', 'Ministry of Minority Affairs', 'Ministry of Labour and Employment',
  'State Government Department'
];

const generateMockSchemes = (count) => {
  const generated = [];
  for(let i = 0; i < count; i++) {
    const isState = Math.random() > 0.5;
    const state = isState ? INDIAN_STATES[Math.floor(Math.random() * INDIAN_STATES.length)] : 'All';
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const ministry = isState ? `Government of ${state}` : MINISTRIES[Math.floor(Math.random() * MINISTRIES.length)];
    const ageMin = Math.floor(Math.random() * 60);
    const ageMax = ageMin + Math.floor(Math.random() * 40) + 10;
    
    generated.push({
      title: `Generated Scheme ${i+1}: ${category.split(' ')[0]} Initiative ${Math.floor(Math.random() * 10000)}`,
      category: category,
      ministry: ministry,
      description: {
        raw: `This is an auto-generated scheme meant to provide assistance in the field of ${category}. It offers robust support to eligible beneficiaries in ${isState ? state : 'India'}.`,
        simplified: { en: `Provides support for ${category.toLowerCase()}.` }
      },
      benefits: `Financial or material assistance up to ₹${(Math.floor(Math.random() * 100) + 1) * 1000}`,
      eligibilityRules: {
        age: { min: ageMin, max: ageMax },
        states: isState ? [state] : ['All'],
        isRural: Math.random() > 0.6 ? true : (Math.random() > 0.5 ? false : null),
        isStudent: category === 'Education & Learning' ? true : (Math.random() > 0.8 ? true : null),
        isFarmer: category === 'Agriculture,Rural & Environment' ? true : (Math.random() > 0.8 ? true : null),
        gender: Math.random() > 0.8 ? ['Female'] : ['All']
      },
      schemeType: isState ? "State" : "Central",
      tags: ["Generated", category.split(' ')[0], isState ? state : "Central"],
      deadline: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 180),
      isActive: true
    });
  }
  return generated;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    await Scheme.deleteMany({});
    
    // Add random deadlines to the curated schemes too
    const curatedWithDeadlines = schemes.map(s => ({
      ...s,
      deadline: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 180)
    }));

    const allSchemes = [...curatedWithDeadlines, ...generateMockSchemes(1000)];
    
    await Scheme.insertMany(allSchemes);
    console.log(`Seeded ${allSchemes.length} Schemes (22 Real + 1000 Generated)!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

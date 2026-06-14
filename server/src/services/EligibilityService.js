/**
 * Eligibility Engine for BharatBenefit
 * Evaluates a user profile against scheme criteria.
 */

export const evaluateEligibility = (user, scheme) => {
  const { profile } = user;
  const { eligibilityRules } = scheme;
  
  const reasons = [];
  const failures = [];
  
  // 1. Age Check
  if (profile.age) {
    if (profile.age < eligibilityRules.age.min || profile.age > eligibilityRules.age.max) {
      failures.push(`Age ${profile.age} is outside the required range (${eligibilityRules.age.min}-${eligibilityRules.age.max}).`);
    } else {
      reasons.push(`User age (${profile.age}) meets the criteria.`);
    }
  }

  // 2. Gender Check
  if (eligibilityRules.gender && !eligibilityRules.gender.includes('All')) {
    if (!eligibilityRules.gender.includes(profile.gender)) {
      failures.push(`Scheme is for ${eligibilityRules.gender.join(', ')} only.`);
    } else {
      reasons.push(`Gender criteria met.`);
    }
  }

  // 3. Income Check
  const income = profile.economic?.familyIncome || profile.socioEconomic?.familyIncome;
  if (eligibilityRules.incomeLimit && income) {
    if (income > eligibilityRules.incomeLimit) {
      failures.push(`Family income (₹${income}) exceeds the limit of ₹${eligibilityRules.incomeLimit}.`);
    } else {
      reasons.push(`Income criteria met.`);
    }
  }

  // 4. State Check
  if (eligibilityRules.states && !eligibilityRules.states.includes('All')) {
    if (!eligibilityRules.states.includes(profile.location.state)) {
      failures.push(`Scheme is only available in: ${eligibilityRules.states.join(', ')}.`);
    } else {
      reasons.push(`State eligibility confirmed.`);
    }
  }

  // 5. Category (Caste) Check
  const caste = profile.social?.caste || profile.socioEconomic?.caste;
  if (eligibilityRules.castes && !eligibilityRules.castes.includes('All')) {
    if (!eligibilityRules.castes.includes(caste)) {
      failures.push(`Scheme is for ${eligibilityRules.castes.join(', ')} categories only.`);
    } else {
      reasons.push(`Category criteria met.`);
    }
  }

  // 6. Farmer Status
  const isFarmer = profile.workEdu?.isFarmer || profile.status?.isFarmer;
  if (eligibilityRules.isFarmer !== null && eligibilityRules.isFarmer !== undefined) {
    if (eligibilityRules.isFarmer !== isFarmer) {
      failures.push(eligibilityRules.isFarmer ? 'This scheme is specifically for farmers.' : 'This scheme is for non-farmers.');
    } else {
      reasons.push(`Occupational criteria met.`);
    }
  }

  // 7. Student Status
  const isStudent = profile.workEdu?.isStudent || profile.status?.isStudent;
  if (eligibilityRules.isStudent !== null && eligibilityRules.isStudent !== undefined) {
    if (eligibilityRules.isStudent !== isStudent) {
      failures.push(eligibilityRules.isStudent ? 'This scheme is specifically for students.' : 'This scheme is for non-students.');
    } else {
      reasons.push(`Academic status criteria met.`);
    }
  }

  // 8. Rural/Urban Status
  if (eligibilityRules.isRural !== null && eligibilityRules.isRural !== undefined) {
    if (eligibilityRules.isRural !== profile.location.isRural) {
      failures.push(eligibilityRules.isRural ? 'This scheme is for rural citizens only.' : 'This scheme is for urban citizens only.');
    } else {
      reasons.push(`Location type criteria met.`);
    }
  }

  // 9. Disability Status
  const hasDisability = profile.health?.hasDisability || profile.socioEconomic?.disabilityStatus;
  if (eligibilityRules.hasDisability === true) {
    if (!hasDisability) {
      failures.push('This scheme requires a valid disability status.');
    } else {
      reasons.push(`Disability criteria met.`);
    }
  }

  // 10. Minority Status
  const isMinority = profile.social?.isMinority || profile.socioEconomic?.isMinority;
  if (eligibilityRules.isMinority === true) {
    if (!isMinority) {
      failures.push('This scheme is specifically for minority communities.');
    } else {
      reasons.push(`Minority status confirmed.`);
    }
  }

  // 11. Marital Status
  const maritalStatus = profile.social?.maritalStatus || profile.socioEconomic?.maritalStatus;
  if (eligibilityRules.maritalStatus && eligibilityRules.maritalStatus !== 'All') {
    if (eligibilityRules.maritalStatus !== maritalStatus) {
      failures.push(`Scheme is for ${eligibilityRules.maritalStatus} individuals only.`);
    } else {
      reasons.push(`Marital status criteria met.`);
    }
  }

  // 12. Land Size
  const landSize = profile.workEdu?.landSize || profile.status?.landSize;
  if (eligibilityRules.maxLandSize && isFarmer) {
    if (landSize > eligibilityRules.maxLandSize) {
      failures.push(`Land size (${landSize} acres) exceeds the limit of ${eligibilityRules.maxLandSize} acres.`);
    } else {
      reasons.push(`Land size criteria met.`);
    }
  }

  // 13. Health Condition
  const healthCondition = profile.health?.healthCondition || profile.socioEconomic?.healthCondition;
  if (eligibilityRules.healthCondition && eligibilityRules.healthCondition !== 'None') {
    if (eligibilityRules.healthCondition !== healthCondition) {
      failures.push(`Scheme is for individuals with ${eligibilityRules.healthCondition}.`);
    } else {
      reasons.push(`Health status criteria met.`);
    }
  }

  // 14. Business Type
  const isBusinessOwner = profile.workEdu?.isBusinessOwner || profile.status?.isBusinessOwner;
  const businessType = profile.workEdu?.businessType || profile.status?.businessType;
  if (eligibilityRules.businessType && isBusinessOwner) {
    if (eligibilityRules.businessType !== businessType) {
      failures.push(`Scheme is for ${eligibilityRules.businessType} businesses.`);
    } else {
      reasons.push(`Business type criteria met.`);
    }
  }

  // 15. Housing & Infrastructure
  if (eligibilityRules.houseType && profile.economic?.houseType) {
    if (eligibilityRules.houseType !== profile.economic.houseType) {
      failures.push(`Scheme is for people living in ${eligibilityRules.houseType} houses.`);
    } else {
      reasons.push(`Housing criteria met.`);
    }
  }

  if (eligibilityRules.requiresToilet === true && !profile.economic?.hasToilet) {
    failures.push('This scheme requires a functional toilet at home.');
  }

  // 16. Energy & Fuel
  if (eligibilityRules.cookingFuel && profile.economic?.cookingFuel) {
    if (eligibilityRules.cookingFuel !== profile.economic.cookingFuel) {
      failures.push(`Scheme is for users using ${eligibilityRules.cookingFuel} as fuel.`);
    } else {
      reasons.push(`Fuel type criteria met.`);
    }
  }

  // 17. Financial Inclusion
  if (eligibilityRules.requiresBankAadhar === true && !profile.economic?.hasBankAadhar) {
    failures.push('Aadhar-seeded bank account is mandatory for this scheme.');
  }

  // 18. Family & Parental Status
  const parentalOccupation = profile.social?.parentalOccupation || profile.socioEconomic?.parentalOccupation;
  if (eligibilityRules.parentalOccupation && parentalOccupation) {
    if (eligibilityRules.parentalOccupation !== parentalOccupation) {
      failures.push(`Scheme is for children of ${eligibilityRules.parentalOccupation}s.`);
    } else {
      reasons.push(`Parental status criteria met.`);
    }
  }

  // Final Verdict
  let status = 'Not Eligible';
  if (failures.length === 0) {
    status = 'Eligible';
  } else if (failures.length <= 1) {
    status = 'Likely Eligible';
  }

  return {
    status,
    reasons,
    failures,
    matchPercentage: Math.round(((reasons.length) / (reasons.length + failures.length)) * 100) || 0
  };
};

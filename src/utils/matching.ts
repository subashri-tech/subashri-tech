import { Internship, SkillMatchResult, StudentProfile } from '../types';

/**
 * Normalize skill names for flexible matching (e.g., 'React.js' -> 'react', 'C++' -> 'cpp')
 */
export function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\.js$/i, '')
    .replace(/\+/g, 'p')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates a detailed, transparent match between a student profile and an internship
 */
export function calculateSkillMatch(
  student: StudentProfile | null,
  internship: Internship
): SkillMatchResult {
  if (!student || !student.skills || student.skills.length === 0) {
    return {
      matchPercentage: 0,
      matchingSkills: [],
      missingSkills: internship.requiredSkills,
      preferredMatches: [],
      roleFitScore: 0,
      matchVerdict: 'Explore',
      explanation: 'Complete your student skill profile to unlock personalized match ratings.',
    };
  }

  const studentSkillMap = new Map<string, { original: string; proficiency: string }>();
  student.skills.forEach((s) => {
    studentSkillMap.set(normalizeSkill(s.name), {
      original: s.name,
      proficiency: s.proficiency,
    });
  });

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  const preferredMatches: string[] = [];

  let requiredScore = 0;
  const totalRequired = internship.requiredSkills.length || 1;

  internship.requiredSkills.forEach((reqSkill) => {
    const norm = normalizeSkill(reqSkill);
    const found = studentSkillMap.get(norm);

    if (found) {
      matchingSkills.push(reqSkill);
      // Proficiency multiplier
      let mult = 0.85;
      if (found.proficiency === 'advanced') mult = 1.0;
      if (found.proficiency === 'beginner') mult = 0.7;
      requiredScore += mult;
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const requiredRatio = Math.min(1, requiredScore / totalRequired);

  // Preferred skills evaluation
  let preferredScore = 0;
  if (internship.preferredSkills && internship.preferredSkills.length > 0) {
    internship.preferredSkills.forEach((prefSkill) => {
      const norm = normalizeSkill(prefSkill);
      if (studentSkillMap.has(norm)) {
        preferredMatches.push(prefSkill);
        preferredScore += 1;
      }
    });
  }
  const preferredRatio =
    internship.preferredSkills && internship.preferredSkills.length > 0
      ? preferredScore / internship.preferredSkills.length
      : 0.5;

  // Role preference fit
  let roleFitScore = 0.5;
  const prefs = student.preferences;
  if (prefs && prefs.roles && prefs.roles.length > 0) {
    const isRoleMatch = prefs.roles.some(
      (role) =>
        internship.title.toLowerCase().includes(role.toLowerCase()) ||
        internship.category.toLowerCase().includes(role.toLowerCase()) ||
        role.toLowerCase().includes(internship.category.toLowerCase())
    );
    roleFitScore = isRoleMatch ? 1.0 : 0.4;
  }

  // Work type fit
  let workTypeScore = 0.7;
  if (prefs && prefs.workTypes && prefs.workTypes.length > 0) {
    workTypeScore = prefs.workTypes.includes(internship.workType) ? 1.0 : 0.5;
  }

  // Combined weighted calculation:
  // 55% Required Skills + 15% Preferred Skills + 20% Target Role + 10% Work Type
  const rawScore =
    requiredRatio * 0.55 +
    preferredRatio * 0.15 +
    roleFitScore * 0.20 +
    workTypeScore * 0.10;

  const matchPercentage = Math.round(Math.min(99, Math.max(15, rawScore * 100)));

  let matchVerdict: SkillMatchResult['matchVerdict'] = 'Explore';
  if (matchPercentage >= 80) matchVerdict = 'High Match';
  else if (matchPercentage >= 60) matchVerdict = 'Good Match';
  else if (matchPercentage >= 40) matchVerdict = 'Moderate Match';

  // Generate plain-English explanation
  let explanation = '';
  const matchCount = matchingSkills.length;
  const totalReq = internship.requiredSkills.length;

  if (matchPercentage >= 80) {
    explanation = `Strong fit! You have ${matchCount} of ${totalReq} required skills (${matchingSkills.slice(0, 3).join(', ')})${
      prefs.roles.length ? ' aligned with your target roles' : ''
    }.`;
  } else if (matchPercentage >= 60) {
    explanation = `Good foundation with ${matchCount} of ${totalReq} skills. Adding ${
      missingSkills[0] || 'additional domain skills'
    } would make you an outstanding candidate.`;
  } else if (matchPercentage >= 40) {
    explanation = `Moderate match. You match ${matchingSkills.join(', ') || 'basic preferences'}, but role prioritizes ${missingSkills.slice(0, 2).join(' & ')}.`;
  } else {
    explanation = `Growth opportunity. You'd need to develop ${missingSkills.slice(0, 3).join(', ')} before applying.`;
  }

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    preferredMatches,
    roleFitScore,
    matchVerdict,
    explanation,
  };
}

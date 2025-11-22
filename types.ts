export interface VisitorFormData {
  firstName: string;
  lastName: string;
  address: string;
  cityStateZip: string;
  ageRange: string;
  email: string; // Added for contact
  prayerRequest: string;
  membershipInterest: 'yes' | 'no' | 'maybe';
}

export enum AgeRange {
  TEEN = '13-17',
  YOUNG_ADULT = '18-29',
  ADULT = '30-49',
  SENIOR = '50-69',
  ELDER = '70+',
}

export interface GeneratedContent {
  welcomeMessage: string;
  prayer: string;
}

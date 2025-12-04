export type Language = 'Hinglish' | 'Hindi' | 'Gujarati' | 'English';

export type AgeGroup = 'Kids (5–12)' | 'Teens (13–19)' | 'Youth (20–35)' | 'Adults (35–60)' | 'Seniors (60+)';

export type VideoType = 'Short' | 'Medium' | 'Long' | 'Reels' | 'YouTube Short' | 'TikTok style';

export type Platform = 'YouTube' | 'Instagram' | 'Snapchat' | 'Twitter' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'Custom';

export type LengthCategory = 'Mini (0–10 sec)' | 'Short (10–30 sec)' | 'Medium (30–60 sec)' | 'Long (60+ sec)';

export interface HookRequest {
  topic: string;
  category: string;
  ageGroup: AgeGroup;
  videoType: VideoType;
  platform: Platform;
  length: LengthCategory;
  language: Language;
  thunderMode?: boolean;
}

export interface GeneratedHook {
  text: string;
  type: 'emotional' | 'curiosity' | 'pattern-interrupt' | 'viral';
  explanation?: string;
}

export interface User {
  email: string;
  name: string;
}
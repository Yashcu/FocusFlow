
'use server';

import {
  getProductivityTip,
  type DailyDevotionOutput,
} from '@/ai/flows/productivity-tips';
import {
  Activity,
  getActivity as getActivityFromDb,
} from '@/lib/firebase/firestore';

export async function getActivity(
  uid: string,
  days: number
): Promise<Activity[]> {
  return getActivityFromDb(uid, days);
}

export async function fetchProductivityTip(): Promise<{
  data: DailyDevotionOutput | null;
  error: string | null;
}> {
  try {
    const result = await getProductivityTip();
    return { data: result, error: null };
  } catch (error) {
    console.error('Error fetching productivity tip:', error);
    return {
      data: null,
      error: 'Failed to generate a tip. Please try again later.',
    };
  }
}

'use server';

import {
  getProductivityTip,
  type DailyDevotionOutput,
} from '@/server/ai/flows/productivity-tips';
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

export async function uploadImageToCloudinary(formData: FormData): Promise<{
  url: string | null;
  error: string | null;
}> {
  const file = formData.get('file') as File; // Get the file from FormData

  if (!file) {
    return { url: null, error: 'No file provided.' };
  }

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('Cloudinary environment variables are not set.');
    return {
      url: null,
      error: 'Server configuration error: Cloudinary not set up.',
    };
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', UPLOAD_PRESET);
    // You can add more Cloudinary options here, like folder, tags, etc.
    // uploadFormData.append("folder", "focusflow_avatars");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload failed:', errorData);
      return {
        url: null,
        error: errorData.error?.message || 'Cloudinary upload failed.',
      };
    }

    const data = await response.json();
    return { url: data.secure_url, error: null }; // Return the secure URL
  } catch (error: unknown) {
    console.error('Error uploading to Cloudinary:', error);

    let message = 'An unexpected error occurred during upload.';
    if (error instanceof Error) {
      message = error.message;
    }

    return { url: null, error: message };
  }
}

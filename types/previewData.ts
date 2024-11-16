"use client";

import { FieldValue } from "firebase/firestore";

export type previewData = {
  previewTitleId?: string;
  timeStamp?: FieldValue | string;
  category?: string;
  title: string;
  description: string;
  image: string;
  url: string;
  memo: string;
};

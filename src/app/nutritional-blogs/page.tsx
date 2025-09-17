'use client';

import { useStore } from '@/lib/store';
import NutritionalBlogs from '@/components/NutritionalBlogs';

export default function NutritionalBlogsPage() {
  const { blogs } = useStore();

  return (
    <NutritionalBlogs blogs={blogs} />
  );
}

'use client';

import { useParams } from 'next/navigation';
import MathDayClient from '@/Components/MathDayClient';

export default function MathDayPage() {
  const params = useParams();
  const day = params?.day as string;

  return <MathDayClient day={day} />;
}

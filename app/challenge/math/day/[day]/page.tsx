import MathDayClient from "@/Components/MathDayClient";

export default function MathDayPage({ params }: { params: { day: string } }) {
  return <MathDayClient day={params.day} />;
}
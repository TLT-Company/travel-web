import ListThongHanh from '@/components/listThongHanh';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table page for TailAdmin Tailwind CSS Admin Dashboard Template",
};
const ThongHanh = () => {
  return (
    <>
      <ListThongHanh />
    </>
  );
}
export default ThongHanh;
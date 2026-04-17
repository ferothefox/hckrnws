import Link from "next/link";
import HeaderClient from "@/components/Header/HeaderClient";

export default function Header() {
  return (
    <div className="flex h-16 flex-none items-center justify-between select-none">
      <Link href="/top/1">
        <h2 className="text-primary font-mono text-xl md:text-2xl">hckrnws</h2>
      </Link>
      <HeaderClient />
    </div>
  );
}

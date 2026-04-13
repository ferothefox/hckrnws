"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AskHNIcon,
  TopHNIcon,
  ShowHNIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
} from "@/icons";
import Dropdown from "../Common/Dropdown";
import { useHydrated } from "@/hooks/useHydrated";
import { useKeyPress } from "@/hooks/useKeyPress";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  useKeyPress("t", () => router.push("/top/1"));
  useKeyPress("s", () => router.push("/show/1"));
  useKeyPress("n", () => router.push("/new/1"));
  useKeyPress("a", () => router.push("/ask/1"));
  useKeyPress("x", () => router.push("/star"));

  if (!hydrated) return null;

  const dropdownItems = [
    {
      label: "Top",
      id: "top",
      icon: (
        <TopHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
      ),
      kbd: "T",
    },
    {
      label: "Show",
      id: "show",
      icon: (
        <ShowHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
      ),
      kbd: "S",
    },
    {
      label: "New",
      id: "new",
      icon: (
        <ClockIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
      ),
      kbd: "N",
    },
    {
      label: "Ask",
      id: "ask",
      icon: (
        <AskHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
      ),
      kbd: "A",
    },
    {
      label: "Starred",
      id: "star",
      icon: (
        <StarIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
      ),
      kbd: "X",
    },
  ];

  const currentSection = pathname?.split("/")[1];
  const selectedItem = dropdownItems.find((item) => item.id === currentSection);

  const triggerLabel = () => (
    <div className="flex items-center">
      {selectedItem?.icon}
      <span className="text-primary text-sm font-medium">
        {selectedItem?.label || "Go to"}
      </span>
    </div>
  );

  const handleOnClick = (id: string) => {
    if (id === "star") {
      router.push(`/${id}`);
    } else {
      router.push(`/${id}/1`);
    }
  };

  return (
    <div className="flex h-16 flex-none items-center justify-between select-none">
      <Link href="/top/1">
        <h2 className="text-primary font-mono text-xl md:text-2xl">hckrnws</h2>
      </Link>
      <div className="flex items-center">
        <Dropdown
          items={dropdownItems}
          triggerLabel={triggerLabel()}
          selectedId={selectedItem?.id}
          handleOnClick={handleOnClick}
        />
        <button
          className="border-primary bg-secondary hover:bg-tertiary ml-2 cursor-pointer rounded-sm border p-1.5 duration-150 focus-visible:ring-1 focus-visible:ring-blue-500"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          type="button"
          aria-label="Toggle Theme"
        >
          {resolvedTheme === "dark" ? (
            <SunIcon className="text-icon h-4 w-4" />
          ) : (
            <MoonIcon className="text-icon h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

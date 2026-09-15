"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useAuth, useSettings } from "@/app/lib/providers";

const MainHeader = () => {
  const user = useAuth();
  const { handedness, setHandedness } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/play");
    router.refresh();
  }

  const navLinks = [
    { href: "/play", label: "Play", show: true },
    { href: "/library", label: "Library", show: true },
    { href: "/", label: "Progress", show: true },
  ];

  return (
    <div
      className="border-b-2 grid grid-cols-3 items-center p-3 font-source-serif"
      style={{ borderBottomColor: "var(--color-border)" }}
    >
      <Link href="/" className="justify-self-start">
        <h2
          className="font-bold text-2xl"
          style={{ color: "var(--color-primary)" }}
        >
          GUIT STRUM
        </h2>
      </Link>

      <nav className="flex justify-center gap-6">
        {navLinks
          .filter((link) => link.show)
          .map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-sm font-medium pb-1 border-b-2"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
                  borderColor: isActive
                    ? "var(--color-primary)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
      </nav>

      <div className="justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <UserRound />
              </Button>
            }
          />
          <DropdownMenuContent className="w-56">
            {user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem render={<Link href="/login">Log In</Link>} />
                <DropdownMenuItem
                  render={<Link href="/signup">Sign Up</Link>}
                />
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuCheckboxItem
              checked={handedness === "right"}
              onCheckedChange={(checked) =>
                setHandedness(checked ? "right" : "left")
              }
            >
              Right Handed
            </DropdownMenuCheckboxItem>

            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MainHeader;

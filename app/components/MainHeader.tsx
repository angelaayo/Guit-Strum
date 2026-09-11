"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuth, useSettings } from "@/app/lib/providers";

const MainHeader = () => {
  const user = useAuth();
  const { handedness, setHandedness } = useSettings();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/play");
    router.refresh();
  }

  return (
    <div
      className="border-b-2 flex justify-between p-3 items-center font-source-serif"
      style={{ borderBottomColor: "var(--color-border)" }}
    >
      <Link href={user ? "/" : "/play"}>
        <h2
          className="font-bold text-2xl"
          style={{ color: "var(--color-primary)" }}
        >
          GUIT STRUM
        </h2>
      </Link>

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
              <DropdownMenuItem render={<Link href="/">Your Progress</Link>} />
              <DropdownMenuItem
                render={<Link href="/library">Chord Library</Link>}
              />
              <DropdownMenuSeparator />
            </>
          ) : (
            <>
              <DropdownMenuItem render={<Link href="/login">Log In</Link>} />
              <DropdownMenuItem render={<Link href="/signup">Sign Up</Link>} />
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
  );
};

export default MainHeader;

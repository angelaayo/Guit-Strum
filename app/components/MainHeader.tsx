import React from "react";
import { Button } from "@/components/ui/button";
import { UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

const MainHeader = () => {
  return (
    <div
      className="border-b-2 flex justify-between p-3 items-center font-source-serif"
      style={{ borderBottomColor: "var(--color-border" }}
    >
      <h2
        className=" font-bold text-2xl"
        style={{ color: "var(--color-primary)" }}
      >
        GUIT STRUM
      </h2>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline"> <UserRound/> </Button>} />
        <DropdownMenuContent className="w-48">
            <DropdownMenuCheckboxItem checked = {true}>
               Right Handed
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainHeader;

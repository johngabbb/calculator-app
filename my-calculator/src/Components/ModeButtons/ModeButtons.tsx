import React from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
} from "../ui/alert-dialog";

interface Props {
  activeMode: "standard" | "advance";
  handleModeChange: (mode: "standard" | "advance") => void;
  handleHistoryTab: () => void;
}

const ModeButtons = ({ activeMode, handleModeChange, handleHistoryTab }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-5 mb-5 w-min">
        <Button
          className={`px-4 py-2 rounded min-w-30 ${
            activeMode === "standard"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950 transition-colors"
          }`}
          onClick={() => handleModeChange("standard")}
        >
          Standard
        </Button>

        <Button
          className={`px-4 py-2 rounded min-w-30 ${
            activeMode === "advance"
              ? "bg-emerald-800 text-white hover:bg-emerald-800"
              : "bg-neutral-700 text-white hover:bg-emerald-950 transition-colors"
          }`}
          onClick={() => handleModeChange("advance")}
        >
          Advance
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-neutral-700 text-white hover:bg-emerald-950 transition-colors"
              onClick={handleHistoryTab}
            >
              History
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-neutral-900 border-0 w-88">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">History</AlertDialogTitle>
              <AlertDialogDescription className="text-white flex items-center h-20">
                WHOOPS! This function is currently unavailable.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex">
              <div className="mx-auto">
                <AlertDialogAction className="bg-emerald-800 hover:bg-emerald-950 transition-colors text-white">
                  Continue
                </AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default ModeButtons;

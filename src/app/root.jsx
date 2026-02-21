"use client";

import { Toaster } from "sonner";
import { DialogContentPopupProvider } from "@/components/content/dialog-content";

export default function Root({ children }) {
  return (
    <>
      <DialogContentPopupProvider oneLineButton={false}>
        <Toaster theme="light" richColors position="bottom-center" />
        {children}
      </DialogContentPopupProvider>
    </>
  );
}

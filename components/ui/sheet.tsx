"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Sheet = DialogPrimitive.Root;

const SheetTrigger = DialogPrimitive.Trigger;

const SheetPortal = DialogPrimitive.Portal;

const SheetClose = DialogPrimitive.Close;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "left" | "right";
}

const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ side = "left", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex w-[min(20rem,calc(100vw-3rem))] flex-col gap-4 border border-border bg-card p-5 pt-14 shadow-xl outline-none backdrop-blur-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === "left" &&
            "inset-y-0 left-0 h-full overflow-y-auto rounded-r-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "right" &&
            "inset-y-0 right-0 h-full overflow-y-auto rounded-l-xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          className
        )}
        {...props}
      >
        <SheetClose asChild>
          <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 size-10" aria-label="Close menu">
            <X className="size-5" />
          </Button>
        </SheetClose>
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 pr-10 text-left", className)} {...props} />;
}

export { Sheet, SheetPortal, SheetTrigger, SheetClose, SheetOverlay, SheetContent, SheetHeader };

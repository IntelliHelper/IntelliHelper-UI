"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@intelli/ui";

type ComponentFaqProps = {
  title: string;
  description: string;
  installCommand: string;
};

/**
 * Client-only FAQ accordion for component pages.
 * Keeps Radix Accordion (and any CVA helpers) off the RSC boundary.
 */
export function ComponentFaq({
  title,
  description,
  installCommand,
}: ComponentFaqProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="glass-panel w-full rounded-2xl px-4"
    >
      <AccordionItem value="install">
        <AccordionTrigger>How do I install {title}?</AccordionTrigger>
        <AccordionContent>
          Run{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            {installCommand}
          </code>{" "}
          after initializing IntelliHelper UI in your Next.js project.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="use">
        <AccordionTrigger>What is {title} used for?</AccordionTrigger>
        <AccordionContent>{description}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="stack">
        <AccordionTrigger>
          Does it work with Next.js and Tailwind?
        </AccordionTrigger>
        <AccordionContent>
          Yes. It is designed for React, Next.js, and Tailwind CSS with Liquid
          Glass tokens and chrome variants you can edit locally.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

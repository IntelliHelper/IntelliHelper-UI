"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@intelli/ui";

export type FaqItem = {
  q: string;
  a: string;
};

type DocsFaqProps = {
  items: readonly FaqItem[];
};

/**
 * Client-only FAQ accordion for docs pages (RSC-safe boundary).
 */
export function DocsFaq({ items }: DocsFaqProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="glass-panel w-full rounded-2xl px-4"
    >
      {items.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

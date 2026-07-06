"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@intelli/ui";

const slides = [
  {
    title: "Liquid Glass",
    description:
      "Frosted chrome controls that float above expressive content backgrounds.",
  },
  {
    title: "Spring Motion",
    description:
      "Subtle rise, scale, and blur transitions tuned for premium interfaces.",
  },
  {
    title: "Install via CLI",
    description:
      "Copy source into your project with npx @intellihelper/cli add carousel.",
  },
  {
    title: "Fully Customizable",
    description:
      "Every component exports CVA helpers, data-slot hooks, and className slots.",
  },
];

export function CarouselDemo() {
  return (
    <div className="mx-auto max-w-xl">
      <Carousel className="w-full">
        <CarouselContent variant="chrome" className="px-1 py-1">
          {slides.map((slide) => (
            <CarouselItem key={slide.title}>
              <Card variant="outline" animated={false} className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>{slide.title}</CardTitle>
                  <CardDescription>{slide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm glass-chrome-text-muted">
                    Use arrow keys when the carousel is focused to move between
                    slides.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
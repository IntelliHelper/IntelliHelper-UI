import { BackgroundPictureDemo } from "./background-picture-demo";
import { ThemeSwitcher } from "./theme-switcher";

export function PlaygroundSettings() {
  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="mb-5 max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground">
          Customize the playground
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the background and theme — changes apply across every component
          page.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Background</h3>
          <BackgroundPictureDemo compact />
        </div>

        <div className="min-w-0 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Theme</h3>
          <ThemeSwitcher variant="compact" />
        </div>
      </div>
    </section>
  );
}
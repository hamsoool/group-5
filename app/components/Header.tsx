import { ChefHat } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-white/80 dark:bg-background/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
              <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-xl tracking-tight">CookBot</h1>
              <span className="text-sm text-muted-foreground/80">AI Recipe Generator</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


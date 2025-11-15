import Link from "next/link";
import { Header } from "./components/Header";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Sparkles, Lightbulb, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-5 sm:space-y-6 md:space-y-8 py-8 sm:py-12 md:py-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 blur-2xl opacity-20 dark:opacity-30"></div>
              <Sparkles
                className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 text-orange-500 relative"
                strokeWidth={2}
              />
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Discover Your Next Meal
            </h2>
            <p className="text-muted-foreground/90 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
              Tell us what ingredients you have, and we'll create delicious
              recipes just for you. Reduce food waste and make meal planning
              effortless.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 md:pt-8 px-2">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full shadow-sm">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 md:mb-16">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow dark:bg-card/50">
            <CardContent className="pt-7 pb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center ring-1 ring-orange-100 dark:ring-orange-900">
                  <Sparkles
                    className="w-6 h-6 text-orange-600 dark:text-orange-500"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <h3 className="mb-2 tracking-tight">AI-Powered</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Smart recipes generated using advanced AI technology
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow dark:bg-card/50">
            <CardContent className="pt-7 pb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center ring-1 ring-green-100 dark:ring-green-900">
                  <Leaf
                    className="w-6 h-6 text-green-600 dark:text-green-500"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <h3 className="mb-2 tracking-tight">Reduce Waste</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Use what you have and minimize food waste
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow dark:bg-card/50">
            <CardContent className="pt-7 pb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center ring-1 ring-amber-100 dark:ring-amber-900">
                  <Lightbulb
                    className="w-6 h-6 text-amber-600 dark:text-amber-500"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <h3 className="mb-2 tracking-tight">Smart Tips</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Get variations and healthier alternatives
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-16 sm:mt-20 md:mt-24 py-8 sm:py-10 md:py-12 bg-white/50 dark:bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center text-xs sm:text-sm text-muted-foreground/70">
          <p className="tracking-wide">
            CookBot - Making cooking easier, one recipe at a time
          </p>
        </div>
      </footer>
    </div>
  );
}

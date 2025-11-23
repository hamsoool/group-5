import Link from "next/link";
import { Header } from "./components/Header";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Sparkles, Lightbulb, Leaf, Mail, Users, ChefHat, Clock, Heart } from "lucide-react";
import { ParallaxSection } from "./components/ParallaxSection";
import { FadeInSection } from "./components/FadeInSection";
import { FloatingElements } from "./components/FloatingElements";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-background dark:via-background dark:to-orange-950 overflow-x-hidden">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Parallax */}
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
          {/* Background Parallax Elements */}
          <ParallaxSection speed={0.3} className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/40 dark:bg-orange-900/30 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/40 dark:bg-amber-900/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-300/20 dark:bg-orange-800/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </ParallaxSection>
          
          <FloatingElements />
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-24 sm:py-28 md:py-32 lg:py-40">
            <FadeInSection>
              <Card className="border-none shadow-2xl bg-white/90 dark:bg-background/90 backdrop-blur-xl max-w-5xl mx-auto hover:shadow-3xl transition-shadow duration-500">
                <CardContent className="flex flex-col items-center py-16 sm:py-20 md:py-24 px-6 sm:px-8 md:px-12 lg:px-16 text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 flex items-center justify-center shadow-xl mb-8 sm:mb-10 animate-bounce-slow hover:scale-110 transition-transform duration-300">
                    <ChefHat
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white animate-pulse"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight mb-8 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent animate-gradient">
                    Discover Your Next Meal
                  </h1>
                  <p className="text-muted-foreground/90 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed mb-10 sm:mb-12 font-medium">
                    Tell us what ingredients you have, and we'll create delicious
                    recipes just for you. Reduce food waste and make meal planning
                    effortless.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center pt-4 w-full sm:w-auto">
                    <Link href="/auth/signup" className="w-full sm:w-auto group">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto px-10 py-7 text-lg sm:text-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 font-semibold"
                      >
                        Get Started
                        <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                    </Link>
                    <Link href="/auth/login" className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto px-10 py-7 text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 font-semibold"
                      >
                        Login
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </section>

        {/* Features Section with Parallax */}
        <section className="py-20 sm:py-24 md:py-28 lg:py-36 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent dark:via-orange-950/20"></div>
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <FadeInSection delay={100}>
              <div className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-28">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent animate-gradient">
                  Why Choose CookBot?
                </h2>
                <p className="text-muted-foreground text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto font-medium">
                  Experience the future of cooking with AI-powered recipe generation
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              <FadeInSection delay={200}>
                <ParallaxSection speed={0.2}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 dark:from-background dark:via-orange-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200/0 to-orange-300/0 group-hover:from-orange-200/20 group-hover:to-orange-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/50 dark:to-orange-900 flex items-center justify-center ring-2 ring-orange-200 dark:ring-orange-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Sparkles
                          className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 dark:text-orange-500 group-hover:animate-spin"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-orange-900 dark:text-orange-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                        AI-Powered
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Smart recipes generated using advanced AI technology that learns from millions of recipes
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>

              <FadeInSection delay={300}>
                <ParallaxSection speed={0.25}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-green-50 via-green-100 to-green-50 dark:from-background dark:via-green-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/0 to-green-300/0 group-hover:from-green-200/20 group-hover:to-green-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/50 dark:to-green-900 flex items-center justify-center ring-2 ring-green-200 dark:ring-green-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Leaf
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600 dark:text-green-500 group-hover:animate-bounce"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-green-900 dark:text-green-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                        Reduce Waste
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Use what you have and minimize food waste with intelligent ingredient matching
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>

              <FadeInSection delay={400}>
                <ParallaxSection speed={0.2}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 dark:from-background dark:via-amber-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200/0 to-amber-300/0 group-hover:from-amber-200/20 group-hover:to-amber-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/50 dark:to-amber-900 flex items-center justify-center ring-2 ring-amber-200 dark:ring-amber-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Lightbulb
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-600 dark:text-amber-500 group-hover:animate-pulse"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                        Smart Tips
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Get variations, healthier alternatives, and cooking tips tailored to your preferences
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>

              <FadeInSection delay={500}>
                <ParallaxSection speed={0.15}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-red-50 via-red-100 to-red-50 dark:from-background dark:via-red-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-200/0 to-red-300/0 group-hover:from-red-200/20 group-hover:to-red-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/50 dark:to-red-900 flex items-center justify-center ring-2 ring-red-200 dark:ring-red-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Heart
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600 dark:text-red-500 group-hover:scale-125 transition-transform duration-300"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-red-900 dark:text-red-100 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                        Personalized
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Recipes customized to your dietary preferences, allergies, and taste preferences
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>

              <FadeInSection delay={600}>
                <ParallaxSection speed={0.2}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-background dark:via-blue-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/0 to-blue-300/0 group-hover:from-blue-200/20 group-hover:to-blue-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950/50 dark:to-blue-900 flex items-center justify-center ring-2 ring-blue-200 dark:ring-blue-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Clock
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-500 group-hover:animate-spin"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        Quick & Easy
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Get instant recipe suggestions that fit your available time and cooking skill level
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>

              <FadeInSection delay={700}>
                <ParallaxSection speed={0.25}>
                  <Card className="group flex flex-col justify-center items-center border-none shadow-2xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-background dark:via-purple-950 dark:to-background hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 h-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/0 to-purple-300/0 group-hover:from-purple-200/20 group-hover:to-purple-300/20 transition-all duration-500"></div>
                    <CardContent className="flex flex-col items-center py-10 sm:py-12 md:py-14 px-6 sm:px-8 text-center relative z-10">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950/50 dark:to-purple-900 flex items-center justify-center ring-2 ring-purple-200 dark:ring-purple-900 mb-6 sm:mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Sparkles
                          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-600 dark:text-purple-500 group-hover:animate-pulse"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                        Endless Variety
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                        Discover new cuisines and flavors with unlimited recipe variations and combinations
                      </p>
                    </CardContent>
                  </Card>
                </ParallaxSection>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* About Us Section with Parallax */}
        <section className="py-20 sm:py-24 md:py-28 lg:py-36 relative overflow-hidden">
          <ParallaxSection speed={0.1} className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/60 via-orange-200/40 to-orange-100/60 dark:from-orange-950/60 dark:via-orange-900/40 dark:to-orange-950/60"></div>
          </ParallaxSection>
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <FadeInSection>
              <Card className="border-none shadow-2xl bg-white/95 dark:bg-background/95 backdrop-blur-md max-w-5xl mx-auto hover:shadow-3xl transition-shadow duration-500">
                <CardContent className="flex flex-col items-center py-16 sm:py-20 md:py-24 px-8 sm:px-10 md:px-14 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 dark:from-orange-900 dark:via-orange-800 dark:to-orange-700 flex items-center justify-center ring-4 ring-orange-300/50 dark:ring-orange-800/50 mb-8 shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Users
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-orange-700 dark:text-orange-300"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent animate-gradient">
                    About Us
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-4xl mx-auto mb-8 font-medium">
                    We are a team of passionate foodies and tech enthusiasts dedicated
                    to making cooking easier and more enjoyable. Our mission is to
                    help you create amazing meals, reduce waste, and discover new
                    flavors every day.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground/70 leading-relaxed max-w-3xl mx-auto">
                    With CookBot, we combine the power of artificial intelligence with
                    culinary expertise to bring you personalized recipe suggestions
                    that transform your kitchen experience. Whether you're a beginner
                    cook or a seasoned chef, we're here to inspire your next culinary adventure.
                  </p>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </section>

        {/* Contact Section with Parallax */}
        <section className="py-20 sm:py-24 md:py-28 lg:py-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/40 to-transparent dark:via-orange-950/30"></div>
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            <FadeInSection>
              <Card className="border-none shadow-2xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 dark:from-background dark:via-orange-950 dark:to-background max-w-4xl mx-auto hover:shadow-3xl transition-shadow duration-500">
                <CardContent className="flex flex-col items-center py-16 sm:py-20 md:py-24 px-8 sm:px-10 md:px-14 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900 dark:via-orange-800 dark:to-orange-700 flex items-center justify-center ring-4 ring-orange-200/50 dark:ring-orange-800/50 mb-8 shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Mail
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-orange-600 dark:text-orange-300"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent animate-gradient">
                    Contact Us
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
                    Have questions or feedback? We'd love to hear from you! Reach out to our developers:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
                    <a
                      href="mailto:dev1@cookbot.com"
                      className="group text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 px-6 py-3 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:scale-110 hover:shadow-lg"
                    >
                      cookbot@contact.com
                    </a>
                    <span className="hidden sm:inline text-muted-foreground/50 text-2xl">•</span>
                    <a
                      href="mailto:dev2@cookbot.com"
                      className="group text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 px-6 py-3 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:scale-110 hover:shadow-lg"
                    >
                      group5@bsit3.edu.ph
                    </a>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </section>
      </main>

      <footer className="border-t mt-20 sm:mt-24 md:mt-28 lg:mt-32 py-12 sm:py-14 md:py-16 bg-white/60 dark:bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground/80 tracking-wide font-medium">
            CookBot - Making cooking easier, one recipe at a time
          </p>
        </div>
      </footer>
    </div>
  );
}


import { Header } from "@/app/components/Header";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Card, CardContent } from "@/app/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-orange-950/20 dark:via-background dark:to-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Hero Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
          </div>

          {/* Ingredients Section Skeleton */}
          <Card className="border-none shadow-sm dark:bg-card/50">
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-32">
                    <Skeleton className="h-24 w-full mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-10 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button Skeleton */}
          <Skeleton className="h-12 w-full rounded-md" />

          {/* Recipe Cards Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm dark:bg-card/50">
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
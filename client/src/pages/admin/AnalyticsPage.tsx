import {
  TrendingUp,
  DollarSign,
  Users,
  Film,
  Theater,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDashboardOverview,
  useRevenueReport,
  useOccupancyReport,
  usePopularMovies,
} from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from "date-fns";

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: revenue, isLoading: revenueLoading } = useRevenueReport({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    period: "daily",
  });
  const { data: occupancy, isLoading: occupancyLoading } = useOccupancyReport();
  const { data: popularMovies, isLoading: popularLoading } = usePopularMovies();

  const stats = [
    {
      title: "Total Revenue",
      value: `$${(overview?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Reservations",
      value: overview?.totalReservations || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Movies",
      value: overview?.totalMovies || 0,
      icon: Film,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Theaters",
      value: overview?.totalTheaters || 0,
      icon: Theater,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Monitor your business performance and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {overviewLoading
            ? [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Revenue and Popular Movies */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue Trend (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : revenue?.daily && revenue.daily.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Total Revenue: $
                    {revenue.daily
                      .reduce((sum, day) => sum + day.revenue, 0)
                      .toFixed(2)}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {revenue.daily.slice(-10).map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {format(new Date(day.date), "MMM dd")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {day.reservations} reservations
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          ${day.revenue.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No revenue data available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Movies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5 text-purple-600" />
                Popular Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : popularMovies?.movies && popularMovies.movies.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {popularMovies.movies.map((movie, index) => (
                    <div
                      key={movie.movieId}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{movie.movieTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            {movie.totalReservations} reservations
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        ${movie.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Film className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No popular movies data available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Theater className="h-5 w-5 text-rose-600" />
              Theater Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {occupancyLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : occupancy?.overall ? (
              <div>
                {/* Overall Occupancy */}
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Overall Occupancy Rate
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Across all theaters
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-rose-600">
                      {occupancy.overall.occupancyRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Theater-wise Occupancy */}
                {occupancy.theaters && occupancy.theaters.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {occupancy.theaters.map((theater) => (
                      <div
                        key={theater.theaterId}
                        className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{theater.theaterName}</h4>
                          <span className="text-lg font-bold text-rose-600">
                            {theater.occupancyRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                          <div
                            className="bg-rose-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(theater.occupancyRate, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No theater occupancy data available
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Theater className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No occupancy data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

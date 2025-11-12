import {
  TrendingUp,
  Users,
  Film,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDashboardOverview,
  usePopularMovies,
  useOccupancyReport,
} from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useDashboardOverview();

  const { data: popularMoviesData, isLoading: isLoadingMovies } =
    usePopularMovies();

  const { data: occupancyData, isLoading: isLoadingOccupancy } =
    useOccupancyReport();

  const popularMovies = popularMoviesData?.movies || [];

  const statsCards = [
    {
      title: "Total Revenue",
      value: dashboardData
        ? `$${dashboardData.totalRevenue.toLocaleString()}`
        : "$0",
      icon: DollarSign,
      trend: "+12.5%",
      loading: isLoadingDashboard,
    },
    {
      title: "Total Bookings",
      value: dashboardData
        ? dashboardData.totalReservations.toLocaleString()
        : "0",
      icon: Calendar,
      trend: "+8.2%",
      loading: isLoadingDashboard,
    },
    {
      title: "Active Movies",
      value: dashboardData ? dashboardData.totalMovies.toString() : "0",
      icon: Film,
      trend: "+3",
      loading: isLoadingDashboard,
    },
    {
      title: "Avg Occupancy",
      value: occupancyData
        ? `${Math.round(occupancyData.overall.occupancyRate)}%`
        : "0%",
      icon: Users,
      trend: "+5.1%",
      loading: isLoadingOccupancy,
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back! Here is what is happening with your theater.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">{stat.trend}</span> from
                      last period
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMovies ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : popularMovies.length > 0 ? (
                <div className="space-y-4">
                  {popularMovies.slice(0, 5).map((movie, index) => (
                    <div
                      key={movie.movieId}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {movie.movieTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {movie.totalReservations} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">\</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No data available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Theater Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOccupancy ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : occupancyData && occupancyData.theaters.length > 0 ? (
                <div className="space-y-4">
                  {occupancyData.theaters.map((theater) => (
                    <div key={theater.theaterId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {theater.theaterName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(theater.occupancyRate)}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${theater.occupancyRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {theater.occupiedSeats} / {theater.totalSeats} seats
                        occupied
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {dashboardData && (
          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Total Theaters
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.totalTheaters}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Movies</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.totalMovies}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Total Reservations
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardData.totalReservations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

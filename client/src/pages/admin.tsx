import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Building, Review } from "@shared/schema";

interface AdminStats {
  totalUsers: number;
  totalBuildings: number;
  pendingBuildings: number;
  totalReviews: number;
  pendingReviews: number;
}

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingBuildings, isLoading: buildingsLoading } = useQuery<Building[]>({
    queryKey: ["/api/admin/buildings/pending"],
  });

  const { data: pendingReviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews/pending"],
  });

  const approveBuilding = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/buildings/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/buildings/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      toast({ title: "Building approved", description: "The building is now visible to users." });
    },
  });

  const denyBuilding = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/buildings/${id}/deny`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/buildings/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Building denied", description: "The building submission has been rejected." });
    },
  });

  const approveReview = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Review approved", description: "The review is now visible on the building page." });
    },
  });

  const denyReview = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/reviews/${id}/deny`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Review denied", description: "The review has been rejected." });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the admin dashboard.
            </p>
            <Button asChild data-testid="button-signin-admin">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage buildings, reviews, and platform content
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalBuildings || 0}</p>
                    <p className="text-sm text-muted-foreground">Buildings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalReviews || 0}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {(stats?.pendingBuildings || 0) + (stats?.pendingReviews || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="buildings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="buildings" className="gap-2" data-testid="tab-buildings">
                <Building2 className="h-4 w-4" />
                Buildings
                {(stats?.pendingBuildings || 0) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {stats?.pendingBuildings}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2" data-testid="tab-reviews">
                <MessageSquare className="h-4 w-4" />
                Reviews
                {(stats?.pendingReviews || 0) > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {stats?.pendingReviews}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buildings">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Buildings</CardTitle>
                  <CardDescription>
                    Review and approve new building submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {buildingsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : (pendingBuildings?.length || 0) > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Building</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingBuildings?.map((building) => (
                          <TableRow key={building.id} data-testid={`building-row-${building.id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{building.name}</p>
                                {building.neighborhood && (
                                  <p className="text-sm text-muted-foreground">
                                    {building.neighborhood}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">
                                {building.address}, {building.zipCode}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground">
                                {building.createdAt
                                  ? formatDistanceToNow(new Date(building.createdAt), {
                                      addSuffix: true,
                                    })
                                  : "Unknown"}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => approveBuilding.mutate(building.id)}
                                  disabled={approveBuilding.isPending}
                                  data-testid={`button-approve-building-${building.id}`}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 text-destructive hover:text-destructive"
                                  onClick={() => denyBuilding.mutate(building.id)}
                                  disabled={denyBuilding.isPending}
                                  data-testid={`button-deny-building-${building.id}`}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Deny
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending buildings</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                  <CardDescription>
                    Moderate and approve user reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                      ))}
                    </div>
                  ) : (pendingReviews?.length || 0) > 0 ? (
                    <div className="space-y-4">
                      {pendingReviews?.map((review) => (
                        <Card key={review.id} data-testid={`review-row-${review.id}`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {review.overallRating}/5 stars
                                  </Badge>
                                  <Badge variant="secondary">
                                    Floor {review.floorNumber}
                                  </Badge>
                                  {review.isAnonymous && (
                                    <Badge variant="secondary">Anonymous</Badge>
                                  )}
                                </div>
                                <p className="text-sm">{review.reviewText}</p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted{" "}
                                  {review.createdAt
                                    ? formatDistanceToNow(new Date(review.createdAt), {
                                        addSuffix: true,
                                      })
                                    : "Unknown"}
                                </p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => approveReview.mutate(review.id)}
                                  disabled={approveReview.isPending}
                                  data-testid={`button-approve-review-${review.id}`}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 text-destructive hover:text-destructive"
                                  onClick={() => denyReview.mutate(review.id)}
                                  disabled={denyReview.isPending}
                                  data-testid={`button-deny-review-${review.id}`}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Deny
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending reviews</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

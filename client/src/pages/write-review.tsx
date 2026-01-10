import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigation } from "@/components/navigation";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Building2, CheckCircle2, Volume2, Sparkles, Wrench, Shield, Bug } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Building } from "@shared/schema";

const reviewFormSchema = z.object({
  overallRating: z.number().min(1, "Please select an overall rating").max(5),
  floorNumber: z.number().min(1, "Please enter your floor number").max(100),
  noiseRating: z.number().min(1).max(5).optional(),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  maintenanceRating: z.number().min(1).max(5).optional(),
  safetyRating: z.number().min(1).max(5).optional(),
  pestRating: z.number().min(1).max(5).optional(),
  reviewText: z.string().min(50, "Review must be at least 50 characters"),
  isAnonymous: z.boolean().default(true),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function WriteReview() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { data: building, isLoading: buildingLoading } = useQuery<Building>({
    queryKey: ["/api/buildings", id],
  });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      overallRating: 0,
      floorNumber: 1,
      noiseRating: undefined,
      cleanlinessRating: undefined,
      maintenanceRating: undefined,
      safetyRating: undefined,
      pestRating: undefined,
      reviewText: "",
      isAnonymous: true,
    },
  });

  const submitReview = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const response = await apiRequest("POST", `/api/buildings/${id}/reviews`, {
        ...data,
        buildingId: id,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings", id, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buildings", id] });
      setSuccessModalOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    submitReview.mutate(data);
  };

  if (buildingLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-96 rounded-xl" />
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
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to write a review.
            </p>
            <Button asChild data-testid="button-signin-to-review">
              <a href="/api/login">Sign In to Continue</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Building Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The building you're trying to review doesn't exist.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <Link href={`/building/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to {building.name}
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Write a Review</CardTitle>
              <CardDescription>
                Share your experience at {building.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="overallRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Overall Rating *</FormLabel>
                        <FormControl>
                          <StarRating
                            rating={field.value}
                            size="lg"
                            interactive
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="floorNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            data-testid="input-floor-number"
                          />
                        </FormControl>
                        <FormDescription>
                          Which floor did you live on?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label className="text-base">Category Ratings (Optional)</Label>
                    <p className="text-sm text-muted-foreground">
                      Rate specific aspects of the building
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="noiseRating"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 p-3 rounded-lg border">
                            <Volume2 className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <FormLabel className="text-sm">Noise</FormLabel>
                              <StarRating
                                rating={field.value || 0}
                                size="sm"
                                interactive
                                onChange={field.onChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cleanlinessRating"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 p-3 rounded-lg border">
                            <Sparkles className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <FormLabel className="text-sm">Cleanliness</FormLabel>
                              <StarRating
                                rating={field.value || 0}
                                size="sm"
                                interactive
                                onChange={field.onChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maintenanceRating"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 p-3 rounded-lg border">
                            <Wrench className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <FormLabel className="text-sm">Maintenance</FormLabel>
                              <StarRating
                                rating={field.value || 0}
                                size="sm"
                                interactive
                                onChange={field.onChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="safetyRating"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 p-3 rounded-lg border">
                            <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <FormLabel className="text-sm">Safety</FormLabel>
                              <StarRating
                                rating={field.value || 0}
                                size="sm"
                                interactive
                                onChange={field.onChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pestRating"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 p-3 rounded-lg border sm:col-span-2">
                            <Bug className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <FormLabel className="text-sm">Pest-Free (5 = no pests)</FormLabel>
                              <StarRating
                                rating={field.value || 0}
                                size="sm"
                                interactive
                                onChange={field.onChange}
                              />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="reviewText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Review *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your experience living in this building. What did you like or dislike? How was the landlord/management? Any issues with the apartment?"
                            className="min-h-[150px] resize-y"
                            {...field}
                            data-testid="textarea-review"
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 50 characters. Be honest and specific.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Post Anonymously</FormLabel>
                          <FormDescription>
                            Your name will not be shown with this review
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-anonymous"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitReview.isPending}
                    data-testid="button-submit-review"
                  >
                    {submitReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your review has been submitted and is pending approval. We'll review it shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setLocation(`/building/${id}`)} data-testid="button-back-to-building">
              Back to Building
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

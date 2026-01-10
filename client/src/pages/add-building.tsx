import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Building2, CheckCircle2, PenLine } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { NYC_NEIGHBORHOODS, BUILDING_TYPES } from "@shared/schema";

const addBuildingSchema = z.object({
  name: z.string().min(2, "Building name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().default("New York"),
  zipCode: z.string().regex(/^\d{5}$/, "Must be a valid 5-digit ZIP code"),
  neighborhood: z.string().optional(),
  buildingType: z.string().optional(),
  landlordName: z.string().optional(),
});

type AddBuildingFormValues = z.infer<typeof addBuildingSchema>;

export default function AddBuilding() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [newBuildingId, setNewBuildingId] = useState<string | null>(null);

  const form = useForm<AddBuildingFormValues>({
    resolver: zodResolver(addBuildingSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "New York",
      zipCode: "",
      neighborhood: "",
      buildingType: "",
      landlordName: "",
    },
  });

  const addBuilding = useMutation({
    mutationFn: async (data: AddBuildingFormValues) => {
      const response = await apiRequest("POST", "/api/buildings", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/buildings"] });
      setNewBuildingId(data.id);
      setSuccessModalOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add building. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddBuildingFormValues) => {
    addBuilding.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-96 bg-muted rounded-xl" />
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
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to add a building.
            </p>
            <Button asChild data-testid="button-signin-to-add">
              <a href="/api/login">Sign In to Continue</a>
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
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add a New Building</CardTitle>
              <CardDescription>
                Can't find a building? Add it to our database so you and others can review it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., The Avalon, 123 Main St Apartments"
                            {...field}
                            data-testid="input-building-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 123 Main Street"
                            {...field}
                            data-testid="input-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="bg-muted"
                              data-testid="input-city"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 10001"
                              maxLength={5}
                              {...field}
                              data-testid="input-zip"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neighborhood</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-neighborhood">
                              <SelectValue placeholder="Select neighborhood" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NYC_NEIGHBORHOODS.map((n) => (
                              <SelectItem key={n} value={n}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buildingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-building-type">
                              <SelectValue placeholder="Select building type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BUILDING_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landlordName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landlord / Management Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., ABC Property Management"
                            {...field}
                            data-testid="input-landlord"
                          />
                        </FormControl>
                        <FormDescription>
                          Optional, but helps other renters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={addBuilding.isPending}
                    data-testid="button-submit-building"
                  >
                    {addBuilding.isPending ? "Adding Building..." : "Add Building"}
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
            <DialogTitle className="text-center">Building Added!</DialogTitle>
            <DialogDescription className="text-center">
              The building has been submitted and is pending approval. Would you like to write the first review?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setLocation("/search")}
              data-testid="button-back-to-search"
            >
              Back to Search
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => newBuildingId && setLocation(`/building/${newBuildingId}/review`)}
              data-testid="button-write-first-review"
            >
              <PenLine className="h-4 w-4" />
              Write First Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

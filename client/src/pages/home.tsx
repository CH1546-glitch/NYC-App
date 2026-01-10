import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { Search, Building2, Shield, Users, ChevronRight } from "lucide-react";
import heroImage from "@assets/generated_images/nyc_skyline_sunset_hero.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation("/search");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation transparent />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Honest, anonymous reviews from{" "}
            <span className="text-primary">real NYC renters</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Make informed decisions about your next apartment. Read and share authentic reviews about buildings across all five boroughs.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by building name or address..."
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-hero-search"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg" data-testid="button-hero-search">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <span>Popular: </span>
            <button
              onClick={() => setLocation("/search?q=Upper East Side")}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Upper East Side
            </button>
            <button
              onClick={() => setLocation("/search?q=Williamsburg")}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Williamsburg
            </button>
            <button
              onClick={() => setLocation("/search?q=Astoria")}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Astoria
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-8 w-8 text-white/50 rotate-90" />
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finding your perfect NYC apartment has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-card border border-card-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Buildings</h3>
              <p className="text-muted-foreground">
                Browse thousands of NYC apartment buildings by name, address, or neighborhood
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-card border border-card-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Read Reviews</h3>
              <p className="text-muted-foreground">
                Get detailed insights on noise, cleanliness, maintenance, safety, and more
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-card border border-card-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Experience</h3>
              <p className="text-muted-foreground">
                Help fellow renters by anonymously sharing your honest apartment review
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Privacy, Protected
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We understand the importance of honest feedback. That's why all reviews can be posted anonymously, protecting you from any potential retaliation from landlords or management companies.
              </p>
              <div className="flex items-center gap-3 text-primary">
                <Shield className="h-6 w-6" />
                <span className="font-medium">Anonymous reviews by default</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">No personal info shared</h4>
                    <p className="text-sm text-muted-foreground">Your identity stays private</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Moderated content</h4>
                    <p className="text-sm text-muted-foreground">All reviews are checked for quality</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Community driven</h4>
                    <p className="text-sm text-muted-foreground">Built by renters, for renters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NYC Apartment Reviews. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

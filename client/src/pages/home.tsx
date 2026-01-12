import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { Shield, Search, Star, PenLine } from "lucide-react";
import heroVideo from "@assets/NYC_Video.mp4";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleBuildingSelect = (building: { id: string; name: string; address: string }) => {
    setLocation(`/building/${building.id}`);
  };

  const handleSearch = (query: string) => {
    if (query) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    } else {
      setLocation("/search");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation transparent />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Fallback background while video loads */}
        <div className="absolute inset-0 bg-neutral-900 -z-10 animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-normal text-white mb-12 leading-[1.1] tracking-tight">
            Honest, anonymous reviews from real NYC renters
          </h1>

          <SearchAutocomplete
            onSelect={handleBuildingSelect}
            onSearch={handleSearch}
            placeholder="Search by building name or address"
            className="max-w-2xl mx-auto mb-8"
          />

          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto font-light tracking-wide">
            Make informed decisions about your next apartment. Read and share authentic reviews about buildings across all five boroughs.
          </p>
        </div>

      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-normal">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Search className="h-10 w-10 mx-auto mb-6 text-muted-foreground" strokeWidth={1} aria-hidden="true" />
              <h3 className="font-serif text-2xl font-normal mb-4">Search</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Browse thousands of NYC apartment buildings by name, address, or neighborhood
              </p>
            </div>

            <div className="text-center">
              <Star className="h-10 w-10 mx-auto mb-6 text-muted-foreground" strokeWidth={1} aria-hidden="true" />
              <h3 className="font-serif text-2xl font-normal mb-4">Read Reviews</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Get detailed insights on noise, cleanliness, maintenance, safety, and more
              </p>
            </div>

            <div className="text-center">
              <PenLine className="h-10 w-10 mx-auto mb-6 text-muted-foreground" strokeWidth={1} aria-hidden="true" />
              <h3 className="font-serif text-2xl font-normal mb-4">Contribute</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Help fellow renters by anonymously sharing your honest apartment review
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl font-normal mb-8">
                Privacy Protected
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                We understand the importance of honest feedback. That's why all reviews can be posted anonymously, protecting you from any potential retaliation.
              </p>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span className="text-sm tracking-wide uppercase">Anonymous by default</span>
              </div>
            </div>
            <div className="md:border-l md:border-border md:pl-12">
              <div className="space-y-8">
                <div>
                  <h4 className="font-serif text-xl mb-2">No personal info shared</h4>
                  <p className="text-sm text-muted-foreground font-light">Your identity stays private</p>
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2">Moderated content</h4>
                  <p className="text-sm text-muted-foreground font-light">All reviews are checked for quality</p>
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-2">Community driven</h4>
                  <p className="text-sm text-muted-foreground font-light">Built by renters, for renters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            &copy; {new Date().getFullYear()} NYC Apartment Reviews
          </p>
        </div>
      </footer>
    </div>
  );
}

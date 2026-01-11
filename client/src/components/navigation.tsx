import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Landmark, Search, Plus, LayoutDashboard, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key press (accessibility)
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  const isHome = location === "/";
  const bgClass = transparent && isHome
    ? "bg-white/95 backdrop-blur-md border-b border-border"
    : "bg-background/95 backdrop-blur-md border-b border-border";

  const navLinks = [
    { href: "/search", label: "Search", icon: Search },
    { href: "/add-building", label: "Add Building", icon: Plus },
  ];

  const adminLinks = user ? [
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
  ] : [];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center h-20">
          {/* Left: Logo and brand */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Landmark className="h-8 w-10" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter" />
              <span className="font-serif text-2xl font-medium tracking-tight hidden sm:inline">
                NYC Reviews
              </span>
            </Link>
          </div>

          {/* Center: Navigation links - absolutely centered */}
          <div className="hidden md:flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2 rounded-none text-xs tracking-widest uppercase font-medium"
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2 rounded-none text-xs tracking-widest uppercase font-medium"
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right: Auth buttons */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-none" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="cursor-pointer" data-testid="button-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="rounded-none text-xs tracking-widest uppercase font-serif bg-black hover:bg-black/90 text-white border border-black" data-testid="button-login">
                <a href="/api/login">Sign In</a>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1" role="menu">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-none text-xs tracking-widest uppercase font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-none text-xs tracking-widest uppercase font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

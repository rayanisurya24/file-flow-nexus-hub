
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

export const AuthButtons = () => {
  const location = useLocation();
  const isInDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton fallbackRedirectUrl="/">
          <Button 
            variant="ghost" 
            className="text-foreground/80 hover:text-primary bg-background/5 backdrop-blur-lg border border-border rounded-full px-6 py-2"
          >
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton fallbackRedirectUrl="/">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2"
          >
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        {!isInDashboard && (
          <Link to="/dashboard">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2 mr-4"
            >
              Go to Dashboard
            </Button>
          </Link>
        )}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </SignedIn>
    </div>
  );
};


import { NavBar } from "@/components/ui/tubelight-navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AuthButtons } from "@/components/AuthButtons";
import { FileText, Upload, Share2, Settings } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import AuthPage from "@/components/AuthPage";

const Index = () => {
  const { user, isLoaded } = useUser();

  const navItems = [
    { name: 'Home', url: '#home', icon: FileText },
    { name: 'Upload', url: '#upload', icon: Upload },
    { name: 'Share', url: '#share', icon: Share2 },
    { name: 'Settings', url: '#settings', icon: Settings }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // If user is signed in, they'll be redirected by AuthWrapper in App.tsx
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AuthPage />
    </div>
  );
};

export default Index;

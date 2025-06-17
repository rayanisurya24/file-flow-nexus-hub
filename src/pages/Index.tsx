
import { NavBar } from "@/components/ui/tubelight-navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AuthButtons } from "@/components/AuthButtons";
import { FileText, Upload, Share2, Settings } from "lucide-react";

const Index = () => {
  const navItems = [
    { name: 'Home', url: '#home', icon: FileText },
    { name: 'Upload', url: '#upload', icon: Upload },
    { name: 'Share', url: '#share', icon: Share2 },
    { name: 'Settings', url: '#settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen">
      <NavBar items={navItems} />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Index;

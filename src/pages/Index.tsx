
import { NavBar } from "@/components/ui/tubelight-navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
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
      
      <div id="home">
        <HeroSection />
      </div>
      
      <div id="features">
        <FeaturesSection />
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-lg mb-8 text-blue-100">Join thousands of users who trust us with their files</p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300">
            Start Free Trial
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Index;

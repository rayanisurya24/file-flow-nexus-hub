
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AuthButtons } from "@/components/AuthButtons";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* CloudVault Logo in top left */}
      <div className="fixed top-6 left-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">CloudVault</span>
        </div>
      </div>

      {/* Auth buttons in top right */}
      <div className="fixed top-6 right-6 z-50">
        <AuthButtons />
      </div>
      
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

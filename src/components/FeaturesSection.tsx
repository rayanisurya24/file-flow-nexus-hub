
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: FileTextIcon,
    name: "Smart File Management",
    description: "Organize your files with AI-powered categorization and automatic tagging for instant retrieval.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-lg"></div>
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Universal Search",
    description: "Find any file instantly with powerful search that works across all your content, including inside documents.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10">
        <div className="absolute top-6 left-6 w-20 h-20 bg-green-500/20 rounded-full blur-lg"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Global Access",
    description: "Access your files from anywhere in the world with lightning-fast sync across all your devices.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="absolute bottom-6 right-6 w-28 h-28 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Version History",
    description: "Never lose your work with automatic version history and the ability to restore any previous version.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-500/20 rounded-full blur-md"></div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Smart Notifications",
    description: "Stay updated with intelligent notifications about file changes, shares, and collaboration activities.",
    href: "#",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10">
        <div className="absolute top-8 right-8 w-24 h-24 bg-red-500/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-4 left-8 w-16 h-16 bg-pink-500/20 rounded-full blur-md"></div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage, share, and collaborate on your files with advanced features that scale with your needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}

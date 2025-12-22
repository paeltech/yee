import { Lightbulb, Users, Target, Award, Handshake, TrendingUp } from "lucide-react";

export function ProjectDetails() {
  const features = [
    {
      icon: Lightbulb,
      title: "Program Overview",
      description: "Comprehensive initiative designed to empower young people through economic opportunities, skills development, and community engagement."
    },
    {
      icon: Target,
      title: "Objectives",
      description: "Creating sustainable economic opportunities, building entrepreneurial skills, and promoting financial independence among youth."
    },
    {
      icon: Users,
      title: "Implementation",
      description: "Implemented under Mulika Tanzania, providing training, resources, and support to help young people achieve their economic goals."
    },
    {
      icon: Award,
      title: "Key Benefits",
      description: "Access to training programs, mentorship opportunities, networking events, and financial resources."
    },
    {
      icon: Handshake,
      title: "Community Impact",
      description: "Strengthening local communities by creating jobs, supporting local businesses, and developing economically empowered leaders."
    },
    {
      icon: TrendingUp,
      title: "Success Metrics",
      description: "Tracking member engagement, business growth, employment rates, and community development indicators."
    }
  ];

  return (
    <section id="project-details" className="py-24 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            About the Program
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Empowering Tanzania's youth through economic opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-3">
              <feature.icon className="h-8 w-8 text-amber-600" />
              <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


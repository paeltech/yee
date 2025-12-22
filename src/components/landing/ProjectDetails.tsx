import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, Target, Award, Handshake, TrendingUp } from "lucide-react";

export function ProjectDetails() {
  const features = [
    {
      icon: Lightbulb,
      title: "Program Overview",
      description: "The Youth Economic Empowerment (YEE) Program is a comprehensive initiative designed to empower young people through economic opportunities, skills development, and community engagement."
    },
    {
      icon: Target,
      title: "Objectives",
      description: "Our primary objectives include creating sustainable economic opportunities, building entrepreneurial skills, fostering community leadership, and promoting financial independence among youth."
    },
    {
      icon: Users,
      title: "Implementation",
      description: "Implemented under Mulika Tanzania, the program operates through youth groups, providing training, resources, and support to help young people achieve their economic goals."
    },
    {
      icon: Award,
      title: "Key Benefits",
      description: "Participants gain access to training programs, mentorship opportunities, networking events, financial resources, and ongoing support to build successful enterprises."
    },
    {
      icon: Handshake,
      title: "Community Impact",
      description: "The program strengthens local communities by creating jobs, supporting local businesses, and developing a new generation of economically empowered leaders."
    },
    {
      icon: TrendingUp,
      title: "Success Metrics",
      description: "We track success through member engagement, business growth, employment rates, and community development indicators to ensure continuous improvement."
    }
  ];

  return (
    <section id="project-details" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            About the YEE Program
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Empowering Tanzania's youth through economic opportunities and community engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-neutral-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl text-neutral-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">Program Goals</h3>
          <ul className="space-y-3 text-neutral-700">
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">•</span>
              <span>Increase youth participation in economic activities by 40%</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">•</span>
              <span>Create sustainable income-generating opportunities for 1000+ youth</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">•</span>
              <span>Develop entrepreneurial skills through comprehensive training programs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">•</span>
              <span>Foster community leadership and social responsibility</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-600 font-bold">•</span>
              <span>Build strong networks and partnerships for long-term success</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}


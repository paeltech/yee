import { Lightbulb, Users, Target, Award, Handshake, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectDetails() {
  const features = [
    {
      icon: Lightbulb,
      title: "Program Overview",
      description: "YEE project is implemented by Mulika Tanzania with support from UNFPA Tanzania to equip youths with skills, resources, and collective support to build sustainable livelihoods and financial independence. "
    },
    {
      icon: Target,
      title: "Objectives",
      description: "The program focuses on building entrepreneurship skills, improving financial literacy, and enabling youths to create stable income opportunities that strengthen their families and communities."
    },
    {
      icon: Users,
      title: "Implementation",
      description: "YEE is delivered through structured training, group formation, mentorship, and access to financial opportunities. Participants are supported to register groups, engage local systems, and grow viable enterprises."
    },
    {
      icon: Award,
      title: "Key Benefits",
      description: "Through the program, youths gain access to business training, financial resources, mentorship, peer networks, and digital tools that support long-term economic growth."
    },
    {
      icon: Handshake,
      title: "Community Impact",
      description: "By empowering youths economically, the program strengthens local economies, supports job creation, and nurtures confident community leaders."
    },
    {
      icon: TrendingUp,
      title: "Success Metrics",
      description: "Impact is measured through participation levels, group formation and registration, enterprise growth, access to finance, and improved economic outcomes."
    }
  ];

  return (
    <section id="project-details" className="py-24 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            About the Program
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Empowering youth with sustainable economic opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-3"
            >
              <feature.icon className="h-8 w-8 text-amber-600" />
              <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



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
    <section id="project-details" className="py-32 px-4 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 tracking-tight">
            About the Program
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-medium">
            Empowering youth with sustainable economic opportunities through innovation and collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-white border border-neutral-100 shadow-sm hover:shadow-2xl hover:border-brand-200 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-black transition-colors duration-500">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-brand-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



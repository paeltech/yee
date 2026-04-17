import { Lightbulb, Users, Target, Award, Handshake, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ProjectDetails() {
  const { t } = useTranslation();
  const features = [
    {
      icon: Lightbulb,
      title: t('landing.project.features.overview.title'),
      description: t('landing.project.features.overview.description')
    },
    {
      icon: Target,
      title: t('landing.project.features.objectives.title'),
      description: t('landing.project.features.objectives.description')
    },
    {
      icon: Users,
      title: t('landing.project.features.implementation.title'),
      description: t('landing.project.features.implementation.description')
    },
    {
      icon: Award,
      title: t('landing.project.features.benefits.title'),
      description: t('landing.project.features.benefits.description')
    },
    {
      icon: Handshake,
      title: t('landing.project.features.impact.title'),
      description: t('landing.project.features.impact.description')
    },
    {
      icon: TrendingUp,
      title: t('landing.project.features.metrics.title'),
      description: t('landing.project.features.metrics.description')
    }
  ];

  return (
    <section id="project-details" className="py-32 px-4 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 dark:bg-brand-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 dark:opacity-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-50 dark:bg-brand-500 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-50 dark:opacity-10 translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight">
            {t('landing.project.title')}
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
            {t('landing.project.subtitle')}
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
              className="group p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-2xl hover:border-brand-200 dark:hover:border-brand-500 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 dark:bg-neutral-800 text-brand-600 group-hover:bg-brand-500 group-hover:text-black transition-colors duration-500">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-brand-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



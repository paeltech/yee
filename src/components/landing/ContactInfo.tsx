import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactInfoProps {
  variant?: "default" | "compact";
}

export function ContactInfo({ variant = "default" }: ContactInfoProps) {
  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: "info@mulika.or.tz",
      link: "mailto:info@mulika.or.tz"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+255 758 335 223",
      link: "tel:+255758335223"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Delta House 1 floor,Donga St,Kinondoni, Dar es Salaam",
      link: null
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Fri: 8:00 AM - 5:00 PM",
      link: null
    }
  ];

  if (variant === "compact") {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-black uppercase tracking-widest text-neutral-900 dark:text-white leading-none">Contact Us</h3>
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <div className="p-2 rounded-lg bg-brand-50 dark:bg-neutral-800 text-brand-600 group-hover:bg-brand-500 group-hover:text-black transition-colors">
                <contact.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 leading-none">{contact.label}</div>
                {contact.link ? (
                  <a
                    href={contact.link}
                    className="text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-brand-600 transition-colors"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <div className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{contact.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-32 px-4 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight">
            Get in <span className="text-brand-600">Touch</span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
            Have questions or want to partner with us? We're here to help build the future together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contacts.map((contact, index) => (
            <div key={index} className="p-10 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center space-y-6 shadow-sm hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-neutral-800 text-brand-600 flex items-center justify-center mx-auto group-hover:bg-brand-500 group-hover:text-black transition-colors duration-500">
                <contact.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{contact.label}</h3>
                {contact.link ? (
                  <a
                    href={contact.link}
                    className="text-lg font-bold text-neutral-900 dark:text-white hover:text-brand-600 transition-colors block leading-tight"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">{contact.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


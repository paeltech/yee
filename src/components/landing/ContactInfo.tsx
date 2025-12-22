import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ContactInfoProps {
  variant?: "default" | "compact";
}

export function ContactInfo({ variant = "default" }: ContactInfoProps) {
  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: "info@yeeportal.tz",
      link: "mailto:info@yeeportal.tz"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+255 XXX XXX XXX",
      link: "tel:+255XXXXXXXXX"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Dar es Salaam, Tanzania",
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Contact</h3>
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start gap-3">
            <contact.icon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-neutral-700">{contact.label}</div>
              {contact.link ? (
                <a
                  href={contact.link}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  {contact.value}
                </a>
              ) : (
                <div className="text-sm text-neutral-600">{contact.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-24 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Questions? We're here to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contacts.map((contact, index) => (
            <div key={index} className="text-center space-y-3">
              <contact.icon className="h-8 w-8 text-amber-600 mx-auto" />
              <h3 className="text-lg font-semibold text-neutral-900">{contact.label}</h3>
              {contact.link ? (
                <a
                  href={contact.link}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors block"
                >
                  {contact.value}
                </a>
              ) : (
                <p className="text-neutral-600">{contact.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


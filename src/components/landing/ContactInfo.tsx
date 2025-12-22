import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      value: "Monday - Friday: 8:00 AM - 5:00 PM",
      link: null
    }
  ];

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start gap-3">
            <contact.icon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-neutral-700">{contact.label}</div>
              {contact.link ? (
                <a 
                  href={contact.link} 
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
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
    <section className="py-20 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, index) => (
            <Card 
              key={index}
              className="border-neutral-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 text-center"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg text-neutral-900">{contact.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {contact.link ? (
                  <a 
                    href={contact.link} 
                    className="text-neutral-600 hover:text-amber-600 hover:underline transition-colors"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <CardDescription className="text-neutral-600">
                    {contact.value}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


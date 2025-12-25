import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Erica Thomas",
        age: 24,
        location: "Dodoma Jiji",
        quote: "The training gave me confidence to start a restaurant with my group. Today, I earn an income and help others believe change is possible.",
    },
    {
        name: "Furuha Stanley",
        age: 22,
        location: "Chamwino",
        quote: "The program gave me tailoring and financial skills. I’m now preparing to open my own tailoring shop from home.",
    },
    {
        name: "Hadjia Ally",
        age: 19,
        location: "Bahi",
        quote: "The mentorship and group support changed my mindset. I’m now working with my group to start a vegetable farming project.",
    },
    {
        name: "Aziza Juma Iddi",
        age: 26,
        location: "Kondoa",
        quote: "I no longer depend on handouts. I started a food vending business and gained respect in my community.",
    },
    {
        name: "Betina Makomelo",
        age: 23,
        location: "Kongwa",
        quote: "The program gave me hope and practical skills. I’m planning to open a small shop to support my child and others.",
    },
    {
        name: "Zuhura Issa",
        age: 22,
        location: "Ilala",
        quote: "From street vending to starting a catering service, the program helped me build a better future for my children.",
    },
    {
        name: "Winifrida Simuchimba",
        age: 20,
        location: "Momba",
        quote: "I gained skills, confidence, and hope. With my group, I’m building a goat-rearing business to support my family.",
    },
    {
        name: "Pendo Kandonga",
        age: 22,
        location: "Songwe",
        quote: "Together with other young mothers, I’m running a sunflower oil business that has improved our lives.",
    },
];

export function TestimonialsSlider() {
    return (
        <section className="py-32 bg-neutral-50 px-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center space-y-6 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight"
                    >
                        Success <span className="text-brand-600">Stories</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-neutral-600 max-w-3xl mx-auto font-medium"
                    >
                        Hear from the incredible young women who have transformed their lives and communities through the YEE Program.
                    </motion.p>
                </div>

                <div className="relative px-4 md:px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-6">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="h-full py-4"
                                    >
                                        <Card className="h-full border border-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-[2.5rem] overflow-hidden group hover:-translate-y-2">
                                            <CardContent className="p-10 flex flex-col h-full relative">
                                                <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <Quote className="h-16 w-16 text-brand-600" />
                                                </div>
                                                <blockquote className="flex-grow relative z-10">
                                                    <p className="text-neutral-700 italic leading-relaxed text-xl font-medium">
                                                        &ldquo;{testimonial.quote}&rdquo;
                                                    </p>
                                                </blockquote>
                                                <div className="mt-10 pt-8 border-t border-neutral-100">
                                                    <div className="font-black text-neutral-900 text-xl tracking-tight">
                                                        {testimonial.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-neutral-400 font-bold uppercase tracking-widest text-xs">{testimonial.age} YEARS OLD</span>
                                                        <span className="text-neutral-300">•</span>
                                                        <span className="text-brand-600 font-black uppercase tracking-widest text-xs">
                                                            {testimonial.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-6 w-14 h-14 bg-white border-neutral-200 hover:bg-brand-500 hover:border-brand-500 text-black transition-all shadow-lg" />
                        <CarouselNext className="hidden md:flex -right-6 w-14 h-14 bg-white border-neutral-200 hover:bg-brand-500 hover:border-brand-500 text-black transition-all shadow-lg" />
                    </Carousel>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
        </section>
    );
}

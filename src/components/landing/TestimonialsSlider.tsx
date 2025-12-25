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
        <section className="py-24 bg-neutral-50 px-4 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center space-y-4 mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight"
                    >
                        Success Stories
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-neutral-600 max-w-2xl mx-auto"
                    >
                        Hear from the young women who have transformed their lives through the YEE Program.
                    </motion.p>
                </div>

                <div className="relative px-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="h-full"
                                    >
                                        <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                                            <CardContent className="p-8 flex flex-col h-full">
                                                <Quote className="h-8 w-8 text-brand-500/20 mb-4" />
                                                <blockquote className="flex-grow">
                                                    <p className="text-neutral-700 italic leading-relaxed text-lg">
                                                        &ldquo;{testimonial.quote}&rdquo;
                                                    </p>
                                                </blockquote>
                                                <div className="mt-8 pt-6 border-t border-neutral-100">
                                                    <div className="font-bold text-neutral-900 text-lg">
                                                        {testimonial.name}, {testimonial.age}
                                                    </div>
                                                    <div className="text-brand-600 font-medium">
                                                        {testimonial.location}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-4 hover:bg-brand-500 text-black hover:text-black transition-colors" />
                        <CarouselNext className="hidden md:flex -right-4 hover:bg-brand-500 text-black hover:text-black transition-colors" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

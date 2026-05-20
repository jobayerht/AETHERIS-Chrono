import { motion } from "motion/react";
import { Zap, ShieldAlert, Award, Compass, Sparkles } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
}

const events: TimelineEvent[] = [
  {
    year: "2019",
    title: "The Cryo-Metallury Spark",
    subtitle: "Geneva Subterranean Research Lab",
    description: "Our founders isolate a super-dense amorphous platinum-palladium alloy under absolute-zero cryogenic temperatures, yielding structural resilience twice that of aerospace steel.",
    icon: Zap,
  },
  {
    year: "2021",
    title: "Double-Flying Tourbillon Debut",
    subtitle: "Mechanical Singularity Patent",
    description: "Releasing our signature coaxial gear layout: twin skeletonized balance cages orbiting opposite axes to cancel gravity-induced balance wheel friction entirely.",
    icon: Compass,
  },
  {
    year: "2023",
    title: "Silicon Core Integration",
    subtitle: "Frictionless Mechanical Conduits",
    description: "Replaced copper-brass gear teeth with atomic-brushed silicon-carbide, achieving self-lubricating actions with a certified 40-year servicing lifespan limit.",
    icon: Sparkles,
  },
  {
    year: "2025",
    title: "AETHERIS Chrono Formation",
    subtitle: "The Fusion of Cyber and Horology",
    description: "Consolidating our bespoke mechanical assets under the AETHERIS brand—combining Apple-level smooth user interaction with elite Swiss skeletonized craftsmanship.",
    icon: Award,
  }
];

export default function BrandStory() {
  return (
    <div className="relative py-20 bg-[#050505] text-[#E0D8D0] border-t border-white/[0.04] select-none overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full blur-[140px] opacity-[0.06] bg-[#2A1D12] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-[140px] opacity-[0.04] bg-[#C5A059] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Title branding block */}
        <div className="text-center mb-20">
          <span className="text-[9px] tracking-[0.3em] font-sans font-bold text-[#C5A059] uppercase">
            CHRONOLOGICAL ANCESTRY
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight mt-2 pb-4 text-[#E0D8D0]">
            A Legacy Sourced in <span className="font-serif italic text-[#C5A059]">Tomorrow</span>
          </h2>
          <div className="w-12 h-[1px] bg-gradient-to-r from-[#C5A059] to-[#E0D8D0] mx-auto mt-4" />
        </div>

        {/* Narrative editorial timeline */}
        <div className="relative border-l border-[#C5A059]/10 ml-4 md:ml-32 pl-8 md:pl-16 flex flex-col gap-16">
          {events.map((event, index) => {
            const Icon = event.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Year Badge Positioning inside gutter */}
                <div className="absolute -left-12 md:-left-44 top-0 flex items-center gap-1.5 md:w-32 justify-end">
                  <span className="text-xl md:text-2xl font-bold font-mono text-neutral-500 group-hover:text-[#C5A059] transition-colors duration-300">
                    {event.year}
                  </span>
                  <div className="w-2 h-2 rounded-full border border-neutral-700 bg-[#050505] group-hover:bg-[#C5A059] group-hover:border-[#C5A059] hidden md:block transition-all duration-300" />
                </div>

                {/* Event Core Card */}
                <div className="relative p-6 rounded-none border border-[#C5A059]/10 bg-neutral-900/10 hover:bg-neutral-900/20 transition-all duration-300 backdrop-blur-sm shadow-xl">
                  {/* Glowing vertical alignment vector */}
                  <div className="absolute top-6 -left-14 w-4 h-4 rounded-full border border-neutral-700 bg-[#050505] flex items-center justify-center group-hover:border-[#C5A059] transition-all duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-[#C5A059] transition-all duration-300" />
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2.5 bg-[#C5A059]/5 border border-[#C5A059]/20 text-[#C5A059]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif text-[#E0D8D0] group-hover:text-white transition-colors">
                        {event.title}
                      </h4>
                      <span className="text-[10px] font-sans tracking-wider text-neutral-500 block mt-0.5">
                        {event.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#E0D8D0]/60 leading-relaxed font-sans mt-2">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { SectionReveal } from "@/components/home/SectionReveal";

const leaders = [
  {
    name: "Amritanshu Pandey",
    role: "Managing Director",
    image: "/images/leadership/amritanshu-pandey.png",
  },
  {
    name: "Krishshna Chandra Pandey",
    role: "Director",
    image: "/images/leadership/krishshna-chandra-pandey.png",
  },
  {
    name: "Bhola Yadav",
    role: "Director",
    image: "/images/leadership/bhola-yadav.png",
  },
  {
    name: "Sunil Yadav",
    role: "Director",
    image: "/images/leadership/sunil-yadav.png",
  },
] as const;

const impact = [
  { value: "45", label: "Staff" },
  { value: "1,000+", label: "People" },
  { value: "3", label: "Causes" },
] as const;

export function FoundationLeadership() {
  return (
    <section className="portal-section-pad bg-white dark:bg-slate-950" aria-labelledby="leadership-heading">
      <div className="container-page">
        <SectionReveal>
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#079c91] via-[#19b9a9] to-[#075b59] p-5 text-white shadow-2xl md:p-8">
            <div className="grid items-stretch gap-6 xl:grid-cols-[280px_minmax(0,1fr)_270px]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-1">
                {leaders.map((leader) => (
                  <article key={leader.name} className="flex items-center gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-white/40 bg-white">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        sizes="64px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold leading-tight sm:text-base">
                        {leader.name}
                      </h3>
                      <p className="mt-1 text-xs text-cyan-50">{leader.role}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-2xl border-4 border-white/30 shadow-xl md:min-h-[390px]">
                <Image
                  src="/images/gallery/children-study.png"
                  alt="Rural children studying with Rurally Smile Foundation"
                  fill
                  sizes="(max-width: 1280px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 pt-16">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                    Rurally Smile Foundation
                  </p>
                  <p className="mt-1 text-xl font-extrabold">
                    शिक्षा से सशक्त भविष्य
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl bg-slate-950/15 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
                  Foundation Leadership
                </p>
                <h2 id="leadership-heading" className="mt-2 text-3xl font-extrabold">
                  At Your Service
                </h2>
                <p className="mt-3 text-sm leading-6 text-cyan-50">
                  ग्रामीण बच्चों को गुणवत्तापूर्ण शिक्षा, अवसर और सम्मान देने के लिए हमारी टीम समर्पित है।
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-bold">
                      <span>Education Support</span>
                      <span>50%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/25">
                      <div className="h-full w-1/2 bg-white" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-bold">
                      <span>Volunteers</span>
                      <span>100%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/25">
                      <div className="h-full w-full bg-orange-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/25 pt-5 text-center">
                  {impact.map((item) => (
                    <div key={item.label}>
                      <p className="text-xl font-extrabold">{item.value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-100">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "About Rurally Smile Foundation",
  description: "ग्रामीण शिक्षा और बच्चों के उज्जवल भविष्य के लिए हमारा संकल्प।",
};

const leadership = [
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

const teamImages = Array.from(
  { length: 9 },
  (_, index) => `/images/team/team-${String(index + 1).padStart(2, "0")}.png`
);

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Rurally Smile Foundation"
        description="ग्रामीण शिक्षा और बच्चों के उज्जवल भविष्य के लिए हमारा संकल्प।"
      />

      <section className="portal-section-pad bg-white dark:bg-slate-950">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1399A2]">
                Our History
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
                शिक्षा, अवसर और सम्मान
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                {SITE.aboutFoundation.welcome}
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                {SITE.aboutFoundation.missionEn}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/registration" className="btn btn-primary rounded-pill px-4">
                  Student Registration
                </Link>
                <Link href="/contact" className="btn btn-outline-primary rounded-pill px-4">
                  Contact Foundation
                </Link>
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-[28px] shadow-2xl">
              <Image
                src="/images/gallery/rural-children.png"
                alt="Rural children supported by the foundation"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-widest text-orange-300">
                  Our Commitment
                </p>
                <p className="mt-2 text-2xl font-extrabold">{SITE.slogan}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-section-pad bg-cyan-50/70 dark:bg-slate-900">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Foundation Leadership
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              संस्था के प्रमुख
            </h2>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((leader) => (
              <article
                key={leader.name}
                className="group overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-5 pt-16 text-white">
                    <h3 className="text-lg font-extrabold">{leader.name}</h3>
                    <p className="mt-1 text-sm text-cyan-100">{leader.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-section-pad bg-white dark:bg-slate-950">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1399A2]">
              Our Team
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              सेवा के लिए समर्पित हमारी टीम
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              ग्रामीण शिक्षा और सामाजिक विकास के लिए साथ मिलकर कार्य करने वाले सदस्य।
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {teamImages.map((image, index) => (
              <figure
                key={image}
                className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900 ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={image}
                    alt={`Rurally Smile Foundation team member ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Foundation Team
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 text-white">
        <Image
          src="/images/gallery/rural-children.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="container-page relative text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
            Ready to make a difference?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-extrabold md:text-4xl">
            बच्चों के उज्जवल भविष्य में अपना योगदान दें
          </h2>
          <Link href="/contact" className="btn btn-warning mt-6 rounded-pill px-5 fw-bold">
            Get Involved
          </Link>
        </div>
      </section>
    </>
  );
}

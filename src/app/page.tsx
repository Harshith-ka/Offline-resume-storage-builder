"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Sparkles, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero gradient background (shader-style) */}
      <div className="hero-gradient absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(263_70%_58%_/_0.2),transparent)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            Resume <span className="text-primary">Forge</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/resumes">
            <Button variant="ghost" size="sm">
              My Resumes
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="ghost" size="sm">
              Templates
            </Button>
          </Link>
          <Link href="/editor">
            <Button variant="glass" size="sm">
              Open Editor
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 px-6 pt-20 pb-32 lg:px-12 lg:pt-32">
        <motion.section
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Shield className="size-4" />
            Local-first · Works offline
          </motion.p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            The resume builder that{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              works where you do
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Canva-level editor. AI-powered writing. Student & fresher templates.
            Your data stays on your device. Build, polish, and export — online
            or off.
          </p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/templates">
              <Button size="xl" className="shadow-lg shadow-primary/25">
                <FileText className="size-5" />
                Start with a template
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="xl" variant="outline" className="border-white/20">
                Open blank canvas
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Differentiators */}
        <motion.section
          className="mx-auto mt-32 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {[
            {
              icon: Palette,
              title: "Canva-style editor",
              desc: "Drag blocks, timelines, skill bars. Resize, align, snap. Full control.",
            },
            {
              icon: Sparkles,
              title: "AI that gets context",
              desc: "Impact bullets, ATS optimization, section enhancer, one-click summaries.",
            },
            {
              icon: FileText,
              title: "Student & fresher first",
              desc: "Degree + internship flows, projects highlighted, recruiter-tested layouts.",
            },
            {
              icon: Shield,
              title: "Local-first storage",
              desc: "Edit and save offline. Version history. Optional cloud backup later.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <item.icon className="mb-3 size-8 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Who it's for */}
        <motion.section
          className="mx-auto mt-24 max-w-3xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold">Built for</h2>
          <p className="mt-3 text-muted-foreground">
            College students, freshers (0–2 yrs), freelancers, career switchers,
            and placement cells. One tool, every resume.
          </p>
        </motion.section>
      </main>
    </div>
  );
}

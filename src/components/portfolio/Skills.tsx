"use client";

import { motion } from "framer-motion";
import { Brain, Code2, Cloud, Shield } from "lucide-react";

const skillGroups = [
  {
    title: "AI Intelligence Core",
    icon: Brain,
    skills: [
      "Large Language Models",
      "RAG Systems",
      "AI Agents",
      "LangChain",
      "LangGraph",
      "Hugging Face",
      "Deep Learning",
      "Prompt Engineering",
    ],
  },
  {
    title: "Software Engineering",
    icon: Code2,
    skills: [
      "Python",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "REST APIs",
    ],
  },
  {
    title: "Cloud Infrastructure",
    icon: Cloud,
    skills: [
      "AWS EC2",
      "AWS Lambda",
      "AWS S3",
      "Docker",
      "Kubernetes",
      "MongoDB",
    ],
  },
  {
    title: "Security Systems",
    icon: Shield,
    skills: [
      "Wireshark",
      "Vulnerability Analysis",
      "Security Monitoring",
      "Risk Assessment",
    ],
  },
];

export default function Skills() {
  return (
    <section className="relative min-h-screen px-24 py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-20 top-40 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-cyan-400 tracking-[6px] mb-4">NEURAL SKILL MATRIX</p>

        <h2 className="text-6xl font-bold mb-20">Technology Stack</h2>

        <div className="grid grid-cols-2 gap-8">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.04 }}
                className="relative rounded-3xl bg-white/[0.05] border border-white/10 p-8 backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-cyan-400/10 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center">
                      <Icon className="text-cyan-300" />
                    </div>

                    <h3 className="text-2xl font-semibold">{group.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-white/70 hover:text-cyan-300 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
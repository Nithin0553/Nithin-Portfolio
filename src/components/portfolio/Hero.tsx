"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  function scrollProjects() {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden flex items-center px-20"
    >

      <div className="absolute right-20 top-20 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[170px]" />

      <div className="absolute left-20 bottom-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[150px]" />


      <div className="relative z-10 w-full grid grid-cols-[1.2fr_.8fr] items-center gap-10">


        {/* LEFT CONTENT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
          }}
        >

          <p className="text-cyan-400 tracking-[8px] mb-10">
            NITHIN.AI
          </p>


          <h1 className="text-8xl font-bold leading-tight">

            Building

            <br />


            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">

              Intelligent AI Systems

            </span>


          </h1>


          <p className="mt-14 text-2xl leading-[3rem] text-white/60 max-w-5xl">

            I'm Nithin Thirumani — a Computer Science graduate student,
            Graduate Research Assistant, and AI Engineer building systems
            with Large Language Models, AI Agents, Cloud Computing,
            and Intelligent Automation.

          </p>



          <div className="flex gap-7 mt-16">


            <button
              onClick={scrollProjects}
              className="px-12 py-5 rounded-full bg-white text-black text-lg hover:scale-105 transition"
            >

              Explore Work

            </button>


            <button className="px-12 py-5 rounded-full border border-white/20 text-lg hover:bg-white hover:text-black transition">

              Ask Nithin.ai

            </button>


          </div>


        </motion.div>






        {/* RIGHT PHOTO */}


        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          className="flex justify-center items-center"
        >


          <motion.div

            animate={{
              y: [0, -20, 0],
            }}

            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}

            className="relative w-[430px] h-[520px] rounded-[50px] overflow-hidden border border-cyan-400/20 shadow-[0_0_120px_rgba(34,211,238,.25)]"
          >


            <div className="absolute inset-0 bg-cyan-400/10 blur-3xl" />


            <Image
              src="/images/profile.png"
              alt="Nithin"
              fill
              priority
              sizes="430px"
              className="object-cover"
            />


            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />


          </motion.div>


        </motion.div>


      </div>





      <motion.div

        animate={{
          y: [0, 10, 0],
        }}

        transition={{
          duration: 2,
          repeat: Infinity,
        }}

        className="absolute bottom-10 left-1/2"
      >

        <ArrowDown className="text-white/40" />

      </motion.div>


    </section>
  );
}
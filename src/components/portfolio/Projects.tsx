"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Cloud,
  Shield,
  Activity,
} from "lucide-react";


const projects = [
  {
    title: "CineAI Director",
    icon: Brain,

    description:
      "An AI cinematic generation system that converts scripts into automated cutscenes using LLMs, emotion analysis, and Unity.",

    tech:[
      "LLMs",
      "AI Agents",
      "Unity",
      "Python"
    ]
  },


  {
    title:"Microservices Healthcare Monitoring",

    icon:Activity,

    description:
      "Cloud-native healthcare monitoring platform using microservices architecture for real-time patient vitals and alerts.",

    tech:[
      "FastAPI",
      "React",
      "MongoDB",
      "Kubernetes"
    ]
  },



  {
    title:"Malware Detection System",

    icon:Shield,

    description:
      "Machine learning based malware classification system designed to detect malicious software patterns.",

    tech:[
      "Python",
      "Machine Learning",
      "Scikit-Learn"
    ]
  },



  {
    title:"Privacy Protected Health Query",

    icon:Cloud,

    description:
      "Secure healthcare data processing system using encryption techniques for privacy-preserving queries.",

    tech:[
      "Python",
      "AES",
      "Security"
    ]
  }

];





export default function Projects(){


return(

<section className="min-h-screen px-24 py-32 relative">


<div className="absolute right-20 top-40 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px]" />



<motion.div

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

>


<p className="text-cyan-400 tracking-[6px] mb-4">

AI PROJECT LAB

</p>



<h2 className="text-6xl font-bold mb-20">

Systems I've Built

</h2>





<div className="grid grid-cols-2 gap-8">


{

projects.map((project)=>(


<motion.div

key={project.title}


whileHover={{

scale:1.04,

y:-10

}}


transition={{

type:"spring",

stiffness:200

}}


className="group rounded-3xl p-8 bg-white/[0.05] border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl"

>



<div className="flex items-center gap-5 mb-8">


<div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center">


<project.icon className="text-cyan-300"/>


</div>



<h3 className="text-2xl font-semibold">

{project.title}

</h3>



</div>





<p className="text-white/50 leading-7">

{project.description}

</p>






<div className="flex flex-wrap gap-3 mt-8">


{

project.tech.map(t=>(


<span

key={t}

className="px-4 py-2 rounded-full bg-white/10 text-sm text-cyan-100"

>


{t}


</span>


))

}



</div>




</motion.div>


))

}



</div>



</motion.div>


</section>

)

}
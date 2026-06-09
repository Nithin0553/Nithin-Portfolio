"use client";

import { motion } from "framer-motion";

import {
  BrainCircuit,
  ShieldCheck,
  Cloud,
} from "lucide-react";


const experiences = [

{
year:"2025 - Present",

title:"Graduate Research Assistant",

icon:BrainCircuit,

description:
"Researching Artificial Intelligence, Large Language Models, Deep Learning, and intelligent automation systems.",

skills:[
"LLMs",
"AI Research",
"Deep Learning",
"Automation"
]

},


{
year:"2024",

title:"Cybersecurity Analyst Intern",

icon:ShieldCheck,

description:
"Performed security monitoring, vulnerability analysis, incident response improvements, and risk assessment reporting.",

skills:[
"Wireshark",
"Security Analysis",
"Risk Assessment"
]

},


{
year:"2022 - 2023",

title:"AWS Cloud Intern",

icon:Cloud,

description:
"Built cloud infrastructure and automated solutions using AWS services including EC2, S3, Lambda, RDS, and IAM.",

skills:[
"AWS",
"EC2",
"Lambda",
"IAM"
]

}

];




export default function Experience(){


return(

<section className="relative min-h-screen px-24 py-32 overflow-hidden">


{/* background */}

<div className="absolute left-20 top-40 w-[400px] h-[400px] bg-purple-500/10 blur-[140px]" />




<p className="text-cyan-400 tracking-[6px] mb-4">

EXPERIENCE STREAM

</p>



<h2 className="text-6xl font-bold mb-24">

Professional Journey

</h2>





<div className="relative">


{/* timeline line */}


<div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />





<div className="space-y-20">


{

experiences.map((exp,index)=>(



<motion.div

key={exp.title}


initial={{

opacity:0,

x:-50

}}


whileInView={{

opacity:1,

x:0

}}


viewport={{

once:true

}}



transition={{

delay:index*0.2

}}



className="relative flex gap-10"


>



{/* icon */}


<div className="relative z-10 w-16 h-16 rounded-full bg-black border border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,.4)]">


<exp.icon className="text-cyan-300"/>


</div>





<div className="max-w-3xl rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl p-8">



<p className="text-cyan-300 mb-3">

{exp.year}

</p>




<h3 className="text-3xl font-semibold mb-5">

{exp.title}

</h3>




<p className="text-white/50 leading-8">

{exp.description}

</p>





<div className="flex gap-3 flex-wrap mt-6">


{

exp.skills.map(skill=>(


<span

key={skill}

className="px-4 py-2 rounded-full bg-white/10 text-sm"

>

{skill}

</span>


))

}


</div>



</div>




</motion.div>



))

}


</div>



</div>



</section>

)

}
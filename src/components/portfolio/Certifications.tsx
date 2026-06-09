"use client";


import Image from "next/image";
import { motion } from "framer-motion";



const certificates = [


{
company:"Google",

title:"Google AI Professional Certificate",

logo:"/logos/google.png",

category:"Artificial Intelligence"

},



{
company:"Anthropic",

title:"AI Fluency: Framework & Foundations",

logo:"/logos/anthropic.png",

category:"Generative AI"

},




{
company:"IBM",

title:"Python 101 for Data Science",

logo:"/logos/ibm.png",

category:"Data Science"

},




{
company:"UST",

title:"Create Your First Python Program",

logo:"/logos/ust.png",

category:"Programming"

}


];







export default function Certifications(){


return(

<section className="relative min-h-screen px-24 py-32 overflow-hidden">



{/* background glow */}

<div className="absolute left-20 top-40 w-[500px] h-[500px] bg-purple-500/10 blur-[160px]" />






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

ACHIEVEMENT VAULT

</p>





<h2 className="text-6xl font-bold mb-20">

Certifications

</h2>







<div className="grid grid-cols-4 gap-8">


{

certificates.map((cert,index)=>(


<motion.div


key={cert.title}



initial={{

opacity:0,

y:30

}}



whileInView={{

opacity:1,

y:0

}}



transition={{

delay:index*.15

}}



whileHover={{

y:-12,

scale:1.05

}}



className="group h-[300px] rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 hover:border-cyan-400/50 transition"


>




<div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-8">


<Image

src={cert.logo}

alt={cert.company}

width={50}

height={50}

/>


</div>






<h3 className="text-xl font-semibold mb-3">


{cert.title}


</h3>






<p className="text-cyan-300 text-sm">


{cert.company}


</p>





<p className="text-white/40 text-sm mt-3">


{cert.category}


</p>






</motion.div>


))


}


</div>





</motion.div>



</section>

)

}
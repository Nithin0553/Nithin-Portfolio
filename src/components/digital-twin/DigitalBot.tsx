"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import EyeProjection from "./EyeProjection";


export default function DigitalBot(
{
active
}:{active:boolean}
){

return (

<div
className="
relative
w-[240px]
h-[240px]
"
>


<motion.div

animate={{
y:[0,-8,0]
}}

transition={{
duration:4,
repeat:Infinity,
ease:"easeInOut"
}}

className="
relative
w-full
h-full
flex
items-center
justify-center
"
>


<div
className={`
absolute
w-[220px]
h-[220px]
rounded-full
blur-[80px]

${active
?"bg-cyan-400/30"
:"bg-cyan-400/10"}
`}
/>


<Image

src="/assets/bot.png"

alt="Nithin AI"

width={230}

height={230}

priority

style={{
width:"230px",
height:"auto"
}}

className="
relative
z-20
"

/>


{active && <EyeProjection/>}


</motion.div>


</div>

)

}
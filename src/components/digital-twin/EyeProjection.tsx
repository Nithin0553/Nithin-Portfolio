"use client";

import {motion} from "framer-motion";


export default function EyeProjection(){

return(

<div
className="
absolute
top-[78px]

left-1/2

-translate-x-1/2

z-10
"
>


<motion.div

initial={{
opacity:0,
height:0
}}

animate={{
opacity:1,
height:260
}}


className="
absolute

left-[-45px]

w-[80px]

bg-gradient-to-b

from-cyan-300/40

to-transparent

blur-xl

rotate-[12deg]
"

/>


<motion.div

initial={{
opacity:0,
height:0
}}

animate={{
opacity:1,
height:260
}}


className="
absolute

right-[-45px]

w-[80px]

bg-gradient-to-b

from-cyan-300/40

to-transparent

blur-xl

-rotate-[12deg]
"

/>


</div>

)

}
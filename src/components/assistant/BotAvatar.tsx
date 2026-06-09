"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export default function BotAvatar({
state
}:{
state:string
}){


const active =
state !== "idle";


return(

<div className="relative">


{/* flight particles */}

{
state==="flying" && (

<motion.div

initial={{
opacity:0
}}

animate={{
opacity:[0,1,0]
}}

transition={{
duration:1,
repeat:Infinity
}}

className="
absolute
-right-8
top-8

w-20
h-2

bg-gradient-to-r

from-cyan-300
to-transparent

blur-md
"

/>

)

}




<motion.div


animate={{

y:[0,-6,0],

scale:
active
?
[1,1.08,1]
:
1

}}


transition={{

duration:3,

repeat:Infinity,

ease:"easeInOut"

}}



className="
relative

w-16
h-16

cursor-pointer
"

>



{/* aura */}

<div

className={

`

absolute

w-full
h-full

rounded-full

blur-xl


${active
?
"bg-cyan-400/60"
:
"bg-cyan-400/25"
}

`

}

/>




<Image

src="/assets/bot.png"

alt="Nithin AI"

width={65}

height={65}

style={{

width:"65px",

height:"auto"

}}

className="
relative
z-10
"

/>


</motion.div>


</div>

)

}
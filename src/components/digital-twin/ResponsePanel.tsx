"use client";

import {motion} from "framer-motion";
import {X} from "lucide-react";


export default function ResponsePanel(
{
question,
onClose
}:any)

{


return(

<motion.div

initial={{opacity:0,scale:.8}}
animate={{opacity:1,scale:1}}

className="
w-[700px]
min-h-[350px]
bg-white/10
backdrop-blur-xl
rounded-3xl
p-10
relative
"

>

<button
onClick={onClose}
className="absolute right-5 top-5"
>
<X/>
</button>


<h2 className="text-2xl mb-5">
Digital Twin Response
</h2>


<p className="opacity-70">
Question:
{question}
</p>


<p className="mt-10 text-lg">

I am Nithin's AI Twin. Soon I will connect
to his research, projects and experience.

</p>


</motion.div>

)

}
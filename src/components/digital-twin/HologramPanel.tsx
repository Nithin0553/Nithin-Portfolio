"use client";

import {useEffect,useState} from "react";
import {motion} from "framer-motion";
import {X} from "lucide-react";


export default function HologramPanel(
{
question,
onClose
}:any
){


const [answer,setAnswer]=useState("");



useEffect(()=>{


async function load(){


const res = await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
question
})


});


const data = await res.json();


setAnswer(data.answer);


}


load();


},[question]);





return(

<motion.div

initial={{
opacity:0,
scale:.9
}}

animate={{
opacity:1,
scale:1
}}

className="
mt-8

w-[700px]

min-h-[260px]

rounded-2xl

bg-cyan-950/20

border
border-cyan-300/30

p-8

backdrop-blur-xl

relative
"

>


<button

onClick={onClose}

className="
absolute
right-5
top-5
"

>

<X/>

</button>




<p
className="
text-xs
tracking-[6px]
text-cyan-300
"
>

NITHIN.AI RESPONSE

</p>





<div

className="
mt-8

text-white/80

leading-8

whitespace-pre-line
"

>


{
answer ||
"Accessing Nithin's neural memory..."
}



</div>




</motion.div>

)

}
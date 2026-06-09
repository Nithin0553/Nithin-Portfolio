"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Send} from "lucide-react";


export default function AgentInput(
{
onAsk
}:{onAsk:(q:string)=>void}
){

const [text,setText]=useState("");

function submit(){

if(!text.trim()) return;

onAsk(text);

}


return(

<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}


className="
w-[650px]

h-[70px]

rounded-full

bg-white/10

border
border-white/20

backdrop-blur-xl

flex

items-center

px-6

"

>


<input

value={text}

onChange={(e)=>setText(e.target.value)}

onKeyDown={(e)=>{
if(e.key==="Enter") submit();
}}


placeholder="Ask about my AI projects, research, skills..."

className="
flex-1

bg-transparent

outline-none

text-white

placeholder:text-white/40
"

/>



<button

onClick={submit}

className="
w-12
h-12

rounded-full

bg-cyan-400

text-black

flex
items-center
justify-center
"

>

<Send size={20}/>

</button>


</motion.div>


)

}
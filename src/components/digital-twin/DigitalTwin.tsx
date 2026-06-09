"use client";

import { useState } from "react";

import DigitalBot from "./DigitalBot";
import AgentInput from "./AgentInput";
import EyeProjection from "./EyeProjection";
import HologramPanel from "./HologramPanel";


export default function DigitalTwin() {


const [active,setActive]=useState(false);
const [question,setQuestion]=useState("");


function handleAsk(value:string){

setQuestion(value);
setActive(true);

}


return(

<section
className="
min-h-screen
bg-[#030303]
text-white
relative
overflow-hidden

flex
items-center
justify-center
"
>


{/* BACKGROUND LIGHT */}

<div
className="
absolute
w-[500px]
h-[500px]
rounded-full
bg-cyan-400/10
blur-[150px]
"
/>



{/* MAIN CONTENT */}

<div
className="
relative
z-10

flex
flex-col

items-center

w-full

"
>


{/* HEADER */}


<div className="text-center mb-8">


<h1
className="
text-5xl
font-bold
tracking-[18px]
"
>
NITHIN.AI
</h1>


<p
className="
mt-3
text-sm
tracking-[6px]
text-white/40
"
>

DIGITAL TWIN EXPERIENCE

</p>


</div>





{/* BOT AREA */}

<div className="relative">


<DigitalBot active={active}/>


{active && <EyeProjection/>}


</div>





{/* NORMAL MODE */}


{!active && (

<div
className="
mt-8

flex
flex-col
items-center

gap-8
"
>


<h2
className="
text-xl
font-light
text-cyan-100
"
>

Talk with my Digital Twin

</h2>


<AgentInput onAsk={handleAsk}/>


</div>


)}






{/* RESPONSE MODE */}


{active && (

<HologramPanel

question={question}

onClose={()=>setActive(false)}

/>

)}






<button

className="
mt-12

px-10
py-3

rounded-full

border

border-white/20


text-sm

tracking-widest


hover:bg-white
hover:text-black

transition
"

>

FULL PORTFOLIO

</button>



</div>


</section>

)

}
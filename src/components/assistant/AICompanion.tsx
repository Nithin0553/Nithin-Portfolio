"use client";

import {useEffect,useState} from "react";
import {motion} from "framer-motion";

import BotAvatar from "./BotAvatar";
import ChatWindow from "./ChatWindow";


export default function AICompanion(){


const [open,setOpen]=useState(false);


const [position,setPosition]=useState({
x:0,
y:0
});


const [botState,setBotState]
=
useState<
"idle"|"thinking"|"flying"
>("idle");




function moveBot(section:string){


const element =
document.getElementById(section);


if(!element)
return;



const rect =
element.getBoundingClientRect();



setBotState("flying");



setPosition({

x:
rect.left-window.innerWidth+130,


y:
rect.top-window.innerHeight+200

});




setTimeout(()=>{

setBotState("idle");

},2000);


}






useEffect(()=>{


function reset(){


setPosition({
x:0,
y:0
});


}



window.addEventListener(
"wheel",
reset
);



return()=>{


window.removeEventListener(
"wheel",
reset
);


};



},[]);






return(

<div className="fixed right-8 bottom-8 z-50">



{
open && (

<div className="absolute right-0 bottom-24">

<ChatWindow

onGuide={moveBot}

onThinking={setBotState}

/>

</div>

)

}





<motion.div


animate={{

x:position.x,

y:position.y

}}


transition={{

duration:1.5,

type:"spring",

stiffness:45,

damping:18

}}


onClick={()=>setOpen(!open)}

>


<BotAvatar state={botState}/>


</motion.div>


</div>

)

}
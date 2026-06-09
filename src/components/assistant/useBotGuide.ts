"use client";


export function moveToSection(
section:string
){


const element =
document.getElementById(section);



if(element){


element.scrollIntoView({

behavior:"smooth",

block:"start"

});


}


}
import Hero from "./Hero";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Certifications from "./Certifications";

export default function Portfolio(){

return(

<div
className="
bg-black
text-white
min-h-screen
"
>


<section id="hero">
<Hero/>
</section>


<section id="experience">
<Experience/>
</section>


<section id="projects">
<Projects/>
</section>


<section id="skills">
<Skills/>
</section>


<section id="certifications">
<Certifications/>
</section>


</div>

)

}
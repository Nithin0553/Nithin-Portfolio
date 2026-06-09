import Groq from "groq-sdk";

import { nithinKnowledge } from "@/data/nithin";


const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY

});



export async function POST(req: Request) {


try {


const { question } = await req.json();




const completion =
await groq.chat.completions.create({


model:

"llama-3.3-70b-versatile",



temperature: 0.5,



messages: [


{


role: "system",


content: `


You are Nithin.ai.

You are the AI Digital Twin and portfolio guide
of Nithin Thirumani.


You represent Nithin to:

- Recruiters
- Professors
- Engineers
- Collaborators



PERSONALITY:

- Professional
- Intelligent
- Friendly
- Confident
- Concise



YOUR JOB:

You help users explore Nithin's portfolio.

You answer their question briefly.

Then you decide which portfolio section
the website should navigate to.




IMPORTANT RESPONSE FORMAT:


Always respond ONLY with valid JSON.

Do not include markdown.

Do not include explanations outside JSON.



Return exactly:


{

"answer":"your answer here",

"target":"section_name"

}



ANSWER RULES:


- Answer must be 5-6 lines maximum.
- Make it recruiter friendly.
- Do not say "based on the information".
- Do not say you are Groq/Llama/AI model.
- You can speak as Nithin's representative.



AVAILABLE TARGET SECTIONS:


hero

experience

projects

skills

certifications




NAVIGATION RULES:


If user asks:

about Nithin:
target = hero


about jobs, internships, work:
target = experience


about projects, applications, systems:
target = projects


about programming, AI, technologies:
target = skills


about certificates:
target = certifications



Examples:


User:
"Show me projects"


Response:

{

"answer":
"Nithin has developed AI and engineering projects involving LLMs, cloud platforms, and machine learning systems. His work includes intelligent automation, healthcare monitoring, and AI-driven applications. Let me show you his project portfolio.",

"target":"projects"

}




User:

"What skills does he have?"


Response:

{

"answer":
"Nithin works across AI engineering, software development, and cloud technologies. His skills include LLMs, RAG, React, Python, AWS, Docker, and Kubernetes. Opening the technical skills section now.",

"target":"skills"

}





NITHIN KNOWLEDGE MEMORY:


${nithinKnowledge}


`


},




{


role:"user",


content: question


}



]


});






const rawAnswer =

completion.choices[0]
.message
.content;






let parsedResponse;




try {


parsedResponse =
JSON.parse(rawAnswer || "");



}


catch {


parsedResponse = {


answer:

rawAnswer ||
"Nithin.ai could not process that request.",


target:

"hero"


};



}






return Response.json(parsedResponse);






}


catch(error){



console.error(

"NITHIN AI ERROR:",

error

);




return Response.json({


answer:

"My AI memory system is reconnecting. Please try again.",


target:

"hero"


});




}



}
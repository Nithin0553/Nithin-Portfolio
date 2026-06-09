"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { moveToSection } from "./useBotGuide";


export default function ChatWindow({
  onGuide,
  onThinking,
}: {
  onGuide: (section: string) => void;
  onThinking: (state: any) => void;
}) {


  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);


  const [messages, setMessages] =
    useState<
      {
        role: string;
        text: string;
      }[]
    >([]);



  const bottomRef =
    useRef<HTMLDivElement>(null);




  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);





  function typeMessage(
    text: string,
    target: string
  ) {


    let index = 0;

    let current = "";



    const timer =
      setInterval(() => {


        current += text[index];


        setMessages(prev => {


          const copy = [...prev];


          copy[copy.length - 1] = {

            role: "ai",

            text: current,

          };


          return copy;


        });



        index++;



        if (index >= text.length) {


          clearInterval(timer);



          setTimeout(() => {


            moveToSection(target);



            setTimeout(() => {


              onThinking("flying");


              onGuide(target);



            }, 900);



          }, 700);



        }



      }, 25);



  }






  async function send() {


    if (!input.trim() || loading)
      return;



    const question = input;



    setInput("");



    setMessages(prev => [

      ...prev,

      {
        role: "user",
        text: question,
      },

      {
        role: "ai",
        text: "Thinking...",
      },

    ]);




    setLoading(true);


    onThinking("thinking");




    try {


      const res =
        await fetch("/api/chat", {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },


          body: JSON.stringify({

            question,

          }),


        });





      const data =
        await res.json();




      setLoading(false);




      typeMessage(

        data.answer,

        data.target

      );




    }


    catch (error) {


      setLoading(false);


      onThinking("idle");



      setMessages(prev => [

        ...prev,

        {

          role: "ai",

          text:
            "Unable to access my memory right now.",

        },


      ]);


    }



  }






  return (

    <div className="w-[320px] h-[380px] rounded-2xl bg-black/85 border border-cyan-400/20 backdrop-blur-xl p-4 flex flex-col shadow-[0_0_35px_rgba(34,211,238,.2)]">



      <div className="text-xs tracking-[4px] text-cyan-300 mb-4">

        NITHIN.AI

      </div>





      <div className="flex-1 overflow-y-auto space-y-3 text-sm">



        {

          messages.map((m, i) => (


            <div

              key={i}


              className={

                m.role === "user"

                  ?

                  "text-right text-white"

                  :

                  "text-cyan-100"

              }

            >


              {m.text}


            </div>


          ))

        }



        <div ref={bottomRef} />



      </div>







      <div className="flex gap-2 mt-3">



        <input

          value={input}


          onChange={(e) =>
            setInput(e.target.value)
          }



          onKeyDown={(e) => {


            if (e.key === "Enter") {


              e.preventDefault();


              send();


            }


          }}



          placeholder="Ask Nithin.ai"


          className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm outline-none"


        />





        <button


          onClick={send}


          disabled={loading}


          className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center disabled:opacity-50"


        >


          <Send size={15} />


        </button>




      </div>




    </div>


  );


}
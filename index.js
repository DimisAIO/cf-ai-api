import { Ai, modelMappings } from './vendor/@cloudflare/ai.js';

export default {

  async fetch(request, env) {
    
      // Check if the request method is POST
      if(request.method != "POST") return new Response("POST?");
        // Read the request body as text
        const body = await request.text()

        // Parse the URL-encoded form data string
        const formData = new URLSearchParams(body)

        // Initialize an empty object to store key-value pairs
        const jsonBody = {}

        // Iterate over each entry in the form data
        for (const [key, value] of formData) {
          // Add key-value pair to the JSON object
          jsonBody[key] = value
        }

        // Convert JSON object to a JSON string
        const w = JSON.stringify(jsonBody);
        const wee = JSON.parse(w);

        if(!wee.message && !wee.image) return new Response("Bruh");

        const ai = new Ai(env.AI);

        if(wee.image) {
          const inputs = {
              prompt: wee.image,
          };
      
          const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);
      
          return new Response(response, {
              headers: {
                  "content-type": "image/png",
              },
          });
        }

        const sys = wee.system ? wee.system : "You are a helpful assistant called [141412.AI]";
        const model = wee.model ? wee.model : "@cf/meta/llama-2-7b-chat-int8";
        const msg = wee.message;


    const tasks = [];

    // messages - chat style input
    let chat = {
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: msg }
      ]
    };
    let response = await ai.run(model, chat);
    tasks.push({ inputs: chat, response });

    // Access the response property from the first element of the array
    const lol = tasks[0].response.response;

    // return Response.json(tasks);
    return new Response(lol);
  }
};

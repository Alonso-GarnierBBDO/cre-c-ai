import OpenAI from "openai";
import cloude from "./anthropic";

const openAI = new OpenAI(
    {
        apiKey: process.env.NEXT_PUBLIC_OPENAI as string,
        dangerouslyAllowBrowser: true,
    }
);

const GPT  = async (prompt : any) => {

    console.log('Intentando con GPT');
    let data = '';

    try{

        const completion = await openAI.chat.completions.create({
            messages: prompt,
            model: "gpt-3.5-turbo",
        });
    
        const response = completion.choices[0].message.content;

        if(response && response.length > 3){
            data = response
            console.log('Funciono con GPT');
        }else{
            console.log('Error con GPT');
            data = await cloude()
        }

    }catch(err){
        console.log('Error con GPT');
        data = await cloude()
    }

    return data;
}

const generateImage = async (title: string, description: string) => {

    let image_url : string | undefined = '';

    try{
        console.log('Generando imagen');

        const response = await openAI.images.generate({
            model: "dall-e-3",
            prompt: `Portada para el siguiente cuento, titulo de la obra: "${title}", descripcion de la obra: "${description}", adicionalmente no quiero que la ilustracion tenga texto`,
            n: 1,
            size: "1792x1024",
        })

        image_url = response.data[0].url;
        
        console.log('Imagen generada con exito')

    }catch(err){

        console.log('Error al crear la imagen');

    }

    return image_url;

}

export {
    GPT,
    generateImage
};
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GPT } from './gpt';

const genAI : GoogleGenerativeAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE as string);

const GenerateGemini = async (instructionGemini: string, promptText: string, prompGPT : any) => {

    console.log('Intentando con Gemini');
    let data = '';

    try{

    
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-latest",
            systemInstruction: instructionGemini
        });

        const prompt : string = promptText;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const description : string = response.text() as string;
        const newDescription : string = description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        if(description.length){
            data = newDescription;
            console.log('Funciono con Gemini');
        }else{
            console.log('Error con Gemini');
            data = await GPT(prompGPT);
        }

    }catch(err){
        console.log('Error con Gemini');
        data = await GPT(prompGPT);
    }
    
    return data;

}


export default GenerateGemini;
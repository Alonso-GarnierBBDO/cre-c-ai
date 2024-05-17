import GenerateGemini from "./ai/gemini";
import JsonData from './data.json';
import { PropsTypes, GPTRules } from "@/types";
import { generateImage } from "./ai/gpt";

/** Obtenemos el titulo de la obra */

const titleAI = async (promp: string) => {

    let title = '';

    try {

        const data: PropsTypes = JsonData;

        const gptUser : GPTRules = {
            role: 'user',
            content: promp
        }

        // Obtenemos las reglas del GPT
        const gptRules = addRulesGPT(gptUser, data.gpt.titulo.rules);
        title = await GenerateGemini(data.gemini.titulo, promp, gptRules);
    }catch(err){
        console.error(err);
    }

    return title;

}

const descriptionAI = async (promp: string, title: string) => {

    let description = '';
    let newPromp = `El usuario solicita: ${promp}, y el titulo de la obra es ${title}`;

    try {
        const data: PropsTypes = JsonData;
        const gptUser : GPTRules = {
            role: 'user',
            content: newPromp
        }

        // Obtenemos las reglas del GPT
        const gptRules = addRulesGPT(gptUser, data.gpt.description.rules);
        description = await GenerateGemini(data.gemini.description, newPromp, gptRules);
    }catch(err){
        console.error(err);
    }

    return description;

}

const imagenAI = async (title: string, description: string) => {

    const image = await generateImage(title, description);
    return image;

}

const historyAI = async (title: string, description: string) => {

    let history = '';
    let newPromp = `Necesito que me generes una historia que no debe terminar, con base a este titulo: "${title}" y esta descripcion "${description}"`;

    try{

        const data: PropsTypes = JsonData;
        const gptUser : GPTRules = {
            role: 'user',
            content: newPromp
        }
        const gptRules = addRulesGPT(gptUser, data.gpt.startHistory.rules);
        history = await GenerateGemini(data.gemini.startHistory, newPromp, gptRules);

    }catch(err){

    }

    return history;

}

const continueHistoryAI =  async (title: string, description: string, history: string, prompt: string) => {


    let historyContinue = '';
    let newPromp = `El usuario solicita lo siguiente: "${prompt}". La idea es que continues la historia con base en el siguiente titulo: '${title}', en la descripción: '${description}' y lo principal es que la historia continue con base en la historia actual que te muestro a continuació: '${history}'`;

    try{

        const data: PropsTypes = JsonData;

        const gptUser : GPTRules = {
            role: 'user',
            content: newPromp
        }

        const gptRules = addRulesGPT(gptUser, data.gpt.continueHistory.rules);

        historyContinue = await GenerateGemini(data.gemini.continueHistory, newPromp, gptRules);

    }catch(err){
        console.error(err);
    }

    return historyContinue;

}

const addRulesGPT = (newRule: GPTRules, allRules: GPTRules[]) => { 
    allRules.push(newRule);
    return allRules;
}

export { titleAI, descriptionAI, imagenAI, historyAI, continueHistoryAI };
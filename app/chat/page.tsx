'use client'

import { ArrowPathIcon, XMarkIcon, PaperAirplaneIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { useState, useRef } from 'react'
import GenerateGemini from '@/helpers/gemini';
import { useEffect } from 'react';
import { generateImage } from '@/helpers/gpt';

const ChatPage = () => {

    const historyContainer = useRef(null);
    const [running, setRunning] = useState(false);
    const [showButtonDescription, setShowButtonDescription] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [thereHistory, setThereHistory] = useState(false);
    const [textButton, setTextButton] = useState('Mostrar descripción');
    const [textDescription, setTextDescription] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [title, setTitle] = useState('Generar un nuevo cuento.');
    const [subTitle, setSubTitle] = useState('Comienza esta nueva aventura.');
    const [value, setValue] = useState('');
    const [imageURL, setImageURL] = useState('');

    useEffect(()=> {

        const getObra = localStorage.getItem('obra');
        const getHistory = localStorage.getItem('history');
        
        if(getObra && getHistory){
            const jsonObra = JSON.parse(getObra);
            setTitle(jsonObra.name);
            setTextDescription(jsonObra.description);
            setShowButtonDescription(true);
            setThereHistory(true);

            const jsonHistory = JSON.parse(getHistory);
            setHistory(jsonHistory)
        }

        const getImage = localStorage.getItem('image');

        if(getImage){
            setImageURL(getImage);
        }

    }, []);

    const generateCharacters = async (promptText: string, prompGPT: any) => {

        const getCharacters = localStorage.getItem('obra');
        const getHistory = localStorage.getItem('history');
        
        if(!getCharacters && !getHistory){

            const descriptionGenerate = await GenerateGemini(promptText, prompGPT);

            if(descriptionGenerate.length){
                getTitle(descriptionGenerate)
            }else{
                setTitle("Ocurrió un error, inténtelo más tarde.");
            }

            setTextButton('Ocultar descripción')

        }

    }

    const getTitle = (description: string) => {
        const lines = description.split("\n");
        const titleLine = lines.find(line => line.startsWith('## '));
        const title = titleLine ? titleLine.slice(3) : '';
        const others = lines.slice(1).join('\n');
        setTextDescription(others);
        setTitle(`${title}.`);
        localStorage.setItem('obra', JSON.stringify({ name: title, description: others }));
        startHistory(title, others)
        setShowButtonDescription(true);
        buttonDescription();
    }

    const run = () => {

        localStorage.removeItem('obra');
        localStorage.removeItem('history');

        const promptText = 'Necesito que me generes un personaje para un cuento de niños. Debe ser solo el personaje, describiendo sus características.';
        const prompGPT = [
            { 
                role: "system", 
                content: "Eres el creador de cuentos, solo debes generar lo que usuario te pide" 
            },
            { 
                role: "system", 
                content: "En un '##' Debes agregar el titulo y en la siguiente linea debes agregar las caracteristicas" 
            },
            { 
                role: "system", 
                content: "No generes conversacion solo entrega los datos que necesito" 
            },
            { 
                role: "system", 
                content: "La respuesta debe estar generar en texto plano" 
            },
            {
                role: 'user',
                content: promptText
            }
        ];

        setRunning(true);
        generateCharacters(promptText, prompGPT);
        setShowButtonDescription(false);
        setShowDescription(false)
        setTitle('Generando nueva obra <div class="loading"><span>.</span><span>.</span><span>.</span></div>')
        setSubTitle('Iniciando esta nueva aventura<div class="loading"><span>.</span><span>.</span><span>.</span></div>')
        setHistory([]);
        setThereHistory(false);
    }

    const buttonDescription = () => {
        
        if(showDescription){
            setShowDescription(false)
            setTextButton('Mostrar descripción')
        }else{
            setShowDescription(true);
            setTextButton('Ocultar descripción')
        }

    }

    const contiuarHistory = async () => {

        const container : HTMLElement | null = historyContainer.current as HTMLElement | null;

        if(container){
            const heightScroll = container.scrollHeight;
            let historyString = '';

            setThereHistory(false);
            setRunning(true);

            history.forEach(e => {
                historyString += `${e}. `;
            });

            const promptTextContinueHistory = `Necesito que me continues esta historia "${historyString}" en la historia el personaje es "${title}" y la descripción del personaje es "${textDescription}", y otra cosa es no debes terminar la historia, la debes dejar en suspenso para continuar la historia mañana.`;
            const prompGPTContinueHistory = [
                { 
                    role: "system", 
                    content: "Eres el creador de cuentos, solo debes generar lo que usuario te pide" 
                },
                { 
                    role: "system", 
                    content: "Debes generar cuentos que nunca acaban, pero nunca coloques un continuara, solo termina en suspenso para mañana continuar con la historia." 
                },
                { 
                    role: "system", 
                    content: "No generes conversacion solo entrega la historia" 
                },
                { 
                    role: "system", 
                    content: "La respuesta debe estar generar en texto plano" 
                },
                {
                    role: 'user',
                    content: promptTextContinueHistory
                }
            ];


            const continueHistory = await GenerateGemini(promptTextContinueHistory, prompGPTContinueHistory);
            resetHistory(continueHistory);

            setTimeout(() => {
                container.scrollTop = heightScroll - 400;
            }, 100)
            
        }

        setThereHistory(true);
        setRunning(false);

    }

    const startHistory = async (title: string, others: string) => {

        setSubTitle('Generando historía<div class="loading"><span>.</span><span>.</span><span>.</span></div>');
        const promptTextStartHistory = `Necesito que me inicies una historia con este personaje "${title}", la descripción del personaje es "${others}", y otra cosa es que la historia no debe terminar, la debes dejar en suspenso para continuar la historia mañana.`;
        const prompGPTHistory = [
            { 
                role: "system", 
                content: "Eres el creador de cuentos, solo debes generar lo que usuario te pide" 
            },
            { 
                role: "system", 
                content: "Debes generar cuentos que nunca acaban, pero nunca coloques un continuara, solo termina en suspenso para mañana continuar con la historia." 
            },
            { 
                role: "system", 
                content: "No generes conversacion solo entrega la historia" 
            },
            { 
                role: "system", 
                content: "La respuesta debe estar generar en texto plano" 
            },
            {
                role: 'user',
                content: promptTextStartHistory
            }
        ]

        const image = await generateImage(title, others);

        if(image){
            setImageURL(image);
            localStorage.setItem('image', image)
        }

        const startHistory = await GenerateGemini(promptTextStartHistory, prompGPTHistory);

        resetHistory(startHistory);

        setThereHistory(true);
        setShowButtonDescription(true);
        setRunning(false);

    }

    const resetHistory = (text: string) => {

        let newHistory : string[] = history;
        const parrafos : string[] = text.split('\n').filter(parrafo => parrafo.trim() !== '');
        newHistory = newHistory.concat(parrafos);
        setHistory(newHistory)
        localStorage.setItem('history', JSON.stringify(newHistory));

    }

    const runHistory = () => {

        if(value.length){

            localStorage.removeItem('obra');
            localStorage.removeItem('history');

            const promptText = `Necesito que me generes un personaje para un cuento. Debe ser solo el personaje, describiendo sus características, el titulo (El titulo debe llevar al inicio los siguiente dos caracteres "##", esto para indentificar el titulo) y la descripcion del cuento debe ser acorde a los siguiente "${value}"`;
            const prompGPT = [
                { 
                    role: "system", 
                    content: "Eres el creador de cuentos, solo debes generar lo que usuario te pide" 
                },
                { 
                    role: "system", 
                    content: "En un '##' Debes agregar el titulo y en la siguiente linea debes agregar las caracteristicas" 
                },
                { 
                    role: "system", 
                    content: "No generes conversacion solo entrega los datos que necesito" 
                },
                { 
                    role: "system", 
                    content: "La respuesta debe estar generar en texto plano" 
                },
                {
                    role: 'user',
                    content: promptText
                }
            ];

            setRunning(true);
            generateCharacters(promptText, prompGPT);
            setShowButtonDescription(false);
            setShowDescription(false)
            setTitle('Generando nueva obra <div class="loading"><span>.</span><span>.</span><span>.</span></div>')
            setSubTitle('Iniciando esta nueva aventura<div class="loading"><span>.</span><span>.</span><span>.</span></div>')
            setHistory([]);
            setThereHistory(false);

        }

    }

    const resetElements = () => {
        localStorage.removeItem('obra');
        localStorage.removeItem('history');

        setRunning(false);
        setShowButtonDescription(false);
        setShowDescription(false)
        setTitle('Generar un nuevo cuento.')
        setSubTitle('Comienza esta nueva aventura.')
        setHistory([]);
        setThereHistory(false);
    }


    return(

        <section className={`center ${showDescription && 'expand'}`}>
            <section className="chat">
                <section className="conversation">
                    <h1 dangerouslySetInnerHTML={{__html: title}}></h1>
                    {showButtonDescription && <button className='show' onClick={buttonDescription}>{textButton}</button>}
                    <section className={` ${showButtonDescription && 'button'} all`}>
                        <section className={`items ${!history.length ? 'center_item' : ''}`} ref={historyContainer}>
                            {
                                history.length && imageURL.length ? (
                                    <div className='image'>
                                        <img src={imageURL} alt="Imagen de la historia" width="300" height="300"/>
                                    </div>
                                ): ''
                            }
                            {
                                history.length ? history.map((e, key) => {
                                    return <section className='item' key={key}>{e}</section>
                                }) : <h2 dangerouslySetInnerHTML={{__html: subTitle}}></h2>
                            }
                        </section>
                    </section>
                </section>
                <section className={`ejecutar ${thereHistory && 'history'}`}>


                    {
                        !thereHistory && !running ? <input type="text" placeholder='Escribe tu nueva historia' onChange={e => setValue(e.target.value)} /> : ''
                    }

                    { 
                        (!thereHistory && running ) &&  (
                            <button className={ running ? 'active' : '' } disabled={running}>
                                {
                                    running ? <ArrowPathIcon width={25}/> : <PaperAirplaneIcon width={25} type='Outline'/>
                                }
                            </button>
                        )
                    }

                    {
                        !thereHistory && !running ?
                            <>
                                <button onClick={runHistory} className={ running ? 'active' : '' } disabled={running}><PaperAirplaneIcon width={25} type='Outline'/></button>
                                <button onClick={run}><QuestionMarkCircleIcon width={25}/></button>
                            </>: ''
                    }

                    {
                        thereHistory && <>
                            <button onClick={resetElements} className={ running ? 'active' : '' } disabled={running}>Eliminar historia </button>
                            <button onClick={contiuarHistory} className={ running ? 'active' : '' } disabled={running}>Continuar historia</button>
                        </>
                    }

                </section>
            </section>
            <section className='description'>
                <div className='header'>
                    <h1 dangerouslySetInnerHTML={{__html: title}}></h1>
                    <button onClick={buttonDescription}>
                        <XMarkIcon width={25}/>
                    </button>
                </div>
                <hr />
                <strong>Descripcíon de la obra:</strong>
                <div className={`description_characters`}><p dangerouslySetInnerHTML={{__html: textDescription}}></p></div>
            </section>
        </section>
        
    )

}

export default ChatPage;
'use client';
import { PaperAirplaneIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/solid'
import { FormEvent, useState, useRef, useEffect } from 'react';
import  ImageExample from '@/assets/img/new_crece.webp';

import WelcomeComponent from '@/components/WelcomeComponent';
import { titleAI, descriptionAI, imagenAI, historyAI, continueHistoryAI } from '@/helpers/startHistory';


export default function Home() {

	const header = useRef(null);
	const container = useRef(null);
	const description = useRef(null);

	const [nextScreen, setNextScreen] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [titleObra, setTitleObra] = useState<string>('');
	const [descriptionObra, setDescriptionObra] = useState<string>('');
	const [imageObra, setImageObra] = useState<string>('');
	const [prompValue, setPrompValue] = useState<string>('');
	const [historyObra, setHistoryObra] = useState<string>('');
	const [inputPlaceholder, setInputPlaceholder] = useState<string>('Escribe aquí tu nueva historia')
	const [constinueHistory, setContinueHistory] = useState<boolean>(false);
	const [id, setID] = useState<number>(0);

	useEffect(() => {

		const titleItem = localStorage.getItem('title');
		const descriptionItem = localStorage.getItem('description');
		const historyItem = localStorage.getItem('history');

		if(titleItem && descriptionItem && historyItem){

			setTitleObra(titleItem);
			setDescriptionObra(descriptionItem);
			setHistoryObra(historyItem);
			setInputPlaceholder('Continua tu historía')

			newHeight(100);

			setContinueHistory(true);

			const image = localStorage.getItem('image');

			if(image){
				setImageObra(image);
			}else{
				setLoading(true);
				generateImage(titleItem, descriptionItem);
			}

			setTimeout(() => {
				setNextScreen(1);
			}, 500);

		}

	},[header, container, description])

	/**
	 * Enviamos el prompt
	 */

	const send = (e : FormEvent<HTMLFormElement>) => {
		
		e.preventDefault();

		if(!prompValue.length) return;

		setNextScreen(1);
		setLoading(true);

		if(constinueHistory){

			continueHistory();

		}else{

			const promp = prompValue;
			setPrompValue('')
			createTitle(promp);
		}

	}

	const createTitle = async (prompt: string) => {

		const title = await titleAI(prompt);

		if(title.length){
			setTitleObra(title);
			createDescription(prompt, title);

			localStorage.setItem('title', title);
		}else{
			setTitleObra('Ocurrió un error al imprimir el título.');
		}

	}

	const createDescription = async (prompt: string, title: string) => {

		const description = await descriptionAI(prompt, title);

		if(description.length){
			setDescriptionObra(description);
			generateImage(title, description);
			generateHistory(title, description);
			newHeight();

			localStorage.setItem('description', description);

		}else{
			setDescriptionObra('Ocurrió un error al imprimir la descripción.');
		}
		
	}

	const newHeight = (menos: number = 0) => {

		const headerComponent : HTMLElement | null = header.current as HTMLElement | null;
		const containerComponent : HTMLElement | null = container.current as HTMLElement | null;
		const descriptionComponent : HTMLElement | null = description.current as HTMLElement | null;

		if(headerComponent && containerComponent && descriptionComponent){
			const heightHeader: number = headerComponent.offsetHeight;
			const heightContainer : number = containerComponent.offsetHeight;
			descriptionComponent.style.height = `${heightContainer - heightHeader - 10 - menos}px`
		}

	}

	const generateImage =  async (title: string, description: string) => {

		const image = await imagenAI(title, description);

		if(image){
			setImageObra(image)
			localStorage.setItem('image', image);
		}

	}

	const generateHistory = async (title: string, description: string) => {

		const history = await historyAI(title, description);

		if(history.length){
			var convertHistory = history.replace(/\n/g, '<br/>').replace(/## /g, '');
			setHistoryObra(convertHistory);
			setLoading(false);
			setInputPlaceholder('Continua tu historía')
			setContinueHistory(true);

			localStorage.setItem('history', convertHistory);

		}else{
			setHistoryObra('Ocurrio un error');
		}

	}

	const continueHistory = async () => {

		const history = historyObra;
		let printUser = history + `<hr id="prefix-${id}"/>`;
		let saveLocal = history + '<hr/>';

		const newHistory =  await continueHistoryAI(titleObra, descriptionObra, historyObra, prompValue);
		const convertNewHistory = newHistory.replace(/\n/g, '<br/>').replace(/## /g, '');

		printUser += convertNewHistory;
		saveLocal += convertNewHistory;

		localStorage.setItem('history', saveLocal);

		setHistoryObra(printUser);
		scrollItems();

		setLoading(false);
		setPrompValue('');


	}

	const scrollItems = () => {

		setTimeout(() => {
			const descriptionComponent : HTMLElement | null = description.current as HTMLElement | null;
			const hrItem : HTMLHRElement | null = document.querySelector(`#prefix-${id}`);

			if(descriptionComponent && hrItem){
				descriptionComponent.scrollTop = hrItem.offsetTop - descriptionComponent.offsetTop;
			}

		}, 100);

		setID(id + 1);

	}

	const deleteAll = () => {

		setNextScreen(0)
		setLoading(false);
		setTitleObra('')
		setDescriptionObra('');
		setImageObra('');
		setPrompValue('');
		setHistoryObra('');
		setInputPlaceholder('Escribe aquí tu nueva historia');
		setContinueHistory(false)
		setID(0);

		localStorage.clear();

	}

	return (
		<main className="home">
			<section className="content">
				<div>
					<section className='image'>
						<img src={imageObra.length ? imageObra : ImageExample.src} width={ImageExample.width} alt='Desmostracion Cre-C' height={ImageExample.height}/>
						{
							(loading && !imageObra.length) && <div className='loading'></div>
						}
					</section>
					<section className='information' ref={container}>
						<section className={`${nextScreen == 0 && 'show'} ${nextScreen > 0 && 'remove'} welcome`}>
							<WelcomeComponent/>
						</section>
						<section className={`${nextScreen == 1 && 'show'} ${nextScreen > 1 && 'remove'} texts`}>
							<section ref={header}>
								<div className={` ${(loading && !titleObra) && 'loading'} title`}>
									{titleObra && <h1 dangerouslySetInnerHTML={{__html: titleObra}}></h1>}
								</div>
								<div className={` ${(loading && !descriptionObra.length) && 'loading'} description`}>
									<p dangerouslySetInnerHTML={{__html: descriptionObra}}></p>
								</div>
							</section>
							<div className={` ${(loading && !historyObra.length ) && 'loading'} content`} ref={description} dangerouslySetInnerHTML={{ __html: historyObra }}></div>
						</section>
					</section>
				</div>
			</section>
			<form className="controls" onSubmit={send}>

				<input 
					type="text" 
					placeholder={inputPlaceholder}
					value={prompValue}
					onChange={e => setPrompValue(e.target.value)}
					disabled={loading}
				/>
				<button className='submit' type='submit' disabled={loading}>
					{
						loading ? <ArrowPathIcon width={25} type='Outline' color='white'/> : <PaperAirplaneIcon width={25} type='Outline' color='white'/>
					}
				</button>

					{
						(titleObra.length && descriptionObra.length && historyObra.length) ? (
							<button className='submit delete' disabled={loading} onClick={deleteAll}>
								<TrashIcon width={25} type='Outline' color='white'/>
							</button>
						) : ''
					}

			</form>
		</main>
	);
}

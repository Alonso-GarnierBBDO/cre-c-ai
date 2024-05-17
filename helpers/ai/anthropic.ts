//TODO

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC as string,
});

const ClaudeResponse = async () => {

    console.log('Intentando con Cloude');

    try{


        const msg = await anthropic.messages.create({
            max_tokens: 1024,
            messages: [{ role: 'user', content: 'Hello, Claude' }],
            model: 'claude-3-opus-20240229',
        }).catch((err) => {
            console.log(err);
        });

        console.log(msg);


    }catch(err){

        console.log(err);

    }

    return '';

}

export default ClaudeResponse;
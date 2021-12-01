import {SapperRequest} from '@sapper/server';

let TEMPLATE_SECTIONS = null

const TOKENS = ['sapper.base','sapper.head','sapper.styles','sapper.html','sapper.scripts'];

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()[\]\\]/g, '\\$&');
}


export type TransformData = Readonly<{
    html: any;
    head: any;
    styles: string;
    script: string;
    baseUrl: string;
    nonce_value: string;
    nonce_attr: string;
    is_bot: boolean;
    req: SapperRequest;
}>;

export type Transformer = (body: string, data: TransformData) => string;

const transformers: Transformer[] = [
    (template, data) =>
    {
        const TOKEN_REGEX = new RegExp('(?:%' + escapeRegExp(TOKENS.join('%|%')) + '%)','g');

        if(TEMPLATE_SECTIONS == null)
        {
            TEMPLATE_SECTIONS = template.split(TOKEN_REGEX);
        }

        TEMPLATE_SECTIONS.forEach(ts => {

            console.log({ts});
        })

        console.log({5:TEMPLATE_SECTIONS[5]})

        return TEMPLATE_SECTIONS[0] + "<base href=\"/\" >" + TEMPLATE_SECTIONS[1] + data.head + TEMPLATE_SECTIONS[2] + data.styles + TEMPLATE_SECTIONS[3] + data.html + TEMPLATE_SECTIONS[4] + "<script " + data.nonce_attr + " >" + data.script + "</script>"
            + TEMPLATE_SECTIONS[5];
        // return template
        //     .replace('%sapper.base%', () => `<base href="${data.req.baseUrl}/">`)
        //     .replace(
        //         '%sapper.scripts%',
        //         () => `<script${data.nonce_attr}>${data.script}</script>`
        //     )
        //     .replace('%sapper.html%', () => data.html)
        //     .replace('%sapper.head%', () => data.head)
        //     .replace('%sapper.styles%', () => data.styles)
        //     .replace(/%sapper\.cspnonce%/g, () => data.nonce_value)
    }

];

export function registerTemplateTransformer(transformer: Transformer) {
    transformers.push(transformer);
}

export function transformTemplate(template: string, data: TransformData) {

    return transformers.reduce(
        (acc, transformer) => transformer(acc, data),
        template
    );
}
import { SapperRequest } from '@sapper/server';

let TEMPLATE_SECTIONS = null

const TOKENS = ['sapper.base','sapper.head','sapper.html','sapper.scripts'];

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()[\]\\]/g, '\\$&');
}

const TOKEN_REGEX = new RegExp('(?:%' + escapeRegExp(TOKENS.join('%|%')) + '%)','g');

export type TransformData = Readonly<{
    html: any;
    head: any;
    styles: string;
    script: string;
    nonce_value: string;
    nonce_attr: string;
    req: SapperRequest;
}>;

export type Transformer = (body: string, data: TransformData) => string;

const transformers: Transformer[] = [
    (template, data) =>
    {
        if(TEMPLATE_SECTIONS === null)
        {
            TEMPLATE_SECTIONS = template.split(TOKEN_REGEX);
        }

        return  TEMPLATE_SECTIONS[0] + "<base href=\"" + data.req.baseUrl + "\" >" + TEMPLATE_SECTIONS[1] + data.head + TEMPLATE_SECTIONS[2] + data.html + TEMPLATE_SECTIONS[3] + "<script " +  data.nonce_attr + " >" + data.script +  "</script>" + TEMPLATE_SECTIONS[4];
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
    transformers.splice(0, 0, transformer);
}

export function transformTemplate(template: string, data: TransformData) {
    return transformers.reduce(
        (acc, transformer) => transformer(acc, data),
        template
    );
}
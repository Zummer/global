import * as React from 'react';
import Koa from 'koa';
import Router from 'koa-router';
import { renderToString } from 'react-dom/server';
import {promises as fs} from 'fs';
import { StaticRouter } from 'react-router-dom';
import {AppRoutes} from '../client/AppRoutes';

const app = new Koa();
const router = new Router;
app.use(require('koa-bodyparser')());

function serverRender(assets, url) {
    const js = Object.keys(assets).map(bundle => `<script src="${assets[bundle].js}"></script>`);

    return (
        `<html>
            <head>
                <title>Hi there</title>
            </head>
            <body>
                <div id="root">${renderToString(
                    <StaticRouter location={url}>
                        <AppRoutes />
                    </StaticRouter>
                )}</div>
                ${js}
            </body>
        </html>`
    )
}

router.get('*',async (ctx, next) => {
    const assetsJSON = await fs.readFile('./public/webpack-assets.json', 'utf8');
    const assets = JSON.parse(assetsJSON);
    ctx.body = serverRender(assets, ctx.url);
});

app.use(require('koa-static')('./public'));

app.use(router.routes());

export {
    app
};

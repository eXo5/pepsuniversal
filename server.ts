import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

enableProdMode();

const app = express();

const PORT = process.env.port || 1337;
const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.js');

import { ngExpressEngine } from '@nguniversal/express-engine';
//lazy-loader,
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
	bootstrap: AppServerModuleNgFactory,
	providers: [
		provideModuleMap(LAZY_MODULE_MAP)
	]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

//todo implement secure data transfer. bcrypt as the midware?
app.get('/api/*', (req, res) => {
	res.status(404)
	.send('Data requests are not supported');
});

//server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

//all regular routes use the Universal engine,
app.get('*', (req,res) => {
	res.render('index', { req });
});

app.listen(PORT, () => {
	console.log(`Node Server listening on http://localhost:${PORT}`);
});
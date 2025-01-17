import express, { Express } from 'express';
import dotenv from 'dotenv';
import projectService from './services/project.service';
import reportService from './services/report.service';
import Joi from 'joi';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const AUTH_TOKEN = 'Password123';

function authenticate(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const token = req.headers['authorization'];

	if (token === `Bearer ${AUTH_TOKEN}`) {
		next();
	} else {
		res.status(401).json({
			message: 'Unauthorized: Invalid or missing token',
		});
	}
}

app.use(authenticate);
app.use(express.json());

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
	res.send('Hello!');
});

app.get('/api/projects', (req, res) => {
	res.json(projectService.getAllProjects());
});

app.get('/api/projects/:id', (req, res) => {
	let project;
	try {
		project = projectService.getProjectById(req.params.id);
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
	res.json(project);
});

app.post('/api/projects', (req, res) => {
	// schema validation
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const params = {
		name: req.body.name,
		description: req.body.description,
	};
	const project = projectService.addProject(params);
	res.json(project);
});

app.put('/api/projects', (req, res) => {
	//schema validation
	const schema = Joi.object({
		id: Joi.string().required(),
		name: Joi.string(),
		description: Joi.string(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const params = {
		id: req.body.id,
		name: req.body.name,
		description: req.body.description,
	};
	try {
		res.json(projectService.updateProject(params));
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
});

app.delete('/api/projects/:id', (req, res) => {
	let project;
	try {
		project = projectService.deleteProjectById(req.params.id);
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
	return res.json(project);
});

app.get('/api/reports/', (req, res) => {
	res.json(reportService.getAllReports());
});

app.get('/api/reports/:id', (req, res) => {
	let report;
	try {
		report = reportService.getReportById(req.params.id);
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
	res.json(report);
});

app.post('/api/reports', (req, res) => {
	// schema validation
	const schema = Joi.object({
		text: Joi.string().required(),
		projectid: Joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const params = {
		text: req.body.text,
		projectid: req.body.projectid,
	};
	const report = reportService.addReport(params);
	res.json(report);
});

app.put('/api/reports', (req, res) => {
	//schema validation
	const schema = Joi.object({
		id: Joi.string().required(),
		text: Joi.string(),
		projectid: Joi.string(),
	});
	const { error } = schema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const params = {
		id: req.body.id,
		text: req.body.text,
		projectid: req.body.projectid,
	};
	try {
		res.json(reportService.updateReport(params));
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
});

app.delete('/api/reports/:id', (req, res) => {
	let report;
	try {
		report = reportService.deleteReportById(req.params.id);
	} catch (e) {
		return res.status(404).send((<Error>e).message);
	}
	return res.json(report);
});

app.get('/api/reportswith3samewords', (req, res) => {
	res.json(reportService.getReportWith3SameWords());
});

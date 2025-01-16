import express, { Express } from 'express';
import dotenv from 'dotenv';
import projectService from './services/project.service';
import reportService from './services/report.service';
import Joi from 'joi';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

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
	const report = reportService.getReportById(req.params.id);
	if (Object.keys(report).length === 0)
		return res
			.status(400)
			.send('The report with the given ID is not found.');
	res.json(report);
});

import express from 'express';
import { authentification } from '../middleware/authentification';
import { ProjectController } from '../controller/project.controller';

const Router = express.Router();

Router.get('/projects', authentification, ProjectController.getAllProjects);
Router.post('/projects', authentification, ProjectController.addProject);

Router.get('/projects/:id', authentification, ProjectController.getProjectById);
Router.put('/projects/:id', authentification, ProjectController.updateProject);
Router.delete(
	'/projects/:id',
	authentification,
	ProjectController.deleteProjectById,
);

export { Router as projectRouter };

import express from 'express';
import { authentification } from '../middleware/authentification';
import { ReportService } from '../services/report.service';

const Router = express.Router();

Router.get('/reports', authentification, ReportService.getAllReports);
Router.post('/reports', authentification, ReportService.addReport);

Router.get('/reports/:id', authentification, ReportService.getReportById);
Router.put('/reports/:id', authentification, ReportService.updateReport);
Router.delete('/reports/:id', authentification, ReportService.deleteReportById);

Router.get(
	'/reportswith3samewords',
	authentification,
	ReportService.getReportWith3SameWords,
);
export { Router as reportRouter };

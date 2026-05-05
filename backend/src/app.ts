import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Coneckt API is running' });
});

export default app;

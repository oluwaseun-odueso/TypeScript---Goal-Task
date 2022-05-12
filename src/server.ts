import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

// Get all 
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the official goal tracker page.')
})

// To listen to the server
app.listen(4000, () => console.log('Server running'));
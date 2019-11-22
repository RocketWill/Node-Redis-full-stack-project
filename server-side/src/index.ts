import * as express from 'express';
import { Request, Response } from 'express';
import api from './api';

var cors = require('cors')

const app = express();
const { 
  PORT = 3000
} = process.env;

app.use(cors());

app.use('/api/v1', api);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'hello world!',
  })
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('server started at http://localhost:'+PORT);
  });
}

export default app;

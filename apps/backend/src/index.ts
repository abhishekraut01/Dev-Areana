import app from './app';
import dotenv from 'dotenv';
dotenv.config();
app.listen(process.env.PORT ?? 5000, () => {
  console.log(`server is running on port : ${process.env.PORT ?? 5000}`);
});

import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, DATABASE_URL, NODE_ENV, SERVER_URL } = process.env;

 
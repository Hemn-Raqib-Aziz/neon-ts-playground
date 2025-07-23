import { Pool } from "pg";
import { DATABASE_URL } from "../config/config";

 const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default pool;
import pool from "./db";

export async function initializeDatabase() {
  // Check if the 'post' table exists
  const tableCheckQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'post'
    );
  `;

  const { rows } = await pool.query(tableCheckQuery);
  const exists = rows[0].exists;

  if (!exists) {
    console.log("🛠️  'post' table does not exist. Creating...");

    const createTableQuery = `
      CREATE TABLE post (
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        description VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log("✅ 'post' table created.");

    const insertDummyDataQuery = `
      INSERT INTO post (title, description) VALUES
      ('Venice Canals: A Romantic Gondola Ride', 'Experience the magic of Venice''s waterways and historic architecture'),
      ('The Leaning Tower of Pisa: An Architectural Marvel', 'Visit one of Italy''s most recognizable landmarks and learn about its unique tilt'),
      ('Amalfi Coast: Coastal Beauty and Charming Villages', 'Explore the stunning coastline, colorful towns, and Mediterranean charm of Amalfi'),
      ('Exploring the Colosseum: Rome''s Ancient Wonder', 'Discover the history and grandeur of Rome''s iconic amphitheater'),
      ('Tuscany''s Rolling Hills: Wine Tasting in Chianti', 'Savor the flavors of Italy''s famous wine region amidst picturesque landscapes');
    `;

    await pool.query(insertDummyDataQuery);
    console.log("✅ Dummy data inserted into 'post' table.");
  } else {
    console.log("📦 'post' table already exists.");
  }
}

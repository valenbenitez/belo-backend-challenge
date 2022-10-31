interface Configuration {
  port: number;
  postgresConnection: DatabaseConnection;
}

interface DatabaseConnection {
  type: 'postgres' | 'mongodb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default (): Configuration => ({
  port: +process.env.PORT || 3001,
  postgresConnection: {
    type: 'postgres',
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    port: +process.env.POSTGRES_DB_PORT || 5432,
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
  },
});

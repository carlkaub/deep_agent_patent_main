
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Project } from './entities/Project';
import { PatentAnalysis } from './entities/PatentAnalysis';
import { BatchJob } from './entities/BatchJob';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'patent_analysis',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Project, PatentAnalysis, BatchJob],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

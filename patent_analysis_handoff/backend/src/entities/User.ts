
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Project } from './Project';
import { BatchJob } from './BatchJob';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: ['inventor', 'corporate_rd', 'patent_attorney', 'business_strategist']
  })
  personaType: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ default: 'free' })
  subscriptionTier: string;

  @OneToMany(() => Project, project => project.user)
  projects: Project[];

  @OneToMany(() => BatchJob, batchJob => batchJob.user)
  batchJobs: BatchJob[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  preferences: object;

  @Column({ type: 'jsonb', default: {} })
  dashboardConfig: object;
}

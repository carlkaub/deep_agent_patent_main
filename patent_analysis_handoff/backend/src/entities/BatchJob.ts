
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';

@Entity('batch_jobs')
export class BatchJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.batchJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  jobName: string;

  @Column()
  jobType: string;

  @Column({ type: 'jsonb' })
  inputData: object;

  @Column({ default: 'queued' })
  status: string;

  @Column({ default: 0 })
  progress: number;

  @Column()
  totalItems: number;

  @Column({ default: 0 })
  completedItems: number;

  @Column({ default: 0 })
  failedItems: number;

  @Column({ type: 'jsonb', default: {} })
  results: object;

  @Column({ type: 'text', array: true, default: [] })
  errorLog: string[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  estimatedCompletionTime: Date;

  @Column({ type: 'jsonb', default: {} })
  configuration: object;

  @Column({ default: 1 })
  priority: number;
}

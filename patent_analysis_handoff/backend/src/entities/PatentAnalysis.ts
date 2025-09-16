
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './Project';

@Entity('patent_analyses')
export class PatentAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, project => project.analyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ nullable: true })
  patentNumber: string;

  @Column({ type: 'text', nullable: true })
  patentTitle: string;

  @Column()
  analysisType: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'jsonb', default: {} })
  agentResults: object;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidenceScore: number;

  @Column({ nullable: true })
  processingTimeMs: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', default: {} })
  inputData: object;

  @Column({ type: 'jsonb', default: {} })
  metadata: object;

  @Column({ type: 'text', array: true, default: [] })
  errorLog: string[];

  @Column({ default: 0 })
  retryCount: number;
}

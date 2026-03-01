import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('startups')
export class Startup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  careersUrl: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  source: string; // e.g., 'YC', 'Product Hunt'

  @Column({ nullable: true })
  batch: string; // e.g., 'W24'

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  jobTitle: string;

  // AI Scores (0-100)
  @Column('int', { default: 0 })
  hiringScore: number;

  @Column('int', { default: 0 })
  remoteScore: number;

  @Column('int', { default: 0 })
  techStackScore: number;

  @Column('int', { default: 0 })
  growthScore: number;

  // AI Explanations
  @Column('text', { nullable: true })
  aiSummary: string; // "Why it's interesting"

  @Column('text', { nullable: true })
  outreachAngle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

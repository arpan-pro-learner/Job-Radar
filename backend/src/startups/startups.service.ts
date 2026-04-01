import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { Startup } from './entities/startup.entity';

@Injectable()
export class StartupsService {
  constructor(
    @InjectRepository(Startup)
    private startupsRepository: Repository<Startup>,
  ) {}

  async create(createStartupDto: CreateStartupDto) {
    const existing = await this.startupsRepository.findOne({ where: { name: createStartupDto.name } });
    if (existing) {
      return existing;
    }
    const startup = this.startupsRepository.create(createStartupDto);
    return this.startupsRepository.save(startup);
  }

  async upsert(createStartupDto: CreateStartupDto) {
    const existing = await this.startupsRepository.findOne({ 
        where: { name: createStartupDto.name } 
    });
    
    if (existing) {
      // Update existing record
      await this.startupsRepository.update(existing.id, createStartupDto);
      return this.startupsRepository.findOneBy({ id: existing.id });
    }
    
    // Create new record
    const startup = this.startupsRepository.create(createStartupDto);
    return this.startupsRepository.save(startup);
  }

  async findAll(query: { page?: number; limit?: number; search?: string; source?: string; locationFilter?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search || '';
    const source = query.source || '';

    const queryBuilder = this.startupsRepository.createQueryBuilder('startup');
    queryBuilder.where('1=1'); // Base condition to safely chain andWhere calls

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(startup.name) LIKE LOWER(:search) OR LOWER(startup.jobTitle) LIKE LOWER(:search) OR LOWER(startup.shortDescription) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (source) {
      queryBuilder.andWhere('startup.source LIKE :source', { source: `${source}%` });
    }

    if (query.locationFilter === 'global_india') {
      const locKeywords = ['%global%', '%worldwide%', '%india%', '%anywhere%', '%apac%', '%remote (any)%'];
      const conditions = locKeywords.map((_, i) => `LOWER(startup.location) LIKE :loc${i}`);
      const params = locKeywords.reduce((acc, val, i) => ({ ...acc, [`loc${i}`]: val }), {});
      
      queryBuilder.andWhere(`(${conditions.join(' OR ')})`, params);
    }

    queryBuilder.orderBy('startup.updatedAt', 'DESC');
    queryBuilder.take(limit);
    queryBuilder.skip((page - 1) * limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      }
    };
  }

  findOne(id: string) {
    return this.startupsRepository.findOneBy({ id });
  }

  update(id: string, updateStartupDto: UpdateStartupDto) {
    return this.startupsRepository.update(id, updateStartupDto);
  }

  async remove(id: string) {
    await this.startupsRepository.delete(id);
    return { deleted: true };
  }

  async removeBySource(source: string) {
    const result = await this.startupsRepository.delete({ source });
    return { deletedCount: result.affected };
  }

  async countBySource(source: string): Promise<number> {
    return this.startupsRepository.count({ where: { source: source as any } });
  }

  async countAll(): Promise<number> {
    return this.startupsRepository.count();
  }
}

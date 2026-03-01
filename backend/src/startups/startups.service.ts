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

  async findAll(query: { page?: number; limit?: number; search?: string; source?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search || '';
    const source = query.source || '';

    const queryBuilder = this.startupsRepository.createQueryBuilder('startup');

    if (search) {
      queryBuilder.where(
        '(LOWER(startup.name) LIKE LOWER(:search) OR LOWER(startup.jobTitle) LIKE LOWER(:search) OR LOWER(startup.shortDescription) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (source) {
      if (search) {
        queryBuilder.andWhere('startup.source = :source', { source });
      } else {
        queryBuilder.where('startup.source = :source', { source });
      }
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
}

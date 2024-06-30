import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BranchesService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(createBranchDto: Prisma.BranchCreateInput) {
        return this.databaseService.branch.create({
            data: createBranchDto,
        });
    }

    async findAll(name?: string) {
        return this.databaseService.branch.findMany({ where: { name: { contains: name } } });
    }

    async findOne(id: number) {
        return this.databaseService.branch.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateBranchDto: Prisma.BranchUpdateInput) {
        return this.databaseService.branch.update({
            where: { id },
            data: updateBranchDto,
        });
    }

    async remove(id: number) {
        return this.databaseService.branch.delete({
            where: { id },
        });
    }
}

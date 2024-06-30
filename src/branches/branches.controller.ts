import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { Prisma, Role } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) {}

    @Get()
    async findAll(@Query('name') name?: string){
        return this.branchesService.findAll(name);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.branchesService.findOne(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    @Post()
    async create(@Body(ValidationPipe) branchCreateInput: Prisma.BranchCreateInput) {
        return this.branchesService.create(branchCreateInput);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) branchUpdateInput: Prisma.BranchUpdateInput) {
        return this.branchesService.update(id, branchUpdateInput);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.branchesService.remove(id);
    }
}

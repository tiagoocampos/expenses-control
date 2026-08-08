import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @CurrentUser('userId') userId: number) {
    return this.expensesService.create(createExpenseDto, userId);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: number) {
    return this.expensesService.findAll(userId);
  }

  @Get('total')
  getTotal(@CurrentUser('userId') userId: number) {
    return this.expensesService.getTotal(userId);
  }

  @Get('by-category')
  getByCategory(@CurrentUser('userId') userId: number) {
    return this.expensesService.getByCategory(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}

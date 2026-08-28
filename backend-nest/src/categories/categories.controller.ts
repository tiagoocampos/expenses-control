import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser('userId') userId: number) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: number) {
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.categoriesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.categoriesService.remove(id, userId);
  }
}
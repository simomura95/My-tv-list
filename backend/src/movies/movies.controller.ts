import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import mongoose from 'mongoose';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll() {
    return await this.moviesService.findAll();
  }

  @Get('id/:id')
  async findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return await this.moviesService.findOne(id);
  }

  @Get('/title/:title')
  async findByTitle(@Param('title') title: string) {
    return await this.moviesService.findByTitle(title);
  }

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.moviesService.create(createMovieDto);
  }

  // @Patch('add-rating/:id')
  // async addRating(@Param('id') id: mongoose.Types.ObjectId, @Body('rating') rating: number) {
  //   return await this.moviesService.addRating(id, rating);
  // }

  // @Patch('remove-rating/:id')
  // async removeRating(@Param('id') id: mongoose.Types.ObjectId, @Body('rating') rating: number) {
  //   return await this.moviesService.removeRating(id, rating);
  // }
  
  // @Patch('edit-rating/:id')
  // async editRating(@Param('id') id: mongoose.Types.ObjectId, @Body() ratings: {oldRating: number, newRating: number}) {
  //   return await this.moviesService.editRating(id, ratings.oldRating, ratings.newRating);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return await this.moviesService.update(id, updateMovieDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.moviesService.remove(id);
  // }
}

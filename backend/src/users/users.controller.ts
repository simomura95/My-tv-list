import { Controller, Get, Post, Body, Request, Param, UseGuards, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Movie, MovieDocument } from 'src/movies/schemas/movie.schema';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('movies')
  getMovies(@Request() req) {
    return this.usersService.getMovies(req.user)
  }

  @UseGuards(AuthGuard)
  @Post('add-movie/:movieId')
  addMovie(@Request() req, @Param('movieId') movieId: mongoose.Types.ObjectId, @Body('rating') rating: number) { // se lo metto come argomento di body, è destrutturato; altrimento, è l'oggetto json
    return this.usersService.addMovie(req.user._id, req.user.watchlist, movieId, rating)
  }

  @UseGuards(AuthGuard)
  @Delete('delete-movie/:movieId')
  deleteMovie(@Request() req, @Param('movieId') movieId: mongoose.Types.ObjectId) {
    return this.usersService.deleteMovie(req.user._id, req.user.watchlist, movieId)
  }

  @UseGuards(AuthGuard)
  @Patch('edit-movie/:movieId')
  editRating(@Request() req, @Param('movieId') movieId: mongoose.Types.ObjectId, @Body('newRating') newRating: number) {
    return this.usersService.editRating(req.user._id, req.user.watchlist, movieId, newRating)
  }
}

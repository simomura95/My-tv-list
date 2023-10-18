import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserMovie } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'
import { Movie, MovieDocument } from 'src/movies/schemas/movie.schema';
import { MoviesService } from 'src/movies/movies.service';

@Injectable()
export class UsersService {
  constructor(
    private moviesService: MoviesService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // auth methods
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findOne(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  // movies methods
  getMovies(user: UserDocument): UserMovie[] {
    return user.watchlist // standard order: by add date
  }

  async addMovie(userId: mongoose.Types.ObjectId, userWatchList: UserMovie[], movieId: mongoose.Types.ObjectId, rating: number): Promise<UserMovie> {
    let movieRated: UserMovie
    try {
      const movieAdded = await this.moviesService.findOne(movieId)
      movieRated = {movie: movieAdded, rating: rating, addDate: new Date()}
      const updatedWatchlist = [...userWatchList, movieRated]
      await this.userModel.findByIdAndUpdate(userId, {watchlist: updatedWatchlist})
      await this.moviesService.addRating(movieId, rating)
    } catch(error) {
      throw new Error(error)
    }
    return movieRated
  }

  async deleteMovie(userId: mongoose.Types.ObjectId, userWatchList: UserMovie[], movieId: mongoose.Types.ObjectId): Promise<UserMovie> {
    let movieRemoved: UserMovie
    const updatedWatchlist = userWatchList.filter(userMovie => {
      if (userMovie.movie._id.equals(new mongoose.Types.ObjectId(movieId))) {
        movieRemoved = userMovie;
        return false
      } else {
        return true
      }
    })
    if (!movieRemoved) {
      throw new NotFoundException('Movie not found')
    }

    try {
      await this.userModel.findByIdAndUpdate(userId, {watchlist: updatedWatchlist})
      await this.moviesService.removeRating(movieId, movieRemoved.rating)
    } catch(error) {
      throw new Error(error)
    }

    return movieRemoved;
  }

  async editRating(userId: mongoose.Types.ObjectId, userWatchList: UserMovie[], movieId: mongoose.Types.ObjectId, newRating: number): Promise<UserMovie> {
    let movieEdited: UserMovie
    let oldRating: number

    const updatedWatchlist = userWatchList.map(userMovie => {
      if (userMovie.movie._id.equals(new mongoose.Types.ObjectId(movieId))){
        oldRating = userMovie.rating
        movieEdited = { ...userMovie, rating: newRating }
        return movieEdited
      } else {
        return userMovie
      }
    });

    if (!movieEdited) {
      throw new NotFoundException()
    }

    try {
      await this.userModel.findByIdAndUpdate(userId, {watchlist: updatedWatchlist})
      await this.moviesService.editRating(movieId, oldRating, newRating)
    } catch(error) {
      throw new Error(error)
    }

    return movieEdited;
  }
}

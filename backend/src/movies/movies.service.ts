import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findAll(): Promise<Movie[]> {
    return await this.movieModel.find().exec(); // exec non è necessario, ma aumenta leggibilità
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<MovieDocument> {
    return await this.movieModel.findOne({ _id: id}).exec();
  }

  async findByTitle(title: string): Promise<MovieDocument[]> {
    const regex = new RegExp(title, 'i'); // 'i' indica una corrispondenza non case-sensitive
    return await this.movieModel.find({ title: regex }).exec();
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return await createdMovie.save();
  }

  async addRating(id: mongoose.Types.ObjectId, rating: number): Promise<MovieDocument> {
    let movieEdited = await this.findOne(id)
    movieEdited.ratings.push(rating)
    return await movieEdited.save()
  }

  async removeRating(id: mongoose.Types.ObjectId, rating: number): Promise<Movie> {
    let movieEdited = await this.findOne(id)
    const index = movieEdited.ratings.findIndex(movieRating => movieRating === rating) // ritorna solo il primo indice, quindi non rimuove duplicati
    movieEdited.ratings.splice(index, 1)
    return await movieEdited.save();
  }

  async editRating(id: mongoose.Types.ObjectId, oldRating: number, newRating: number): Promise<Movie> {
    let movieEdited = await this.findOne(id)
    const index = movieEdited.ratings.findIndex(movieRating => movieRating === oldRating) // ritorna solo il primo indice, quindi non rimuove duplicati
    movieEdited.ratings[index] = newRating
    return await movieEdited.save();
  }

  // async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
  //   let editedMovie = await this.movieModel.findOne({ _id: id}).exec();
  //   editedMovie.set(updateMovieDto);;
  //   return await editedMovie.save();
  // }

  // async remove(id: string): Promise<Movie> {
  //   return await this.movieModel.findByIdAndRemove({ _id: id}).exec();
  // }
}

export default interface MovieMovieDB {
  id: string; // se non presente in un oggetto film è undefined e non dà errore
  title: string;
  overview: string | null;
  release_date: string;
  poster_path: string;
}
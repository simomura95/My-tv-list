export default interface Movie {
  _id: string; // se non presente in un oggetto film è undefined e non dà errore
  moviedb_id: number;
  title: string;
  overview: string | null;
  release_date: string;
  image_url: string;
  ratings: number[]
}
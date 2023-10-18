# Website for storing users' movie watched and their ratings

As the backend is hosted for free on Render, it goes on stand-by when it's not used, so it can take up to a couple of minutes for the website to load the first time.

It uses NestJS for the backend, React for the frontend, Mongo for the database, and TypeScript. CSS are done almost entirely with Bootstrap 5.

After registration, users can start adding movies to their watchlist, with a rating.
Movie search is done first locally, in the website db; if the desired movie is not found, the research can then be extended to [themoviedb] (https://www.themoviedb.org/) using their API. Each time a new movie is searched in moviedb and added by a user, it is also added in my database. The movie database starts empty; the idea is that it populates itself over time, with users adding more and more new movies.

When the user selects a movie and a rating, it is added both to their watchlist and to the movie table. This way it's possible to keep track of the global rating of the movie and show it in the Add section.

In the home, after authentication (done via JWT token), the user can see the movie previously added with the rating chosen; it's possible to remove them, edit their rating, filter among them and changing their order. When a movie is removed or edited, its global rating is adjusted accordingly.

The same website structure could be easily used for other projects, e.g. a database of TV series, anime, games, dishes, etc (anything that has a title, description and can be rated is good)
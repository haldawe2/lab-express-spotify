require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// Our routes go here:

app.get("/", (req, res, next) => {
  res.status(200).render("home");
});

app.get("/artist-search", (req, res, next) => {
    const {artist} = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // res.render('artist-search-results', {data});
      res.json(data);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/album-:artistId", (req, res, next) => {
  const {artistId} = req.params;
spotifyApi
  .searchArtists(artistId)
  .then((data) => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // res.render('albums', {data});
  res.json(data.body);
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

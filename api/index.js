const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');

const nodemailer = require('nodemailer');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');



app.listen(port, () => {
  console.log('Server running on port 8000');
});

const User = require('./models/user');
const Game = require('./models/game');
const Venue = require('./models/venue');

app.post('/register', async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);

    await newUser.save();

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: newUser._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('Error creating user', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    if (user.password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('error loggin in', error);
    res.status(500).json({message: 'Error loggin In'});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: 'Error fetching the user details'});
  }
});

app.post('/creategame', async (req, res) => {
  try {
    const {sport, area, date, time, admin, totalPlayers} = req.body;

    const activityAccess = 'public';

    console.log('sport', sport);
    console.log(area);
    console.log(date);
    console.log(admin);

    const newGame = new Game({
      sport,
      area,
      date,
      time,
      admin,
      totalPlayers,
      players: [admin],
    });

    const savedGame = await newGame.save();
    res.status(200).json(savedGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to create game'});
  }
});

app.get('/games', async (req, res) => {
  try {
    const games = await Game.find({})
      .populate('admin')
      .populate('players', 'image firstName lastName');

    const currentDate = moment();

    // Filter games based on current date and time
    const filteredGames = games.filter(game => {
      const gameDate = moment(game.date, 'Do MMMM'); // Assuming your date is stored in "9th July" format

      console.log('game Date', gameDate);
      const gameTime = game.time.split(' - ')[0]; // Get the start time of the game
      console.log('game time', gameTime);
      const gameDateTime = moment(
        `${gameDate.format('YYYY-MM-DD')} ${gameTime}`,
        'YYYY-MM-DD h:mm A',
      );

      console.log('gamedateTime', gameDateTime);

      return gameDateTime.isAfter(currentDate);
    });

    const formattedGames = filteredGames.map(game => ({
      _id: game._id,
      sport: game.sport,
      date: game.date,
      time: game.time,
      area: game.area,
      players: game.players.map(player => ({
        _id: player._id,
        imageUrl: player.image, // Player's image URL
        name: `${player.firstName} ${player.lastName}`, // Optional: Player's name
      })),
      totalPlayers: game.totalPlayers,
      queries: game.queries,
      requests: game.requests,
      isBooked: game.isBooked,
      adminName: `${game.admin.firstName} ${game.admin.lastName}`,
      adminUrl: game.admin.image, // Assuming the URL is stored in the image field
      matchFull:game.matchFull
    }));
    res.json(formattedGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch games'});
  }
});

app.get('/upcoming', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming you have user authentication and req.user contains the authenticated user's info

    console.log('userId', userId);

    // Fetch games where the user is either the admin or a player
    const games = await Game.find({
      $or: [
        {admin: userId}, // Check if the user is the admin
        {players: userId}, // Check if the user is in the players list
      ],
    })
      .populate('admin')
      .populate('players', 'image firstName lastName');

    // Format games with the necessary details
    const formattedGames = games.map(game => ({
      _id: game._id,
      sport: game.sport,
      date: game.date,
      time: game.time,
      area: game.area,
      players: game.players.map(player => ({
        _id: player._id,
        imageUrl: player.image, // Player's image URL
        name: `${player.firstName} ${player.lastName}`, // Optional: Player's name
      })),
      totalPlayers: game.totalPlayers,
      queries: game.queries,
      requests: game.requests,
      isBooked: game.isBooked,
      courtNumber: game.courtNumber,
      adminName: `${game.admin.firstName} ${game.admin.lastName}`,
      adminUrl: game.admin.image, // Assuming the URL is stored in the image field
      isUserAdmin: game.admin._id.toString() === userId,
      matchFull:game.matchFull
    }));

    res.json(formattedGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch upcoming games'});
  }
});

app.post('/games/:gameId/request', async (req, res) => {
  try {
    const {userId, comment} = req.body; // Assuming the userId and comment are sent in the request body
    const {gameId} = req.params;

    // Find the game by ID
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    // Check if the user has already requested to join the game
    const existingRequest = game.requests.find(
      request => request.userId.toString() === userId,
    );
    if (existingRequest) {
      return res.status(400).json({message: 'Request already sent'});
    }

    // Add the user's ID and comment to the requests array
    game.requests.push({userId, comment});

    // Save the updated game document
    await game.save();

    res.status(200).json({message: 'Request sent successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to send request'});
  }
});

app.get('/games/:gameId/requests', async (req, res) => {
  try {
    const {gameId} = req.params;
    const game = await Game.findById(gameId).populate({
      path: 'requests.userId',
      select: 'email firstName lastName image skill noOfGames playpals sports', // Select the fields you want to include
    });

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    const requestsWithUserInfo = game.requests.map(request => ({
      userId: request.userId._id,
      email: request.userId.email,
      firstName: request.userId.firstName,
      lastName: request.userId.lastName,
      image: request.userId.image,
      skill: request.userId.skill,
      noOfGames: request.userId.noOfGames,
      playpals: request.userId.playpals,
      sports: request.userId.sports,
      comment: request.comment,
    }));

    res.json(requestsWithUserInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch requests'});
  }
});

app.post('/accept', async (req, res) => {
  const {gameId, userId} = req.body;

  console.log('user', userId);

  console.log('heyy', gameId);

  try {
    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    game.players.push(userId);

    // Remove the user from the requests array
    // game.requests.splice(requestIndex, 1);

    await Game.findByIdAndUpdate(
      gameId,
      {
        $pull: {requests: {userId: userId}},
      },
      {new: true},
    );

    // Save the updated game
    await game.save();

    res.status(200).json({message: 'Request accepted', game});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

app.get('/game/:gameId/players', async (req, res) => {
  try {
    const {gameId} = req.params;
    const game = await Game.findById(gameId).populate('players');

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    res.status(200).json(game.players);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch players'});
  }
});

const venues = [
  {
    name: '147 One Four Seven Snooker, Billiards and Pool Sports Academy',
    rating: 4,
    deferLink: 'https://playo.page.link/ry8TT',
    fullLink:
      'https://playo.co/venue/?venueId=4ec5b58f-d58f-4ce1-8c84-2caa63007ecc',
    avgRating: 4,
    ratingCount: 3,
    lat: 12.9341796,
    lng: 77.6101537,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/FIGURINEFITNESSINDIRANAGAR/SnookerRoom1652349575145.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"AVS Compound, 1st Floor, 1st Cross",
    bookings: [],
  },
  {
    name: 'OvalNet Badminton Academy - Sahakar Nagar',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/MAAX",
    fullLink: "https://playo.co/venue/?venueId=afbe7186-2f86-4215-8715-4b967f166b09",
    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/OVALNETBADMINTONACADEMY/OvalNetBadmintonAcademy6.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'OvalNet Badminton Academy - Sahakar Nagar',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/MAAX",
    fullLink: "https://playo.co/venue/?venueId=afbe7186-2f86-4215-8715-4b967f166b09",
    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/OVALNETBADMINTONACADEMY/OvalNetBadmintonAcademy6.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'Play Zone - Sahakarnagar (Shree Vayu Badminton Arena)',
    rating: 4,
    fullLink: "https://playo.co/venue?venueId=6bb450c0-318b-49e5-b7c0-c02a37d34ef8",
    deferLink: "https://z34v4.app.goo.gl/4Kqo",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.053750730700056,
    lng: 77.57626923775621,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/PLAYZONESAHAKARNAGARSHREEVAYUBADMINTONARENA20231206074712995440/PlayZoneSahakarnagarShreeVayuBadmintonArena1701880566748.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"Sahakar Nagar road, Adjacent to AMCO layout and Tata Nagar, Hebbal",
    bookings: [],
  },
  {
    name: 'VIN Badminton',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/RTF4",
    fullLink: "https://playo.co/venue/?venueId=37f3675b-dfd2-4f30-8506-a3883abef902",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.071497063988476,
    lng: 77.58706385591489,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/VINI5BADMINTONARENA20240226042742110513/Vini5BadmintonArena1709376498394.jpg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"Vini5 badminton arena, 5th main road, Canara bank layout",
    bookings: [],
  },
  {
    name: 'Serve & Smash Badminton Academy',
    rating: 4,
    fullLink: "https://playo.co/venue?venueId=a0c6ceb4-d09b-4fcf-bafd-6c949a55590c",
    deferLink: "https://z34v4.app.goo.gl/3k9a",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.045735,
    lng: 77.572929,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://playo.gumlet.io/SERVESMASH20191003055000886885/ServeSmash0.jpeg?mode=crop&crop=smart&h=200&width=450&q=75",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"1st Cross, RMV 2nd Stage, Nagashettihalli bangalore",
    bookings: [],
  },
  // Add more venues as need
];

async function addVenues() {
  for (const venueData of venues) {
    // Check if the venue already exists
    const existingVenue = await Venue.findOne({name: venueData.name});

    if (existingVenue) {
      console.log(`Venue "${venueData.name}" already exists. Skipping.`);
    } else {
      // Add the new venue
      const newVenue = new Venue(venueData);
      await newVenue.save();
      console.log(`Venue "${venueData.name}" added successfully.`);
    }
  }
}

addVenues().catch(err => {
  console.error('Error adding venues:', err);
});

app.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find({});
    console.log("ven",venues)
    res.status(200).json(venues);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Failed to fetch venues'});
  }
});

app.post('/book', async (req, res) => {
  const {courtNumber, date, time, userId, name, game} = req.body;

  console.log('game', game);

  try {
    const venue = await Venue.findOne({name: name});
    if (!venue) {
      return res.status(404).json({message: 'Venue not found'});
    }

    // console.log('Venue', venue);
    // Check for booking conflicts
    const bookingConflict =
      venue.bookings &&
      venue.bookings.find(
        booking =>
          booking.courtNumber === courtNumber &&
          booking.date === date &&
          booking.time === time,
      );
    if (bookingConflict) {
      return res.status(400).json({message: 'Slot already booked'});
    }
    // Add new booking
    venue.bookings.push({courtNumber, date, time, user: userId, game});

    await venue.save();

    await Game.findByIdAndUpdate(game, {
      isBooked: true,
      courtNumber: courtNumber,
    });
    res.status(200).json({message: 'Booking successful', venue});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});


app.post('/toggle-match-full', async (req, res) => {
  try {
    const { gameId } = req.body;

    // Find the game by its ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Toggle the matchFull status
    game.matchFull = !game.matchFull;
    await game.save();

    res.json({ message: 'Match full status updated', matchFull: game.matchFull });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update match full status' });
  }
});
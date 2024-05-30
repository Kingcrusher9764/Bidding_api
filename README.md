# Bidding Platform API

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up the database and environment variables in a `.env` file.
4. Create the database using `database.sql` query file

## Endpoints

### Users

- `POST api/users/register` - Register a new user.
- `POST api/users/login` - Authenticate a user and return a token.
- `GET api/users/profile` - Get the profile of the logged-in user.

### Items

- `GET api/items` - Retrieve all auction items.
- `GET api/items/:id` - Retrieve a single auction item by ID.
- `POST api/items` - Create a new auction item. (Authenticated users, image upload)
- `PUT api/items/:id` - Update an auction item by ID. (Authenticated users, only item owners or admins)
- `DELETE api/items/:id` - Delete an auction item by ID. (Authenticated users, only item owners or admins)

### Bids

- `GET api/items/:itemId/bids` - Retrieve all bids for a specific item.
- `POST api/items/:itemId/bids` - Place a new bid on a specific item. (Authenticated users)

### Notifications

- `GET api/notifications` - Retrieve notifications for the logged-in user.
- `POST api/notifications/mark-read` - Mark notifications as read.


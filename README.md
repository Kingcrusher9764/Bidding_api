# Bidding Platform API

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up the database and environment variables in a `.env` file present in `src` folder.
4. Create the database using `database.sql` query file

## Run command
1. To start the server run `node src/app.js` in terminal
2. Start the postman and hit the api `endpoints` at `http://localhost:3000`

## Endpoints

### Users

- `POST api/users/register` - Register a new user.
    - Take `username, email, and password` as a input in request body
- `POST api/users/login` - Authenticate a user and return a token.
    - Take `email and password` as input in request body
- `GET api/users/profile` - Get the profile of the logged-in user.
    - Take `token` as input in request header with name `Authorization`
    - Give user information as a output

### Items

- `GET api/items` - Retrieve all auction items.
    - Take `page and limit` as a input in request query parmaters for pagination
    - Provide items according to it as output
- `GET api/items/:id` - Retrieve a single auction item by ID.
    - Take item `id` a request paramter
    - Provide item information as output
- `POST api/items` - Create a new auction item. (Authenticated users, image upload)
    - Take `image, name, description, starting_price and end_time` as input
    - Create a new item
- `PUT api/items/:id` - Update an auction item by ID. (Authenticated users, only item owners or admins)
    - Take `image, name, description, starting_price and end_time` as input
    - Update the item information
- `DELETE api/items/:id` - Delete an auction item by ID. (Authenticated users, only item owners or admins)
    - Take `id` of item as request parameter
    - Delete the item

### Bids

- `GET api/items/:itemId/bids` - Retrieve all bids for a specific item.
    - Take `itemId` as a request parameter for input
    - Retrieves all the bids of that item
- `POST api/items/:itemId/bids` - Place a new bid on a specific item. (Authenticated users)
    - Take `itemId and bid_amount` as a request paramater for input
    - Place a bid on the item of that itemId

### Notifications

- `GET api/notifications` - Retrieve notifications for the logged-in user.
    - Take `token` as a input in request header
    - Retrieves all notifications of the user
- `POST api/notifications/mark-read` - Mark notifications as read.
    - Take `token` as a input in request header
    - Mark all the notifications for the users as read


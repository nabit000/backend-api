# Roblox Place Creator API

Backend API server for creating Roblox places dynamically from a template. This API is called by your Roblox game when players need their personal place created.

## Features

- Creates new Roblox places from a template using Roblox Open Cloud API
- Stores place creation requests with user information
- Error handling and retry logic
- Health check endpoint for monitoring

## Prerequisites

- Node.js 16+ installed
- Roblox Open Cloud API Key
- A template place ID (the place that will be cloned for each player)
- Your Roblox Universe ID

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
ROBLOX_API_KEY=your_actual_api_key_here
ROBLOX_UNIVERSE_ID=your_universe_id_here
TEMPLATE_PLACE_ID=your_template_place_id_here
PORT=3000
```

### 3. Get Your Roblox API Key

1. Go to [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials)
2. Create a new API key with the following permissions:
   - `Universe:Read`
   - `Universe:Write` (or `Place:Create` if available)
3. Copy the API key to your `.env` file

### 4. Find Your Universe ID

- Go to your game's settings page on Roblox
- The Universe ID is in the URL or in the game settings
- Example: `https://create.roblox.com/games/1234567890` → Universe ID is `1234567890`

### 5. Get Your Template Place ID

- This is the Place ID of the template place you want to clone
- You can find it in the place's URL or settings
- Example: `https://www.roblox.com/games/9876543210/Game-Name` → Place ID is `9876543210`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT you specified).

## API Endpoints

### POST /create_place

Creates a new Roblox place from the template for a player.

**Request Body:**
```json
{
  "userId": 123456789,
  "displayName": "PlayerName"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "placeId": 9876543210,
  "userId": 123456789,
  "displayName": "PlayerName"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error type",
  "message": "Error description",
  "details": "Additional error details"
}
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "message": "Roblox Place Creator API is running"
}
```

## Deployment

### Option 1: Deploy to Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set ROBLOX_API_KEY=your_key
   heroku config:set ROBLOX_UNIVERSE_ID=your_id
   heroku config:set TEMPLATE_PLACE_ID=your_place_id
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to Railway

1. Connect your GitHub repository to [Railway](https://railway.app)
2. Add environment variables in Railway dashboard
3. Railway will automatically deploy

### Option 3: Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Set environment variables in the dashboard
4. Deploy

### Option 4: Deploy to VPS (DigitalOcean, AWS, etc.)

1. Clone repository on your server
2. Install Node.js and npm
3. Run `npm install --production`
4. Set up environment variables
5. Use PM2 or systemd to run the server:
   ```bash
   pm2 start server.js --name roblox-api
   ```

## Update Your Roblox Game

After deploying, update the endpoint in your Roblox game's `TeleportHandler.lua`:

```lua
local CREATE_PLACE_ENDPOINT = "https://your-deployed-api.com/create_place"
```

## Troubleshooting

### "Authentication failed" error

- Verify your `ROBLOX_API_KEY` is correct
- Ensure the API key has the necessary permissions
- Check that the API key hasn't expired

### "Permission denied" error

- Your API key needs `Universe:Write` or `Place:Create` permissions
- Verify you're using the correct Universe ID

### "Failed to create place" error

- Check the Roblox Open Cloud API documentation for the latest endpoint structure
- Verify your template Place ID is correct
- Ensure the template place is accessible and not private

### API endpoint structure changed

The Roblox Open Cloud API may change. If you encounter issues, check:
- [Roblox Open Cloud Documentation](https://create.roblox.com/docs/cloud/open-cloud)
- Update the API endpoint in `server.js` if needed

## Security Notes

- **Never commit your `.env` file to version control**
- Keep your API key secure and rotate it regularly
- Consider adding rate limiting for production use
- Add authentication/authorization if exposing publicly

## License

ISC


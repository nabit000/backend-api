const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration from environment variables
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const ROBLOX_UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID;
const TEMPLATE_PLACE_ID = process.env.TEMPLATE_PLACE_ID;
const ROBLOX_OPEN_CLOUD_BASE_URL = 'https://apis.roblox.com';

// Validate required environment variables
if (!ROBLOX_API_KEY) {
	console.error('ERROR: ROBLOX_API_KEY is not set in environment variables');
	process.exit(1);
}

if (!TEMPLATE_PLACE_ID) {
	console.error('ERROR: TEMPLATE_PLACE_ID is not set in environment variables');
	process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'ok', message: 'Roblox Place Creator API is running' });
});

// Create place endpoint
app.post('/create_place', async (req, res) => {
	try {
		const { userId, displayName } = req.body;

		// Validate request body
		if (!userId || !displayName) {
			return res.status(400).json({
				error: 'Missing required fields',
				message: 'Both userId and displayName are required'
			});
		}

		console.log(`Creating place for user ${userId} (${displayName})...`);

		// Method 1: Using Roblox Open Cloud API (Recommended)
		// This creates a new place from a template
		let placeId;

		try {
			// Create a new place from the template
			// Note: This uses the Roblox Open Cloud API
			// You may need to adjust the endpoint based on the latest Roblox API documentation
			
			const createPlaceResponse = await axios.post(
				`${ROBLOX_OPEN_CLOUD_BASE_URL}/universes/v1/${ROBLOX_UNIVERSE_ID}/places`,
				{
					name: `${displayName}'s Personal Place`,
					description: `Personal place for ${displayName}`,
					basePlaceId: parseInt(TEMPLATE_PLACE_ID)
				},
				{
					headers: {
						'x-api-key': ROBLOX_API_KEY,
						'Content-Type': 'application/json'
					}
				}
			);

			placeId = createPlaceResponse.data.placeId;
			console.log(`Successfully created place ${placeId} for user ${userId}`);

		} catch (apiError) {
			console.error('Error creating place via Open Cloud API:', apiError.response?.data || apiError.message);
			
			// Fallback: If Open Cloud API doesn't work, you might need to use a different method
			// Alternative: Clone the template place using Roblox's internal APIs
			// This is a placeholder - you may need to adjust based on your Roblox API access
			
			if (apiError.response?.status === 401) {
				return res.status(500).json({
					error: 'Authentication failed',
					message: 'Invalid ROBLOX_API_KEY. Please check your API key configuration.'
				});
			}

			if (apiError.response?.status === 403) {
				return res.status(500).json({
					error: 'Permission denied',
					message: 'API key does not have permission to create places. Check your Roblox API key permissions.'
				});
			}

			// If the API structure is different, you might need to use this alternative approach:
			// For now, we'll return an error with instructions
			return res.status(500).json({
				error: 'Failed to create place',
				message: 'Place creation failed. Please check the API endpoint and your Roblox API key configuration.',
				details: apiError.response?.data || apiError.message
			});
		}

		// Return success response
		res.json({
			success: true,
			placeId: placeId,
			userId: userId,
			displayName: displayName
		});

	} catch (error) {
		console.error('Unexpected error in create_place:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: 'An unexpected error occurred while creating the place',
			details: error.message
		});
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	res.status(500).json({
		error: 'Internal server error',
		message: err.message
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Roblox Place Creator API running on port ${PORT}`);
	console.log(`📋 Template Place ID: ${TEMPLATE_PLACE_ID}`);
	console.log(`🔑 API Key configured: ${ROBLOX_API_KEY ? 'Yes' : 'No'}`);
	console.log(`🌐 Health check: http://localhost:${PORT}/health`);
	console.log(`📍 Create place endpoint: http://localhost:${PORT}/create_place`);
});


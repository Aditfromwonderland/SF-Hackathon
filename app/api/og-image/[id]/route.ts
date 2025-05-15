import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Document Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Guides"; // Or from an environment variable

// Configure route to use Edge runtime for @vercel/og
export const runtime = 'edge';

/**
 * Generates an Open Graph image for a specific guide
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the guide ID from the route parameters
    const { id } = params;

    if (!id) {
      return new Response('Guide ID is required', { status: 400 });
    }

    // Fetch the guide data from DynamoDB
    const command = new GetCommand({
      TableName: tableName,
      Key: { id }
    });

    const result = await docClient.send(command);

    // Check if the guide exists and has the required data
    if (!result.Item || !result.Item.userInput || !result.Item.userInput.name) {
      return new Response('Guide not found', { status: 404 });
    }

    const userName = result.Item.userInput.name;

    // Generate the Open Graph image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA93A 25%, #FFD93D 50%, #6BCB77 75%, #4D96FF 100%)',
            padding: '40px 20px',
          }}
        >
          {/* White container for content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              margin: '20px',
              width: '90%',
              height: '80%',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* App Logo/Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #FF6B6B, #4D96FF)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              Coffee-Chat Coach
            </div>

            {/* Divider */}
            <div
              style={{
                width: '80%',
                height: '4px',
                background: 'linear-gradient(90deg, #FFA93A, #6BCB77)',
                margin: '20px 0',
                borderRadius: '2px',
              }}
            />

            {/* Personalized Message */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'medium',
                color: '#333333',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              Your Personalized Networking Guide
            </div>

            {/* User Name */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#4D96FF',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              {userName}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: '24px',
                color: '#666666',
                marginTop: '30px',
                textAlign: 'center',
              }}
            >
              Unlock your networking potential today!
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response(`Failed to generate image: ${error.message}`, { status: 500 });
  }
}

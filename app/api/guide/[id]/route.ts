import { NextResponse } from "next/server";
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

/**
 * Handle GET requests to fetch a guide by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the guide ID from the route parameters
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Guide ID is required" },
        { status: 400 }
      );
    }

    // Create a GetCommand to fetch the item with the given ID
    const command = new GetCommand({
      TableName: tableName,
      Key: { id }
    });

    // Execute the GetCommand
    const result = await docClient.send(command);

    // Check if the item was found
    if (!result.Item) {
      return NextResponse.json(
        { message: "Guide not found" },
        { status: 404 }
      );
    }

    // Return the guide data
    return NextResponse.json(
      { guide: result.Item },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during the DynamoDB operation
    console.error("Error fetching guide:", error);
    return NextResponse.json(
      { message: "Failed to fetch guide" },
      { status: 500 }
    );
  }
}

/**
 * Handle all other HTTP methods with a 405 Method Not Allowed response
 */
export async function POST() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

/**
 * Helper function to return a 405 Method Not Allowed response
 */
function methodNotAllowed() {
  return NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405 }
  );
}

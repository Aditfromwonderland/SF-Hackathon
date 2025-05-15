import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import ClientNavButton from "@/components/ui/ClientNavButton";
import { FormData } from '../../../lib/schemas';

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

// Define types for the guide content structure
interface ActionableStep {
  title: string;
  description: string;
  iconName: string;
}

interface GuideContent {
  greeting: string;
  keyStrengths: string[];
  areasToFocus: string[];
  actionableSteps: ActionableStep[];
  conversationStarters: string[];
  closingRemark: string;
}

interface GuideData {
  id: string;
  userInput: FormData;
  guideContent: GuideContent;
  createdAt: string;
}

async function getGuideById(id: string): Promise<GuideData | null> {
  try {
    // Create a GetCommand to fetch the item with the given ID
    const command = new GetCommand({
      TableName: tableName,
      Key: { id }
    });

    // Execute the GetCommand
    const result = await docClient.send(command);

    // Check if the item was found
    if (!result.Item) {
      return null;
    }

    // Return the guide data
    return result.Item as GuideData;
  } catch (error) {
    console.error("Error fetching guide:", error);
    throw new Error(`Failed to fetch guide: ${error.message}`);
  }
}

// Generate dynamic metadata for the page
type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  // Fetch guide data
  const guideData = await getGuideById(id);

  if (!guideData) {
    // Return default metadata if guide not found
    return {
      title: "Guide Not Found - Coffee-Chat Coach",
      description: "The requested guide could not be found.",
    };
  }

  const userName = guideData.userInput.name;
  const pageTitle = `${userName}'s Networking Guide - Coffee-Chat Coach`;
  const description = `Personalized networking advice for ${userName} from Coffee-Chat Coach.`;
  const ogImageUrl = `/api/og-image/${id}`; // URL to the OG image generation route

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      type: 'article',
      url: `/guide/${id}`, // Canonical URL to this page
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Social preview for ${userName}'s networking guide`,
        },
      ],
      siteName: 'Coffee-Chat Coach',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default async function GuidePage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // Fetch the guide data
  let guideData: GuideData | null;
  
  try {
    guideData = await getGuideById(id);
    
    if (!guideData) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching guide:", error);
    
    // Return an error UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-[#FF6B6B] mb-4">Oops!</h1>
          <p className="text-gray-700 mb-6">Failed to load guide. Please try again later.</p>
          <ClientNavButton 
            targetPath="/" 
            buttonText="Return to Home" 
            className="px-4 py-2 bg-gradient-to-r from-[#4D96FF] to-[#6BCB77] text-white rounded-md hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    );
  }

  const { guideContent } = guideData;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl bg-gradient-to-r from-[#FF6B6B] to-[#4D96FF] bg-clip-text text-transparent">
            Coffee-Chat Coach
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your Personalized Networking Guide
          </p>
        </div>

        {/* Guide Content */}
        <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
          {/* Greeting */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-[#FFD93D]/10 to-[#FFA93A]/10">
            <h2 className="text-3xl font-bold text-gray-800">
              {guideContent.greeting}
            </h2>
          </div>

          {/* Key Strengths */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-[#6BCB77] mb-4">
              Your Key Strengths
            </h3>
            <ul className="space-y-2">
              {guideContent.keyStrengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#6BCB77] font-bold mr-2">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Focus */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-[#4D96FF] mb-4">
              Areas to Focus On
            </h3>
            <ul className="space-y-2">
              {guideContent.areasToFocus.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4D96FF] font-bold mr-2">•</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Steps */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Your Action Plan
            </h3>
            <div className="space-y-6">
              {guideContent.actionableSteps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 mt-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFA93A]/20 text-orange-700">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                    <p className="text-xs text-gray-600 mt-1">Icon: {step.iconName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Starters */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-[#FF6B6B] mb-4">
              Conversation Starters
            </h3>
            <ul className="space-y-3">
              {guideContent.conversationStarters.map((starter, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-gray-700">"{starter}"</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Remark */}
          <div className="px-6 py-8 bg-gradient-to-r from-[#4D96FF]/10 to-[#6BCB77]/10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Final Thoughts
            </h3>
            <p className="text-gray-700 italic">
              {guideContent.closingRemark}
            </p>
          </div>
        </div>

        {/* Footer with return button */}
        <div className="mt-8 text-center">
          <ClientNavButton
            targetPath="/"
            buttonText="Create Another Guide"
            className="px-6 py-3 bg-gradient-to-r from-[#FFA93A] to-[#FF6B6B] text-slate-900 rounded-md hover:from-[#FF6B6B] hover:to-[#FFA93A] transition-all duration-300 shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { accessToken , presentationId, content } = req.body;

        if (!accessToken) {
        return res.status(400).json({ error: 'Access Token is required' });
        }

        // Set up Google Slides and Drive API
        const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
        );

        auth.setCredentials({
        access_token: accessToken,
        });

        const slides = google.slides({ version: 'v1', auth });

        if (!presentationId) {
        throw new Error('Failed to update presentation: No presentation ID returned');
        }
        
        // const presentationContent = await callOpenAI(systemPrompt, userPrompt);
        
        const requests = [
            {
                createSlide: {
                    insertionIndex: 1,
                    slideLayoutReference: {
                        predefinedLayout: 'TITLE_AND_TWO_COLUMNS'
                    }
                }
            },
            // {
            //     insertText: {
            //         objectId: 'myTextBoxId01', // This needs to be a valid page element ID
            //         text: content,
            //         insertionIndex: 0
            //     }
            // }
        ];
        
        const batchUpdateResponse = await slides.presentations.batchUpdate({
            presentationId: presentationId,
            requestBody: {
                requests: requests
            }
        });
        console.log('Batch update response:', batchUpdateResponse);

        res.status(200).json({
            message: 'Presentation updated successfully!',
            presentationId: presentationId,
        });

    } catch (error) {
        console.error('Error creating presentation:', error);
        res.status(500).json({ error: 'Failed to create presentation' });
    }

}
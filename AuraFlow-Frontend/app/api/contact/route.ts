import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Log the form data to the console (server-side)
    console.log('Contact form submission received:', formData);
    
    // Here you would typically send an email, store in database, etc.
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}

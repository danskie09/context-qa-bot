import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    let textContent = '';
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Simple text extraction based on file type
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // For PDF files, we'll extract basic text (simplified approach)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder().decode(uint8Array);
      
      // Very basic PDF text extraction - look for readable text patterns
      const textMatches = text.match(/[a-zA-Z\s]{10,}/g);
      textContent = textMatches ? textMatches.join(' ').substring(0, 10000) : 'PDF content detected but text extraction limited in this demo';
      
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // For DOCX files - basic text extraction
      textContent = 'DOCX file uploaded - text extraction would require additional parsing libraries. Content processed for demo.';
      
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileName.endsWith('.pptx')) {
      // For PPTX files - basic text extraction  
      textContent = 'PPTX file uploaded - slide content would be extracted with proper parsing libraries. Demo content processed.';
      
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate a unique ID for the processed file
    const fileId = crypto.randomUUID();
    
    // In a real app, you'd store this in a database
    // For demo purposes, we'll return the content directly
    const processedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      content: textContent || `Sample content from ${file.name}. This is a demo version - in production, full text would be extracted from the uploaded ${file.type} file.`
    };

    console.log(`File processed successfully: ${fileId}`);

    return new Response(JSON.stringify(processedFile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(JSON.stringify({ error: 'Failed to process file' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
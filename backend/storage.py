import os
import requests
import mimetypes

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://cxqckevpzdktkxgqykka.supabase.co")
# Fallback to local testing value if not in env but required in production
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cWNrZXZwemRrdGt4Z3F5a2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzA3NTcsImV4cCI6MjA5MTE0Njc1N30.oliT4_rdRUR-cVrQtCR_lqMNu14hddtCZNOQmqSPHMU")
BUCKET_NAME = "wave-uploads"

def upload_file_to_supabase(file_obj, destination_path):
    """
    Uploads a file to Supabase Storage using the REST API.
    
    Args:
        file_obj: Local file path OR a FileStorage object from Flask.
        destination_path: The path in the bucket (e.g. 'avatars/123.jpg')
    Returns:
        public_url (str): The public URL of the uploaded file on success.
        None: On failure.
    """
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{destination_path}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
    }

    try:
        # Determine content type
        content_type = "application/octet-stream"
        if hasattr(file_obj, 'filename'): # Flask FileStorage
            content_type = file_obj.content_type
            file_data = file_obj.read()
            file_obj.seek(0) # reset for good measure
        elif isinstance(file_obj, str): # Local file path
            mime_guess, _ = mimetypes.guess_type(file_obj)
            if mime_guess:
                content_type = mime_guess
            with open(file_obj, 'rb') as f:
                file_data = f.read()
        else:
             file_data = file_obj.read()
        
        headers["Content-Type"] = content_type

        response = requests.post(url, headers=headers, data=file_data)
        
        if response.status_code in [200, 201]:
            # Construct public URL
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{destination_path}"
            return public_url
        else:
            print(f"Supabase Upload Failed: {response.text}")
            # Try to save locally as fallback if Supabase fails (e.g. key issue)
            return None
    except Exception as e:
        print(f"Exception during Supabase upload: {e}")
        return None

# 3D Gaussian Splatting Walkthrough Integration

This component integrates photorealistic 3D virtual walkthroughs into your project detail overlays using Luma AI.

## How to add a new 3D Walkthrough:

1. **Capture Site Video**: 
   Download the Luma AI mobile app (iOS or Android). Record a slow, steady 1-minute video circling your building or room.
2. **Process Scan**: 
   Upload it as an "Interactive Scene" inside the Luma AI app and wait for it to process.
3. **Get the Embed Code**:
   - Go to Luma AI web portal, find your scan.
   - Click **Share / Embed**.
   - Copy the share URL (e.g., `https://lumalabs.ai/embed/your-capture-id`).
4. **Update `embeds.json`**:
   - Open [embeds.json](file:///d:/anti%20gravity/Construction%20Builder/src/components/ThreeDWalkthrough/embeds.json).
   - Find the project by its ID (e.g., `contemporary-bungalow`).
   - Paste your URL into `embedUrl` field.
   
```json
"contemporary-bungalow": {
  "embedUrl": "https://lumalabs.ai/embed/your-new-capture-id",
  "projectName": "HMS Colony"
}
```

The website will automatically detect the new URL and render the fully interactive 3D flythrough scene in the project's modal window!

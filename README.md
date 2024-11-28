# 3D Horse Viewer

An interactive 3D horse model built with Three.js.

## Requirements

- Web browser with WebGL support
- Local web server (multiple options available)

## Running the Application

The easiest way to run the application is using the provided start script:

```bash
# Make the script executable
chmod +x start.sh
# Run the script
./start.sh
```

Alternatively, you can run the server manually using one of these methods:

1. Using Node.js http-server (if installed):
```bash
npx http-server . -p 8080
```

2. Using Python's built-in server (Python 3):
```bash
python -m http.server 8080
```

3. Using any static file server pointing to this directory

## Testing the Setup

1. First, open status.html in your browser to check if all dependencies are loading correctly:
```
http://localhost:8080/status.html
```

2. Then open the main application:
```
http://localhost:8080/
```

## Controls

- Left Click + Drag: Rotate view
- Right Click + Drag: Pan view
- Scroll: Zoom in/out

## Quick Start Commands

Using npm:
```bash
npm install    # Install dependencies
npm start      # Start the server
npm run check  # Open the status page
npm run open   # Open the main application
```

## Troubleshooting

If you see any errors or blank screen:

1. Check status.html first to verify all dependencies are loading
2. Ensure your browser supports WebGL
3. Check the browser's console for detailed error messages
4. Make sure all files are being served with correct MIME types

## Files

- index.html: Main application
- horse.js: 3D horse implementation
- status.html: Dependency checker
- .server-config.json: Server configuration

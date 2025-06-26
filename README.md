# Learning Guide: A Local Video Bookmarking App

A simple, robust, and cross-platform application for scanning local video courses and tracking your progress. This tool is designed for anyone with a collection of video tutorials on their machine who wants a clean interface to manage what they're watching.

The application runs entirely on your local machine and requires no internet connection. All data is stored locally in your browser.

## Features

-   **Multi-Directory Scanning**: Scans multiple course directories and combines them into a single, unified library.
-   **Natural Sorting**: Intelligently sorts your courses and videos in a natural, numerical order (e.g., `1, 2, ..., 10, 11`).
-   **Robust Local Server**: Includes a custom Python server that correctly handles all file types and special characters in paths, avoiding common MIME type and `FileNotFound` errors.
-   **Progress Tracking**: For each video, you can track:
    -   Timestamp Bookmarks
    -   Status (To Watch, Watching, Completed)
    -   Notes
-   **Auto-Completion**: Automatically marks a video as "Completed" when it finishes.
-   **GNOME Desktop Integration**: Includes a `.desktop` file and launcher script for easy launching from the GNOME applications menu.
-   **Cross-Browser Compatibility**: Designed to work reliably across different web browsers.

## How It Works

The project uses a two-script system for a clean and reliable setup:

1.  **`setup.py`**: This is a one-time setup script. It creates a dedicated application directory (`video-bookmarker-app`) and copies all the necessary web application files (`index.html`, `style.css`, `app.js`, etc.) and creates symbolic links to your course directories. This keeps the application self-contained and avoids issues with file paths.

2.  **`scanner.py`**: This script scans the symbolically linked course directories inside the `video-bookmarker-app` and generates the `videos.js` file, which contains the complete, sorted list of your videos.

## Setup and Installation

Follow these steps to get the application running.

### Step 1: One-Time Setup

Open a terminal in the `video-bookmarker` directory (this directory) and run the `setup.py` script. You need to provide two things:
1. The full path where you want the application to be created (e.g., `/home/amilgaul/video-bookmarker-app`).
2. The full paths to all of your video course directories.

**Example Command:**
```bash
python video-bookmarker/setup.py "/home/amilgaul/video-bookmarker-app" "/path/to/your/first/course_dir" "/path/to/your/second/course_dir"
```

### Step 2: Scan for Videos

After the setup is complete, run the `scanner.py` script to generate your video list. The command is the same as above, but you run the `scanner.py` script instead.

**Example Command:**
```bash
python video-bookmarker/scanner.py "/home/amilgaul/video-bookmarker-app" "/path/to/your/first/course_dir" "/path/to/your/second/course_dir"
```
*(You only need to re-run this step if you add or remove videos from your courses.)*

### Step 3: Install the Desktop Shortcut (Optional)

For easy access, install the "Learning Guide" shortcut to your GNOME applications menu.

1.  **Copy the `.desktop` file:**
    ```bash
    cp "/home/amilgaul/video-bookmarker-app/learning-guide.desktop" ~/.local/share/applications/
    ```
2.  **Update the desktop database:**
    ```bash
    update-desktop-database ~/.local/share/applications
    ```

## Usage

You can now launch the "Learning Guide" from your applications menu. This will automatically start the local server and open the application in your browser.

Alternatively, you can run it manually:
```bash
/home/amilgaul/video-bookmarker-app/launch.sh
```

## Author

-   **ravi sai vigneswara**

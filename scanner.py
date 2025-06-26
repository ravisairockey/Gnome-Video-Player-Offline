import os
import json
import sys
import re
import shutil

def natural_sort_key(s):
    """A key for natural sorting."""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'([0-9]+)', s)]

def scan_videos(app_dir, course_dirs):
    video_files = []
    all_mp4_files = []

    for course_dir in course_dirs:
        for dirpath, _, filenames in os.walk(course_dir):
            for filename in filenames:
                if filename.endswith('.mp4'):
                    all_mp4_files.append(os.path.join(dirpath, filename))

    all_mp4_files.sort(key=natural_sort_key)

    for full_path in all_mp4_files:
        # The path should be relative to the app_dir, using the symlink name
        containing_course_dir = next((cd for cd in course_dirs if full_path.startswith(cd)), None)
        if containing_course_dir:
            course_basename = os.path.basename(containing_course_dir)
            path_inside_course = os.path.relpath(full_path, containing_course_dir)
            relative_path = os.path.join(course_basename, path_inside_course)
            
            title = os.path.splitext(os.path.basename(full_path))[0]
            course = os.path.basename(os.path.dirname(full_path))

            video_files.append({
                'title': title,
                'path': relative_path,
                'course': course
            })
    return video_files

def main():
    print("--- Video List Generator ---")
    
    if len(sys.argv) < 3:
        print("Usage: python scanner.py <path_to_app_dir> <path_to_course_dir_1> [path_to_course_dir_2] ...")
        exit()

    app_dir = sys.argv[1]
    course_dirs = sys.argv[2:]

    print(f"Scanning for .mp4 files in: {', '.join(course_dirs)}")
    videos = scan_videos(app_dir, course_dirs)

    if not videos:
        print("No .mp4 files found.")
        return

    js_path = os.path.join(app_dir, 'videos.js')
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write('var videos = ' + json.dumps(videos, indent=4) + ';')

    print(f"\nSuccess! Scanned {len(videos)} videos.")
    print(f"Video list has been saved to '{js_path}'")

if __name__ == '__main__':
    main()

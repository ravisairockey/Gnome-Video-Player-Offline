import os
import sys
import shutil

def main():
    print("--- Application Setup ---")
    
    if len(sys.argv) < 3:
        print("Usage: python setup.py <path_to_app_dir> <path_to_course_dir_1> [path_to_course_dir_2] ...")
        exit()

    app_dir = sys.argv[1]
    course_dirs = sys.argv[2:]

    # Create app directory
    if not os.path.exists(app_dir):
        os.makedirs(app_dir)
    
    # Create symbolic links
    for course_dir in course_dirs:
        if os.path.isdir(course_dir):
            link_name = os.path.basename(course_dir)
            link_path = os.path.join(app_dir, link_name)
            if not os.path.lexists(link_path):
                os.symlink(course_dir, link_path)
                print(f"Created symlink: {link_path} -> {course_dir}")
        else:
            print(f"Warning: Course directory not found at '{course_dir}'")

    # Copy application files
    source_dir = os.path.dirname(os.path.abspath(__file__))
    files_to_copy = ['index.html', 'style.css', 'app.js', 'server.py', 'launch.sh', 'learning-guide.desktop']
    for filename in files_to_copy:
        shutil.copy(os.path.join(source_dir, filename), app_dir)

    # Make launch script executable
    os.chmod(os.path.join(app_dir, 'launch.sh'), 0o755)

    print("\n--- Setup Complete ---")
    print(f"Application has been set up in: {app_dir}")
    print("Please run the scanner to generate the video list:")
    print(f"python {os.path.join(app_dir, 'scanner.py')} {app_dir} {' '.join([f'\"{d}\"' for d in course_dirs])}")

if __name__ == '__main__':
    main()

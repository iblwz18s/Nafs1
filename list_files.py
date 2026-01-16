import os
import json

root_dir = 'Nafs1'
text_extensions = {'.ts', '.tsx', '.js', '.json', '.css', '.html', '.md', '.toml', '.sql', '.txt', '.gitignore', '.env'}
files_to_push = []
total_size = 0

if not os.path.exists(root_dir):
    with open('files.json', 'w') as f:
        json.dump({'error': 'Directory not found'}, f)
    exit(1)

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        ext = os.path.splitext(file)[1]
        if ext in text_extensions or file == '.env' or file == '.gitignore':
             path = os.path.join(subdir, file).replace('\\', '/')
             try:
                 size = os.path.getsize(path)
                 with open(path, 'r', encoding='utf-8') as f:
                     content = f.read()
                 files_to_push.append({'path': path, 'content': content})
                 total_size += size
             except Exception as e:
                 pass

with open('files.json', 'w', encoding='utf-8') as f:
    json.dump({'count': len(files_to_push), 'total_size': total_size, 'files': files_to_push}, f, indent=2)

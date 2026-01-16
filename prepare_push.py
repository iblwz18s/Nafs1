import os
import json

root_dir = 'Nafs1'
# Allowed text extensions
extensions = {
    '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', 
    '.md', '.txt', '.gitignore', '.svg', '.lockb' # excluding lockb normally binary but often treated specially, actually let's skip lockb/lock for now to be safe if binary
}
skip_files = {'package-lock.json', 'bun.lockb', 'pnpm-lock.yaml'} 
# We might skip big lock files to avoid payload size limits if they are huge.

files_data = []

for subdir, dirs, files in os.walk(root_dir):
    # Exclude directories
    dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', 'dist'}]
    
    for file in files:
        if file in skip_files:
            continue
            
        ext = os.path.splitext(file)[1].lower()
        if ext in extensions or file == '.gitignore':
            # Relative path for the repo
            full_path = os.path.join(subdir, file)
            rel_path = os.path.relpath(full_path, root_dir).replace('\\', '/')
            
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                files_data.append({
                    "path": rel_path,
                    "content": content
                })
            except Exception as e:
                print(f"Skipping {rel_path}: {e}")

batch_size = 10
for i in range(0, len(files_data), batch_size):
    batch = files_data[i:i + batch_size]
    batch_file = f'push_batch_{i//batch_size}.json'
    with open(batch_file, 'w', encoding='utf-8') as f:
        json.dump(batch, f, ensure_ascii=False, indent=2)
    print(f"Created {batch_file} with {len(batch)} files")

print(f"Total files: {len(files_data)}")

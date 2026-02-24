#!/bin/bash
# Fix Claude plugin installPaths for devcontainer
CONFIG_DIR="/home/node/.claude"

# Paths that may need remapping to the devcontainer home
OLD_PATHS=('/Users/pallan/\.claude' '/home/vscode/\.claude')

# Patch top-level config files
for file in "$CONFIG_DIR/claude.json" "$CONFIG_DIR/marketplace.json"; do
  if [ -f "$file" ]; then
    for old_path in "${OLD_PATHS[@]}"; do
      if grep -q "${old_path//\\/}" "$file"; then
        sed -i "s|${old_path}|/home/node/.claude|g" "$file"
        echo "Patched $old_path in: $file"
      fi
    done
  fi
done

# Patch any JSON files in plugins subdirectories
find "$CONFIG_DIR/plugins" -name "*.json" 2>/dev/null | while read file; do
  for old_path in "${OLD_PATHS[@]}"; do
    if grep -q "${old_path//\\/}" "$file"; then
      sed -i "s|${old_path}|/home/node/.claude|g" "$file"
      echo "Patched $old_path in: $file"
    fi
  done
done

# Remove orphaned markers from installed plugins
find "$CONFIG_DIR/plugins/cache" -name ".orphaned_at" 2>/dev/null -exec rm -v {} \;

echo "Done patching Claude plugin paths"

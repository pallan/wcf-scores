FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Pre-create ~/.claude with correct ownership so file-level bind mounts don't create it as root
RUN mkdir -p /home/node/.claude/commands /home/node/.claude/projects \
    && touch /home/node/.claude/.credentials.json /home/node/.claude/settings.json \
    && chown -R node:node /home/node/.claude

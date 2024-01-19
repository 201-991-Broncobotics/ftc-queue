dev:
  bun --bun dev

studio: 
  bun drizzle-kit studio --config drizzle.dev.config.json

push-sqlite:
  bun drizzle-kit push:sqlite  --config drizzle.dev.config.json


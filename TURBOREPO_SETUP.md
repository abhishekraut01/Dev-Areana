# Turborepo Setup - Production Best Practices

This project follows production-grade Turborepo best practices for TypeScript monorepo development.

## Project Structure

```
dev-areana/
├── apps/
│   ├── backend/          # Express.js backend (ESM + TypeScript)
│   └── web/              # Next.js frontend
└── packages/
    ├── db/               # Prisma database package
    ├── utils/            # Shared utility functions
    ├── validations/      # Zod validation schemas
    ├── typescript-config/# Shared TypeScript configs
    ├── eslint-config/    # Shared ESLint configs
    └── ui/               # Shared UI components
```

## Key Configuration Decisions

### 1. Package Exports Strategy
All internal packages (`@repo/utils`, `@repo/db`, `@repo/validations`) are configured to:
- **Export compiled JavaScript** (`dist/**/*.js`) instead of raw TypeScript
- Use proper ESM exports with type definitions
- Follow Node.js module resolution standards

**Why?** Node.js cannot execute TypeScript files directly. Packages must be built to JavaScript.

### 2. Development Workflow

#### For Packages:
```bash
# Build all packages once
pnpm run build

# Or build specific package
pnpm --filter "@repo/utils" build
```

Packages compile TypeScript to JavaScript in their `dist/` directories.

#### For Backend App:
```bash
# Development mode with hot reload
pnpm --filter "@repo/backend" dev
```

The backend uses `tsx watch` which:
- Runs TypeScript directly without pre-compilation
- Watches for file changes and auto-reloads
- Imports the **pre-built** package dist files

#### For Frontend App:
```bash
# Development mode
pnpm --filter "web" dev
```

Next.js handles TypeScript compilation automatically.

### 3. TypeScript Configuration

#### Base Config (`packages/typescript-config/base.json`)
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true
  }
}
```

#### Package Configs
All packages extend the base and add:
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Why NodeNext?** It's the modern standard for Node.js ESM projects and ensures proper module resolution.

### 4. Import Extensions

**Critical:** All relative imports in TypeScript files MUST use `.js` extensions:

```typescript
// ✅ Correct
import { resend } from './resend.js';

// ❌ Wrong
import { resend } from './resend';
```

**Why?** With `moduleResolution: "NodeNext"`, TypeScript enforces explicit file extensions for ESM compatibility.

### 5. Package.json Configuration

#### Internal Packages:
```json
{
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

#### Backend App:
```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 6. Turborepo Pipeline

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- `build` depends on upstream packages being built first (`^build`)
- `dev` tasks are persistent (long-running processes)
- Packages don't have `dev` scripts to avoid circular dependencies

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run everything in dev mode
pnpm run dev

# Lint
pnpm run lint

# Type check
pnpm run check-types

# Build for production
pnpm run build

# Run backend in production
pnpm --filter "@repo/backend" start
```

## Development Workflow

1. **First time setup:**
   ```bash
   pnpm install
   pnpm run build  # Build all packages
   ```

2. **Daily development:**
   ```bash
   pnpm run dev  # Starts all apps
   ```

3. **After changing package code:**
   ```bash
   # Rebuild the specific package
   pnpm --filter "@repo/utils" build
   
   # Backend will auto-reload with tsx watch
   ```

4. **Production build:**
   ```bash
   pnpm run build
   ```

## Best Practices

### ✅ Do:
- Always build packages before running apps
- Use `.js` extensions in relative imports
- Keep package exports focused and explicit
- Use `tsx` for development, `tsc` + `node` for production
- Follow ESM standards (`type: "module"`)

### ❌ Don't:
- Don't export raw TypeScript files from packages
- Don't use `moduleResolution: "bundler"` in Node.js packages
- Don't forget to rebuild packages after changes
- Don't omit `.js` extensions in relative imports
- Don't mix CommonJS and ESM

## Troubleshooting

### Error: `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".ts"`
**Cause:** Node.js is trying to import a `.ts` file directly.

**Solution:** Build the package first:
```bash
pnpm --filter "@repo/package-name" build
```

### Error: `Relative import paths need explicit file extensions`
**Cause:** Missing `.js` extension on relative import.

**Solution:** Add `.js` to the import:
```typescript
import { foo } from './bar.js';  // ✅
```

### Error: `persistent task cannot depend on it`
**Cause:** Package has a `dev` script that conflicts with app dev dependencies.

**Solution:** Remove `dev` scripts from packages. Only apps should have persistent dev tasks.

## Additional Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Node.js ESM](https://nodejs.org/api/esm.html)

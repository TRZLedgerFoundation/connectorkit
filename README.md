# Arc

Arc is a modular React development kit for building modern Solana applications. 

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: 9.12.3 or higher (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/arc.git
   cd arc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## 📦 Available Packages

This monorepo contains several packages:

- **@arc/solana** - React hooks for Solana development
- **@arc/connector-kit** - Wallet connector and context
- **@arc/providers** - Provider templates and configurations
- **@arc/jupiter** - Jupiter DEX integration
- **@arc/ui-primitives** - Primitive UI components

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm test             # Run tests across all packages
pnpm lint             # Lint all code
pnpm type-check       # Run TypeScript type checking
pnpm format           # Format code with Biome

# Package management
pnpm changeset        # Create a changeset for releases
pnpm version-packages # Version packages based on changesets
pnpm release          # Build and publish packages
```

### Development Workflow

1. **Start the docs site** (includes all examples and demos)
   ```bash
   cd apps/docs
   pnpm dev
   ```
   Visit http://localhost:3000 to see the documentation and interactive examples.

2. **Work on a specific package**
   ```bash
   cd packages/solana
   pnpm dev    # Start development mode
   pnpm test   # Run tests
   ```

3. **Build everything**
   ```bash
   pnpm build  # From root - builds all packages
   ```

## 🏗️ Project Structure

```
arc/
├── apps/
│   └── docs/              # Documentation site with examples
├── packages/
│   ├── solana/            # Core Solana React hooks
│   ├── connector-kit/     # Wallet connection components
│   ├── providers/         # Provider configurations
│   ├── jupiter/           # Jupiter DEX integration
│   └── ui-primitives/     # Base UI components
├── examples/              # Example applications
└── tools/                 # Development tools and configs
```

## 📚 Documentation

The documentation site includes:

- **Interactive examples** for all hooks
- **API documentation** with TypeScript definitions
- **Copy-paste code samples** for quick implementation
- **Live demos** of wallet connections and transactions

Visit the [documentation](./apps/docs) for detailed guides and examples.

## 🔧 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/solana
pnpm test

# Run tests in watch mode
pnpm test --watch
```

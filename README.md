# Mamba Kick - Precision Physics Game

[![Build Status](https://img.shields.io/github/actions/workflow/status/mamba-kick/mamba-kick/deploy.yml?branch=main)](https://github.com/mamba-kick/mamba-kick/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/mamba-kick/mamba-kick/main.svg)](https://codecov.io/gh/mamba-kick/mamba-kick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/mamba-kick/mamba-kick)](https://github.com/mamba-kick/mamba-kick/releases)

A precision-based physics game where players strategically destroy blocks using calculated shots. Built with Phaser 3 and TypeScript.

**Based on [Phaser Vite TypeScript Template](https://github.com/phaserjs/template-vite)**

### Technology Stack
- [Phaser 3.90.0](https://github.com/phaserjs/phaser) - Game framework
- [Vite 6.3.1](https://github.com/vitejs/vite) - Build tool
- [TypeScript 5.7.2](https://github.com/microsoft/TypeScript) - Type safety
- [Matter.js](https://brm.io/matter-js/) - Physics engine
- [Neon Database](https://neon.tech) - Cloud database

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run dev-nolog` | Launch a development web server without sending anonymous data (see "About log.js" below) |
| `npm run build-nolog` | Create a production build in the `dist` folder without sending anonymous data (see "About log.js" below) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the Vite documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.

## Template Project Structure

We have provided a default project structure to get you started. This is as follows:

## 🎮 Game Overview

Mamba Kick is a physics-driven puzzle game that challenges players to clear levels by strategically destroying blocks with precise shots. The game combines realistic physics simulation with strategic gameplay mechanics.

### Key Features
- **Realistic Physics**: Powered by Matter.js for authentic collision detection and force calculations
- **Strategic Gameplay**: Multiple block types with unique destruction mechanics
- **Progressive Difficulty**: 50+ levels with increasing complexity
- **Performance Optimized**: 60 FPS target across all devices
- **Cross-Platform**: Playable on desktop and mobile browsers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/mamba-kick/mamba-kick.git
cd mamba-kick

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:8080
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Run tests
npm test

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 📁 Project Structure

```
mamba-kick/
├── src/
│   ├── game/
│   │   ├── systems/           # Core game systems
│   │   │   ├── InputSystem.ts    # Input handling and validation
│   │   │   ├── ShotSystem.ts     # Shot mechanics and physics
│   │   │   ├── AimSystem.ts      # Aiming and targeting
│   │   │   ├── BlockSystem.ts    # Block management and destruction
│   │   │   ├── PhysicsManager.ts # Physics configuration
│   │   │   ├── ParticleSystem.ts # Visual effects
│   │   │   ├── LevelService.ts   # Level loading and progression
│   │   │   └── SaveService.ts    # Save/load functionality
│   │   ├── entities/          # Game entities
│   │   ├── scenes/            # Phaser scenes
│   │   └── config/            # Game configuration
│   ├── ui/                  # User interface components
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
├── docs/                    # Documentation
├── tests/                   # Test files
├── public/                  # Static assets
└── dist/                    # Build output
```

## 🏗️ Architecture

### Core Systems

#### Input System (`src/game/systems/InputSystem.ts`)
Handles all player input with advanced features:
- **Input buffering** for responsive controls
- **Cooldown system** to prevent spam
- **Validation** for edge cases
- **Mobile support** for touch devices

#### Shot System (`src/game/systems/ShotSystem.ts`)
Manages shot mechanics and physics:
- **Force calculation** based on charge time
- **Trajectory prediction** for aiming
- **Collision detection** with blocks
- **Physics integration** with Matter.js

#### Block System (`src/game/systems/BlockSystem.ts`)
Handles block lifecycle and destruction:
- **Multiple block types** (normal, multiplier, explosive)
- **Destruction thresholds** based on force
- **Particle effects** on destruction
- **Score calculation** and updates

#### Physics Manager (`src/game/systems/PhysicsManager.ts`)
Configures and manages physics simulation:
- **Matter.js integration** for realistic physics
- **Performance optimization** settings
- **Collision filtering** for efficiency
- **Debug mode** for development

## 🧪 Development

### Development Setup

```bash
# Install development dependencies
npm install --include=dev

# Start development server with hot reload
npm run dev

# Run in debug mode
npm run dev:debug

# Run with physics debug visualization
npm run dev:physics-debug
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | Run TypeScript checks |
| `npm run analyze` | Bundle size analysis |

### Testing

#### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testNamePattern="InputSystem"

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🎯 Game Mechanics

### Block Types

| Type | Health | Points | Special Effect |
|------|--------|----------|----------------|
| **Normal** | 50 | 10 | Standard destruction |
| **Multiplier** | 100 | 50 | 2x score multiplier |
| **Explosive** | 75 | 25 | Destroys nearby blocks |
| **Indestructible** | ∞ | 0 | Cannot be destroyed |

### Scoring System
- **Base points**: 10 per block
- **Combo multiplier**: +10% per consecutive block
- **Accuracy bonus**: +25% for precise shots
- **Time bonus**: Up to +50% for fast completion

## 📊 Performance

### Targets
- **60 FPS** on desktop
- **30 FPS** on mobile
- **<100ms** input response time
- **<50MB** memory usage

## 📋 Documentation

### Available Documentation
- **[Technical Guide](docs/technical_implementation_guide.md)** - Implementation details
- **[Testing Protocol](docs/testing_protocol.md)** - Testing procedures
- **[Deployment Guide](docs/deployment_guide.md)** - Deployment procedures
- **[Troubleshooting Guide](docs/troubleshooting_guide.md)** - Common issues and solutions
- **[Development Checklist](docs/development_checklist.md)** - Development milestones
- **[API Reference](docs/api_reference.md)** - API documentation

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript** with strict mode enabled
- **ESLint** configuration with Prettier
- **Conventional commits** for clear history
- **Unit tests** for all new features
- **Documentation** for complex systems

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Phaser.js** - Game framework
- **Matter.js** - Physics engine
- **TypeScript** - Type safety
- **Neon Database** - Cloud database
- **Phaser Studio** - Original template

---

**Made with ❤️ by the Mamba Kick Team**

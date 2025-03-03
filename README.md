<img src="./public/logo.png" alt="Project Logo" width="auto">

# Modular A.I. for Design and Innovation

[![npm version](https://badge.fury.io/js/madi.svg)](https://badge.fury.io/js/madi)
[![License](https://img.shields.io/npm/l/madi.svg)](https://github.com/nasa-madi/nx/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/nasa-madi/nx/publish.yml?branch=main)](https://github.com/nasa-madi/nx/actions)
[![codecov](https://codecov.io/gh/nasa-madi/nx/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/yourusername/madi)
[![NPM downloads](https://img.shields.io/npm/dm/madi.svg)](https://www.npmjs.com/package/madi)
[![Dependency Status](https://img.shields.io/librariesio/release/NPM/madi)]()
[![Node.js Version](https://img.shields.io/node/v/madi.svg)](https://nodejs.org/en/)


## Table of Contents
- [Quick Reference](#quick-reference)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Global Commands](#global-commands)
  - [App Specific Commands](#app-specific-commands)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)



## Quick Reference

### Prerequisites
- **Node.js**: v20.9.0+
- **pnpm**: Install globally with `npm install -g pnpm`

### Setup
- **Install Dependencies**: `pnpm install`

### Global Commands
- **Dev Stack**: `pnpm dev` - Spin up the entire development stack.
- **Lint All**: `pnpm lint` - Lint the entire repository.
- **Build All**: `pnpm build` - Build all applications as necessary.
- **Test All**: `pnpm test` - Run all local tests.
- **E2E Tests**: `pnpm e2e` - Run end-to-end tests via Docker Compose.

---

### App Specific Commands

#### API (FeathersJS-based) - `apps/api/`
- **Dev Server**: `pnpm dev`
- **Migrate DB**: `pnpm migrate`
- **Format Code**: `pnpm prettier`
- **Run Tests**: `pnpm mocha`

#### Web Interface (Next.js-based) - `apps/interfaces/web/`
- **Dev Server**: `pnpm dev`
- **Build**: `pnpm build`
- **Start Prod**: `pnpm start`
- **Lint**: `pnpm lint`
- **E2E Tests**: `pnpm test:e2e`

---






## Troubleshooting

If you encounter issues, try the following:
1. Ensure all prerequisites are met.
2. Check for error messages and consult the [FAQ](https://github.com/nasa-mad/nx/wiki/FAQ).

## Contributing

Please see [CONTRIBUTING.md](https://github.com/nasa-mad/nx/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nasa-mad/nx/blob/main/LICENSE) file for details.

## Acknowledgments

- Acknowledge any libraries or tools used.
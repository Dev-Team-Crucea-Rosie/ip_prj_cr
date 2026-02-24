# ip_prj_cr

## Setup Guide - Getting Started

This guide will help you set up the project on your local machine with the correct dependencies and versions to ensure consistency across the team.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

1. **Node.js** (v18 or higher recommended)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Step-by-Step Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/Dev-Team-Crucea-Rosie/ip_prj_cr.git
cd ip_prj_cr
```

#### 2. Install Client Dependencies

The client is a React + Vite application with TypeScript.

```bash
cd client
npm install
```

This will install all dependencies with the exact versions specified in `package-lock.json`, ensuring everyone has the same versions.

#### 3. Install Server Dependencies

The server is a Node.js Express application.

```bash
cd ../server
npm install
```

This will install all dependencies with the exact versions specified in `package-lock.json`.

#### 4. Running the Application

##### Start the Server

From the `server` directory:

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start
```

The server will start on the port specified in your environment variables (default configuration may vary).

##### Start the Client

Open a new terminal window and navigate to the `client` directory:

```bash
cd client
npm run dev
```

The client development server will start (typically on `http://localhost:5173`).

#### 5. Environment Configuration

If the project requires environment variables:

1. Check if there's a `.env.example` file in the server directory
2. Create a `.env` file in the `server` directory
3. Copy the contents from `.env.example` and fill in the required values
4. Ask your team lead for the correct environment variable values

### Important Notes

- **Don't delete `package-lock.json`**: This file ensures everyone uses the same dependency versions
- **Use `npm install`** instead of `npm install <package>` when setting up to respect the locked versions
- **If you add new dependencies**: Always commit the updated `package.json` and `package-lock.json` files
- **If you encounter version conflicts**: Run `npm ci` instead of `npm install` for a clean installation based on the lock file

### Troubleshooting

#### Module Not Found Errors
If you encounter "module not found" errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Version Mismatch Issues
If you're having issues related to dependency versions:
```bash
# Use npm ci for a clean install from package-lock.json
npm ci
```

### Available Scripts

#### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

#### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Project Structure

```
ip_prj_cr/
├── client/          # React frontend application
│   ├── src/         # Source files
│   ├── public/      # Static assets
│   └── package.json # Client dependencies
├── server/          # Express backend application
│   ├── src/         # Source files
│   └── package.json # Server dependencies
└── README.md        # This file
```
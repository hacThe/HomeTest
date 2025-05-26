# LocalShop
## 🚀 Quick Start with Docker

The easiest way to run the application is using Docker Compose. Follow these steps:

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

2. Clone the repository:
```bash
git clone https://github.com/hacThe/HomeTest.git
cd HomeTest
```

3. Start the application using Docker Compose:
```bash
# For first time setup or when you've made changes to Dockerfile/dependencies:
docker compose up --build

# For regular development (faster startup):
docker compose up
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5005

## 🛠️ Manual Setup

### Frontend (Next.js)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend (Node.js)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run start
```

The backend API will be available at http://localhost:5005

## 📹 Demo Video

[DEMO](https://youtu.be/1EFWcjZfiGA)

The demo video showcases the following features:
- Product listing and search
- Favorite product
- Responsive design

## 🏗️ Project Structure

```
tymex/
├── client/           # Next.js frontend application
├── server/           # Node.js backend server
└── docker-compose.yml # Docker configuration
```

## 🔧 Technologies Used

- **Frontend**:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Shadcn

- **Backend**:
  - Node.js
  - json-server

## 📚 API Documentation
For detailed API documentation, please refer to the [server README](./server/README.MD).

# DocAmy - AI Medical Consultation Platform

DocAmy is a sophisticated AI-powered medical consultation platform built with React and TypeScript that integrates with the Tavus API to provide emergency medical guidance through personalized video responses. Designed specifically for SHTF (Shit Hits The Fan) scenarios when professional medical care is unavailable.

![DocAmy Medical Platform](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=DocAmy+Medical+AI+Platform)

## ✨ Features

- 🏥 **AI Medical Consultations**: Emergency medical guidance using Tavus AI technology
- 💬 **Medical Chat Interface**: SHTF-optimized chat for emergency scenarios
- 📹 **Live Medical Video Calls**: Real-time video consultations with medical AI
- ⚙️ **Medical Configuration**: Easy setup for emergency medical consultations
- 🎨 **Medical UI Design**: Blood red and black themed interface using color theory
- 🔒 **Secure Medical Data**: HIPAA-conscious data handling and privacy
- 📱 **Emergency Mobile Access**: Optimized for crisis scenarios on all devices
- 💾 **Medical Data Management**: Export/import medical consultation history
- 🚨 **Comprehensive Disclaimers**: Legal protection and medical limitations clearly stated

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Tavus API key ([Get one here](https://platform.tavus.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HeyBatlle1/DocAmy.git
   cd DocAmy
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Backend configuration
   cp server/.env.example server/.env
   # Edit server/.env and add your Tavus API key
   
   # Frontend configuration (optional)
   cp .env.example .env
   ```

4. **Start the development servers**
   
   **Terminal 1 - Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend Server:**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5176
   - Backend API: http://localhost:8000

## 🔧 Configuration

### Configuration

Your DocAmy medical platform configuration includes:
- **Persona ID**: `p38f53895b11`
- **Replica ID**: `r89d844f2b467046d54fef9d08619d180588edea6160`

To get started:
1. Sign up at [Tavus Platform](https://platform.tavus.ai)
2. Get your API key from the dashboard
3. Add it to `server/.env` or through the app's settings panel

### Environment Variables

**Medical Backend (`fastapi-server/.env`):**
```env
TAVUS_API_KEY=your_tavus_medical_api_key_here
PORT=8001
NODE_ENV=development
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here
FRONTEND_URL=http://localhost:5176
```

**Medical Frontend (`.env`):**
```env
VITE_TAVUS_API_KEY=your_tavus_medical_api_key_here
VITE_APP_NAME=DocAmy Medical Platform
VITE_APP_VERSION=1.0.0
```

## 🏗️ Architecture

### Medical Frontend Stack
- **React 18** with TypeScript for medical interface
- **Tailwind CSS** with medical color theming
- **Lucide React** medical icon library
- **Vite** for emergency-optimized builds
- **Medical-focused custom hooks** for consultation management

### Medical Backend Stack
- **FastAPI** with Python 3.8+ for medical APIs
- **PostgreSQL** for medical data persistence
- **Redis** for medical session management
- **Comprehensive medical API** with Tavus integration
- **Medical webhook support** for real-time updates

### Project Structure
```
DocAmy/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend API server
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎯 Usage

### Starting a Medical Consultation
1. Open DocAmy medical platform in your browser
2. Click settings to configure your Tavus medical API key
3. Read and accept the comprehensive medical disclaimer
4. Click "Start your SHTF Emergency Consultation"
5. Describe your medical symptoms or concerns
6. Receive AI-powered medical guidance (NOT professional medical advice)

### Medical Video Consultation Features
- **Emergency Video Consultations**: Real-time medical guidance via video
- **Medical Camera Controls**: Optimized for showing symptoms/injuries
- **Medical Picture-in-Picture**: Monitor patient while consulting AI
- **High Quality Medical Video**: Up to 1080p for detailed symptom assessment

### Medical Data Management
- **Export Medical Consultations**: Download consultation history
- **Import Medical Data**: Restore previous medical consultations
- **Medical Privacy Controls**: HIPAA-conscious local data storage

## 🔌 API Integration

### Medical API Endpoints

The medical backend provides secure proxy endpoints for Tavus medical AI:

```javascript
// Create medical consultation
POST /api/v2/conversations

// Send medical query
POST /api/v2/conversations/:id/messages

// Get consultation status
GET /api/v2/conversations/:id

// End consultation
DELETE /api/v2/conversations/:id
```

### Medical Webhook Support

DocAmy medical platform supports Tavus webhooks for real-time medical updates:
- Medical video generation completion
- Consultation status changes
- Medical emergency notifications

## 🛠️ Development

### Available Scripts

**Medical Frontend:**
```bash
npm run dev          # Start medical platform development
npm run build        # Build medical platform for production
npm run preview      # Preview medical platform build
npm run lint         # Run medical code linting
```

**Medical Backend:**
```bash
python start.py      # Start medical API development server
python main.py       # Start medical API production server
```

### Code Style
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** formatting (recommended)

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🚀 Deployment

### Medical Platform Deployment
The medical frontend can be deployed to any static hosting service:
- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions

### Medical Backend Deployment
Deploy the medical backend to any Python hosting service:
- **Railway**: Connect your GitHub repository
- **Heroku**: Deploy FastAPI medical backend
- **DigitalOcean App Platform**: Connect your repository

### Medical Environment Setup
Make sure to set the following environment variables in production:
- `TAVUS_API_KEY`: Your Tavus medical API key
- `DATABASE_URL`: PostgreSQL medical database
- `REDIS_URL`: Redis for medical session management
- `FRONTEND_URL`: Your frontend domain
- `TAVUS_WEBHOOK_SECRET`: Secure medical webhook secret

## 🔒 Medical Security & Privacy

- **Medical API Key Protection**: Secure medical API key storage
- **Medical Rate Limiting**: Prevents abuse during emergencies
- **HIPAA-Conscious Design**: Privacy-focused medical data handling
- **Medical Input Validation**: Sanitizes all medical consultation inputs
- **Medical Webhook Verification**: Validates medical AI webhook signatures

## 🚨 Medical Platform Troubleshooting

### Common Issues

**Medical API port already in use:**
```bash
# Kill existing medical API processes
lsof -ti:8001 | xargs kill -9
# Or use a different port in fastapi-server/.env
```

**Medical API Key not working:**
- Verify your Tavus medical API key is correct
- Check that it's properly set in `fastapi-server/.env`
- Ensure the medical backend server is running

**Medical Video not loading:**
- Check browser permissions for camera/microphone
- Verify HTTPS is used in production
- Check network connectivity

### Getting Medical Platform Help

- 📖 [Tavus Medical AI Documentation](https://docs.tavus.ai)
- 💬 [DocAmy Medical Issues](https://github.com/HeyBatlle1/DocAmy/issues)
- 🚨 **EMERGENCY**: Call 911 (US), 999 (UK), 112 (EU)
- 📧 Medical Platform Support: [medical-support@docamy.com]

## ⚠️ CRITICAL MEDICAL DISCLAIMER

**DocAmy is an AI application and is NOT a licensed medical doctor or healthcare provider.**

This platform is designed for informational purposes during emergency preparedness scenarios only. 

**In functioning world scenarios**: Always consult licensed healthcare professionals.
**In SHTF scenarios**: Use only when professional medical care is completely unavailable.

See the comprehensive disclaimer accessible through the application settings for complete legal terms and limitations.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Medical Platform Acknowledgments

- [Tavus](https://tavus.ai) for the medical AI video technology
- [React](https://reactjs.org) team for the excellent framework
- [Tailwind CSS](https://tailwindcss.com) for the medical theming framework
- [Lucide](https://lucide.dev) for the medical icon library
- Medical professionals who inspire emergency preparedness

## 🔮 Medical Platform Roadmap

- [ ] Medical symptom checker integration
- [ ] Emergency first aid guidance modules
- [ ] Offline medical consultation capabilities
- [ ] Multi-language medical translations
- [ ] Advanced medical AI training
- [ ] Telemedicine platform integration
- [ ] Medical device connectivity
- [ ] Healthcare provider network integration

---

**Built with ❤️ for emergency medical preparedness by [HeyBatlle1](https://github.com/HeyBatlle1)**

*Emergency medical consultation platform for SHTF scenarios - DocAmy Medical AI*
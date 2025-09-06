# Chryp Lite

Chryp Lite is a lightweight, modern **content publishing platform** that allows you to create and manage blogs, videos, galleries, and quotes with ease.  
It combines simplicity with powerful features like **AI-powered title generation**, responsive design, and a clean interface for both creators and readers.

---

## What can Chryp Lite do?

Chryp Lite makes it possible to host your own publishing platform with minimal fuss.  
You can:

* Write and publish blogs with rich content
* Share videos, galleries, and quotes
* Generate AI-powered titles for your posts
* Manage your content with a friendly dashboard
* Browse posts in an organized feed (blogs, videos, galleries, and more)

Whether you want a personal blog, a multimedia hub, or a collaborative publishing platform, Chryp Lite adapts to your needs.

---

## Key Features

### Core

* Simple login and signup system (`CloneFest2025 / CloneFest2025` as test credentials, or create your own account)
* Fully responsive frontend built with **Vite + React + TailwindCSS**
* Secure backend powered by **Node.js + Express**
* MySQL database hosted on **Aiven** with SSL support
* Clean user dashboard to manage content
* AI Generate Mode to suggest titles from your summaries
* Deployment-ready for **Netlify (frontend)** and **Render (backend)**

### Content Types

* **Blogs** – Write and publish articles
* **Videos** – Add and view uploaded video content
* **Gallery** – Share image collections
* **Quotes** – Create inspirational or reference quotes
* **Posts** – General publishing area for any content type

---

## Requirements

* **Node.js 18+** and npm
* **MySQL 5.7+ / 8.0+** (Aiven-hosted recommended)
* SSL certificate for database connection (`aiven-ca.pem`)
* GitHub account connected with Netlify and Render for deployment

---

## ⚙ Installation (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/ashitha1710/chryp-lite.git
cd chryp-lite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` with your database credentials:

```env
MYSQL_HOST=your-mysql-host.aivencloud.com
MYSQL_PORT=13605
MYSQL_USER=avnadmin
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=defaultdb
MYSQL_SSL=true
```

### 4. Database Setup

Run the database setup script:

```bash
npm run setup:mysql
```

### 5. Start Development Server

```bash
npm run dev:full
```

This will start both the backend server and frontend development server.

---

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy Options

1. **DigitalOcean App Platform**: Use the included `.do/app.yaml` configuration
2. **Netlify + Render**: Follow the deployment guide for separate frontend/backend hosting
3. **Full Stack on Render**: Deploy everything as a single service

---

## 📁 Project Structure

```
chryp-lite/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   └── themes/            # Theme configurations
├── public/                # Static assets and uploads
├── server.js              # Backend Express server
├── setup-mysql.js         # Database setup script
└── *.sql                  # Database schema files
```

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run setup:mysql` - Setup database tables
- `npm start` - Start production server

### Database Management

- `database-setup.sql` - Initial database schema
- `database-complete-setup.sql` - Complete setup with sample data
- `create-missing-tables.sql` - Add missing tables if needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database hosted on [Aiven](https://aiven.io/)


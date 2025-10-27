# Monstera Group Live-Action SOP

Static HTML documentation site for Monstera Group's Live-Action Standard Operating Procedures.

## 🚀 Deployment

### GitHub Pages

1. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/monstera-group-sop.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select `main` branch as source
   - Your site will be live at: `https://YOUR_USERNAME.github.io/monstera-group-sop/`

### AWS S3 Static Hosting

1. **Install AWS CLI** (if not already installed):
   ```bash
   brew install awscli
   ```

2. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

3. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://monstera-group-sop --region us-east-1
   ```

4. **Enable static website hosting**:
   ```bash
   aws s3 website s3://monstera-group-sop \
     --index-document index.html \
     --error-document index.html
   ```

5. **Upload files**:
   ```bash
   aws s3 sync . s3://monstera-group-sop \
     --exclude "*.docx" \
     --exclude "Live-Action/*" \
     --exclude "*.py" \
     --exclude "*.md"
   ```

6. **Make bucket public**:
   ```bash
   aws s3api put-bucket-policy --bucket monstera-group-sop --policy file://bucket-policy.json
   ```

## 📁 Project Structure

```
Monstera_Group/
├── index.html          # Main entry point
├── styles.css          # All styles
├── script.js           # Navigation and accordions
├── pages/              # All content pages
├── assets/             # Icons and images
└── README.md           # This file
```

## 🎨 Features

- **Single Page Application**: Dynamic content loading without page refreshes
- **Search Parameters**: Deep linking with `?page=filename.html`
- **Accordion Navigation**: Collapsible sidebar sections with state persistence
- **Responsive Design**: Works on all screen sizes
- **Local Storage**: Remembers accordion states

## 🔗 Usage

Navigate using the sidebar. URLs update to `?page=filename.html` for easy sharing.

Example: `https://yoursite.com/?page=early-project-prep.html`

## 🛠️ Local Development

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## 📝 License

Internal use only - Monstera Group


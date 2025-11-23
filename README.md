# CookBot - AI Recipe Generator

Generate delicious Filipino recipes from your ingredients using AI!

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root folder:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Enable **Authentication** → Email/Password and Google Sign-in
4. Enable **Firestore Database**
5. Add your domain to **Authentication → Settings → Authorized domains**:
   - Add `localhost` for local development

For detailed Firebase setup, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Firebase Authentication** - Sign in with email or Google
- **AI Recipe Generation** - Get 3 Filipino recipes from your ingredients
- **Save Recipes** - Store your favorite recipes
- **Nutrition Info** - See calories, protein, carbs, and fat
- **Health Tips** - Get helpful nutrition advice
- **Print & Copy** - Share recipes easily
- **Dark Mode** - Easy on the eyes

## Tech Stack

- **Next.js 16** - React framework
- **Firebase** - Authentication & Database
- **Google Gemini AI** - Recipe generation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## How to Use

1. **Sign up** or **Log in** with email or Google
2. **Add 2-3 ingredients** (e.g., chicken, onion, tomato)
3. **Select preferences** (optional): Vegetarian, Low-Salt, Budget-Friendly
4. **Generate recipes** - Get 3 Filipino recipes instantly
5. **Save favorites** - Click the heart icon to save recipes
6. **View saved recipes** - Access them anytime in the Recipes tab

## Troubleshooting

### "Gemini API key not configured"
- Make sure you created `.env.local` with your API key
- Restart the dev server after adding the key

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` to the list

### Module not found errors
- Run `npm install` to install all dependencies
- Delete `node_modules` and run `npm install` again if needed

## License

This project is for educational purposes.

## Contributors

Group 5 - Recipe Generator Team

# Firebase Setup Instructions

## Firestore Rules

Go to Firebase Console → Firestore Database → Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      // Allow read if user owns the recipe
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      // Allow create if user sets their own userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      // Allow update/delete if user owns the recipe
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Database Structure

Collection: `recipes`
Documents contain:
- userId: string (Firebase Auth UID)
- title: string
- ingredients: array of strings
- instructions: array of strings
- prepTime: string
- cookingTime: string
- servings: number
- createdAt: string (ISO timestamp)

Collection: `users`
Documents contain:
- firstName: string
- lastName: string
- email: string
- createdAt: string (ISO timestamp)

## Setup Steps

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: cookbot-b4f41
3. Go to **Firestore Database**
4. Click **Create database** (if not created)
5. Choose **Start in test mode** (for development)
6. Select a location (e.g., us-central1)
7. Click **Enable**

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
4. Enable **Google** provider:
   - Click on "Google"
   - Toggle "Enable"
   - Enter support email
   - Click "Save"

### 3. Update Firestore Rules
Go to **Firestore Database → Rules** and paste the rules from above.

## Features

- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ User-specific recipes (each user sees only their recipes)
- ✅ Secure Firestore rules
- ✅ Auto-redirect to login if not authenticated

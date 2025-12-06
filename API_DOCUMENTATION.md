# API Documentation

## Base URL
- Development: `http://localhost:3001`
- Production: `https://api.yourdomain.com`

## Authentication

Most routes require JWT authentication. Include token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Routes

### Register User
`POST /api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### Login
`POST /api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### Admin Login
`POST /api/auth/admin-login`

Authenticate admin user with password.

**Request Body:**
```json
{
  "password": "admin_password_from_env"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin",
    "role": "admin"
  }
}
```

---

### Get Current User
`GET /api/auth/me`

Get currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "purchases": ["track_id_1", "track_id_2"]
  }
}
```

---

## Track Routes

### Get All Tracks
`GET /api/tracks`

Get all active tracks with optional filtering.

**Query Parameters:**
- `genre` - Filter by genre
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sort` - Sort field (default: `-releaseDate`)

**Example:**
```
GET /api/tracks?genre=hip-hop&minPrice=5&maxPrice=50&sort=-price
```

**Response:**
```json
{
  "tracks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Dark Nights",
      "artist": "JustMalik",
      "genre": "hip-hop",
      "price": 29.99,
      "audioPreviewUrl": "https://...",
      "coverImageUrl": "https://...",
      "metadata": {
        "bpm": 140,
        "key": "C Minor",
        "tags": ["dark", "trap", "808"]
      },
      "releaseDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Latest Releases
`GET /api/tracks/latest`

Get most recent tracks.

**Query Parameters:**
- `limit` - Number of tracks (default: 3)

**Response:**
```json
{
  "tracks": [...]
}
```

---

### Get Single Track
`GET /api/tracks/:id`

Get track by ID.

**Response:**
```json
{
  "track": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Dark Nights",
    ...
  }
}
```

---

### Create Track (Admin Only)
`POST /api/tracks`

Create a new track.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "New Beat",
  "artist": "JustMalik",
  "genre": "hip-hop",
  "price": 29.99,
  "audioFileUrl": "https://...",
  "audioPreviewUrl": "https://...",
  "coverImageUrl": "https://...",
  "stripeProductId": "prod_xxx",
  "stripePriceId": "price_xxx",
  "metadata": {
    "bpm": 140,
    "key": "C Minor",
    "tags": ["dark", "trap"]
  }
}
```

**Response:**
```json
{
  "message": "Track created successfully",
  "track": {...}
}
```

---

### Update Track (Admin Only)
`PUT /api/tracks/:id`

Update existing track.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (partial update supported)
```json
{
  "price": 39.99,
  "metadata": {
    "bpm": 145
  }
}
```

---

### Delete Track (Admin Only)
`DELETE /api/tracks/:id`

Soft delete track (sets isActive to false).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Track deleted successfully"
}
```

---

## Payment Routes

### Create Payment Intent
`POST /api/payments/create-intent`

Create Stripe payment intent for track purchase.

**Headers:**
```
Authorization: Bearer <token> (optional)
```

**Request Body:**
```json
{
  "trackId": "507f1f77bcf86cd799439011",
  "email": "buyer@example.com"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "trackId": "507f1f77bcf86cd799439011",
  "amount": 29.99
}
```

---

### Stripe Webhook
`POST /api/payments/webhook`

Stripe webhook endpoint (called by Stripe automatically).

**Note:** This endpoint is called by Stripe servers, not by your frontend.

---

### Get Download Link
`GET /api/payments/download/:token`

Get download URL for purchased track using download token.

**Response:**
```json
{
  "downloadUrl": "https://...",
  "track": {
    "title": "Dark Nights",
    "artist": "JustMalik"
  },
  "downloadsRemaining": 2,
  "expiresAt": "2024-02-01T00:00:00.000Z"
}
```

---

### Get User Purchases
`GET /api/payments/my-purchases`

Get all purchases for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "purchases": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "track": {
        "title": "Dark Nights",
        "artist": "JustMalik"
      },
      "amount": 29.99,
      "purchasedAt": "2024-01-01T00:00:00.000Z",
      "downloadToken": "abc123...",
      "downloadCount": 1,
      "maxDownloads": 3,
      "downloadExpiry": "2024-02-01T00:00:00.000Z",
      "status": "completed"
    }
  ]
}
```

---

## Health Check

### Health Endpoint
`GET /api/health`

Check API status.

**Response:**
```json
{
  "status": "ok",
  "stripe": "configured",
  "message": "Ready for payments",
  "database": "connected",
  "environment": "development"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "stack": "Stack trace (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Login endpoints:** 5 requests per 15 minutes per IP

When rate limited, you'll receive a `429` response:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Frontend Integration Examples

### Login and Store Token
```javascript
const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data.user;
  }
  
  throw new Error(data.error);
};
```

### Make Authenticated Request
```javascript
const getMyPurchases = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/payments/my-purchases`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### Create Payment
```javascript
const purchaseTrack = async (trackId, email) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ trackId, email })
  });
  
  const { clientSecret } = await response.json();
  
  // Use clientSecret with Stripe Elements
  return clientSecret;
};
```

# Donasiku API Collection

This Postman collection, **Donasiku**, provides a set of endpoints for an application focused on managing donations, user authentication, profile management, document verification, community registration, and area/category management.

## ⚙️ Instalasi dan Prasyarat

Koleksi ini dirancang untuk diuji terhadap server backend lokal yang berjalan, seperti yang ditunjukkan oleh Base URL: `http://localhost:3000`.

### Prasyarat

1.  **Postman:** Anda memerlukan aplikasi Postman (atau alat yang kompatibel) untuk mengimpor dan menjalankan koleksi ini.
2.  **Server Backend:** Server backend untuk Donasiku harus berjalan secara lokal di `http://localhost:3000`.
3.  **Database:** Anda memerlukan server database **MySQL** yang berjalan (biasanya di `localhost:3306`).
4.  **Kredensial Layanan Eksternal:** Anda memerlukan akun dan kredensial untuk **Cloudinary** (untuk penyimpanan file) dan **Firebase** (untuk fungsionalitas chat/real-time).

---

## 🔑 Konfigurasi Lingkungan (`.env`)

Aplikasi backend Anda mengandalkan variabel lingkungan berikut untuk berfungsi. Anda harus membuat file **`.env`** di root proyek Anda dengan konfigurasi ini (sesuaikan jika ada perbedaan pada setup lokal Anda):

```ini
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=donasiku
DB_PORT=3306
DB_DIALECT=mysql

# Application Port
PORT=3000

# JWT Secrets (for Authentication)
JWT_ACCESS_SECRET=test
JWT_REFRESH_SECRET=test

# Cloudinary Configuration (for File Uploads)
CLOUDINARY_CLOUD_NAME=drxyesjkl
CLOUDINARY_API_KEY=436258253685135
CLOUDINARY_API_SECRET=0UJOplfHNMAb3mx2f5ygErrbvE4

# Firebase Configuration (for Real-time/Chat Services)
FIREBASE_PROJECT_ID=donasiku-chat
FIREBASE_PRIVATE_KEY_ID=4353dc261a581daf78a06c18a269b4d3daca57c7
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCr0Xf9ND/Aprj1\nmBFh2nsszrSl7mxq/p6il1g4iEDInXhf9R9BYLqlaS9W7zlj74TZi7H31Wx3ZW1H\npCWxYvVRhusOYviA/IP9VHExJ+osEmdJcf6BYwcjzd3mzqXU6L3yIFgtYwNhbIUB\nheykQHxnmdEm5t5ZAqH48tEKx1mn0YVH7UrycznGP0xFgYD9mqp9U/+HbV1dfPG1\nEKKRu8seuZQhhT9s5LdhJ/98Ps+5KZ/UlMbeKADj2g7DrWj3vTDfte/nAtfQ7rEq\nD25qHc7or5hIGfXIEgSq3V07duDVTgEpxNb0FE+PwoKvxW0MfdgErwtYP2NFS6hK\nz4UNxxO/AgMBAAECggEAPIj2j31DIOscq1rCdQl28Fh7iSKxjBjdZ0ePS4ul14iz\niotgUbZ0zCZ9CVILlEwlMEhpkXneV0qi7+TDavYEnI6+bjkseLV/A1gm8Tyw4oox\nXc0N8CQltdWoYtNX1eWSVqZSqtsBq+eCDQFUWKJnslCdQemBWTb2PjG+uN93lQpF\nhwuQijKjgyHGDKNtCxPFXHZz1BnK/UVzDg/hdkBWNtnx/YeufE/sPP1N8Q9yz/PG\n71BUl63pOWcZOT7tJE0Ht20O4TWmUNOrvUP0Pozu5IHI6rlaXpEAB1io2aflbfvn\n8He8M4+eOn0SaBxSF4Zx2aeTPOvotZCeuLcCN4YkQQKBgQDw9lqEq/1twIv3XrzZ\n3yXvJ5sTqf7szSmCqIJIwOvggua06+cqWRozIW31zD4JhjDnuPCF3QkNZ/KydqpZ\nDhAm0TXKPDi3MjIKBS9VRRcxoX3pibRs0PAJOLptWv/+Ju0KKkpY66oJURIem6/g\nH5umn089cOkkZrmWxgwawIU1rwKBgQC2inXA0rLBvGxLfrutAv7TxKOnNTNgw5Zr\nCnvGM4Lmj1DVahAZ9Kd0B5CViRgf/RqoazXfTiA/1kgkwDoYDyuhi4ggXVRdtFWr\ni9r1kmAdfrXkFseTp3fbHLbWCl177X5eWOkF1bol2OrrrqEttiE3+wibGOfM7Cu1\nqJ8x0YWW8QKBgBmMtZpdtjh98xlepT2gyJ/sHihenRY0xtMA1RerxRcAKkBCxzcZ\nTYrgX41xg5506RiY5n/7KOuP+w7rQDLDJ/lFs6Nm8UiTfPTNCfDLq6LqkbRCkqv7\nF4iSyEmyHXSwYe/y/gEhs9zbCMXQEjz8fP+U4s0L/NyMO999zmjDwxwnAoGAKUJA\nfVXiW5HYNHQvvVpI+NqgVuHafAuZSxZyhYkNFEnebm5rt0IqOzqefn4fOtO9m8Wn\nxpJlDajEY7IjL172cKwWF6KguBFTr9OLqSftm50RRb20XHZky9zAor5zBNjYUEDu\nYog9a+KMrrqo6akZ9wpBlrTZZ+MVuhij6uG9vTECgYBYwCSCJeYgNVhiQRU1GCgI\nyQQqLzMG5ehaDaQXvxj/5M8+5P+GLVQFtL2i1niinZStKC4TWCx/QQyXICrDAcch\n/VmqegBCrvWMc02/dKEdwd/CFf43Vxsj3c0JUoz6IQ/AxeIlQXR/YuJK44AL/vNd\nC4bDem5nMFeTeh5T0bY6/g==\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@donasiku-chat.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=103578749137928933763
FIREBASE_DB_URL=[https://donasiku-chat-default-rtdb.asia-southeast1.firebasedatabase.app](https://donasiku-chat-default-rtdb.asia-southeast1.firebasedatabase.app)

### Prerequisites

1.  **Postman:** You need the Postman application (or a compatible tool) to import and run this collection.
2.  **Running Backend:** The backend server for Donasiku must be running locally on `http://localhost:3000`.

### Setup

1.  **Import:** Import the `Donasiku.postman_collection.json` file into your Postman workspace.
2.  **Environment Variables:**
    * The collection uses a variable named `{{accessToken}}` for authorization.
    * After successfully executing the **Login** request, you should set the received **JWT (JSON Web Token)** as the value for the `accessToken` variable in your environment or collection variables to use it in subsequent protected requests.

## 🔗 Collection Structure

The requests are organized into the following folders (major feature areas):

| Folder Name | Primary Functionality |
| :--- | :--- |
| **Auth** | User registration, login, token refresh, and logout. |
| **User** | Managing user profiles and fetching user lists. |
| **Document verifiy** | Uploading and managing documents for user/community verification. |
| **Community** | Community registration. |
| **Area** | Managing geographical areas (seeding and fetching). |
| **Category** | Managing donation categories (posting and fetching). |
| **Receiver Request** | Receivers creating requests and Donors responding to requests (offering items) and managing their statuses. |
| **Donor Create Item** | Donors posting items available for donation and Receivers requesting those items, along with status updates. |
| **DonationLog** | Placeholder for donation logs/history. |

---

## 🔑 Auth Endpoints

| Request Name | Method | Path | Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Register** | `POST` | `/auth/register/receiver` | JSON (username, password, email) | Registers a new user with the `receiver` role. |
| **Login** | `POST` | `/auth/login` | JSON (username, password) | Authenticates a user and returns tokens. |
| **RefreshToken** | `POST` | `/auth/refresh` | Header (Authorization: Bearer) | Refreshes the access token using a refresh token (typically sent in the `Authorization` header). |
| **Logout** | `POST` | `/auth/logout` | Header (Authorization: Bearer) | Logs out the user and revokes the token. |

---

## 👤 User & Profile Endpoints

| Request Name | Method | Path | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profile** | `GET` | `/user/profile` | Bearer Token | - | Retrieves the currently authenticated user's profile. |
| **Update Profile** | `PUT` | `/user/profile` | - | FormData (name, phone, address, area\_id, file) | Updates user profile details, including an optional file upload. |
| **Get All User** | `GET` | *(URL not specified)* | - | - | Endpoint for fetching a list of all users. |
| **testUploadProfile** | `POST` | `/documents/upload` | Bearer Token | FormData (file) | A general endpoint for uploading a file/document. |

---

## 📄 Document Verification Endpoints

These endpoints are used for uploading verification documents and for admins to manage the verification process.

| Request Name | Method | Path | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Verification Document Upload** | `POST` | `/documents/upload/user` | Bearer Token | FormData (file) | Uploads a document for individual user verification. |
| **Community Verification Document Upload** | `POST` | `/documents/upload/user` | Bearer Token | FormData (file) | *Note: The path `/documents/upload/user` is also used for Community upload in the collection, check documentation for actual community path.* |
| **Get Verif Request Community** | `GET` | `/documents/documents/communities` | Bearer Token | - | Retrieves a list of verification requests from communities. |
| **Get Verif Request All Users** | `GET` | `/documents/documents/users` | Bearer Token | - | Retrieves a list of verification requests from individual users. |
| **Verify Document** | `PATCH` | `/documents/documents/{id}/verify` | Bearer Token | JSON (status, reason) | Updates the verification status of a document (e.g., to `approved` or `rejected`). |

---

## 🏘️ Community Endpoints

| Request Name | Method | Path | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Community Register** | `POST` | `/community/register` | Bearer Token | JSON (details about the community) | Registers a new community with details like name, description, location, etc. |

---

## 💰 Donation Request & Item Offer Flow (Receiver-Initiated)

These requests facilitate a flow where a **Receiver** asks for an item, and a **Donor** offers to fulfill that specific request.

| Request Name | Method | Path | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Receiver Create Request Item** | `POST` | `/donate/requests` | Bearer Token | JSON (category\_id, message, quantity, area\_id) | A receiver posts a request for a specific donation item. |
| **Donatur Get All Request** | `GET` | `/donate/requests` | Bearer Token | - | Retrieves all active donation requests posted by receivers. |
| **Donatur Posting Items** | `POST` | `/donate/items` | Bearer Token | FormData (name, description, category\_id, quantity, area\_id, **request\_id**, image) | A donor offers an item to fulfill a *specific* request. |
| **Approve or Reject Item** | `PATCH` | `/donate/items/{id}/status` | Bearer Token | JSON (status: 'approved' or 'rejected') | A receiver approves or rejects the offered item associated with their request. |
| **Donor and Receiver Update Status** | `PATCH` | `/donate/{id}/status` | Bearer Token | JSON (status: 'completed') | Updates the overall donation status (e.g., to indicate completion). |

---

## 🎁 Donor Item Post Flow (Donor-Initiated)

These requests facilitate a flow where a **Donor** lists an item they want to donate, and a **Receiver** can subsequently request it.

| Request Name | Method | Path | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Donatur Posting Items** | `POST` | `/donate/items` | Bearer Token | FormData (name, description, category\_id, quantity, area\_id, image) | A donor posts an item they are offering for general donation (without a specific request\_id). |
| **Get All Items** | `GET` | `/donate/items` | Bearer Token | - | Fetches all posted items available for donation. |
| **Receiver Create Request for Item** | `POST` | `/donate/requests` | Bearer Token | JSON (category\_id, message, quantity, area\_id) | *This request name is misleading in the folder; it seems to be the same as the initial **Receiver Create Request Item** from the other flow, likely used to test a request against a general posted item.* |
| **Update Status Donatur** | `PATCH` | `/donate/item-request/status` | Bearer Token | JSON (item\_id, status: 'approved', quantity) | A donor updates the status of a request *made by a receiver* for their posted item. |

---

## 🗺️ Area & Category Endpoints

| Folder | Request Name | Method | Path | Body | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Area** | **Post Area** | `POST` | `/area/seed` | - | Seeds the database with initial area data. |
| **Area** | **Get All Area** | `GET` | `/area/areas` | - | Retrieves a list of all defined geographical areas. |
| **Category** | **Post Category** | `POST` | `/category` | JSON (array of categories) | Creates new donation categories. |
| **Category** | **Get Category** | `GET` | `/category` | - | Retrieves a list of all donation categories. |

---

## 🛠️ To Do / Next Steps

1.  Ensure an active environment is selected with a valid `accessToken` variable.
2.  Test the **Login** request first and save the returned token to the `accessToken` variable.
3.  Fill in required form data and file paths for all requests using `formdata` (e.g., in **Update Profile** and **Donatur Posting Items**).
4.  Replace placeholder IDs in paths (like `2` in `/documents/documents/2/verify` or `1` in `/donate/items/1/status`) with dynamic values or valid IDs from your database.
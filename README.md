# Donasiku API Collection

This Postman collection, **Donasiku**, provides a set of endpoints for an application focused on managing donations, user authentication, profile management, document verification, community registration, and area/category management.

## 🚀 Getting Started

This collection is designed to be run against a local development server, as indicated by the base URL: `http://localhost:3000`.

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
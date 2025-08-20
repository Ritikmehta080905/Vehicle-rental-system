# 🚗 Vehicle Rental System  

A web-based **Vehicle Rental System** built with **HTML, CSS, JavaScript, Node.js, and MySQL**.  
The system allows customers to browse and rent vehicles, listers to add their vehicles for rent, and admins to manage users and rentals. It also integrates **Leaflet Maps** for location tracking and **EmailJS** for notifications.  

---

## 🚀 Features  

### 👤 User Features  
- **Signup & Login**: Secure authentication system.  
- **Browse Vehicles**: View available Cars, Bikes, Buses, and Trucks.  
- **Book a Vehicle**: Choose rental duration, upload documents, and confirm booking.  
- **Payments**:  
  - Online payments via Razorpay.  
  - Manual payment option with screenshot upload for verification.  
- **Email Notifications**: Receive booking confirmations and updates via EmailJS.  
- **Map Integration**: See rental locations on an interactive **Leaflet map**.  
- **Contact Page**: Users can send messages or inquiries directly.  

### 👨‍💼 Lister Features  
- Add vehicles with details (type, model, price, location).  
- Manage vehicle availability.  
- View bookings for their listed vehicles.  

### 🛠️ Admin Features  
- **Dashboard** with quick access to renters and listers.  
- Manage **users** (renters & listers).  
- Manage **vehicles** (add, update, remove).  
- Approve or reject **manual payments**.  
- Oversee all **bookings and payments**.  

---
🔄 User Flow
flowchart TD
    A[Start: User Signup/Login] --> B[Homepage - Browse Vehicles]
    B --> C[Select Vehicle Category (Car/Bike/Bus/Truck)]
    C --> D[View Vehicle Details (Price, Model, Location, Availability)]
    D --> E[Choose Rental Dates & Fill Booking Form]
    E --> F[Submit Booking Request]
    F --> G{Select Payment Method}
    G -->|Online Payment| H[Razorpay Secure Payment]
    G -->|Manual Payment| I[Upload Payment Screenshot]
    H --> J[Payment Success → Booking Confirmed]
    I --> K[Admin Reviews Payment Proof]
    K -->|Approved| J[Booking Confirmed]
    K -->|Rejected| L[Booking Cancelled → Retry Payment]
    J --> M[Email Confirmation via EmailJS]
    M --> N[Vehicle Ready for Pickup/Usage]
    N --> O[End]

📋 Step-by-Step Explanation

1.Signup/Login → User registers or logs in securely.
2.Browse Vehicles → User navigates through Cars, Bikes, Buses, and Trucks.
3.View Details → User checks vehicle info (model, price, location, availability).
4.Booking Form → User selects rental dates and submits booking request.
5.Payment →Online (Razorpay): Instant confirmation if successful.
6.Manual: User uploads proof → Admin verifies → Booking is confirmed/rejected.
7.Booking Confirmation → User gets confirmation email via EmailJS.
8.Vehicle Pickup → User collects and uses the rented vehicle.

📂 Project Structure
├── admin.html          # Admin dashboard  
├── bike.html           # Bike rental page  
├── bus.html            # Bus rental page  
├── car.html            # Car rental page  
├── contact.html        # Contact page (EmailJS)  
├── documents.html      # Upload documents page  
├── index.html          # Homepage  
├── login.html          # Login page  
├── signup.html         # Signup page  
├── rental.html         # Vehicle rental form  
├── payment.html        # Online payment page  
├── manualpayment.html  # Manual payment option  
├── map.html            # Map/location page (Leaflet API)  
├── styles.css          # Styling  
├── main.js             # Frontend logic (API calls, validation)  
├── server.js           # Node.js backend server (APIs, DB, payments)  
├── package.json        # Dependencies  
├── .env                # Environment variables  

🛠️ Technologies Used
Frontend: HTML5, CSS3, JavaScript
Backend: Node.js, Express.js
Database: MySQL

APIs & Services:
Leaflet.js – interactive maps for vehicle locations
EmailJS – sending email confirmations & notifications
Razorpay – online payment processing

⚙️ Setup Instructions

Clone the repository

git clone https://github.com/yourusername/vehicle-rental-system.git
cd vehicle-rental-system


Install dependencies
npm install

Configure .env file

DB_HOST=localhost  
DB_USER=root  
DB_PASS=yourpassword  
DB_NAME=vehiclerental  
JWT_SECRET=your_secret_key  
PORT=5000  


Start the backend server
npm start


Open the frontend
Run index.html in a browser.
API will be available at: http://localhost:5000.

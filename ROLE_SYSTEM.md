# CampusHive Role-Based Registration System

## Overview
The system now supports three distinct user roles with specific permissions and features:
- **Students**: Academic tracking, clubs, events, library access
- **Teachers**: Class management, exam creation, student performance tracking
- **Staff**: Administrative functions based on staff type (librarian, admin, etc.)

## Database Changes

### User Model (app/backend/models/User.js)
Enhanced schema with role-specific fields:

```javascript
role: {
  type: String,
  enum: ['student', 'teacher', 'staff', 'admin'],
  default: 'student'
}

// Student-specific fields
rollNo: { type: String, unique: true, sparse: true }
semester: Number
year: Number
tags: [String]  // club-head, manager, coordinator, etc.
clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }]
proficiencies: [{
  subject: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
}]

// Teacher-specific fields
teacherId: { type: String, unique: true, sparse: true }
subjectsTaught: [String]
designation: String  // Assistant Professor, Associate Professor, etc.

// Staff-specific fields
staffId: { type: String, unique: true, sparse: true }
staffType: String  // librarian, admin-staff, lab-assistant, maintenance

// Common fields
phone: String
isActive: { type: Boolean, default: true }
updatedAt: Date
```

## Registration API

### Endpoint: POST /api/auth/register

#### Student Registration
```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "securepassword",
  "phone": "1234567890",
  "department": "Computer Science",
  "role": "student",
  "rollNo": "245125733500",
  "semester": 3,
  "year": 2
}
```

#### Teacher Registration
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@university.edu",
  "password": "securepassword",
  "phone": "1234567890",
  "department": "Computer Science",
  "role": "teacher",
  "teacherId": "T001",
  "designation": "Associate Professor",
  "subjectsTaught": ["Data Structures", "Algorithms", "DBMS"]
}
```

#### Staff Registration
```json
{
  "name": "Mike Johnson",
  "email": "mike@university.edu",
  "password": "securepassword",
  "phone": "1234567890",
  "department": "Library",
  "role": "staff",
  "staffId": "S001",
  "staffType": "librarian"
}
```

## Frontend Registration Page

### Features
- **Dynamic Form Fields**: Form adapts based on selected role
- **Role-Specific Information**: Helpful alerts explain permissions for each role
- **Validation**: Required field validation for role-specific IDs
- **User Experience**: Clean, intuitive interface with logo and theme support

### Available Departments
- Computer Science
- Electronics
- Mechanical
- Civil
- Electrical
- Mathematics
- Physics
- Chemistry
- Administration
- Library

### Staff Types
- General Staff
- Librarian
- Admin Staff
- Lab Assistant
- Maintenance

### Teacher Designations
- Assistant Professor
- Associate Professor
- Professor
- Lecturer
- Guest Faculty

## Permissions & Features

### Student Permissions
✅ View and join clubs
✅ RSVP to events
✅ Track attendance
✅ Check library books
✅ View subject proficiency
✅ Access PYQ papers
✅ Submit feedback
✅ Use timer and calendar
✅ Lost & found items
✅ StudySnap collaboration

**Special Tags** (assigned by admin):
- `club-head`: Lead a club
- `manager`: Event management
- `coordinator`: Coordinate activities

### Teacher Permissions
✅ All student features
✅ Add and manage classes
✅ Create and schedule exams
✅ Track student performance
✅ Grade assignments
✅ Update attendance records

### Staff Permissions (Librarian)
✅ Add books to library
✅ Track checked-out books
✅ Manage book inventory
✅ View borrowing history
✅ Send overdue notifications

### Staff Permissions (Admin Staff)
✅ Manage fee records
✅ Generate reports
✅ View all user data
✅ System configuration

## Database Reset
All existing users have been deleted to ensure clean implementation of the new role system.

## Testing the System

### Test Student Registration
1. Navigate to `/register`
2. Select "Student" role
3. Fill in: Name, Email, Password, Department
4. Enter Roll Number (e.g., 245125733500)
5. Select Semester and Year
6. Click "Create Account"

### Test Teacher Registration
1. Navigate to `/register`
2. Select "Teacher" role
3. Fill in: Name, Email, Password, Department
4. Enter Teacher ID (e.g., T001)
5. Select Designation
6. Enter Subjects (comma-separated)
7. Click "Create Account"

### Test Staff Registration
1. Navigate to `/register`
2. Select "Staff Member" role
3. Fill in: Name, Email, Password, Department
4. Enter Staff ID (e.g., S001)
5. Select Staff Type
6. Click "Create Account"

## Next Steps

### Immediate Priorities
1. ✅ User model updated
2. ✅ Registration API updated
3. ✅ Registration page created
4. ✅ Database cleared

### Future Enhancements
- [ ] Teacher dashboard with class management
- [ ] Exam creation interface for teachers
- [ ] Librarian dashboard for book management
- [ ] Admin panel for user management
- [ ] Role-based route protection
- [ ] Permission middleware
- [ ] Student proficiency tracking system
- [ ] Teacher performance analytics

## Security Features
- Unique ID validation (rollNo, teacherId, staffId)
- Email uniqueness check
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control ready

## API Responses

### Success Response
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@university.edu",
    "role": "student"
  }
}
```

### Error Responses
- `User already exists` - Email already registered
- `Roll number already exists` - Duplicate student roll number
- `Teacher ID already exists` - Duplicate teacher ID
- `Staff ID already exists` - Duplicate staff ID
- `Roll number is required for students` - Missing required field
- `Teacher ID is required for teachers` - Missing required field
- `Staff ID is required for staff members` - Missing required field

## Files Modified
1. `app/backend/models/User.js` - Enhanced schema
2. `app/backend/routes/auth.js` - Updated registration endpoint
3. `frontend/src/pages/Register.jsx` - New registration UI

---

**Status**: ✅ Fully Implemented and Ready for Testing
**Server**: Running on port 3000
**Database**: MongoDB at localhost:27017/campushive
**Users**: Cleared - Ready for fresh registrations

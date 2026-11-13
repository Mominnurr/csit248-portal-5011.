
// Enrolment Number: A85204925011 | Start Date: 2026-11-13

// PERSONAL PROJECT VALUES
const PASSWORD_MIN = 7;
const NAME_MAX = 25;
const PASS_MARK = 41;
const DISTINCTION_MARK = 75;
const ENROLMENT_NUMBER = "A85204925011";

// ========================================
// PAGE 1: REGISTRATION FORM
// ========================================

const registrationForm = document.querySelector("#registrationForm");

if (registrationForm) {

    const fullName = document.querySelector("#fullName");
    const email = document.querySelector("#email");
    const phone = document.querySelector("#phone");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirmPassword");
    const city = document.querySelector("#city");

    const errorList = document.querySelector("#errorList");
    const nameCounter = document.querySelector("#nameCounter");
    const cityMessage = document.querySelector("#cityMessage");

    fullName.maxLength = NAME_MAX;

    // Validate one field
    function validateField(field) {

        if (field.value.trim() === "") {
            return "This field is required.";
        }

        if (field === email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {
                return "Please enter a valid email address.";
            }
        }

        if (field === phone) {
            const phonePattern = /^\d{9}$/;

            if (!phonePattern.test(phone.value)) {
                return "Phone number must contain exactly 9 digits.";
            }
        }

        if (field === password) {
            if (password.value.length < PASSWORD_MIN) {
                return "Password must contain at least 7 characters.";
            }
        }

        if (field === confirmPassword) {
            if (confirmPassword.value !== password.value) {
                return "Passwords do not match.";
            }
        }

        return "";
    }

    // Check fields when the user leaves them
    const formFields = [
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        city
    ];

    formFields.forEach(function(field) {

        field.addEventListener("blur", function() {

            const error = validateField(field);

            if (error !== "") {
                field.classList.add("invalid");
            } else {
                field.classList.remove("invalid");
            }

        });

    });

    // Update name character counter
    fullName.addEventListener("keyup", function() {

        const remaining = NAME_MAX - fullName.value.length;

        nameCounter.textContent =
            Math.max(0, remaining) + " characters left";

    });

    // Update selected city message
    city.addEventListener("change", function() {

        if (city.value === "") {
            cityMessage.textContent = "";
        } else {
            cityMessage.textContent = "You chose " + city.value;
        }

    });

    // Registration form submission
    registrationForm.addEventListener("submit", function(event) {

        event.preventDefault();

        errorList.textContent = "";

        let formIsValid = true;

        formFields.forEach(function(field) {

            const error = validateField(field);

            if (error !== "") {

                formIsValid = false;

                field.classList.add("invalid");

                const listItem = document.createElement("li");

                listItem.textContent = error;

                errorList.appendChild(listItem);

            } else {

                field.classList.remove("invalid");

            }

        });

        // Stop if the form contains errors
        if (formIsValid === false) {
            return;
        }

        // Ask for registration confirmation
        const answer = confirm("Register " + fullName.value.trim() + "?");

        if (answer === true) {

            const studentName = encodeURIComponent(fullName.value.trim());

            window.location.href = "board.html?name=" + studentName;

        }

    });

}


// ========================================
// PAGE 2: STUDENT MARKS BOARD
// ========================================

const welcomeMessage = document.querySelector("#welcomeMessage");

if (welcomeMessage) {

    const loadTime = document.querySelector("#loadTime");
    const backButton = document.querySelector("#backButton");
    const sortSelect = document.querySelector("#sortSelect");
    const tableBody = document.querySelector("#studentTableBody");
    const statusMessage = document.querySelector("#statusMessage");

    // Read student name from the URL
    const studentName = new URLSearchParams(location.search).get("name");

    if (studentName === null || studentName.trim() === "") {
        welcomeMessage.textContent = "Welcome, Student";
    } else {
        welcomeMessage.textContent = "Welcome, " + studentName;
    }

    // Display page load time
    const pageLoadTime = new Date();

    loadTime.textContent =
        "Page loaded at: " + pageLoadTime.toLocaleString();

    // Back button
    backButton.addEventListener("click", function() {

        history.back();

    });

    // Grade calculation
    function grade(marks) {

        if (marks < PASS_MARK) {
            return "Fail";
        }

        if (marks >= DISTINCTION_MARK) {
            return "Distinction";
        }

        return "Pass";

    }

    let students = [];

    // Build the student table
    function renderStudents(studentList) {

        tableBody.textContent = "";

        studentList.forEach(function(student) {

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            const marksCell = document.createElement("td");
            const cityCell = document.createElement("td");
            const gradeCell = document.createElement("td");

            nameCell.textContent = student.name;
            marksCell.textContent = student.marks;
            cityCell.textContent = student.city;
            gradeCell.textContent = grade(student.marks);

            row.appendChild(nameCell);
            row.appendChild(marksCell);
            row.appendChild(cityCell);
            row.appendChild(gradeCell);

            tableBody.appendChild(row);

        });

    }

    // Sort students
    function sortStudents() {

        const sortedStudents = [...students];

        if (sortSelect.value === "name") {

            sortedStudents.sort(function(a, b) {

                return a.name.localeCompare(b.name);

            });

        } else if (sortSelect.value === "marks") {

            sortedStudents.sort(function(a, b) {

                return b.marks - a.marks;

            });

        }

        renderStudents(sortedStudents);

    }

    // Fetch student data using async and await
    async function loadStudents() {

        try {

            statusMessage.textContent = "Loading students...";

            const response = await fetch("students.json");

            if (response.ok === false) {
                throw new Error("Could not load students.json");
            }

            const data = await response.json();

            if (Array.isArray(data) === false) {
                throw new Error("Student data is invalid.");
            }

            students = data;

            statusMessage.textContent =
                "Successfully loaded " + students.length + " students.";

            sortStudents();

        } catch (error) {

            statusMessage.textContent =
                "Error loading student data. Please run the project using a local server and check students.json.";

        }

    }

    // Sort whenever the selection changes
    sortSelect.addEventListener("change", function() {

        sortStudents();

    });

    // Load student records
    loadStudents();

}

// Log enrolment number
console.log("A85204925011");

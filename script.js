/* =========================================
   FeedBackHub - Main JavaScript
========================================= */


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

    } else {

        input.type = "password";
        button.textContent = "👁";

    }
}


/* =========================================
   STUDENT LOGIN
========================================= */

function studentLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("studentLoginEmail").value.trim();

    const password =
        document.getElementById("studentPassword").value.trim();

    if (!email || !password) {

        alert("Please enter email and password.");
        return;

    }

    /*
       This is a DEMO login.
       No backend is being used.
    */

    localStorage.setItem("studentEmail", email);

    window.location.href = "feedback.html";
}


/* =========================================
   ADMIN LOGIN
========================================= */

function adminLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value.trim();


    /* Demo admin credentials */

    if (
        email === "adfeedback@gmail.com" &&
        password === "sanadmulti"
    ) {

        localStorage.setItem("adminLoggedIn", "true");

        window.location.href = "admin-dashboard.html";

    } else {

        alert(
            "Invalid admin login.\n\n" +
            "Demo credentials:\n" +
            "Email: adfeedback@gmail.com\n" +
            "Password: sanadmulti"
        );

    }
}


/* =========================================
   GET SAVED FEEDBACK
========================================= */

function getFeedbacks() {

    const saved =
        localStorage.getItem("feedbacks");

    if (!saved) {
        return [];
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        return [];

    }
}


/* =========================================
   SAVE FEEDBACK
========================================= */

function saveFeedbacks(feedbacks) {

    localStorage.setItem(
        "feedbacks",
        JSON.stringify(feedbacks)
    );

}


/* =========================================
   SUBMIT STUDENT FEEDBACK
========================================= */

function submitFeedback(event) {

    event.preventDefault();


    const studentId =
        document.getElementById("studentId").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();

    const category =
        document.getElementById("category").value;

    const feedback =
        document.getElementById("feedback").value.trim();

    const ratingInput =
        document.querySelector(
            'input[name="rating"]:checked'
        );


    /* Validation */

    if (
        !studentId ||
        !email ||
        !category ||
        !feedback ||
        !ratingInput
    ) {

        alert(
            "Please complete all fields and select a rating."
        );

        return;
    }


    /* Get previous feedback */

    const feedbacks = getFeedbacks();


    /* Create new feedback */

    const newFeedback = {

        id: Date.now(),

        studentId: studentId,

        email: email,

        category: category,

        rating: Number(ratingInput.value),

        feedback: feedback,

        date: new Date().toLocaleString("en-IN")

    };


    /* Add newest feedback at the beginning */

    feedbacks.unshift(newFeedback);


    /* Save into browser */

    saveFeedbacks(feedbacks);


    /* Show success */

    document.getElementById("feedbackForm").style.display =
        "none";

    document.getElementById("successMessage").style.display =
        "block";

}


/* =========================================
   ADMIN DASHBOARD
========================================= */

let allFeedbacks = [];

let currentCategory = "All";


function loadAdminFeedback() {

    const feedbackTable =
        document.getElementById("feedbackTable");

    if (!feedbackTable) {
        return;
    }


    allFeedbacks = getFeedbacks();


    updateStatistics(allFeedbacks);

    displayFeedbacks(allFeedbacks);

}


/* =========================================
   UPDATE DASHBOARD STATISTICS
========================================= */

function updateStatistics(feedbacks) {

    const feedbackCount =
        document.getElementById("feedbackCount");

    const studentCount =
        document.getElementById("studentCount");

    const averageRating =
        document.getElementById("averageRating");


    if (!feedbackCount) {
        return;
    }


    /* Total feedback */

    feedbackCount.textContent =
        feedbacks.length;


    /* Unique students */

    const students = [
        ...new Set(
            feedbacks.map(
                item => item.studentId
            )
        )
    ];

    studentCount.textContent =
        students.length;


    /* Average rating */

    if (feedbacks.length === 0) {

        averageRating.textContent = "0.0";

    } else {

        const total =
            feedbacks.reduce(
                (sum, item) =>
                    sum + Number(item.rating),
                0
            );

        const average =
            total / feedbacks.length;

        averageRating.textContent =
            average.toFixed(1);
    }

}


/* =========================================
   DISPLAY FEEDBACKS
========================================= */

function displayFeedbacks(feedbacks) {

    const feedbackTable =
        document.getElementById("feedbackTable");

    if (!feedbackTable) {
        return;
    }


    feedbackTable.innerHTML = `

        <div class="table-header">

            <div>Student ID</div>

            <div>Email</div>

            <div>Category</div>

            <div>Rating</div>

            <div>Feedback</div>

        </div>

    `;


    if (feedbacks.length === 0) {

        feedbackTable.innerHTML += `

            <div class="empty-state">

                <h3>No feedback submitted yet.</h3>

                <p>
                    Student feedback will appear here
                    after submission.
                </p>

            </div>

        `;

        return;
    }


    feedbacks.forEach(item => {

        const stars =
            "⭐".repeat(item.rating);


        feedbackTable.innerHTML += `

            <div class="feedback-row">

                <div>
                    <strong>
                        ${escapeHTML(item.studentId)}
                    </strong>
                </div>


                <div>
                    ${escapeHTML(item.email)}
                </div>


                <div>
                    ${escapeHTML(item.category)}
                </div>


                <div>
                    ${stars}
                </div>


                <div>

                    ${escapeHTML(
                        shortenText(
                            item.feedback,
                            90
                        )
                    )}

                    <br>

                    <small>
                        ${escapeHTML(item.date)}
                    </small>

                    <br>

                    <button
                        class="view-btn"
                        onclick="showFeedback(${item.id})"
                    >
                        View
                    </button>

                </div>

            </div>

        `;

    });

}


/* =========================================
   SEARCH FEEDBACK
========================================= */

function searchFeedback() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value
        .toLowerCase()
        .trim();


    const filtered =
        allFeedbacks.filter(item => {

            const matchesSearch =

                item.studentId
                    .toLowerCase()
                    .includes(search)

                ||

                item.email
                    .toLowerCase()
                    .includes(search)

                ||

                item.category
                    .toLowerCase()
                    .includes(search)

                ||

                item.feedback
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =

                currentCategory === "All"

                ||

                item.category === currentCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayFeedbacks(filtered);

}


/* =========================================
   FILTER FEEDBACK
========================================= */

function filterFeedback(category, button) {

    currentCategory = category;


    document
        .querySelectorAll(".filter")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    searchFeedback();

}


/* =========================================
   VIEW FEEDBACK DETAILS
========================================= */

function showFeedback(id) {

    const item =
        allFeedbacks.find(
            feedback => feedback.id === id
        );


    if (!item) {
        return;
    }


    const modal =
        document.getElementById("feedbackModal");

    const modalBody =
        document.getElementById("modalBody");


    modalBody.innerHTML = `

        <div class="modal-info">

            <strong>Student ID:</strong>

            ${escapeHTML(item.studentId)}

        </div>


        <div class="modal-info">

            <strong>Email:</strong>

            ${escapeHTML(item.email)}

        </div>


        <div class="modal-info">

            <strong>Category:</strong>

            ${escapeHTML(item.category)}

        </div>


        <div class="modal-info">

            <strong>Rating:</strong>

            ${"⭐".repeat(item.rating)}

        </div>


        <div class="modal-info">

            <strong>Date:</strong>

            ${escapeHTML(item.date)}

        </div>


        <div class="modal-info">

            <strong>Feedback:</strong>

            <div class="modal-feedback">

                ${escapeHTML(item.feedback)}

            </div>

        </div>

    `;


    modal.style.display = "flex";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeFeedback() {

    const modal =
        document.getElementById("feedbackModal");

    if (modal) {

        modal.style.display = "none";

    }

}


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById("feedbackModal");

        if (
            modal &&
            event.target === modal
        ) {

            modal.style.display = "none";

        }

    }
);


/* =========================================
   SHORTEN LONG FEEDBACK
========================================= */

function shortenText(text, length) {

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + "...";

}


/* =========================================
   BASIC HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* Load admin feedback */

        loadAdminFeedback();


        /* Pre-fill student email if available */

        const savedEmail =
            localStorage.getItem("studentEmail");

        const studentEmail =
            document.getElementById("studentEmail");


        if (
            savedEmail &&
            studentEmail
        ) {

            studentEmail.value =
                savedEmail;

        }

    }
);
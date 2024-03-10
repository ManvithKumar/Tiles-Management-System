var loggedUser;
var tileData ={};
var reviewsData;
var amount = 0;
var quantity = 1;
var originalPrice = 0;
const getLoggedUser = () => {
    if (sessionStorage.getItem("user")) {
        loggedUser = JSON.parse(sessionStorage.getItem("user"))
        document.getElementById("nav_username").innerHTML = loggedUser.username;
    }
    else {
        window.location.href = "/client/pages/login.html";
    }
}


const getTileDetails = () => {
    if (localStorage.getItem("tile")) {
        const tileData = JSON.parse(localStorage.getItem("tile"));
        amount = parseInt(tileData.price);
        originalPrice = amount; // Store the original price
        console.log(typeof(amount));
        document.getElementById("quantity").innerHTML = quantity;
        document.getElementById("finalprice").innerHTML = amount;
        document.getElementById("titleName").innerHTML = tileData.tname;
        document.getElementById("type").innerHTML = tileData.type;
        document.getElementById("price").innerHTML = tileData.price;
        return tileData;
    } else {
        window.location.href = "/client/pages/index.html";
    }
}

getLoggedUser(); //Run
tileData = getTileDetails();


//Reviews:

const displayReviews = (data) => {
    const reviewsContainer = document.getElementById('reviews');
    reviewsContainer.innerHTML = ''; // Clear previous content

    data.forEach(review => {
      const reviewHTML = `
        <div class="card mb-3">
          <div class="card-body">
           <div>
           <h5 class="card-title">Rating: ${review.rating}</h5>
           <p class="card-text">${review.comment}</p>
           </div>
           <h6 class="card-subtitle mb-2 text-muted">Date: ${review.createdOn}</h6>
          </div>
        </div>
      `;
      reviewsContainer.innerHTML += reviewHTML;
    });
  };




const getAllReviews = (id) => {
    
    fetch(`http://localhost:9000/reviews/tiles/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tile');
            }
            return response.json();
        })
        .then(data => {
            reviewsData = data;
            displayReviews(reviewsData)
        })
        .catch(error => {
            console.error('Error fetching tile:', error.message);
        });
    
}

getAllReviews(tileData.tid);



const createReview = async() => {

    const formData = {
        uid:loggedUser.uid,
        tid:tileData.tid,
        comment:document.getElementById("comment").value,
        rating:document.getElementById("rating").value,
    }
    try {
        const response  = await fetch(`http://localhost:9000/reviews`,
    {
        method:"POST",
        headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
        body:JSON.stringify(formData)
    })
    } catch (error) {
        
    }
    
}

document.getElementById("rating-btn").addEventListener("click",createReview)

const increment = () => {
    console.log(typeof(amount));
    // Increment the final price by the original price
    amount += originalPrice;
    document.getElementById("finalprice").innerHTML = amount;
    quantity = quantity + 1;
    document.getElementById("quantity").innerHTML = quantity;
}

const decrement = () => {
    // Decrement the final price by the original price
    amount -= originalPrice;
    quantity = quantity - 1;
    document.getElementById("quantity").innerHTML = quantity;
    document.getElementById("finalprice").innerHTML = amount;
}

//Order Section:

var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var closeBtn = document.getElementById("closeModalBtn");
btn.onclick = function () {
    modal.style.display = "block";
}
closeBtn.onclick = function () {
    modal.style.display = "none";
}

//Order :

const createOrder = async (e) => {
    e.preventDefault();
    const formData = {
        uid: loggedUser.uid,
        tid: tileData.tid,
        price: amount,
        quantity: quantity,
        deliveredOn: "12-03-2024" // Assuming this value is set elsewhere
    };

    try {
        const response = await fetch(`http://localhost:9000/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const data = await response.json();
        console.log(data); // Log the response data

        // Store the order data in localStorage if needed
        localStorage.setItem("order", JSON.stringify(data.order));
        window.location.href ="/client/pages/payment.html"

        // Close the modal
        modal.style.display = "none";
    } catch (error) {
        console.error('Error creating order:', error);
    }
}; 

document.getElementById("confirmBtn").addEventListener("click", createOrder);

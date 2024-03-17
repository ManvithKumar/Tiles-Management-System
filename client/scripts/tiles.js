var loggedUser;
var tilesData;

const checkAdmin  = (data) =>{
  console.log(data);
  if(data.role !== "admin")
  {
    document.getElementById("admin-routes").innerHTML=""
  }
  else{
    document.getElementById("admin-routes").style.display="block"
  }
}

const getLoggedUser = () =>{
 if( sessionStorage.getItem("user"))
 {
    loggedUser = JSON.parse(sessionStorage.getItem("user"))
    document.getElementById("nav_username").innerHTML =loggedUser.username;
    checkAdmin(loggedUser)
 }
 else{
  window.location.href = "/client/pages/login.html";
 }
}
 getLoggedUser();

getLoggedUser();

const types = [
  "Kitchen",
  "Bathroom",
  "Floor",
  "Exterior Walls",
  "Roof",
  "Pool"
];

function populateTileType() {
  const tileDropdown = document.getElementById("tiletypes");
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    tileDropdown.appendChild(option);
  });
}

populateTileType();

var modal = document.getElementById("myModal");
var btn = document.getElementById("openModalBtn");
var closeBtn = document.getElementById("closeModalBtn");

btn.onclick = function () {
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const createTile = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('tname', document.getElementById("tilename").value);
  formData.append('type', document.getElementById("tiletypes").value);
  formData.append('stock', document.getElementById("stock").value);
  formData.append('price', document.getElementById("price").value);
  
  // Get the file from the input field
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0]; // Get the first file from the input
  
  // Append the file to the FormData
  formData.append('image', imageFile);

  try {
    const response = await fetch("http://localhost:9000/tiles", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create tile');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error creating tile:', error);
  }
};


const deleteTileById = async (id) => {
  try {
    const response = await fetch(`http://localhost:9000/tiles/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete tile');
    }
    const data = await response.json();
    console.log(data.message);
    getAllTiles();
  } catch (error) {
    console.error('Error deleting tile:', error.message);
  }
};

function populateTable(data) {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = '';
  data.forEach(post => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${post.tid}</td>
            <td>${post.tname}</td>
            <td>${post.type}</td>
            <td>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn" data-id="${post.tid}">Delete</button>
            </td>
        `;

    tableBody.appendChild(row);
  });

  tableBody.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('edit-btn')) {
      const row = target.closest('tr');
      const tile = {
        tid: row.querySelector('td:first-child').textContent,
        tname: row.querySelector('td:nth-child(2)').textContent,
        type: row.querySelector('td:nth-child(3)').textContent,
        stock: row.querySelector('td:nth-child(4)').textContent,
        price: row.querySelector('td:nth-child(5)').textContent
      };
      handleEditButtonClick(tile);
    } else if (target.classList.contains('delete-btn')) {
      const id = target.getAttribute('data-id');
      deleteTileById(id);
    }
  });
}

const getAllTiles = () => {
  fetch('http://localhost:9000/tiles')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      populateTable(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

getAllTiles();

function handleEditButtonClick(tile) {
  document.getElementById("tilename").value = tile.tname;
  document.getElementById("tiletypes").value = tile.type;
  document.getElementById("stock").value = tile.stock;
  document.getElementById("price").value = tile.price;
  modal.style.display = "block";

  document.getElementById("update-btn").addEventListener("click", () => {
    updateTile(tile.tid);
  });
}

const updateTile = async (tid) => {
  const tname = document.getElementById("tilename").value;
  const type = document.getElementById("tiletypes").value;
  const stock = document.getElementById("stock").value;
  const price = document.getElementById("price").value;

  try {
    const response = await fetch(`http://localhost:9000/tiles/${tid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tname, type, stock, price })
    });

    if (!response.ok) {
      throw new Error("Failed to update tile");
    }

    const data = await response.json();
    console.log(data);
    modal.style.display = "none";
    getAllTiles();
  } catch (error) {
    console.error("Error updating tile:", error);
  }
};

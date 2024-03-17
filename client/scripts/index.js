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
    document.getElementById("nav_username").innerHTML = loggedUser.username;
    checkAdmin(loggedUser)
 }
 else{
  window.location.href = "/client/pages/login.html";
 }
}
 getLoggedUser();


 function populateCards(data) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    
    data.forEach(tile => {
      const card = document.createElement('div');
      card.className = 'card mb-3 box';
      card.style = 'width: 18rem;';
  
      const cardImage = document.createElement('img');
      cardImage.className = 'card-img-top';
      cardImage.className ='card-img'
      const  image = tile.image
      // const imagePath = image.replace(/\\/g, "/");
      // const imageUrl = `http://localhost:9000/${imagePath}`;
      // console.log(imageUrl);
      cardImage.src =image; 
      cardImage.alt = 'Tile Image';
  
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
  
      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title';
      cardTitle.textContent = tile.tname;
  
      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = tile.description; 

      const cardTextPrice = document.createElement('p');
      cardTextPrice.className='card-text';
      cardTextPrice.innerHTML =`
      <div>
        <h4>Type : ${tile.type}</h4>
        <span"> Rs:     <strong class="text-success">${tile.price}</strong></span><br/>
        <span>Remaining Stock : <strong>${tile.stock}</strong></span>
      </div>`;
  
      const cardLink = document.createElement('a');
      cardLink.className = tile.stock !==0 ? 'btn btn-primary card-btn':'btn btn-danger card-btn';
      cardLink.textContent = tile.stock !==0 ? 'Details':'Out of Stock';

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      cardBody.appendChild(cardTextPrice)
      cardBody.appendChild(cardLink);
  
      card.appendChild(cardImage);
      card.appendChild(cardBody);
  
      cardContainer.appendChild(card);

      // Adding an event listener to the button inside each card
      cardLink.addEventListener('click', () => {
         if(tile.stock !== 0)
         {
          const myTile = tile; 
          localStorage.setItem("tile",JSON.stringify(myTile));
          window.location.href="/client/pages/details.html"
         }
      });
    });
}



 const getAllTiles = () => {
    fetch('http://localhost:9000/tiles')
      .then(response => response.json())
      .then(data => {
        tilesData = data
        populateCards(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  getAllTiles();


const types=[
    "Kitchen",
    "Bathroom",
    "Floor",
   " Exterior Walls",
    "Roof",
    "Pool"
]
    
populateTileType = () =>{
    const tileDropdown = document.getElementById("tiletypes");
    types.forEach((type)=>{
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        tileDropdown.appendChild(option);
    })
}

populateTileType();
const menuItems = [
    { id: 1, name: "Crusty Garlic Focaccia with Melted Cheese", price: 799, type: "Main" },
    { id: 2, name: "Blueberry Shake", price: 299, type: "Drinks" },
    { id: 3, name: "Home Country Fries with Herbs & Chilli Flakes", price: 399, type: "Appetizers" },
    { id: 4, name: "French Fries with Cheese and Japapenos", price: 499, type: "Appetizers" },
    { id: 5, name: "Chicken Tikka Masala", price: 899, type: "Main" },
    { id: 6, name: "Hazelnut latte", price: 399, type: "Drinks" },
    { id: 7, name: "Chicken Nuggets", price: 299, type: "Sides" },
    { id: 8, name: "Potato Wedges", price: 199, type: "Sides" },
    { id: 9, name: "Coke", price: 199, type: "Drinks" },
    { id: 10, name: "Butter Chiken", price: 799, type: "Main" },
    { id: 11, name: "Vegetable Thukpa", price: 399, type: "Appetizers" },
    { id: 12, name: "Ice tea", price: 199, type: "Drinks" },
    { id: 13, name: "Hakka Noodles", price: 399, type: "Chinese" },
    { id: 14, name: "Fried Rice", price: 299, type: "Chinese" },
];

const tableItems = [
{id: 1, name:"Table 1"},
{id: 2, name:"Table 2"},
{id: 3, name:"Table 3"},
{id: 4, name:"Table 4"},
{id: 5, name:"Table 5"},
{id: 6, name:"Table 6"},
{id: 7, name:"Table 7"},
{id: 8, name:"Table 8"},
];
let currentSessions = {};

document.addEventListener("DOMContentLoaded", () => {
    const menuList = document.getElementById("menuList");
    const tableList = document.getElementById("tableList")
    const menuSearchInput = document.getElementById("menuSearch");              // Input 
    const clearMenuSearch = document.getElementById("clearMenuSearch");      // Button
    const tableSearchInput = document.getElementById("tableSearch");                // Input
    const clearTableSearch = document.getElementById("clearTableSearch");       // Button
    const billPopup = document.getElementById("billPopup");                                 // Div
    const billDetails = document.getElementById("billDetails");                                // Table  
    const totalPrice = document.getElementById("totalPrice");                                 // Div
    const popupTableNum = document.getElementById("popupTableNum");          // Span 
    const closeBtn = document.querySelector(".close-btn");                                    // Button


    console.log(menuSearchInput)
    menuItems.forEach(item => {
        
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₹${item.price}`;          
        li.draggable = true;
        li.addEventListener("dragstart", (e) => {
            // e.currentTarget.classList.add("dragging");                           //To verify if the drag functionality is working or not.
            e.dataTransfer.setData("text/plain", JSON.stringify(item));
        });
        menuList.appendChild(li);
    });

  tableItems.forEach(i=>{
    const  div = document.createElement("div");
    div.textContent = `${i.name}`
    div.classList.add("table");
    div.setAttribute("data-table",`${i.id}`)
    tableList.appendChild(div);
  })

    // Drag and Drop Functionality on tables. Tables will have dragover and drop event whereas menuitems will have dragstart event
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        table.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        table.addEventListener("drop", (e) => {
            e.preventDefault();
            const item = JSON.parse(e.dataTransfer.getData("text/plain"));
            const tableNum = table.dataset.table;

            if (!currentSessions[tableNum]) {
                currentSessions[tableNum] = { items: {}, total: 0 };
                console.log(currentSessions)                    //Debugging
            }

            currentSessions[tableNum].items[item.name] = (currentSessions[tableNum].items[item.name] || 0) + 1;
            currentSessions[tableNum].total += item.price;

            updateTableDisplay(tableNum);
        });

        table.addEventListener("click", (e) => {
            const current = e.currentTarget;
            current.style.backgroundColor = 'rgb(4, 34, 58)';
            current.style.color = 'cyan';
            showBillPopup(table.dataset.table);    
        });
    });

    // Menu search functionality
    menuSearchInput.addEventListener("input", () => {
        const query = menuSearchInput.value.toLowerCase().trim();

        Array.from(menuList.children).forEach(li => {
            const itemName = li.textContent.toLowerCase();
            const item = menuItems.find(i => i.name.toLowerCase() === itemName.split(' - ')[0]);            //Spilts the text content into item name and item price using "-" as delimeter.
            const itemType = item ? item.type.toLowerCase() : '';

            li.style.display = itemName.includes(query) || itemType.includes(query) ? "block" : "none";
        });
    });

    // Clear menu search functionality by clicking the cross button
    clearMenuSearch.addEventListener("click", () => {
        menuSearchInput.value = "";
        Array.from(menuList.children).forEach(li => {
            li.style.display = "block";
        });
        menuSearchInput.focus();
    });

    // Table search functionality
    tableSearchInput.addEventListener("input", () => {
        const query = tableSearchInput.value.toLowerCase().trim();
        Array.from(tables).forEach(table => {
            const tableName = table.textContent.toLowerCase();
            table.style.display = tableName.includes(query) ? "block" : "none";
        });
    });

    // Clear table search functionality by clicking the cross button
    clearTableSearch.addEventListener("click", () => {
        tableSearchInput.value = "";
        Array.from(tables).forEach(table => {
            table.style.display = "block";
        });
        tableSearchInput.focus();
    });

    // Close Bill popup tab
    closeBtn.addEventListener("click", () => {
        billPopup.style.display = "none";
    });
   
    // End session button
    document.getElementById("endSession").addEventListener("click", () => {
        const tableNum = popupTableNum.textContent;
        delete currentSessions[tableNum];
        billPopup.style.display = "none";
        updateTableDisplay(tableNum);
        alert("Thank you for visiting")
    });
});




function updateTableDisplay(tableNum) {
    const table = document.querySelector(`.table[data-table='${tableNum}']`);
    const session = currentSessions[tableNum];
    if (session) {
        const totalItems = Object.values(session.items).reduce((a, b) => a + b, 0);
        table.textContent = `Table ${tableNum} - ${totalItems} items - ₹${session.total}`;
    } else {
        table.textContent = `Table ${tableNum}`;
    }
}

function showBillPopup(tableNum) {
    const session = currentSessions[tableNum];
    const billDetails = document.getElementById("billDetails");
    const totalPrice = document.getElementById("totalPrice");
    const popupTableNum = document.getElementById("popupTableNum");

    popupTableNum.textContent = tableNum;
    billDetails.innerHTML = ""; // Clear previous bill details
    console.log("This is session log "+session)
    let flag =0;
    if (session) {
        let serialNo = 1;
        
        console.log(Object.entries(session.items))
        for (const [itemName, count] of Object.entries(session.items)) {  
            console.log(itemName+" : "+count)                          // Looping through session object to match the item name
            const item = menuItems.find(i => i.name === itemName);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${serialNo++}</td>
                <td>${itemName}</td>
                <td>₹${item.price}</td>
                <td><label>No. of Servings</label></td>
                <td><input type="number" id="count"  min="1" max="10" value='${count}' oninput="changeItemCount('${tableNum}','${itemName}')"></input></td>    
                    <button class="billBtn" onclick="removeItem('${tableNum}', '${itemName}')">✖</button>
                </td>
            `;

            billDetails.appendChild(tr);
        }
        totalPrice.textContent = `Total: ₹${session.total}`;
    } else {
        billDetails.innerHTML = "<tr><td colspan='5'>No items added.</td></tr>";
        totalPrice.textContent = `Total: ₹0`;
    }
          
        document.getElementById("billPopup").style.display = "flex";        // Show the popup
       
        // const endBtn = document.getElementById("endSession");
        // const sessionLength = Object.entries(session).length;
        // console.log("This is Session Length : "+sessionLength) 
        // if(sessionLength==null || sessionLength==undefined)
        //     endBtn.style.display = "none"
        const modal = document.getElementById("billPopup");
        billPopup.addEventListener('click', (e)=>{
            if(e.target == modal){
                billPopup.style.display="none"
            }
        });
}


function changeItemCount(tableNum, itemName) {
    const session = currentSessions[tableNum];

    if (session && session.items[itemName]) {
        const item = menuItems.find(i => i.name === itemName);              //Matching menu item list name with the current itemName in the BillPopUp Menu

        // Get the input field specific to this item
        const itemRow = Array.from(billDetails.children).find(tr => tr.children[1].textContent === itemName);           //item name is at 1st index of the table row content in the Bill Pop Up Menu
        const inputCount = itemRow.querySelector('#count');
        let newCount = parseInt(inputCount.value, 10) || 0;

        let value = newCount;
        let min = 1;
         let max = 10;
             if (value < min) {
                  newCount = min;
                    } else if (value > max) {
                         newCount = max;
                         }


        // Update session items and total
        if (newCount > 0) {
            session.total -= (session.items[itemName] * item.price);        // Subtract the old total
            session.items[itemName] = newCount;                                 // Update the count
            session.total += (newCount * item.price);                   // Add the new total
        } 
        else {
            // If count is 0, remove the item
            delete session.items[itemName];
            session.total -= (item.price); // Adjust total
        }

        updateTableDisplay(tableNum); // Update table display
        showBillPopup(tableNum); // Refresh the popup display
    }
}



function removeItem(tableNum, itemName) {
    const session = currentSessions[tableNum];
    if (session && session.items[itemName]) {
        const item = menuItems.find(i => i.name === itemName);
        session.total -= (session.items[itemName] * item.price);
        delete session.items[itemName];
        updateTableDisplay(tableNum);
        showBillPopup(tableNum); // Refresh the popup display
    }
}


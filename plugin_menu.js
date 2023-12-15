// Assign functions to buttons
const deleteButton = document.getElementById('delete');
const title = document.getElementById('title');

deleteButton.addEventListener('click', handleDelete);

function handleDelete() {
    deleteData()
}

// ------------------------------------------------------------- //

// delete all username-password entries from the database
function deleteData() {
    fetch(`http://localhost:5000/delete`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        deleteButton.disabled = true;
        title.textContent = "Passwords deleted!"
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
const activeUser=getActiveUser();
if (!activeUser) window.location.href='login.html';

const users=getAllUsers();
const userIndex=users.findIndex(u=>u.username===activeUser.username);
if (userIndex!==-1) {
    const user=users[userIndex];
    user.readingList=(user.readingList || []).filter(b=>b&&b.title);
    saveAllUsers(users);
    saveActiveUser(user);
}

const readingListDiv=document.getElementById('readingListContainer');
const readingList=activeUser.readingList || [];

if (readingList.length===0){
    readingListDiv.innerHTML='<div class="box"><p>No books in your reading list yet.</p></div>';
} else{
    readingListDiv.innerHTML='';
    readingList.forEach(book=>{
        const cover=(book.covers&&book.covers.length>0)
            ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
            : '../assets/nocover.png';
        const bookDiv=document.createElement('div');
        bookDiv.classList.add('box');
        bookDiv.innerHTML=`
            <h3>${book.title}</h3>
            <img src="${cover}" alt="${book.title}" style="width:100px; height:150px; object-fit:contain;"><br>
            <p><b>Author:</b> ${book.authorName || 'Unknown'}</p>
            <p><b>Published:</b> ${book.publishYear || 'N/A'}</p>
            <button style="width:120px; margin-right: 8px;" onclick="markAsRead('${book.key}')">Mark as Read</button>
            <button style="width:80px;" onclick="deleteBook('${book.key}')">Delete</button>
        `;
        readingListDiv.appendChild(bookDiv);
    });
}

function markAsRead(bookKey){
    const users=getAllUsers();
    const userIndex=users.findIndex(u=>u.username===activeUser.username);
    if (userIndex===-1) return;
    const user=users[userIndex];
    const bookIndex=user.readingList.findIndex(b=>b.key===bookKey);
    if (bookIndex===-1){
        console.error('Book not found for key:',bookKey);
        return alert('Book not found.');
    }
    const [book]=user.readingList.splice(bookIndex,1);
    user.doneRead.push(book);
    saveAllUsers(users);
    saveActiveUser(user);
    alert(`"${book.title}" moved to Done Read!`);
    window.location.reload();
}

function deleteBook(bookKey){
    if (!confirm('Are you sure you want to delete this book from your Reading List?')) return;
    const users=getAllUsers();
    const userIndex=users.findIndex(u=>u.username===activeUser.username);
    if (userIndex===-1) return;
    const user=users[userIndex];
    user.readingList=user.readingList.filter(b=>b.key!==bookKey);
    saveAllUsers(users);
    saveActiveUser(user);
    alert('Book removed from Reading List.');
    window.location.reload();
}

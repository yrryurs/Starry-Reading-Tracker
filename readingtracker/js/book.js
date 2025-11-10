const activeUser=getActiveUser();
if (!activeUser)window.location.href='login.html';

const bookDetailBox=document.getElementById('bookDetailBox');

const bookData=JSON.parse(sessionStorage.getItem('selectedBook'));
if (!bookData){
    bookDetailBox.innerHTML='<p>No book selected. Please go back and choose a book.</p>';
} else{
    displayBookDetail(bookData);
}

async function displayBookDetail(book){
    const workKey=book.key.replace('/works/', '');
    const editionsUrl=`https://openlibrary.org/works/${workKey}/editions.json`;
    let editionData={};
    try{
        const res=await fetch(editionsUrl);
        const data=await res.json();
        editionData=data.entries?.[0] || {};
    } catch(err){
        console.error('Error fetching edition details:', err);
    }
    const publishYear=editionData.publish_date?.match(/\d{4}/)?.[0] || 'N/A';
    const totalPages=editionData.number_of_pages || 'N/A';
    const availableOnline=editionData.ocaid ? '✅ Yes' : '❌ No';
    const editionName=editionData.edition_name || editionData.title || 'N/A';
    const coverImg=book.covers?.[0] 
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` 
        : '../assets/nocover.png';
    const description=book.description 
        ? (typeof book.description==='string' ? book.description : book.description.value) 
        : 'No description available.';
    bookDetailBox.innerHTML=`
        <h2>${book.title}</h2><br>
        <img src="${coverImg}" alt="${book.title}" style="width:80px; height:120px; object-fit: contain; margin-bottom:8px;">
        <p><b>Author:</b> ${book.authorName}</p>
        <p><b>Edition:</b> ${editionName}</p>
        <p><b>Published Year:</b> ${publishYear}</p>
        <p><b>Total Pages:</b> ${totalPages}</p>
        <p><b>Available Online:</b> ${availableOnline}</p>
        <p style="width: 800px; word-wrap: break-word; margin: 0 auto;"><b>Description:</b> ${description}</p><br><br>
        <button id="addReadingBtn" style="width:150px;">Add to Reading List</button>
    `;
    document.getElementById('addReadingBtn').addEventListener('click',()=>{
        book.publishYear=publishYear;
        addToReadingList('readingList',book);
    });
}

function addToReadingList(listType,book){
    const users=getAllUsers();
    const userIndex=users.findIndex(u=>u.username===activeUser.username);
    if (userIndex===-1) return alert('Active user not found!');
    const bookKey=book.key || book.id || book.title;
    if (!bookKey){
        console.warn('Book has no key, skipping:', book);
        return alert('This book cannot be added (missing ID).');
    }
    const bookToSave={
        key:bookKey,
        title:book.title || 'Untitled',
        authorName:book.authorName || (book.authors?.[0]?.name || 'Unknown'),
        covers:book.covers || [],
        publishYear:book.publishYear || 'N/A',
        number_of_pages:book.number_of_pages || 'N/A'
    };
    if (users[userIndex][listType].some(b=>b.key===bookToSave.key)){
        return alert('Book already in your Reading List.');
    }
    users[userIndex][listType].push(bookToSave);
    saveAllUsers(users);
    saveActiveUser(users[userIndex]);
    alert(`Book added to your ${listType==='readingList' ? 'Reading List' : 'Done Read'}!`);
}

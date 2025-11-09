const activeUser=getActiveUser();
if (!activeUser) window.location.href='login.html';

const searchBtn=document.getElementById('searchBtn');
const authorNameInput=document.getElementById('authorName');
const authorsListDiv=document.getElementById('authorsList');

searchBtn.addEventListener('click',async()=>{
    const query=authorNameInput.value.trim();
    if (!query) return alert('Please enter an author name.');
    authorsListDiv.innerHTML='<div class="box"><p>Loading authors...</p></div>';
    const authors=await searchAuthors(query);
    displayAuthors(authors);
});

async function searchAuthors(authorName){
    try{
        const url=`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`;
        const response=await fetch(url);
        const data=await response.json();
        return data.docs.slice(0, 10);
    } catch(err){
        console.error(err);
        alert('Error fetching authors.');
        return [];
    }
}

function displayAuthors(authors){
    if (authors.length===0){
        authorsListDiv.innerHTML='<div class="box"><p>No authors found.</p></div>';
        return;
    }
    authorsListDiv.innerHTML='';
    const gridDiv=document.createElement('div');
    gridDiv.style.display='flex';
    gridDiv.style.flexWrap='wrap';
    gridDiv.style.justifyContent='space-between';
    gridDiv.style.gap='10px';
    authors.forEach(author=>{
        const authorDiv=document.createElement('div');
        authorDiv.classList.add('box');
        authorDiv.style.width='40%';
        authorDiv.innerHTML=`
            <h3><img src="../assets/write.png" style='width:40px; margin-right:10px;'>${author.name}</h3><br>
            <p><b>Work Count:</b> ${author.work_count || 'N/A'}</p>
            <p style="word-wrap: break-word; margin: 0 auto;"><b>Top Work:</b> ${author.top_work || 'N/A'}</p><br><br>
            <button style="width: 25%;" onclick="showWorks('${author.key}','${author.name}')">See Books</button>
        `;
        gridDiv.appendChild(authorDiv);
    });
    authorsListDiv.appendChild(gridDiv);
}

async function showWorks(authorKey,authorName){
    const authorId=authorKey.replace('/authors/', '');
    const url=`https://openlibrary.org/authors/${authorId}/works.json`;
    authorsListDiv.innerHTML='<div class="box"><p>Loading books...</p></div>';
    try{
        const response=await fetch(url);
        const data=await response.json();
        displayWorks(data.entries,authorName);
    } catch(err){
        console.error(err);
        alert('Error fetching books.');
    }
}

function displayWorks(books,authorName){
    authorsListDiv.innerHTML=`<div class="box" style="background-color: #6aa4e7ff;"><h3>Books by ${authorName}</h3></div>`;
    const listDiv=document.createElement('div');
    listDiv.style.display='flex';
    listDiv.style.flexWrap='wrap';
    listDiv.style.justifyContent='space-between';
    listDiv.style.gap='15px';
    books.slice(0,20).forEach(book=>{
        const bookDiv=document.createElement('div');
        bookDiv.classList.add('box');
        bookDiv.style.width='22%';
        bookDiv.style.textAlign='center';
        const coverImg=book.covers&&book.covers.length>0
            ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
            : '../assets/nocover.png';
        bookDiv.innerHTML=`
            <img src="${coverImg}" alt="${book.title}" style="width:80px; height:120px; object-fit: contain; margin-bottom:8px;">
            <h4 style="font-size: 16px; margin: 5px 0;">${book.title}</h4>
            <button style="width:70%; margin-top:5px;" onclick='selectBook(${JSON.stringify({...book,authorName:authorName})})'>View Details</button>
        `;
        listDiv.appendChild(bookDiv);
    });
    authorsListDiv.appendChild(listDiv);
}

function selectBook(book) {
    sessionStorage.setItem('selectedBook',JSON.stringify(book));
    window.location.href='../html/book.html';
}

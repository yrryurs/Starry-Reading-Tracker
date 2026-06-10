document.addEventListener('DOMContentLoaded',()=>{
    const searchForm=document.getElementById('searchForm');
    const searchInput=document.getElementById('searchInput');
    const resultsContainer=document.getElementById('resultsContainer');

    function renderUserProfile(user){
        resultsContainer.innerHTML='';
        if (!user){
            resultsContainer.innerHTML=`<div class="box"><p>User not found.</p></div>`;
            return;
        }
        const userDiv=document.createElement('div');
        userDiv.classList.add('box');
        userDiv.innerHTML=`
            <h2>${user.username}'s Profile</h2>
            <p><b>Bio:</b> ${user.bio || 'No bio yet'}</p>
            <p><b>Total Books Read:</b> ${user.doneRead?.length || 0}</p><br>
            <p><b>TOP 5 BOOKS:</b></p>
        `;
        resultsContainer.appendChild(userDiv);
        const topBooks=(user.doneRead || [])
            .filter(b=>typeof b.rating==='number'&&b.rating>0)
            .sort((a,b)=>b.rating-a.rating)
            .slice(0,5);

        if (topBooks.length>0){
            const topBooksContainer=document.createElement('div');
            topBooksContainer.style.display='flex';
            topBooksContainer.style.gap='10px';
            topBooksContainer.style.flexWrap='wrap';
            topBooks.forEach(book=>{
                const cover=(book.covers&&book.covers.length>0)
                    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
                    : '../assets/nocover.png';
                const bookDiv=document.createElement('div');
                bookDiv.classList.add('box');
                bookDiv.style.width='200px';
                bookDiv.style.textAlign='center';
                bookDiv.innerHTML=`
                    <img src="${cover}" alt="${book.title}" style="width:100px; height:150px; object-fit:contain;"><br>
                    <p><b>${book.title}</b></p>
                    <p><b>Author:</b> ${book.authorName}</p>
                    <p>⭐ ${book.rating}</p>
                `;
                topBooksContainer.appendChild(bookDiv);
            });
            resultsContainer.appendChild(topBooksContainer);
        }
    }

    searchForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const username=searchInput.value.trim();
        if (!username) return;
        const users=getAllUsers();
        const user=users.find(u=>u.username.toLowerCase()===username.toLowerCase());
        renderUserProfile(user);
    });
});

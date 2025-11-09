document.addEventListener('DOMContentLoaded',()=>{
    let activeUser=getActiveUser();
    if (!activeUser){
        alert('No active user found! Redirecting to login...');
        window.location.href='login.html';
        return;
    }
    const users=getAllUsers();
    const user=users.find(u=>u.username===activeUser.username);
    if (!user){
        alert('User not found! Redirecting to login...');
        window.location.href='login.html';
        return;
    }
    activeUser=user;
    const profileContainer=document.getElementById('profileContainer');
    profileContainer.innerHTML='';
    const profileInfoDiv=document.createElement('div');
    profileInfoDiv.classList.add('box');
    profileContainer.appendChild(profileInfoDiv);

    function renderBio(){
        profileInfoDiv.innerHTML=`
            <h2>${activeUser.username}'s Profile</h2>
            <p>
                <b>Bio:</b> <span id="bioText">${activeUser.bio || 'No bio yet'}</span>
                <button id="editBioBtn" style="margin-left:10px;">${activeUser.bio ? 'Edit' : 'Add'}</button>
            </p>
            <p><b>Total Books Read:</b> ${activeUser.doneRead.length}</p>
        `;
        const bioModal=document.getElementById('bioModal');
        const bioInput=document.getElementById('bioInput');
        const saveBioBtn=document.getElementById('saveBioBtn');
        const cancelBioBtn=document.getElementById('cancelBioBtn');
        document.getElementById('editBioBtn').addEventListener('click',()=>{
            bioInput.value=activeUser.bio || '';
            bioModal.style.display='flex';
        });
        saveBioBtn.addEventListener('click',()=>{
            activeUser.bio=bioInput.value.trim();
            const allUsers=getAllUsers();
            const userIndex=allUsers.findIndex(u=>u.username===activeUser.username);
            allUsers[userIndex]=activeUser;
            saveAllUsers(allUsers);
            saveActiveUser(activeUser);
            bioModal.style.display='none';
            renderBio();
        });
        cancelBioBtn.addEventListener('click',()=>{
            bioModal.style.display='none';
        });
    }

    renderBio();
    const doneReadWithRating=(activeUser.doneRead||[]).filter(b=>typeof b.rating==='number');
    const topBooks=doneReadWithRating
        .sort((a,b)=>b.rating-a.rating)
        .slice(0,5);
    if (topBooks.length===0){
        const noBooksDiv=document.createElement('div');
        noBooksDiv.classList.add('box');
        noBooksDiv.innerHTML=`<p>No rated books yet.</p>`;
        profileContainer.appendChild(noBooksDiv);
    } else{
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
        profileContainer.appendChild(topBooksContainer);
    }

});
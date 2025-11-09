const activeUser=getActiveUser();
if (!activeUser) window.location.href='login.html';

const users=getAllUsers();
const userIndex=users.findIndex(u=>u.username===activeUser.username);
const user=users[userIndex];
const doneRead=user.doneRead || [];

const doneContainer=document.getElementById('doneReadContainer');

if (doneRead.length===0){
    doneContainer.innerHTML='<div class="box"><p>No books marked as done yet.</p></div>';
} else{
    doneContainer.innerHTML=`
        <div class="box" style="background-color: #6aa4e7ff;"><h3 style="text-align:center;">Books To Review</h3></div>
        <div id="unreviewed" style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-bottom:30px;"></div>
        <div class="box" style="background-color: #6aa4e7ff;"><h3 style="text-align:center;">Reviewed Books</h3></div>
        <div id="reviewed" style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;"></div>
    `;
    const unreviewedDiv=document.getElementById('unreviewed');
    const reviewedDiv=document.getElementById('reviewed');
    doneRead.forEach((book,index)=>{
        const cover=(book.covers&&book.covers.length>0)
            ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
            : '../assets/nocover.png';
        const bookDiv=document.createElement('div');
        bookDiv.classList.add('box');
        bookDiv.style.width='250px';
        bookDiv.style.textAlign='center';
        if (!book.rating&&!book.review){
            bookDiv.innerHTML=`
                <h3>${book.title}</h3>
                <img src="${cover}" alt="${book.title}" style="width:100px; height:150px; object-fit:contain;">
                <p><b>Author:</b> ${book.authorName || 'Unknown'}</p>
                <p><b>Published:</b> ${book.publishYear || 'N/A'}</p>
                <div class="rating" id="rating-${index}">
                    ${[1,2,3,4,5].map(i=>`<span class="star"data-value="${i}">★</span>`).join('')}
                </div>
                <textarea id="review-${index}" placeholder="Write your review..." style="width:90%;height:60px;margin-top:10px;"></textarea><br><br>
                <button style="width:100px; margin-right: 8px;" onclick="saveReview(${index})">Save Review</button>
                <button onclick="deleteBook('${book.key}')">Delete</button>
            `;
            unreviewedDiv.appendChild(bookDiv);
            const stars=bookDiv.querySelectorAll('.star');
            stars.forEach(star=>{
                star.addEventListener('click',()=>{
                    const value=parseInt(star.getAttribute('data-value'));
                    stars.forEach(s=>s.style.color=s.getAttribute('data-value')<=value?'#FFD700':'#ccc');
                    document.getElementById(`rating-${index}`).setAttribute('data-rating',value);
                });
            });
        } else{
            const starsHTML='★'.repeat(book.rating||0)+'☆'.repeat(5-(book.rating||0));
            bookDiv.innerHTML=`
                <h3>${book.title}</h3>
                <img src="${cover}" alt="${book.title}" style="width:100px; height:150px; object-fit:contain;">
                <p><b>Author:</b> ${book.authorName || 'Unknown'}</p>
                <p><b>Published:</b> ${book.publishYear || 'N/A'}</p>
                <p><b>Rating:</b><span id="current-rating-${index}" style="color:#FFD700">${starsHTML}</span></p>
                <p><b>Review:</b> <span id="current-review-${index}">${book.review}</span></p>
                <button onclick="editReview(${index})">Edit</button>
                <button onclick="deleteBook('${book.key}')">Delete</button>
            `;
            reviewedDiv.appendChild(bookDiv);
        }
    });
}

function saveReview(index){
    const reviewText=document.getElementById(`review-${index}`).value.trim();
    const ratingEl=document.getElementById(`rating-${index}`);
    const ratingValue=parseInt(ratingEl.getAttribute('data-rating'))||0;
    if (!reviewText) return alert('Please write a review first!');
    const users=getAllUsers();
    const userIndex=users.findIndex(u=>u.username===activeUser.username);
    const user=users[userIndex];
    if (!user.doneRead[index]) return;
    const book=user.doneRead[index];
    book.review=reviewText;
    book.rating=ratingValue;
    saveAllUsers(users);
    saveActiveUser(user);
    alert(`Review saved! Rating: ${ratingValue} stars`);
    window.location.reload();
}

function editReview(index){
    const book=user.doneRead[index];
    const bookDiv=document.getElementById('reviewed').children[index];
    const cover=(book.covers&&book.covers.length>0)
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
        : '../assets/nocover.png';
    bookDiv.innerHTML=`
        <h3>${book.title}</h3>
        <img src="${cover}" alt="${book.title}" style="width:100px; height:150px; object-fit:contain;">
        <p><b>Author:</b> ${book.authorName || 'Unknown'}</p>
        <p><b>Published:</b> ${book.publishYear || 'N/A'}</p>
        <div class="rating" id="rating-${index}">
            ${[1,2,3,4,5].map(i=>`<span class="star" data-value="${i}">★</span>`).join('')}
        </div>
        <textarea id="review-${index}" style="width:90%;height:60px;margin-top:10px;">${book.review}</textarea><br><br>
        <button style="width:100px; margin-right:8px;" onclick="saveReview(${index})">Save Review</button>
        <button onclick="deleteBook('${book.key}')">Delete</button>
    `;
    const stars=bookDiv.querySelectorAll('.star');
    stars.forEach(star=>{
        const value=parseInt(star.getAttribute('data-value'));
        if (value<=(book.rating || 0))star.style.color='#FFD700';
        star.addEventListener('click',()=>{
            stars.forEach(s=>s.style.color=s.getAttribute('data-value')<=value ? '#FFD700' : '#ccc');
            document.getElementById(`rating-${index}`).setAttribute('data-rating',value);
        });
    });
    document.getElementById(`rating-${index}`).setAttribute('data-rating',book.rating || 0);
}

function deleteBook(bookKey){
    const users=getAllUsers();
    const userIndex=users.findIndex(u=>u.username===activeUser.username);
    const user=users[userIndex];
    user.doneRead=user.doneRead.filter(b=>b.key!==bookKey);
    saveAllUsers(users);
    saveActiveUser(user);
    alert('Book deleted from Done Read.');
    window.location.reload();
}

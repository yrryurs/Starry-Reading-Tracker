function getAllUsers(){
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveAllUsers(users){
  localStorage.setItem('users',JSON.stringify(users));
}

function getActiveUser(){
  return JSON.parse(localStorage.getItem('activeUser'));
}

function saveActiveUser(user){
  localStorage.setItem('activeUser',JSON.stringify(user));
}

function logout(){
  localStorage.removeItem('activeUser');
  window.location.href='../html/login.html';
}

function signup(username,password){
  if (!username.trim() || !password.trim()){
    alert("Please enter both a username and password.");
    return false;
  }
  const users=getAllUsers();
  if (users.find(u=>u.username.toLowerCase()===username.toLowerCase())){
    alert("Username already exists. Try another one.");
    return false;
  }
  const newUser={ 
    username:username.trim(), 
    password:password.trim(), 
    readingList:[], 
    doneRead:[] 
  };
  users.push(newUser);
  saveAllUsers(users);
  alert("Account created successfully!");
  return true;
}

function login(username,password){
  if (!username.trim() || !password.trim()) return false;
  const users=getAllUsers();
  const user=users.find(u=>u.username.toLowerCase()===username.toLowerCase()&&u.password===password);
  if (user){
    saveActiveUser(user);
    return true;
  }
  return false;
}

function findUserByUsername(username){
  const users=getAllUsers();
  return users.find(u=>u.username.toLowerCase()===username.toLowerCase());
}

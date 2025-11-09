function navigate(page){
  window.location.href=page;
}
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveData(key,data) {
  localStorage.setItem(key,JSON.stringify(data));
}
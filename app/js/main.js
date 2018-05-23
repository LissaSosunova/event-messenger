//Modal message function
function openModalMessage(mess) {
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("btn-close")[0];
  $scope.errorMessage = mess;
  modal.style.display = "block";
  $scope.closePopup = function() {
    modal.style.display = "none";
  };
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

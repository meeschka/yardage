console.log('connected');
$('#imageUrlRadio').click(function(){
    displayToggle();
    console.log('clicked');
})
$('#imageUploadRadio').click(function(){
    displayToggle();
    console.log('clicked');
})
const displayToggle = function() {
    $('#imageUrl').toggleClass('off');
    $('#imageUpload').toggleClass('off');
}
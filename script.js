// function formatTime(ms){
//     const totalSeconds = Math.floor(ms / 1000);
//     const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//     const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//     const seconds = String(totalSeconds % 60).padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
// }



// start = document.getElementById("start-btn");

// start.addEventListener("click", ()=>{
//     let counter = 10000;
//     const interval = setInterval( () =>
//     {console.log(formatTime(counter*1000))
//         counter--;
//         if(counter <0){
//             clearInterval(interval); 
//             console.log("✅ Pomodoro Complete");
//         }
//     },1000);
// } );
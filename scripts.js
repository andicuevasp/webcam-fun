const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            //we need to input the localMediaStream into our video source
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`Oh no!`,err);
        });      
};

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    //we need to make sure that the canvas is the same size as the video
    canvas.width = width;
    canvas.height = height;
    
    //taking a frame from video and putting it into the canvas
    return setInterval(()=> {
    ctx.drawImage(video,0,0,width,height);
    //takes the pixels out of the canvas image
    let pixels = ctx.getImageData(0,0,width,height);
   //adds filters to pixels
   //pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);

    //pixels = greenScreen(pixels);
    //puts back the altered pixels
    ctx.putImageData(pixels, 0, 0)
     },16)
     
};

function takePhoto(){
    //played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download","photo");
    link.innerHTML = `<img src="${data}" alt = "Snapshot" />`;
    strip.insertBefore(link,strip.firstChild);
    
};

function redEffect(pixels){
    for(let i=0; i<pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //r
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;//b
    }
    return pixels;
};

function rgbSplit(pixels){
    for(let i=0; i<pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i + 0]; //r
        pixels.data[i + 100] = pixels.data[i + 1]; //g
        pixels.data[i - 150] = pixels.data[i + 2];//b
    }
    return pixels;
};

function greenScreen(pixels){
    const levels = {};

    document.querySelectorAll(".rgb input").forEach((input)=> {
        levels[input.name] = input.value; 
    });
    console.log(levels);

    for(i=0; i < pixels.data.legth; i = i + 4) {
        red = pixels.data [i + 0];
        green = pixels.data [i + 1];
        blue = pixels.data [i + 2];
        alpha = pixels.data [i + 3];

        if(red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax){
            pixels.data[i + 3] = 0;
            }
    }
    return pixels; 
}

getVideo();

video.addEventListener("canplay",paintToCanvas);
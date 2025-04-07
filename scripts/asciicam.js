navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then((stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    const asciiChars = "@#S%?*+;:,. ";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const asciiCam = document.getElementById("asciiCam");

    video.onplaying = () => {
        const width = 160;
        const height = 75;
        canvas.width = width;
        canvas.height = height;

        function renderFrame() {
            ctx.drawImage(video, 0, 0, width, height);
            const imgData = ctx.getImageData(0, 0, width, height).data;
            let ascii = "";

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + (width - x - 1)) * 4;
                    const brightness = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
                    const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                    ascii += asciiChars[charIndex];
                }
                ascii += "\n";
            }
            asciiCam.textContent = ascii;
            requestAnimationFrame(renderFrame);
        }

        renderFrame();
    };
}).catch(err => document.getElementById("asciiCam").textContent = err);
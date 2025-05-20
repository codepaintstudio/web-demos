let facingMode = "user";
let isRunning = true;
const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } })
        .then((stream) => {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const asciiCam = document.getElementById("asciiCam");

            video.onplaying = () => {
                const width = 240;
                const height = 100;
                canvas.width = width;
                canvas.height = height;

                function renderFrame() {
                    if (!isRunning) return;
                    ctx.drawImage(video, 0, 0, width, height);
                    const imgData = ctx.getImageData(0, 0, width, height).data;
                    let ascii = "";

                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const i = (y * width + (width - x - 1)) * 4;
                            const r = imgData[i];
                            const g = imgData[i + 1];
                            const b = imgData[i + 2];
                            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                            const charIndex = Math.floor(brightness * (asciiChars.length - 1));
                            ascii += asciiChars[charIndex];
                        }
                        ascii += "\n";
                    }
                    asciiCam.textContent = ascii;
                    requestAnimationFrame(renderFrame)
                }

                renderFrame();
            };

            window.captureFrame = function () {
                const text = asciiCam.textContent;
                const blob = new Blob([text], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "ascii_art.txt";
                link.click();
            };
        })
        .catch(err => {
            document.getElementById("asciiCam").textContent =
                "无法访问摄像头：" + err.message + "。请确保已授予相机权限并刷新页面。";
        });
}

function toggleCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    isRunning = false;
    setTimeout(() => {
        isRunning = true;
        startCamera();
    }, 500);
}

startCamera();
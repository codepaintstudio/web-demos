let facingMode = "user";
let isRunning = true;
let characterSize = 4;
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
                    let asciiHtml = "";

                    for (let y = 0; y < height; y += characterSize) {
                        for (let x = 0; x < width; x += characterSize) {
                            let r = 0, g = 0, b = 0, count = 0;
                            for (let dy = 0; dy < characterSize && (y + dy) < height; dy++) {
                                for (let dx = 0; dx < characterSize && (x + dx) < width; dx++) {
                                    const i = ((y + dy) * width + (width - (x + dx) - 1)) * 4;
                                    r += imgData[i];
                                    g += imgData[i + 1];
                                    b += imgData[i + 2];
                                    count++;
                                }
                            }
                            r = Math.floor(r / count);
                            g = Math.floor(g / count);
                            b = Math.floor(b / count);

                            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                            const charIndex = Math.floor(brightness * (asciiChars.length - 1));
                            const char = asciiChars[charIndex];

                            asciiHtml += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
                        }
                        asciiHtml += "<br>";
                    }
                    asciiCam.innerHTML = asciiHtml;
                    requestAnimationFrame(renderFrame);
                }

                renderFrame();
            };

        })
        .catch(err => {
            document.getElementById("asciiCam").textContent =
                "无法访问摄像头：" + err.message + "。请确保已授予相机权限并刷新页面。";
        });
}

startCamera();

// 修复：检查元素是否存在，避免 undefined
const rangeControl = document.getElementById("input");
if (rangeControl) {
    // 新增：设置初始值（与 characterSize 同步）
    rangeControl.value = characterSize;

    rangeControl.addEventListener("input", (event) => {
        const value = event.target.value;
        // 新增：确保转换后的值有效（避免 NaN）
        const newSize = Math.max(1, Math.min(10, Number(value) || 4)); // 限制范围 1-10
        characterSize = newSize;
    });
} else {
    console.error("未找到 id 为 'input' 的 range 元素");
}
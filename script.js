const colorPicker = document.querySelector("input");
const dropdown = document.querySelector("ul");
const baseUrl =
    "https://www.thecolorapi.com/scheme?hex=0047AB&rgb=0,71,171&hsl=215,100%,34%&cmyk=100,58,0,33&format=html&mode=analogic&count=6";
const btn = document.querySelector("button");
const active = document.querySelector(".mode");
const modal = document.querySelector(".copy-modal");

init();

const rgba2hex = (rgba) =>
    `#${rgba
        .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
        .slice(1)
        .map((n, i) =>
            (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
                .toString(16)
                .padStart(2, "0")
                .replace("NaN", "")
        )
        .join("")}`;

function init() {
    btn.addEventListener("click", () => {
        const activeEdit = active.firstChild.textContent.trim().toLowerCase();
        const colorPickerValue = colorPicker.value.slice(1);
        fetch(
            `https://www.thecolorapi.com/scheme?hex=${colorPickerValue}&format=json&mode=${activeEdit}&count=5`,
            {
                headers: {
                    "content-type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                const colorsArray = [];
                const pArray = [];
                document.querySelectorAll(".color").forEach((element) => {
                    colorsArray.push(element);
                });

                document.querySelectorAll("p").forEach((p) => {
                    pArray.push(p);
                });
                data.colors.forEach((color, index) => {
                    colorsArray[index].style.backgroundColor = color.hex.value;
                    pArray[index].textContent = color.hex.value;
                });
            });
    });

    document.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
            active.firstChild.textContent = li.textContent;
            document.querySelectorAll("li").forEach((element) => {
                element.classList.remove("active");
                element.innerHTML = element.textContent;
            });
            li.classList.add("active");
            li.innerHTML = `
            ${li.textContent}<svg width="14" height="10" class="active-svg"viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z" fill="#4F46E5"/>
                            </svg>
            `;
        });
    });

    document.querySelector(".mode").addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    document.body.addEventListener("click", () => {
        dropdown.classList.remove("show");
    });

    document.querySelectorAll(".color").forEach((element) => {
        element.addEventListener("click", (e) => {
            if (e.target.style.backgroundColor) {
                navigator.clipboard
                    .writeText(rgba2hex(element.style.backgroundColor))
                    .then(showCopyModal());
            }
        });
    });

    document.querySelectorAll('p').forEach(p => {
        p.addEventListener('click', () => {
            navigator.clipboard
                    .writeText(p.textContent)
                    .then(showCopyModal());
        })
    })
}

function showCopyModal() {
    modal.classList.add("show");
    setTimeout(() => {
        modal.classList.remove("show");
    }, 2000);
}
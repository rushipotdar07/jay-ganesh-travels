import{
db,
auth,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp,
onAuthStateChanged
}from "../../js/firebase.js";


const form = document.getElementById("galleryForm");
const grid = document.getElementById("galleryGrid");

const CLOUD_NAME = "dmn0yo5mo";
const UPLOAD_PRESET = "Jay_ganesh_travels";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "login.html";
    }
});

async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
}

async function loadGallery() {

    const q = query(
        collection(db, "gallery"),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        grid.innerHTML = "<p class='empty-text'>No images uploaded yet</p>";
        return;
    }

    grid.innerHTML = "";

    snap.forEach(item => {

        const g = item.data();

        grid.innerHTML += `
            <div class="pkg-card">
                <img class="pkg-thumb" src="${g.imageUrl}" alt="${g.title || 'Gallery image'}">
                <div class="pkg-body">
                    <h3>${g.title || "Travel Memory"}</h3>
                </div>
                <div class="pkg-actions">
                    <button class="btn-delete" onclick="deleteImage('${item.id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

window.deleteImage = async (id) => {
    if (!confirm("Delete this image?")) return;
    await deleteDoc(doc(db, "gallery", id));
    loadGallery();
};

let uploading = false;

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (uploading) return;
    uploading = true;

    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Uploading...";

    try {

        const file = document.getElementById("galleryImage").files[0];

        if (!file) {
            alert("Please choose an image");
            uploading = false;
            btn.disabled = false;
            btn.textContent = "Upload";
            return;
        }

        const imageUrl = await uploadImage(file);

        await addDoc(collection(db, "gallery"), {
            title: document.getElementById("galleryTitle").value,
            imageUrl: imageUrl,
            createdAt: serverTimestamp()
        });

        alert("Image uploaded");
        form.reset();
        loadGallery();

    }
    catch (error) {
        console.log(error);
        alert("Upload failed");
    }

    uploading = false;
    btn.disabled = false;
    btn.textContent = "Upload";
});

loadGallery();
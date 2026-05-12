/* ========= LOGIN ========= */
if (document.getElementById("loginForm")) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
            .then(() => window.location.href = "admin.html")
            .catch(err => alert("Errore: " + err.message));
    });
}

/* ========= PROTEZIONE ADMIN ========= */
if (window.location.pathname.includes("admin.html")) {
    auth.onAuthStateChanged(user => {
        if (!user) window.location.href = "login.html";
    });
}

/* ========= LOGOUT ========= */
if (document.getElementById("logoutBtn")) {
    logoutBtn.onclick = () => auth.signOut();
}

/* ========= AGGIUNTA LAVORI ========= */
if (document.getElementById("workForm")) {
    workForm.addEventListener("submit", async e => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const file = document.getElementById("imageFile").files[0];

        const ref = storage.ref("lavori/" + Date.now() + "-" + file.name);
        await ref.put(file);
        const url = await ref.getDownloadURL();

        await db.collection("lavori").add({
            title,
            image: url,
            createdAt: Date.now()
        });

        alert("Lavoro aggiunto!");
        e.target.reset();
    });
}

/* ========= LETTURA LAVORI IN ADMIN ========= */
if (document.getElementById("workTable")) {
    db.collection("lavori").onSnapshot(snapshot => {
        workTable.innerHTML = "";
        snapshot.forEach(doc => {
            const d = doc.data();
            workTable.innerHTML += `
                <tr>
                    <td><img src="${d.image}" class="thumb"></td>
                    <td>${d.title}</td>
                    <td><button onclick="editWork('${doc.id}', '${d.title}', '${d.image}')">Modifica</button></td>
                    <td><button onclick="deleteWork('${doc.id}')">Elimina</button></td>
                </tr>
            `;
        });
    });
}

/* ========= MODIFICA ========= */
window.editWork = function (id, oldTitle, oldImage) {
    const newTitle = prompt("Nuovo titolo:", oldTitle);
    if (!newTitle) return;

    const changeImage = confirm("Vuoi cambiare anche l'immagine?");
    if (!changeImage) {
        return db.collection("lavori").doc(id).update({ title: newTitle });
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
        const file = input.files[0];
        const ref = storage.ref("lavori/" + Date.now() + "-" + file.name);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        await db.collection("lavori").doc(id).update({
            title: newTitle,
            image: url
        });
    };
    input.click();
};

/* ========= ELIMINAZIONE ========= */
window.deleteWork = function (id) {
    if (!confirm("Eliminare questo lavoro?")) return;
    db.collection("lavori").doc(id).delete();
};

/* ========= LETTURA LAVORI SU SITO ========= */
if (document.getElementById("gallery")) {
    db.collection("lavori").onSnapshot(snapshot => {
        gallery.innerHTML = "";
        snapshot.forEach(doc => {
            const d = doc.data();
            gallery.innerHTML += `
                <div class="card">
                    <img src="${d.image}">
                    <h4>${d.title}</h4>
                </div>
            `;
        });
    });
}

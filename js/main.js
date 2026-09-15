/* ==========================================================================
   1. SECCIÓN DE PRODUCTOS (Pestañas e Interacción)
   ========================================================================== */
function openProduct(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("product-tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-green", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " w3-green";
}

/* ==========================================================================
   2. GALERÍA DE IMÁGENES CON BOTÓN CERRAR (X)
   ========================================================================== */
function openImg(element) {
  var container = document.getElementById("expandedImgContainer");
  var containerImg = document.getElementById("expandedImg");
  containerImg.src = element.querySelector("img").src;
  container.style.display = "block";
}

function closeImg() {
  var container = document.getElementById("expandedImgContainer");
  container.style.display = "none";
}

/* ==========================================================================
   3. SECCIÓN DE TESTIMONIOS Y RESEÑAS CON FIREBASE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  inicializarEstrellas();
  cargarResenasFirebase();
  iniciarAnimacionTecnico();
});

// Control interactivo del selector de estrellas en el formulario
function inicializarEstrellas() {
  const estrellas = document.querySelectorAll(".star-rating-input .star");
  const inputRating = document.getElementById("selectedRating");

  if (!estrellas.length || !inputRating) return;

  estrellas.forEach((star, index) => {
    star.addEventListener("click", () => {
      const valor = index + 1;
      inputRating.value = valor;
      estrellas.forEach((s, i) => {
        if (i < valor) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // Marcar 5 estrellas por defecto al cargar
  estrellas.forEach(s => s.classList.add("active"));
}

// Guardar nueva reseña directamente en Firestore (Nube)
async function guardarResena() {
  const texto = document.getElementById("reviewText").value.trim();
  const calificacion = parseInt(document.getElementById("selectedRating").value);

  if (texto === "") {
    alert("Por favor escribe una breve experiencia antes de guardar.");
    return;
  }

  const ahora = new Date();
  const fechaFormateada = ahora.toLocaleDateString("es-MX", { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
  const horaFormateada = ahora.toLocaleTimeString("es-MX", { 
    hour: '2-digit', minute: '2-digit' 
  });

  const nuevaResena = {
    texto: texto,
    estrellas: calificacion,
    fecha: `${fechaFormateada} a las ${horaFormateada}`,
    timestamp: Date.now() // Usado para ordenar cronológicamente
  };

  try {
    const { collection, addDoc } = window.firebaseModules;
    const db = window.db;

    // Guarda el documento en la colección "resenas"
    await addDoc(collection(db, "resenas"), nuevaResena);

    document.getElementById("reviewText").value = "";
    alert("¡Muchas gracias! Tu opinión ha sido publicada.");
    cargarResenasFirebase(); // Recarga la lista para mostrar la nueva reseña al instante
  } catch (error) {
    console.error("Error al guardar la reseña en Firebase: ", error);
    alert("Hubo un error al guardar tu opinión. Inténtalo de nuevo.");
  }
}

// Consultar las reseñas desde Firestore y actualizar la interfaz y el promedio
async function cargarResenasFirebase() {
  const listaContainer = document.getElementById("listaResenas");
  const promedioNum = document.getElementById("promedioNum");
  const totalResenas = document.getElementById("totalResenas");
  
  if (!listaContainer) return;

  try {
    const { collection, getDocs, query, orderBy } = window.firebaseModules;
    const db = window.db;

    // Consultar ordenadas de la más reciente a la más antigua
    const q = query(collection(db, "resenas"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    listaContainer.innerHTML = "";
    let resenasArray = [];

    querySnapshot.forEach((doc) => {
      resenasArray.push(doc.data());
    });

    if (resenasArray.length === 0) {
      listaContainer.innerHTML = `<div class="empty-reviews">Sé el primero en compartir tu experiencia de forma anónima.</div>`;
      promedioNum.textContent = "5.0";
      totalResenas.textContent = "(0)";
      return;
    }

    let sumaEstrellas = 0;

    resenasArray.forEach(resena => {
      sumaEstrellas += resena.estrellas;
      const estrellasStr = "★".repeat(resena.estrellas) + "☆".repeat(5 - resena.estrellas);

      const tarjeta = document.createElement("div");
      tarjeta.className = "review-card";
      tarjeta.innerHTML = `
        <div class="review-card-header">
          <span class="review-stars">${estrellasStr}</span>
          <span class="review-date">${resena.fecha}</span>
        </div>
        <p>${resena.texto}</p>
      `;
      listaContainer.appendChild(tarjeta);
    });

    const promedio = (sumaEstrellas / resenasArray.length).toFixed(1);
    promedioNum.textContent = promedio;
    totalResenas.textContent = `(${resenasArray.length})`;

  } catch (error) {
    console.error("Error al cargar las reseñas de Firebase: ", error);
    listaContainer.innerHTML = `<div class="empty-reviews">No se pudieron cargar las opiniones en este momento.</div>`;
  }
}

/* ==========================================================================
   4. ANIMACIÓN DEL TÉCNICO FUMIGADOR (Movimiento de ida y vuelta)
   ========================================================================== */
function iniciarAnimacionTecnico() {
  const cajaTecnico = document.getElementById('tecnicoBox');
  const imgTecnico = document.getElementById('tecnicoGif');
  
  if (!cajaTecnico || !imgTecnico) return;
  
  let posX = 0;
  let velocidad = 0.5;
  let direccion = 1;

  function animarTecnico() {
    const anchoPantalla = window.innerWidth;
    const anchoCaja = cajaTecnico.offsetWidth;
    
    posX += velocidad * direccion;

    // Rebote al llegar al borde derecho
    if (posX >= anchoPantalla - anchoCaja - 15) {
      direccion = -1;
      imgTecnico.style.transform = "scaleX(-1)";
    }
    // Rebote al llegar al borde izquierdo
    else if (posX <= 10) {
      direccion = 1;
      imgTecnico.style.transform = "scaleX(1)";
    }

    cajaTecnico.style.left = posX + 'px';
    requestAnimationFrame(animarTecnico);
  }

  requestAnimationFrame(animarTecnico);
}


// Pasos del Proceso
const pasosData = {
    1: {
        titulo: "Inspección",
        texto: "Se realiza una inspección con un recorrido tomando en cuenta la plaga señalada para localizar algún posible nido, fuente que origina el problema o área de oportunidad para saber cómo proceder de forma efectiva."
    },
    2: {
        titulo: "Selección",
        texto: "Tomando en cuenta mascotas y niños pequeños, se prepara el producto ideal de acuerdo a la situación para erradicar cualquier plaga."
    },
    3: {
        titulo: "Aplicación",
        texto: "Se realiza la aplicación del producto con la técnica más adecuada, siempre cuidando de no dañar nada y evitando cualquier accidente garantizando un buen servicio."
    },
    4: {
        titulo: "Recorrido",
        texto: "Al finalizar se realiza un último recorrido verificando si hay actividad tras la aplicación o si hay algún área que no se le haya realizado la aplicación correctamente."
    },
    5: {
        titulo: "Seguimiento",
        texto: "Se le contactará pasando 2 meses verificando que no tenga ningún tipo de actividad y ofreciendo un refuerzo para garantizar la ausencia de plagas."
    }
};

function mostrarPaso(num) {
    document.getElementById("processTitle").textContent = pasosData[num].titulo;
    document.getElementById("processDesc").textContent = pasosData[num].texto;

    const botones = document.querySelectorAll(".process-btn");
    botones.forEach((btn, index) => {
        if (index + 1 === num) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}


function openProceso(evt, pasoName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("proceso-content");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  tablinks = document.getElementsByClassName("process-tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-green", "");
  }
  document.getElementById(pasoName).style.display = "block";  
  evt.currentTarget.className += " w3-green";
}

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
   3. SECCIÓN DE TESTIMONIOS Y RESEÑAS DINÁMICAS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  inicializarEstrellas();
  cargarResenas();
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

// Guardar nueva reseña anónima con fecha, hora y calificación localmente
function guardarResena() {
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
    fecha: `${fechaFormateada} a las ${horaFormateada}`
  };

  let resenas = JSON.parse(localStorage.getItem("exterminador_resenas")) || [];
  resenas.unshift(nuevaResena); // Coloca la reseña nueva al inicio
  localStorage.setItem("exterminador_resenas", JSON.stringify(resenas));

  document.getElementById("reviewText").value = "";
  cargarResenas();
}

// Cargar reseñas guardadas y actualizar el promedio general
function cargarResenas() {
  const listaContainer = document.getElementById("listaResenas");
  const promedioNum = document.getElementById("promedioNum");
  const totalResenas = document.getElementById("totalResenas");
  
  if (!listaContainer) return;

  let resenas = JSON.parse(localStorage.getItem("exterminador_resenas")) || [];
  listaContainer.innerHTML = "";

  if (resenas.length === 0) {
    listaContainer.innerHTML = `<div class="empty-reviews">Sé el primero en compartir tu experiencia de forma anónima.</div>`;
    promedioNum.textContent = "5.0";
    totalResenas.textContent = "(0)";
    return;
  }

  let sumaEstrellas = 0;

  resenas.forEach(resena => {
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

  const promedio = (sumaEstrellas / resenas.length).toFixed(1);
  promedioNum.textContent = promedio;
  totalResenas.textContent = `(${resenas.length})`;
}

/* ==========================================================================
   4. ANIMACIÓN DEL TÉCNICO FUMIGADOR (Movimiento de ida y vuelta)
   ========================================================================== */
function iniciarAnimacionTecnico() {
  const cajaTecnico = document.getElementById('tecnicoBox');
  const imgTecnico = document.getElementById('tecnicoGif');
  
  if (!cajaTecnico || !imgTecnico) return;
  
  let posX = 0;
  let velocidad = 1.2;
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


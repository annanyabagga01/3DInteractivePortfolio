// 1. Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  
  // Simulate loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          initGSAP(); // Initialize animations after load
        }, 1000);
      }, 500);
    }
  }, 100);
});

// 2. Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️';
    updateThreeJsTheme(true);
  } else {
    themeToggle.textContent = '🌙';
    updateThreeJsTheme(false);
  }
});

// 3. 3D Card Tilt Effect
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX * 0.8}deg) rotateY(${rotateY * 0.8}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// 4. Three.js Background
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
let particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x818cf8, // primary color dark mode
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Central Interactive Shape
const shapeGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const shapeMaterial = new THREE.MeshStandardMaterial({
  color: 0x4f46e5,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const centralShape = new THREE.Mesh(shapeGeometry, shapeMaterial);
scene.add(centralShape);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 5;

// Mouse tracking for 3D scene
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - windowHalfX);
  mouseY = (e.clientY - windowHalfY);
});

// Update theme colors in Three.js
function updateThreeJsTheme(isDark) {
  if (isDark) {
    particlesMaterial.color.setHex(0x818cf8);
    shapeMaterial.color.setHex(0x4f46e5);
  } else {
    particlesMaterial.color.setHex(0x4f46e5);
    shapeMaterial.color.setHex(0x6366f1);
  }
}

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  // Particle rotation
  particlesMesh.rotation.y += 0.001;
  particlesMesh.rotation.x += 0.0005;
  
  // Parallax effect on particles
  particlesMesh.rotation.y += 0.02 * (targetX - particlesMesh.rotation.y);
  particlesMesh.rotation.x += 0.02 * (targetY - particlesMesh.rotation.x);

  // Central shape rotation and interaction
  centralShape.rotation.y += 0.005;
  centralShape.rotation.z += 0.002;
  
  centralShape.rotation.x += 0.02 * (targetY - centralShape.rotation.x);
  centralShape.rotation.y += 0.02 * (targetX - centralShape.rotation.y);

  // Floating effect
  centralShape.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll interaction with Three.js
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Move particles down as we scroll down
  particlesMesh.position.y = scrollY * 0.002;
  // Rotate central shape faster on scroll
  centralShape.rotation.x = scrollY * 0.005;
});

// 5. GSAP Animations
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section
  gsap.from(".hero-content h1", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "expo.out"
  });
  
  gsap.from(".hero-content p", {
    y: 30,
    opacity: 0,
    duration: 1.5,
    delay: 0.4,
    ease: "expo.out"
  });
  
  gsap.from(".hero-content .btn", {
    y: 20,
    opacity: 0,
    duration: 1.5,
    delay: 0.8,
    ease: "expo.out"
  });

  // Fade in sections on scroll
  const sections = document.querySelectorAll(".section:not(#hero)");
  
  sections.forEach((sec) => {
    gsap.from(sec.querySelector(".card, .projects-grid"), {
      scrollTrigger: {
        trigger: sec,
        start: "top 80%", // trigger when top of section hits 80% of viewport
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out"
    });
  });

  // Stagger skill items
  gsap.from(".skill-item", {
    scrollTrigger: {
      trigger: "#skills",
      start: "top 75%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "back.out(1.4)"
  });

  // Stagger project cards
  gsap.from(".project-card", {
    scrollTrigger: {
      trigger: "#projects",
      start: "top 75%",
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "expo.out"
  });
}

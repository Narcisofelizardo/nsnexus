document.documentElement.classList.remove('no-js');

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

const header = document.querySelector('#siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');

menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

AOS.init({
  duration: 850,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80
});

gsap.registerPlugin(ScrollTrigger);

gsap.from('.brand', {
  y: -20,
  opacity: 0,
  duration: .8,
  ease: 'power3.out'
});

gsap.from('.dashboard-card', {
  rotateY: -14,
  rotateX: 8,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  delay: .35
});

gsap.utils.toArray('.solution-card, .pain-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(103,232,249,.18), rgba(255,255,255,.06) 34%, rgba(255,255,255,.035) 70%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

const counters = document.querySelectorAll('[data-counter]');
let countersDone = false;

function runCounters(){
  if(countersDone) return;
  countersDone = true;

  counters.forEach(counter => {
    const target = Number(counter.dataset.counter);
    const duration = 1500;
    const start = performance.now();

    function update(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);

      if(progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }

    requestAnimationFrame(update);
  });
}

ScrollTrigger.create({
  trigger: '#resultados',
  start: 'top 75%',
  onEnter: runCounters
});

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createParticles();
}

function createParticles(){
  const count = window.innerWidth < 640 ? 42 : 86;
  particles = [];

  for(let i = 0; i < count; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .42,
      vy: (Math.random() - .5) * .42,
      r: Math.random() * 2 + 1
    });
  }
}

function drawParticles(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;

    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(103,232,249,.72)';
    ctx.fill();
  }

  for(let i = 0; i < particles.length; i++){
    for(let j = i + 1; j < particles.length; j++){
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < 135){
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(103,232,249,${(1 - distance / 135) * .22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  if(mouse.x && mouse.y){
    for(const p of particles){
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < 170){
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(168,85,247,${(1 - distance / 170) * .32})`;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
drawParticles();

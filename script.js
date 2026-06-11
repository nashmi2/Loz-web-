document.addEventListener("DOMContentLoaded", () => {
  // Splash Screen
  const splash = document.getElementById("splash");
  const navbar = document.getElementById("navbar");
  const main = document.getElementById("main");

  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
        if (navbar) navbar.style.display = "flex";
        if (main) main.style.display = "block";
        // Trigger reveal for first section
        reveal();
      }, 500);
    }, 1500);
  } else {
    if (navbar) navbar.style.display = "flex";
    if (main) main.style.display = "block";
    reveal();
  }

  // Background Music Logic
  const bgMusic = document.getElementById("bg-music");
  const toggleMusicBtn = document.getElementById("toggle-music");
  let isPlaying = false;

  // Show button after splash
  if (toggleMusicBtn) {
    setTimeout(() => {
      toggleMusicBtn.style.display = "block";
    }, splash ? 1600 : 100);
  }

  if (bgMusic && toggleMusicBtn) {
    // Auto-play might be blocked by browsers, so we handle it gracefully
    bgMusic.volume = 0.3;
    bgMusic.play().then(() => {
      isPlaying = true;
      toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }).catch((error) => {
      // User interaction needed
      isPlaying = false;
      toggleMusicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    });

    toggleMusicBtn.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        bgMusic.play();
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
      isPlaying = !isPlaying;
    });
  }

  // Reveal Animations on Scroll
  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 100;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      }
    }
  }
  window.addEventListener("scroll", reveal);

  // Image Slider Logic
  const slider = document.getElementById('imageSlider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slider && prevBtn && nextBtn) {
    let slideIndex = 0;
    const slides = slider.querySelectorAll('img');
    const totalSlides = slides.length;

    // Auto slide
    let slideInterval = setInterval(nextSlide, 4000);

    function nextSlide() {
      slideIndex++;
      if (slideIndex >= totalSlides) {
        slideIndex = 0;
      }
      updateSlider();
    }

    function prevSlide() {
      slideIndex--;
      if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
      }
      updateSlider();
    }

    function updateSlider() {
      // For RTL layout, translating to the positive X direction moves the slider left.
      // Or we can use direction: ltr on the slider container to keep logic simple.
      // Let's use RTL math: 
      slider.style.transform = `translateX(${slideIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      nextSlide();
      slideInterval = setInterval(nextSlide, 4000);
    });

    prevBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      prevSlide();
      slideInterval = setInterval(nextSlide, 4000);
    });
  }

  // Background Stars Canvas
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  const numStars = 150;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      vx: Math.floor(Math.random() * 50) - 25,
      vy: Math.floor(Math.random() * 50) - 25,
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < stars.length; i++) {
      let s = stars[i];
      ctx.fillStyle = "#4cadd0";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
      ctx.fill();

      // Update position
      s.x += s.vx / 60;
      s.y += s.vy / 60;

      // Wrap around screen
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(drawStars);
  }

  drawStars();

  // Handle Window Resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Smooth Scrolling for Navbar Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });

      // Update active class
      document.querySelectorAll('.navbar ul li a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Discord OAuth2 Settings
  const CLIENT_ID = '1505300041965764790'; // ضـع Client ID هنـا
  const REDIRECT_URI = window.location.origin + window.location.pathname;

  const loginBtns = document.querySelectorAll('.discord-login-btn');
  const logoutBtns = document.querySelectorAll('.logout-btn');
  const userProfiles = document.querySelectorAll('.user-profile');

  // Check URL for token
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  let accessToken = fragment.get('access_token');

  if (!accessToken) {
    accessToken = localStorage.getItem('discord_token');
  }

  if (accessToken) {
    localStorage.setItem('discord_token', accessToken);
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    // Fetch User Info
    fetch('https://discord.com/api/users/@me', {
      headers: { authorization: `Bearer ${accessToken}` }
    })
      .then(result => result.json())
      .then(response => {
        if (response.id) {
          loginBtns.forEach(btn => btn.style.display = 'none');
          userProfiles.forEach(profile => {
            profile.style.display = 'flex';
            profile.querySelector('span').textContent = response.username;
            const avatarUrl = response.avatar
              ? `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`
              : 'https://cdn.discordapp.com/embed/avatars/0.png';
            profile.querySelector('img').src = avatarUrl;
          });
        } else {
          logout();
        }
      })
      .catch(console.error);
  }

  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        alert('يرجى وضع الـ Client ID في ملف script.js لكي يعمل تسجيل الدخول!');
        return;
      }
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
      window.location.href = authUrl;
    });
  });

  logoutBtns.forEach(btn => btn.addEventListener('click', logout));

  function logout() {
    localStorage.removeItem('discord_token');
    window.location.reload();
  }

  // Webhook Application Form Logic
  const applyForm = document.getElementById('apply-form');
  const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE'; // ضـع رابـط الويب هوك هنـا

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (WEBHOOK_URL === 'YOUR_WEBHOOK_URL_HERE') {
        alert('لم يتم تفعيل الإرسال بعد، يرجى وضع رابط Webhook في ملف script.js!');
        return;
      }

      const faction = document.getElementById('faction-select').options[document.getElementById('faction-select').selectedIndex].text;
      const dName = document.getElementById('discord-name').value;
      const gameId = document.getElementById('ingame-id').value;
      const rAge = document.getElementById('real-age').value;
      const reason = document.getElementById('reason').value;

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.innerText = 'جاري الإرسال...';
      submitBtn.disabled = true;

      const payload = {
        username: 'بوابة توظيف مقاطعة لوز',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        embeds: [{
          title: `📝 طلب انضمام جديد: ${faction}`,
          color: 13150030,
          fields: [
            { name: "اسم الديسكورد", value: dName, inline: true },
            { name: "الأيدي في اللعبة", value: gameId, inline: true },
            { name: "العمر الحقيقي", value: rAge, inline: true },
            { name: "سبب الانضمام والخبرات", value: reason }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (response.ok) {
            const modal = document.getElementById('success-modal');
            if (modal) modal.style.display = 'flex';
            applyForm.reset();
          } else {
            alert('حدث خطأ أثناء الإرسال، يرجى التأكد من صلاحيات الويب هوك.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('حدث خطأ أثناء الاتصال.');
        })
        .finally(() => {
          submitBtn.innerText = 'إرسال الطلب';
          submitBtn.disabled = false;
        });
    });
  }

  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      document.getElementById('success-modal').style.display = 'none';
      window.location.href = 'index.html'; // Return to home
    });
  }

});

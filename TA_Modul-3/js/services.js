// Page load transition
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Smooth page transitions for links
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !link.target) {
                    e.preventDefault();
                    document.body.classList.remove('loaded');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up, .fade-in, .scale-in').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isOpen = false;

    menuBtn.addEventListener('click', () => {
      if (!isOpen) {
        mobileMenu.classList.remove('hidden', 'menu-exit', 'menu-exit-active');
        mobileMenu.classList.add('menu-enter');
        setTimeout(() => mobileMenu.classList.add('menu-enter-active'), 10);
      } else {
        mobileMenu.classList.remove('menu-enter', 'menu-enter-active');
        mobileMenu.classList.add('menu-exit');
        setTimeout(() => mobileMenu.classList.add('menu-exit-active'), 10);
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
      }
      isOpen = !isOpen;
    });
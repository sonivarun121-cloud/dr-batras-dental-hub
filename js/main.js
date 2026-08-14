document.addEventListener('DOMContentLoaded', () => {
  initIntroScreen();
  initHeroSlider();
  initMobileMenu();
  initScrollEffects();
  initSmileSlider();
  initReviewsSlider();
  initVideoTestimonialsSlider();
  initScrollAnimations();
  initCasesGallery();
  initLogoScroll();
  initContentProtection();
  initImageEnhancements();
  initAnimationOptimizer();
  initCasesHomepageCarousel();
});
function initIntroScreen() {
  const intro = document.getElementById('intro-screen');
  if (!intro) return;
  let introPlayed = false;
  try {
    introPlayed = sessionStorage.getItem('batraIntroPlayed');
  } catch (e) {
    console.warn("sessionStorage is not accessible (likely due to local file URL sandbox restrictions).", e);
  }
  if (introPlayed) {
    intro.style.display = 'none';
    intro.remove();
  } else {
    try {
      sessionStorage.setItem('batraIntroPlayed', 'true');
    } catch (e) {}
    const tagline = intro.querySelector('.intro-tagline');
    if (tagline) {
      const childNodes = Array.from(tagline.childNodes);
      tagline.innerHTML = '';
      let charIndex = 0;
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            if (char === ' ') {
              span.innerHTML = '&nbsp;';
            } else {
              span.textContent = char;
            }
            span.className = 'intro-char';
            span.style.animationDelay = `${0.6 + (charIndex * 0.03)}s`;
            tagline.appendChild(span);
            charIndex++;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('intro-break')) {
          const brSpan = document.createElement('span');
          brSpan.className = 'intro-break';
          tagline.appendChild(brSpan);
        }
      });
    }
    let dismissed = false;
    function dismissIntro() {
      if (dismissed) return;
      dismissed = true;
      clearTimeout(safetyTimeout);
      if (intro && intro.parentNode) {
        intro.classList.add('hide');
        setTimeout(() => {
          intro.remove();
        }, 1100); 
      }
    }
    const safetyTimeout = setTimeout(dismissIntro, 4000);
    const minAnimationTime = 2300; 
    const startTime = Date.now();
    function onPageReady() {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minAnimationTime - elapsed);
      setTimeout(dismissIntro, remaining);
    }
    if (document.readyState === 'complete') {
      onPageReady();
    } else {
      window.addEventListener('load', onPageReady);
    }
  }
}
function initHeroSlider() {
  if (window.heroSliderStarted) return;
  window.heroSliderStarted = true;
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (bgSlides.length < 2) return;
  bgSlides.forEach(slide => {
    const bgUrl = slide.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
    if (bgUrl) {
      const img = new Image();
      img.src = bgUrl;
      if (img.decode) {
        img.decode().catch(err => {
          console.warn('Failed to pre-decode slide image:', bgUrl, err);
        });
      }
    }
  });
  let currentIndex = 0;
  let isTransitioning = false;
  const slideDuration = 7000;
  const fadeOverlap = 2000; 
  function changeSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    const prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % bgSlides.length;
    const nextSlide = bgSlides[currentIndex];
    const prevSlide = bgSlides[prevIndex];
    void nextSlide.offsetWidth;
    nextSlide.classList.add('animating-in');
    prevSlide.classList.add('animating-out');
    setTimeout(() => {
      nextSlide.classList.add('active');
      nextSlide.classList.remove('animating-in');
      prevSlide.classList.remove('active', 'animating-out');
      isTransitioning = false;
    }, fadeOverlap);
  }
  setInterval(changeSlide, slideDuration);
}
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownItems = document.querySelectorAll('.nav-item');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
    const burgerDivs = burger.querySelectorAll('div');
    if (burger.classList.contains('toggle')) {
      burgerDivs[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      burgerDivs[1].style.opacity = '0';
      burgerDivs[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      burgerDivs[0].style.transform = 'none';
      burgerDivs[1].style.opacity = '1';
      burgerDivs[2].style.transform = 'none';
    }
  });
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault(); 
          item.classList.toggle('dropdown-active');
        }
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
      burger.click();
    }
  });
}
function initScrollEffects() {
  const header = document.querySelector('header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
function initSmileSlider() {
  const wrapper = document.querySelector('.smile-slider-wrapper');
  const afterImg = document.querySelector('.smile-img-after');
  const handle = document.querySelector('.smile-handle');
  if (!wrapper || !afterImg || !handle) return;
  let active = false;
  handle.addEventListener('mousedown', () => { active = true; });
  window.addEventListener('mouseup', () => { active = false; });
  window.addEventListener('mouseleave', () => { active = false; });
  handle.addEventListener('touchstart', () => { active = true; });
  window.addEventListener('touchend', () => { active = false; });
  window.addEventListener('touchcancel', () => { active = false; });
  window.addEventListener('mousemove', (e) => {
    if (!active) return;
    sliderMove(e.clientX);
  });
  window.addEventListener('touchmove', (e) => {
    if (!active) return;
    if (e.cancelable) e.preventDefault(); 
    sliderMove(e.touches[0].clientX);
  }, { passive: false });
  function sliderMove(xPosition) {
    const rect = wrapper.getBoundingClientRect();
    const wrapperWidth = rect.width;
    const offsetX = xPosition - rect.left;
    let percentage = (offsetX / wrapperWidth) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    afterImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    afterImg.style.webkitClipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;
  }
}
function initReviewsSlider() {
  const track = document.querySelector('.reviews-track');
  const slides = document.querySelectorAll('.review-slide');
  const dotsContainer = document.querySelector('.reviews-dots');
  if (!track || slides.length === 0 || !dotsContainer) return;
  let activeIndex = 0;
  const slideCount = slides.length;
  let autoPlayTimer;
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `review-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.review-dot');
  function goToSlide(index) {
    activeIndex = index;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  function nextSlide() {
    goToSlide((activeIndex + 1) % slideCount);
  }
  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 6000); 
  }
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      goToSlide((activeIndex + 1) % slideCount);
      resetAutoPlay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      goToSlide((activeIndex - 1 + slideCount) % slideCount);
      resetAutoPlay();
    }
  }
  startAutoPlay();
}
function initVideoTestimonialsSlider() {
  const container = document.querySelector('.vt-slider-container');
  const track = document.querySelector('.vt-track');
  const cards = document.querySelectorAll('.vt-card');
  const prevBtn = document.querySelector('.vt-arrow-left');
  const nextBtn = document.querySelector('.vt-arrow-right');
  const dotsContainer = document.querySelector('.vt-dots');
  if (!container || !track || cards.length === 0) return;
  let currentIndex = 0;
  const cardCount = cards.length;
  function getCardsVisible() {
    if (window.innerWidth <= 540) return 1.25; 
    if (window.innerWidth <= 900) return 2; 
    return 3; 
  }
  function getMaxIndex() {
    const visibleCount = getCardsVisible();
    return Math.max(0, Math.ceil(cardCount - visibleCount));
  }
  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.className = `vt-dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        slide();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function slide() {
    document.querySelectorAll('.vt-card video').forEach(v => {
      v.pause();
      const parentCard = v.closest('.vt-card');
      if (parentCard) {
        parentCard.classList.remove('playing');
      }
    });
    const card = cards[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 24;
    const cardWidth = card.offsetWidth;
    const maxIndex = getMaxIndex();
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    const translateVal = -currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(${translateVal}px)`;
    const dots = dotsContainer.querySelectorAll('.vt-dot');
    if (dots.length > 0) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
    if (prevBtn) {
      if (currentIndex === 0) {
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
      }
    }
    if (nextBtn) {
      if (currentIndex >= maxIndex) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex--;
      slide();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      slide();
    });
  }

  updateDots();
  slide();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateDots();
      slide();
    }, 150);
  });
}
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.fade-up, .stagger-parent');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, 
      rootMargin: '0px 0px -10% 0px', 
      threshold: 0.1 
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);
    animElements.forEach(el => observer.observe(el));
  } else {
    animElements.forEach(el => el.classList.add('visible'));
  }
}
const caseData = {
  makeover: {
    title: "Cosmetic Smile Makeover",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/smile_makeover_grid.webp?v=2",
    highlights: [
      "Symmetrical realignment of anterior teeth",
      "Painless gap closure (diastema closure)",
      "Whitening restoration for natural bright color",
      "Completed in multi-specialty clinical sessions"
    ],
    detail: "This patient presented with prominent central diastema (spacing) and alignment variations. Dr. Gursimran Singh Batra executed an aesthetic orthodontic correction and bonding protocol. The treatment completely closed the gap and restored structural symmetry, yielding a confident and bright smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  anterior_decay_makeover: {
    title: "Anterior Crowns & Veneers Makeover",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/anterior_decay_makeover.webp?v=2",
    highlights: [
      "Restoration of severely decayed anterior teeth",
      "Painless crown and veneer rehabilitation",
      "Elimination of dark lesions and structural staining",
      "Restored natural anatomy and bite functionality"
    ],
    detail: "This patient presented with advanced decay, staining, and erosion affecting multiple anterior teeth. Dr. Gursimran Singh Batra utilized premium metal-free all-ceramic crowns and veneers to rebuild the worn tooth structure. The treatment eliminated all decayed lesions and brown discoloration, restoring a healthy, brilliant, and natural smile contour.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  rehab: {
    title: "Full Mouth Rehabilitation",
    tag: "Full Mouth Rehab",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/full_mouth_rehab.webp?v=2",
    highlights: [
      "Complete bite realignment and height restoration",
      "Premium porcelain-fused-to-metal (PFM) or Zirconia crowns",
      "Elimination of multiple diastemas (spacing)",
      "Restoration of natural chewing functionality"
    ],
    detail: "The patient had multiple missing, worn down, and severely spaced teeth causing masticatory discomfort and aesthetic concerns. Dr. Gursimran Singh Batra performed a full-mouth prosthetic rehabilitation. Using metal-free premium restorations, the team restored proper bite height, closed gaps, and established highly durable, natural-looking functional aesthetics.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  full_arch_implant_rehab: {
    title: "Implant-Supported Full Mouth Rehab",
    tag: "Full Mouth Rehab",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/full_arch_implant_rehab.webp?v=2",
    highlights: [
      "Fixed overdenture bridge restoration",
      "Replacement of multiple missing and failing teeth",
      "Stable titanium implant-anchored support",
      "Restored structural chewing force and vertical height"
    ],
    detail: "The patient had severe tooth loss, loose teeth, and uncomfortable older restorations. Dr. Gursimran Singh Batra designed a comprehensive implant-supported rehabilitation plan. Multiple titanium implants were placed to anchor a fixed full-arch prosthesis, providing absolute stability, restored chewing function, and a youthfully aligned smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  implant: {
    title: "Single Dental Implant",
    tag: "Dental Implant",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/dental_implant.webp?v=2",
    highlights: [
      "Precision surgical implant post placement",
      "Uncompromising sterile surgical workflow",
      "Highly durable aesthetic zirconium abutment crown",
      "Natural tooth root replacement solution"
    ],
    detail: "Presented with a missing lower molar leading to bone resorption and chewing difficulty. A premium dental implant was surgically placed with precise computer guidance. After osseointegration, a highly accurate metal-free ceramic crown was loaded, seamlessly matching the surrounding natural teeth.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  single_implant_molar: {
    title: "Posterior Dental Implant",
    tag: "Dental Implant",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/single_implant_molar.webp?v=2",
    highlights: [
      "Computer-guided single molar implant placement",
      "Premium titanium implant post osseointegration",
      "Custom anatomic abutment and access hole seal",
      "Perfect functional alignment and occlusion fit"
    ],
    detail: "This case showcases the replacing of a missing lower molar using a single dental implant. Following precise post insertion and the healing cap phase, a custom-shaded crown was loaded. The final restoration is shown in perfect occlusion, preventing adjacent teeth shifting and restoring full chewing efficiency.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  veneers: {
    title: "Anterior Smile Correction",
    tag: "Smile Design",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/anterior_veneers.webp?v=2",
    highlights: [
      "Premium ultra-thin ceramic veneers placement",
      "Minimal tooth preparation protocol",
      "Closing dental gaps and correcting severe wear",
      "Natural light-reflecting tooth aesthetics"
    ],
    detail: "This patient wanted correction for structural spacing and uneven edges on their front teeth. Using hand-crafted anterior ceramic veneers, Dr. Gursimran Singh Batra closed all spaces and corrected tooth shapes. The ultra-thin veneers seamlessly blend with natural dentin, reflecting light beautifully.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  digital_smile_design: {
    title: "Digital Smile Design & Veneers",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/digital_smile_design.webp?v=2",
    highlights: [
      "Precision digital mapping of facial and tooth symmetry",
      "Correction of enamel hypoplasia and white spot lesions",
      "Conservative preparations for ultra-thin veneers",
      "Symmetrical and anatomically perfect aesthetic result"
    ],
    detail: "For this patient, orthodontic scans and digital parameters were used to precisely design the ideal tooth proportions and margins. The mock-up was transferred to custom aesthetic veneers to resolve severe white spots and surface unevenness on the front teeth, achieving perfect facial harmony and natural aesthetics.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  fluorosis: {
    title: "Fluorosis Stain Correction",
    tag: "Cosmetic Bonding",
    doctor: "Dr. Japneet Kaur Batra",
    img: "images/cases/fluorosis_restoration.webp?v=2",
    highlights: [
      "Enamel micro-abrasion of mottled areas",
      "Layered cosmetic resin composite bonding",
      "Eradication of dark brown stain patches",
      "Conservative, single-visit tooth preservation"
    ],
    detail: "Severe dental fluorosis had caused brown, mottled, and pitted patches across the anterior teeth, leading to social anxiety. Dr. Japneet Kaur Batra utilized a highly conservative micro-abrasion technique followed by premium multi-shaded direct composite bonding. Enamel discoloration was completely eradicated in a single painless visit.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  geriatric_full_reconstruction: {
    title: "Complete Geriatric Smile Rehab",
    tag: "Full Mouth Rehab",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/geriatric_full_reconstruction.webp?v=2",
    highlights: [
      "Re-establishing vertical dimension and bite alignment",
      "High-precision tissue-shaded prosthesis",
      "Restoration of natural facial support and profile",
      "Enhanced chewing efficiency and speech articulation"
    ],
    detail: "This elderly patient presented with severe tooth loss and bite collapse, affecting speech, chewing, and facial aesthetics. Dr. Gursimran Singh Batra performed a full mouth rehabilitation with custom-fit premium bridges and dentures. The treatment restored facial muscle support and alignment, resulting in a highly functional and beautiful smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  single_crown: {
    title: "Single Front Tooth Crown",
    tag: "Smile Design",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/single_crown_restoration.webp?v=2",
    highlights: [
      "Custom shade matching to natural surrounding teeth",
      "Premium metal-free all-ceramic aesthetic crown",
      "Restoration of natural front tooth color and alignment",
      "Completed conservative tooth preparation protocol"
    ],
    detail: "This patient presented with a severely discolored, dark, and structurally weakened left central incisor from past trauma. Dr. Gursimran Singh Batra performed a conservative tooth preparation and fitted a premium metal-free all-ceramic crown. The crown was customized to match the unique shade and light-reflecting properties of the adjacent teeth, yielding a perfectly natural smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  front_bridge: {
    title: "Anterior Fixed Bridge Restorations",
    tag: "Full Mouth Rehab",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/front_bridge.webp?v=2",
    highlights: [
      "Placement of premium multi-unit bridge",
      "Painless replacement of missing anterior teeth",
      "Restoration of natural speech and aesthetics",
      "Completed with high-strength aesthetic materials"
    ],
    detail: "This patient presented with missing front teeth, creating significant chewing and speech issues. Dr. Gursimran Singh Batra designed and fitted a custom-fabricated multi-unit aesthetic fixed dental bridge. This prosthetic solution restored natural tooth anatomy, bite alignment, and a confident, seamless smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  orthodontic_alignment: {
    title: "Orthodontic Alignment Transformation",
    tag: "Smile Makeover",
    doctor: "Dr. Japneet Kaur Batra",
    img: "images/cases/orthodontic_alignment.webp?v=2",
    highlights: [
      "Correction of severe teeth crowding and misalignment",
      "Customized non-extraction orthodontic plan",
      "Ideal dental arch alignment and bite correction",
      "Establishes long-term periodontal health and function"
    ],
    detail: "The patient presented with severe dental crowding and malaligned arches. Dr. Gursimran Singh Batra implemented a customized orthodontic treatment plan. Over the course of the treatment, the teeth were gradually guided into their ideal positions, resulting in perfect alignment, a balanced bite, and a highly aesthetic smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  anterior_decay_fix: {
    title: "Anterior Aesthetic Rehabilitation",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/anterior_decay_fix.webp?v=2",
    highlights: [
      "Restoration of decayed and fractured front teeth",
      "Premium custom composite or ceramic restorations",
      "Eradication of decay and color imperfections",
      "Minimally invasive conservative tooth preservation"
    ],
    detail: "This patient presented with active decay, pitting, and structural loss on multiple anterior teeth. Dr. Gursimran Singh Batra removed all carious lesions conservatively and reconstructed the front teeth using premium, shade-matched aesthetic restorations. The treatment fully restored structural strength, healthy margins, and a beautiful natural smile.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  teeth_whitening_ba: {
    title: "Professional Teeth Whitening",
    tag: "Teeth Whitening",
    doctor: "Dr. Japneet Kaur Batra",
    img: "images/cases/teeth_whitening_ba.webp?v=2",
    highlights: [
      "In-office light-activated dental bleaching",
      "Significant shade improvement by multiple levels",
      "Removal of stubborn extrinsic enamel stains",
      "Safe, sensitivity-controlled professional protocol"
    ],
    detail: "Presented with generalized yellowing and extrinsic discoloration of teeth from dietary staining. A professional in-office teeth whitening procedure was performed. The session achieved exceptional shade improvements by multiple levels while maintaining complete patient comfort and enamel safety.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  lower_bridge: {
    title: "Lower Anterior Bridge Restoration",
    tag: "Full Mouth Rehab",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/lower_bridge.webp?v=2",
    highlights: [
      "Digital mock-up and 3D dental modeling",
      "Multi-unit porcelain-fused bridge placement",
      "Painless lower front teeth gap replacement",
      "Perfect anatomical integration and bite alignment"
    ],
    detail: "This patient presented with missing lower central incisors. Dr. Gursimran Singh Batra designed a custom multi-unit fixed bridge using 3D modeling and high-precision prosthetic techniques. The bridge restored complete lower dental structure, aesthetics, and natural masticatory bite force.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  crowding_correction: {
    title: "Crowded Teeth Realignment",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/crowding_correction.webp?v=2",
    highlights: [
      "Orthodontic correction of crowded arches",
      "Conservative, non-extraction tooth alignment",
      "Symmetrical dental arch leveling and bite fit",
      "Enhanced clinical aesthetics and oral hygiene access"
    ],
    detail: "This case shows correction of moderate crowding and overlap in the upper dental arch. Dr. Gursimran Singh Batra designed a non-extraction alignment path. The teeth were guided to symmetrical leveling, improving chewing occlusion and smile aesthetics.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  },
  anterior_restoration: {
    title: "Anterior Esthetic Crowns",
    tag: "Smile Makeover",
    doctor: "Dr. Gursimran Singh Batra",
    img: "images/cases/anterior_restoration.webp?v=2",
    highlights: [
      "Placement of premium porcelain veneers/crowns",
      "Correction of severe enamel stains and discoloration",
      "Symmetrical smile design alignment restoration",
      "Durable and natural light-reflecting aesthetics"
    ],
    detail: "This patient presented with severe brown intrinsic staining and misalignment of the front teeth. Dr. Gursimran Singh Batra performed a conservative preparation and fitted premium metal-free all-ceramic restorations. The treatment completely resolved the stains, creating a highly natural, symmetrical, and bright smile contour.",
    whatsappText: "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:"
  }
};
function initCasesGallery() {
  const buttons = document.querySelectorAll('.cases-filter-btn');
  const cards = document.querySelectorAll('.case-card');
  if (buttons.length === 0 || cards.length === 0) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}
function openCaseModal(caseKey) {
  const data = caseData[caseKey];
  if (!data) return;
  document.getElementById('modalCaseImg').src = data.img;
  document.getElementById('modalCaseImg').alt = data.title;
  document.getElementById('modalCaseTag').textContent = data.tag;
  document.getElementById('modalCaseTitle').textContent = data.title;
  document.getElementById('modalCaseDoctor').textContent = data.doctor;
  document.getElementById('modalCaseDetailDesc').textContent = data.detail;
  const highlightsList = document.getElementById('modalCaseHighlights');
  highlightsList.innerHTML = '';
  data.highlights.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    highlightsList.appendChild(li);
  });
  const bookBtn = document.getElementById('modalCaseBookBtn');
  const defaultText = "Hi,\n\nI found your website and would like to book an appointment at Dr. Batra's Dental Hub.\n\nMy details are:\n\nName:\n\nPhone Number:\n\nReason for Visit:\n\nPreferred Appointment Date & Time:";
  const queryText = data.whatsappText ? data.whatsappText : defaultText;
  bookBtn.href = `https://wa.me/917757000831?text=${encodeURIComponent(queryText)}`;
  const modal = document.getElementById('caseModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeCaseModal() {
  const modal = document.getElementById('caseModal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; 
}
function closeCaseModalOnOutsideClick(event) {
  const modal = document.getElementById('caseModal');
  const modalContent = modal.querySelector('.case-modal-content');
  if (event.target === modal) {
    closeCaseModal();
  }
}
window.openCaseModal = openCaseModal;
window.closeCaseModal = closeCaseModal;
window.closeCaseModalOnOutsideClick = closeCaseModalOnOutsideClick;
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');
  if (filterBtns.length === 0 || blogCards.length === 0) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            setTimeout(() => {
              if (card.style.display === 'flex') {
                card.style.opacity = '';
                card.style.transform = '';
                card.style.transition = '';
              }
            }, 400);
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
window.initBlogFilters = initBlogFilters;
function initLogoScroll() {
  document.querySelectorAll('a.logo').forEach(logoLink => {
    logoLink.addEventListener('click', function(e) {
      const path = window.location.pathname;
      const isHome = path === '/' || 
                     path.endsWith('/') || 
                     path.endsWith('index.html');
      if (isHome) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });
}
window.initLogoScroll = initLogoScroll;
function initContentProtection() {
  function showToast(message) {
    let toast = document.getElementById('vt-protection-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vt-protection-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <span>${message}</span>`;
    toast.className = 'show';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.className = '';
    }, 2500);
  }
  document.addEventListener('contextmenu', (e) => {
    const isMedia = e.target.tagName === 'IMG' || 
                    e.target.tagName === 'VIDEO' || 
                    e.target.closest('video') || 
                    e.target.closest('.vt-video-wrap') || 
                    e.target.closest('.smile-slider-wrapper');
    if (isMedia) {
      e.preventDefault();
      showToast("Media is copyright protected");
    }
  });
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      showToast("Developer access restricted");
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      showToast("Inspector tools restricted");
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      showToast("Element selection tools restricted");
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      showToast("Developer console restricted");
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
      e.preventDefault();
      showToast("Page source view restricted");
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
      e.preventDefault();
      showToast("Page saving is restricted");
    }
  });
}
window.initContentProtection = initContentProtection;
function initImageEnhancements() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
}
window.initImageEnhancements = initImageEnhancements;
function initAnimationOptimizer() {
  const animatedElements = document.querySelectorAll('.marquee-inner, .status-dot');
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        } else {
          entry.target.style.animationPlayState = 'paused';
        }
      });
    }, { threshold: 0 });
    animatedElements.forEach(el => observer.observe(el));
  }
}
window.initAnimationOptimizer = initAnimationOptimizer;
function initCasesHomepageCarousel() {
  const grid = document.querySelector('.before-after-homepage-section .cases-grid');
  const prevBtn = document.querySelector('.before-after-homepage-section .cases-prev-btn');
  const nextBtn = document.querySelector('.before-after-homepage-section .cases-next-btn');
  if (!grid || !prevBtn || !nextBtn) return;
  const originalCards = Array.from(grid.querySelectorAll('.case-card'));
  if (originalCards.length < 2) return;
  let isInitialized = false;
  let isScrolling = false;
  let activeN = 0;

  function getVisibleCardsCount() {
    if (window.innerWidth <= 768) return 1;
    return 3;
  }

  function getCardWidth() {
    const card = grid.querySelector('.case-card');
    return card ? card.offsetWidth + 20 : 0; 
  }

  function resetToInitial() {
    const cardWidth = getCardWidth();
    grid.scrollLeft = activeN * cardWidth;
  }

  function handleLoop() {
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return;
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (scrollLeft <= 5) {
      grid.scrollTo({
        left: scrollLeft + (originalCards.length * cardWidth),
        behavior: 'instant'
      });
    }
    else if (scrollLeft >= maxScroll - 5) {
      grid.scrollTo({
        left: scrollLeft - (originalCards.length * cardWidth),
        behavior: 'instant'
      });
    }
  }

  function scrollGrid(direction) {
    if (isScrolling) return;
    isScrolling = true;
    const cardWidth = getCardWidth();
    grid.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth'
    });
    setTimeout(() => {
      handleLoop();
      isScrolling = false;
    }, 450);
  }

  prevBtn.addEventListener('click', () => {
    scrollGrid(-1);
  });
  nextBtn.addEventListener('click', () => {
    scrollGrid(1);
  });

  let scrollTimeout;
  let isTouching = false;
  grid.addEventListener('touchstart', () => { isTouching = true; }, { passive: true });
  grid.addEventListener('touchend', () => {
    isTouching = false;
    if (!isScrolling) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleLoop, 300);
    }
  }, { passive: true });
  grid.addEventListener('touchcancel', () => { isTouching = false; }, { passive: true });
  grid.addEventListener('scroll', () => {
    if (isScrolling || isTouching) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleLoop, 300);
  });

  function checkAndInit() {
    const currentN = getVisibleCardsCount();
    if (currentN !== activeN) {
      // 1. Remove all existing cloned cards
      grid.querySelectorAll('.case-card.cloned').forEach(el => el.remove());
      
      // 2. Clone the first currentN cards and append them
      for (let i = 0; i < currentN; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('cloned');
        grid.appendChild(clone);
      }
      
      // 3. Clone the last currentN cards and prepend them in order
      for (let i = 0; i < currentN; i++) {
        const clone = originalCards[originalCards.length - currentN + i].cloneNode(true);
        clone.classList.add('cloned');
        grid.insertBefore(clone, originalCards[0]);
      }
      
      activeN = currentN;
      isInitialized = true;
      setTimeout(resetToInitial, 300);
    }
  }

  window.addEventListener('resize', checkAndInit);
  checkAndInit();
}
window.initCasesHomepageCarousel = initCasesHomepageCarousel;
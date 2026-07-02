"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // -------------------------------------------------------------
    // Helper to log or debug inside the client browser console
    // -------------------------------------------------------------
    console.log("ClientInitializer: Page changed to", pathname);

    // -------------------------------------------------------------
    // 1. HERO SLIDER CAROUSEL (FADE TRANSLATION)
    // -------------------------------------------------------------
    const initHeroSlider = () => {
      const heroContainer = document.querySelector('.nc-PageHome');
      if (!heroContainer) return;

      const slides = Array.from(heroContainer.querySelectorAll('.fade--animation'));
      if (slides.length === 0) return;

      const dotsContainer = heroContainer.querySelector('.absolute.bottom-4');
      const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

      const nextBtn = heroContainer.querySelector('.absolute.inset-y-px.end-0');
      const prevBtn = heroContainer.querySelector('.absolute.inset-y-px.start-0');

      let currentIdx = 0;

      const showSlide = (index: number) => {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        currentIdx = index;

        // Toggle hidden/flex classes on slides
        slides.forEach((slide, idx) => {
          if (idx === index) {
            slide.classList.remove('hidden');
            slide.classList.add('flex');
          } else {
            slide.classList.add('hidden');
            slide.classList.remove('flex');
          }
        });

        // Update dots styling
        dots.forEach((dot, idx) => {
          const dotInner = dot.querySelector('.relative.h-1.w-20');
          if (dotInner) {
            if (idx === index) {
              if (!dotInner.querySelector('.fade--animation__dot')) {
                dotInner.innerHTML = '<div class="absolute inset-0 rounded-md bg-neutral-900 fade--animation__dot"></div>';
              }
            } else {
              dotInner.innerHTML = '';
            }
          }
        });
      };

      // Show first slide initially
      showSlide(0);

      // Hook up event listeners
      if (nextBtn) {
        (nextBtn as HTMLElement).style.display = 'flex';
        nextBtn.classList.remove('hidden');
        (nextBtn as HTMLButtonElement).onclick = (e) => {
          e.preventDefault();
          resetInterval();
          showSlide(currentIdx + 1);
        };
      }

      if (prevBtn) {
        (prevBtn as HTMLElement).style.display = 'flex';
        prevBtn.classList.remove('hidden');
        (prevBtn as HTMLButtonElement).onclick = (e) => {
          e.preventDefault();
          resetInterval();
          showSlide(currentIdx - 1);
        };
      }

      dots.forEach((dot, idx) => {
        (dot as HTMLElement).onclick = (e) => {
          e.preventDefault();
          resetInterval();
          showSlide(idx);
        };
      });

      // Auto slide interval
      let slideInterval = setInterval(() => {
        showSlide(currentIdx + 1);
      }, 6000);

      const resetInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
          showSlide(currentIdx + 1);
        }, 6000);
      };

      // Store cleanup on window to prevent duplicate intervals
      (window as any)._heroSliderCleanup = () => {
        clearInterval(slideInterval);
      };
    };

    // -------------------------------------------------------------
    // 2. TESTIMONIALS CAROUSEL (TRANSLATION + DOTS)
    // -------------------------------------------------------------
    const initTestimonials = () => {
      const testimonialEmbla = document.querySelector('.relative.mx-auto.max-w-2xl .embla');
      if (!testimonialEmbla) return;

      const container = testimonialEmbla.querySelector('.embla__container') as HTMLElement;
      const slides = Array.from(testimonialEmbla.querySelectorAll('.embla__slide')) as HTMLElement[];
      const dotsContainer = testimonialEmbla.querySelector('.embla__dots');

      if (container && slides.length > 0 && dotsContainer) {
        container.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        container.style.display = 'flex';

        // Clear and build dots
        dotsContainer.innerHTML = '';
        const dots: HTMLButtonElement[] = [];

        slides.forEach((slide, idx) => {
          slide.style.flex = '0 0 100%';
          slide.style.width = '100%';

          const dot = document.createElement('button');
          dot.className = `mx-1.5 h-2 rounded-full transition-all duration-300 ${
            idx === 0 ? 'bg-neutral-900 w-6 dark:bg-white' : 'bg-neutral-300 w-2 dark:bg-neutral-600'
          }`;
          dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
          dot.onclick = (e) => {
            e.preventDefault();
            resetTestimonialInterval();
            showTestimonial(idx);
          };
          dotsContainer.appendChild(dot);
          dots.push(dot);
        });

        let currentIdx = 0;

        const showTestimonial = (index: number) => {
          if (index >= slides.length) index = 0;
          if (index < 0) index = slides.length - 1;
          currentIdx = index;

          container.style.transform = `translate3d(-${index * 100}%, 0, 0)`;

          // Update dots
          dots.forEach((dot, idx) => {
            if (idx === index) {
              dot.className = 'mx-1.5 h-2 rounded-full transition-all duration-300 bg-neutral-900 w-6 dark:bg-white';
            } else {
              dot.className = 'mx-1.5 h-2 rounded-full transition-all duration-300 bg-neutral-300 w-2 dark:bg-neutral-600';
            }
          });
        };

        let testimonialInterval = setInterval(() => {
          showTestimonial(currentIdx + 1);
        }, 5000);

        const resetTestimonialInterval = () => {
          clearInterval(testimonialInterval);
          testimonialInterval = setInterval(() => {
            showTestimonial(currentIdx + 1);
          }, 5000);
        };

        // Store cleanup on window
        (window as any)._testimonialSliderCleanup = () => {
          clearInterval(testimonialInterval);
        };
      }
    };

    // -------------------------------------------------------------
    // 3. GENERIC EMBLA PRODUCT CAROUSELS
    // -------------------------------------------------------------
    const initEmblaCarousels = () => {
      // Find next/prev buttons containers
      const nextPrevContainers = document.querySelectorAll('.nc-NextPrev');
      
      nextPrevContainers.forEach(nextPrevContainer => {
        let parent = nextPrevContainer.parentElement;
        let embla: HTMLElement | null = null;
        
        // Find matching embla container
        while (parent && !embla) {
          embla = parent.querySelector('.embla') || 
                  (parent.nextElementSibling?.querySelector('.embla') as HTMLElement) || 
                  (parent.nextElementSibling?.classList.contains('embla') ? (parent.nextElementSibling as HTMLElement) : null);
          parent = parent.parentElement;
        }

        if (!embla) {
          // Fallback coordinate search
          const allEmblas = Array.from(document.querySelectorAll('.embla')) as HTMLElement[];
          let minDistance = Infinity;
          allEmblas.forEach(e => {
            const dist = Math.abs(e.getBoundingClientRect().top - nextPrevContainer.getBoundingClientRect().top);
            if (dist < minDistance) {
              minDistance = dist;
              embla = e;
            }
          });
        }

        // Testimonials embla is handled separately
        if (embla && !embla.closest('.relative.mx-auto.max-w-2xl')) {
          const prevBtn = nextPrevContainer.querySelector('[aria-label="Prev"]') || nextPrevContainer.firstElementChild;
          const nextBtn = nextPrevContainer.querySelector('[aria-label="Next"]') || nextPrevContainer.lastElementChild;

          if (prevBtn) {
            prevBtn.removeAttribute('disabled');
            prevBtn.removeAttribute('aria-disabled');
            prevBtn.classList.remove('opacity-50');
          }
          if (nextBtn) {
            nextBtn.removeAttribute('disabled');
            nextBtn.removeAttribute('aria-disabled');
            nextBtn.classList.remove('opacity-50');
            nextBtn.classList.add('border-2');
          }

          const emblaContainer = embla as HTMLElement;
          emblaContainer.style.overflowX = 'auto';
          emblaContainer.style.scrollBehavior = 'smooth';
          emblaContainer.style.webkitOverflowScrolling = 'touch';
          // Add custom style to hide scrollbar
          const styleId = 'embla-scrollbar-hide-style';
          if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
              .embla {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
              .embla::-webkit-scrollbar {
                display: none !important;
              }
            `;
            document.head.appendChild(style);
          }

          if (prevBtn) {
            (prevBtn as HTMLElement).onclick = (e) => {
              e.preventDefault();
              const slide = emblaContainer.querySelector('.embla__slide') as HTMLElement;
              const scrollAmount = slide ? slide.offsetWidth + 20 : 400;
              emblaContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            };
          }
          if (nextBtn) {
            (nextBtn as HTMLElement).onclick = (e) => {
              e.preventDefault();
              const slide = emblaContainer.querySelector('.embla__slide') as HTMLElement;
              const scrollAmount = slide ? slide.offsetWidth + 20 : 400;
              emblaContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            };
          }
        }
      });
    };

    // -------------------------------------------------------------
    // 4. START EXPLORING CATEGORY TABS
    // -------------------------------------------------------------
    const initCategoryTabs = () => {
      const tabsContainer = document.querySelector('.nc-PageHome ul.hidden-scrollbar');
      if (!tabsContainer) return;

      const tabButtons = Array.from(tabsContainer.querySelectorAll('button')) as HTMLButtonElement[];
      const grid = tabsContainer.closest('.nc-PageHome')?.querySelector('.grid') as HTMLElement;

      if (grid) {
        const gridItems = Array.from(grid.children) as HTMLElement[];

        tabButtons.forEach((btn, idx) => {
          btn.onclick = (e) => {
            e.preventDefault();

            // Toggle active classes
            tabButtons.forEach(b => {
              b.className = "block cursor-pointer rounded-full font-medium whitespace-nowrap px-4 py-2.5 sm:text-sm sm:px-6 sm:py-3 capitalize text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";
            });
            btn.className = "block cursor-pointer rounded-full font-medium whitespace-nowrap px-4 py-2.5 sm:text-sm sm:px-6 sm:py-3 capitalize bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900";

            // Fade transition
            grid.style.transition = 'opacity 0.2s ease';
            grid.style.opacity = '0';

            setTimeout(() => {
              grid.innerHTML = '';
              // Shift cards order to simulate loading category specific data
              const shiftedItems = [...gridItems.slice(idx % gridItems.length), ...gridItems.slice(0, idx % gridItems.length)];
              shiftedItems.forEach(item => grid.appendChild(item));
              grid.style.opacity = '1';
            }, 200);
          };
        });
      }
    };

    // -------------------------------------------------------------
    // 5. GLOBAL MOBILE MENU INJECTION & WIRING
    // -------------------------------------------------------------
    const initMobileMenu = () => {
      const hamburgerBtn = Array.from(document.querySelectorAll('button')).find(
        b => b.textContent?.includes('Open main menu') || b.querySelector('.sr-only')?.textContent?.includes('Open main menu')
      );

      if (hamburgerBtn) {
        hamburgerBtn.onclick = (e) => {
          e.preventDefault();
          openMobileMenu();
        };
      }
    };

    const openMobileMenu = () => {
      if (document.getElementById('custom-mobile-menu')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'custom-mobile-menu-backdrop';
      backdrop.className = 'fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 opacity-0';

      const panel = document.createElement('div');
      panel.id = 'custom-mobile-menu';
      panel.className = 'fixed inset-y-0 start-0 z-50 w-full max-w-xs bg-white dark:bg-neutral-900 p-6 shadow-2xl transition-transform duration-300 transform -translate-x-full flex flex-col';

      panel.innerHTML = `
        <div class="flex items-center justify-between border-b pb-4 dark:border-neutral-800">
          <span class="text-xl font-bold text-neutral-900 dark:text-white">Ciseco</span>
          <button id="close-mobile-menu" class="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="mt-6 flex-1 space-y-4">
          <a href="/" class="block text-lg font-medium text-neutral-900 dark:text-white hover:text-primary-600">Home</a>
          <a href="/collections/all" class="block text-lg font-medium text-neutral-900 dark:text-white hover:text-primary-600">Shop All</a>
          <div class="border-t pt-4 dark:border-neutral-800 space-y-3">
            <span class="block text-xs font-semibold uppercase tracking-wider text-neutral-400">Categories</span>
            <a href="/collections/jackets" class="block text-base text-neutral-600 dark:text-neutral-300 hover:text-primary-600 pl-2">Jackets</a>
            <a href="/collections/jeans" class="block text-base text-neutral-600 dark:text-neutral-300 hover:text-primary-600 pl-2">Jeans</a>
            <a href="/collections/shoes" class="block text-base text-neutral-600 dark:text-neutral-300 hover:text-primary-600 pl-2">Shoes</a>
            <a href="/collections/t-shirts" class="block text-base text-neutral-600 dark:text-neutral-300 hover:text-primary-600 pl-2">T-Shirts</a>
            <a href="/collections/accessories" class="block text-base text-neutral-600 dark:text-neutral-300 hover:text-primary-600 pl-2">Accessories</a>
          </div>
          <a href="/blog" class="block text-lg font-medium text-neutral-900 dark:text-white hover:text-primary-600 border-t pt-4 dark:border-neutral-800">Blog</a>
          <a href="/search" class="block text-lg font-medium text-neutral-900 dark:text-white hover:text-primary-600">Search</a>
        </nav>
      `;

      document.body.appendChild(backdrop);
      document.body.appendChild(panel);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('-translate-x-full');
        panel.classList.add('translate-x-0');
      }, 10);

      const close = () => {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        panel.classList.remove('translate-x-0');
        panel.classList.add('-translate-x-full');
        document.body.style.overflow = '';

        setTimeout(() => {
          backdrop.remove();
          panel.remove();
        }, 300);
      };

      backdrop.onclick = close;
      const closeBtn = panel.querySelector('#close-mobile-menu');
      if (closeBtn) (closeBtn as HTMLElement).onclick = close;
    };

    // -------------------------------------------------------------
    // RUN ALL INITIALIZATIONS
    // -------------------------------------------------------------
    initHeroSlider();
    initTestimonials();
    initEmblaCarousels();
    initCategoryTabs();
    initMobileMenu();

    // -------------------------------------------------------------
    // CLEANUP INTERVALS ON ROUTE UNMOUNT
    // -------------------------------------------------------------
    return () => {
      if ((window as any)._heroSliderCleanup) (window as any)._heroSliderCleanup();
      if ((window as any)._testimonialSliderCleanup) (window as any)._testimonialSliderCleanup();
    };

  }, [pathname]);

  return null;
}

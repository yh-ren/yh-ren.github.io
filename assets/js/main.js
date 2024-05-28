(function() {

  const documentBody = document.body;
  const preloaderOuter = documentBody.querySelector("[data-preloader-outer]");
  const preloader = preloaderOuter.querySelector("[data-preloader-count]");

  const modalOuter = documentBody.querySelector('[data-modal-outer]');
  const modalWrapper = modalOuter.querySelector('[data-modal-wrapper]');
  const modal = modalOuter.querySelector('[data-modal-container]');

  const gsAnimationA = { opacity: 0, y: 20, ease: "sine.out" };
  const gsAnimationB = { opacity: 0, y: 20, ease: "sine.out", stagger: 0.1 };
  const gsAnimationC = { scale: 0.5, opacity: 0, ease: "circ.out" };

  const ls = new Lenis({
    lerp: 0.06,
    smooth: true 
  });

  window.addEventListener("load", _initPreloader);

  function _initPreloader() {
    var start = 0;
    var end = 100;
    const tl = gsap.timeline();

    tl
      .fromTo(preloader, {
        innerText: start
      },
      {
        innerText: end,
        duration: 2.5,
        onUpdate: () => {
          preloader.textContent = `${parseInt(preloader.innerText)}%`;
        }
      })
      .to(preloader, {
        opacity: 0,
        ease: "sine.out",
        onComplete: () => {
          tl.to(preloaderOuter, {
            visibility: "hidden",
            opacity: 0,
            duration: 0.01
          });
          _init();
        }
      })
  }

  function _init() {
    splt({});
    _initScroll();
    _initGradients();
    _initHeaderLinks();
    _initModalTriggers();
    _initSections();
  }

  function _initScroll() {
    const renderScroll = (time) => {
      ls.raf(time);
      requestAnimationFrame(renderScroll);
    }

    requestAnimationFrame(renderScroll);

    ls.on('scroll', () => ScrollTrigger.update());
  }

  /* ================================ helpers ================================ */

  function onEnterChangeBackgroundColor(split) {
    gsap.to(documentBody, {
      backgroundColor: split.dataset.bgColor,
      color: split.dataset.textColor,
      overwrite: 'auto'
    })
  }

  function onLeaveBackChangeBackgroundColor(split) {
    const splits = document.querySelectorAll('[data-split]');
    const currentSplitIndex = parseFloat(split.dataset.split);
    const prevSplit = currentSplitIndex === 0 ? split : splits[currentSplitIndex - 1];
    if (!prevSplit) return;
    
    gsap.to(documentBody, {
      backgroundColor: prevSplit.dataset.bgColor,
      color: prevSplit.dataset.textColor,
      overwrite: 'auto'
    })
  }

  /* ========================================================================= */

  function _initGradients() {
    const colorPrimary = "#7A3DFF";
    const colorSecondary = "#19F3DD";
    const colorAccent = "#C4F548";

    const gn1 = new Granim({
      element: '#hero__background',
      direction: 'left-right',
      isPausedWhenNotInView: true,
      states : {
        "default-state": {
            gradients: [
              [colorPrimary, colorSecondary],
              [colorSecondary, colorAccent],
              [colorAccent, colorPrimary]
            ],
            transitionSpeed: 750
        }
      }
    });

    const gn2 = new Granim({
      element: '#header__menu__background',
      direction: 'diagonal',
      isPausedWhenNotInView: true,
      states : {
        "default-state": {
            gradients: [
              [colorPrimary, colorSecondary],
              [colorSecondary, colorAccent],
              [colorAccent, colorPrimary]
            ],
            transitionSpeed: 750
        }
      }
    });

    gn1.play();
    gn2.play();
  }

  function _initHeaderLinks() {
    const header = document.querySelector('header');
    const links = header.querySelectorAll('[data-header-menu-link]');
    const headerMenuMobileTrigger = header.querySelector('.mobile [data-header-menu-button]');
    const headerMenuMobile = header.querySelector('.mobile .header__menu');
    const headerMenuItemsMobile = headerMenuMobile.querySelectorAll('.header__menu__item');

    const mm = gsap.matchMedia();
    
    links.forEach((link) => {
      link.addEventListener('click', (evt) => {
        const sectionId = evt.target.dataset.headerMenuLink;
        const targetSection = document.querySelector(`#${sectionId}`);
        const targetSectionRect = targetSection.getBoundingClientRect();
        var targetSectionOffset = 0;

        // desktop
        mm.add("(min-width: 768px)", () => {
          targetSectionOffset = parseFloat(targetSection.dataset.offset);
        });

        if (targetSection) {
          var offset = (targetSectionRect.top + window.scrollY > ls.targetScroll) ? targetSectionOffset: 0;
          var duration = offset ? 4 : 1;
          
          ls.scrollTo(targetSection, { 
            offset, 
            duration, 
            lerp: 0.08, 
            smooth: true 
          });
        } else window.scrollTo(0,0);
      })
    });

    headerMenuMobileTrigger.addEventListener('click', () => {
      headerMenuMobileTrigger.classList.toggle('menu-visible');
      headerMenuMobile.classList.toggle('is-visible');
    });
    headerMenuItemsMobile.forEach((item) => {
      item.addEventListener('click', () => {
        headerMenuMobileTrigger.classList.remove('menu-visible');
        headerMenuMobile.classList.remove('is-visible');
      })
    });
  }

  function _initModalTriggers() {
    const openTriggers = document.querySelectorAll('[data-open-modal-trigger]');
    const closeTriggers = document.querySelectorAll('[data-close-modal-trigger]');
    openTriggers.forEach((trigger) => {
      trigger.addEventListener("click", openModal)
    });
    closeTriggers.forEach((trigger) => {
      trigger.addEventListener("click", closeModal);
    })
  }

  /* ================================ helpers ================================ */
  
  function renderModal(evt) {
    const target = evt.currentTarget;
    const modalId = target.dataset.openModalTrigger;
    const modalInner = modalOuter.querySelectorAll('[data-modal-inner]');
    const targetModalInner = modalOuter.querySelector(`#${modalId}`);

    modalInner.forEach((inner) => inner.classList.add("hide"));
    if (targetModalInner) targetModalInner.classList.remove("hide");
  }

  function openModal(evt) {
    renderModal(evt);

    const tl = gsap.timeline();

    tl.to(modalWrapper, {
      visibility: "visible",
      opacity: 1,
      duration: 0.01,
      onComplete: () => {
        tl.fromTo(modal, {
          yPercent: 100,
          opacity: 0,
        }, 
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power4.out',
          duration: 0.4
        });
      }
    });
  }

  function closeModal(evt) {
    const tl = gsap.timeline();

    gsap.fromTo(modal, {
      yPercent: 0,
      opacity: 1
    }, 
    {
      yPercent: 100,
      opacity: 0,
      ease: 'power1.out',
      duration: 0.2,
      onComplete: () => {
        tl.to(modalWrapper, {
          visibility: "hidden",
          opacity: 0,
          duration: 0.01
        })
      }
    });
  }

  /* ========================================================================= */

  function _initSections() {
    initHeroSection();
    initAboutSection();
    initPortfolioSection();
    initContactSection();
  }

  function initHeroSection() {
    const header = document.querySelector('header');
    const section = document.querySelector('#hero');
    const backdrop = section.querySelector('.hero__background');
    // desktop
    const headerLogoDesktop = header.querySelector('.desktop .header__menu__logo .icon');
    const headerMenuItemsDesktop = header.querySelectorAll('.desktop .header__menu__item');
    const titleFirstPathsDesktop = section.querySelectorAll('.desktop .hero__title .icon-name-filled .first');
    const titleLastPathsDesktop = section.querySelectorAll('.desktop .hero__title .icon-name-filled .last');
    const subtitleDesktop = section.querySelector('.desktop .hero__subtitle');
    // mobile
    const headerLogoMobile = header.querySelector('.mobile .header__menu__logo .icon');
    const titleFirstPathsMobile = section.querySelectorAll('.mobile .hero__title .icon-name-filled .first');
    const titleLastPathsMobile = section.querySelectorAll('.mobile .hero__title .icon-name-filled .last');
    const subtitleMobile = section.querySelector('.mobile .hero__subtitle');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 50%",
        end: "bottom top",
        onEnter: () => {
          onEnterChangeBackgroundColor(section);
        },
        onLeaveBack: () => {
          onLeaveBackChangeBackgroundColor(section);
        }
      }
    });
    const mm = gsap.matchMedia();

    // desktop
    mm.add("(min-width: 768px)", () => {
      gsap.set("#title", { autoAlpha: 1 });
      gsap.set(titleFirstPathsDesktop, { yPercent: 200 });
      gsap.set(titleLastPathsDesktop, { yPercent: -200 });
      
      tl
        .to(titleFirstPathsDesktop, {
          delay: 0.5,
          yPercent: 0,
          ease: "power1.out",
          duration: 0.5
        })
        .to(titleLastPathsDesktop, {
          yPercent: 0,
          ease: "power1.out",
          duration: 0.5
        })
        .to(backdrop, {
          '--d1': '25%',
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          ease: 'back.out(2)',
        })
        .to(backdrop, {
          '--d2': '32%',
          '--d3': 'calc(32% + 0.1rem)',
          duration: 0.5,
          delay: 0.5,
          ease: 'back.out(2)',
          onComplete: () => {
            tl.fromTo(backdrop, {
              '--d1': '25%',
              opacity: 1
            },
            {
              '--d1': '100%',
              opacity: 0,
              ease: 'power1.inOut',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: section,
                pin: '.hero__background',
                pinnedContainer: section,
                start: "top top",
                end: "bottom top",
                scrub: 1
              }
            })
          }
        })

      // update backdrop position on mousemove 
      window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = Math.round((clientX / window.innerWidth) * 100);
        const y = Math.round((clientY / window.innerHeight) * 100);

        gsap.to(backdrop, {
          '--x': `${x}%`,
          '--y': `${y}%`,
          duration: 0.4,
          delay: 0.01,
          ease: 'sine.out'
        });
      });

      tl
        .from(subtitleDesktop, gsAnimationA)
        .from(headerLogoDesktop, gsAnimationA)
        .from(headerMenuItemsDesktop, gsAnimationB);
    });
    
    // mobile
    mm.add("(max-width: 767px)", () => {
      gsap.set("#title", { autoAlpha: 1 });
      gsap.set(titleFirstPathsMobile, { yPercent: 200 });
      gsap.set(titleLastPathsMobile, { yPercent: -200 });

      tl
        .to(titleFirstPathsMobile, {
          yPercent: 0,
          ease: "power1.out",
          duration: 0.5
        })
        .to(titleLastPathsMobile, {
          yPercent: 0,
          ease: "power1.out",
          duration: 0.5
        })
        .from(subtitleMobile, gsAnimationA)
        .from(headerLogoMobile, gsAnimationA);
    });
  }

  function initAboutSection() {
    const section = document.querySelector('#about');
    const image = section.querySelector('.about__image');
    const title = section.querySelector('.about__heading');
    const body = section.querySelector('.about__body');
    const bodyLine = section.querySelector('.about__body__line');
    const skillsHeading = section.querySelector('.about__skills__heading');
    const skillsIcons = section.querySelectorAll('.about__skills__icon');
    const titleChars = title.querySelectorAll('.char');

    const mm = gsap.matchMedia();

    mm.add("(min-width: 990px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          onEnter: () => {
            onEnterChangeBackgroundColor(section);
          },
          onLeaveBack: () => {
            onLeaveBackChangeBackgroundColor(section);
          }
        }
      });

      tl
        .from(titleChars, gsAnimationB)
        .from(bodyLine, { width: 0, ease: "sine.out", stagger: 0.02 })
        .from(body, gsAnimationA)
        .from(image, 0.5, gsAnimationC)
        .from(skillsHeading, gsAnimationA)
        .from(skillsIcons, gsAnimationB);  
    });

    mm.add("(max-width: 989px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "top top",
          scrub: 1,
          onEnter: () => {
            onEnterChangeBackgroundColor(section);
          },
          onLeaveBack: () => {
            onLeaveBackChangeBackgroundColor(section);
          }
        }
      });

      tl
        .from(image, 1.5, gsAnimationC)
        .from(titleChars, gsAnimationB)
        .from(body, gsAnimationA)
        .from(skillsHeading, gsAnimationA)
        .from(skillsIcons, gsAnimationB);
    });
  }

  function initPortfolioSection() {
    const section = document.querySelector('#portfolio');
    // desktop
    const previewsWrapper = section.querySelector('.desktop .portfolio__previews__wrapper');
    const previews = section.querySelectorAll('.desktop .portfolio__preview:not(:first-child)');
    const contentsDesktop = section.querySelectorAll('.desktop .portfolio__content');
    // mobile
    const contentsMobile = section.querySelectorAll('.mobile .portfolio__item');

    const mm = gsap.matchMedia();

    // desktop
    mm.add("(min-width: 768px)", () => {
      gsap.set(previews, { 
        clipPath: () => {
          return "ellipse(45% 0px at 50% 100%)"
        }
       });

      ScrollTrigger.create({
        trigger: section,
        pin: previewsWrapper,
        start: 'top top',
        end: 'bottom 80%',
        scrub: 1,
        animation:
          gsap.to(previews, {
            clipPath: () => {
              return "ellipse(165% 650px at 50% 100%)"
            },
            duration: 1, 
            stagger: 1,
            ease: 'sine.out'
          })
      });

      contentsDesktop.forEach((content, index) => {
        const heading = content.querySelector('.portfolio__heading');
        const body = content.querySelector('.portfolio__body');
        const linkBtns = content.querySelectorAll('.portfolio__links .btn');
        const headingChars = heading.querySelectorAll('.char');
  
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: contentsDesktop[index],
            start: 'top 40%',
            end: 'bottom bottom',
            scrub: 1,
            onEnter: () => {
              onEnterChangeBackgroundColor(content);
            },
            onLeaveBack: () => {
              onLeaveBackChangeBackgroundColor(content);
            }
          }
        });
  
        tl
          .from(headingChars, gsAnimationB)
          .from(body, gsAnimationA)
          .from(linkBtns, gsAnimationB);
      });
    });

    // mobile
    mm.add("(max-width: 767px)", () => {
      contentsMobile.forEach((content, index) => {
        const heading = content.querySelector('.portfolio__heading');
        const body = content.querySelector('.portfolio__body');
        const linkBtns = content.querySelectorAll('.portfolio__links .btn');
        const headingChars = heading.querySelectorAll('.char');
  
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: contentsMobile[index],
            start: 'top 50%',
            end: 'bottom bottom',
            scrub: 1,
            onEnter: () => {
              onEnterChangeBackgroundColor(content);
            },
            onLeaveBack: () => {
              onLeaveBackChangeBackgroundColor(content);
            }
          }
        });
  
        tl
          .from(headingChars, gsAnimationB)
          .from(body, gsAnimationA)
          .from(linkBtns, gsAnimationB);
      });
    });
  }

  function initContactSection() {
    const section = document.querySelector('#contact');
    const title = section.querySelector('.contact__heading');
    const body = section.querySelector('.contact__body');
    const icons = section.querySelectorAll('.contact__icon');
    const copyright = section.querySelector('.copyright');
    const titleChars = title.querySelectorAll('.char');

    const mm = gsap.matchMedia();

    // desktop
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          onEnter: () => {
            onEnterChangeBackgroundColor(section);
          },
          onLeaveBack: () => {
            onLeaveBackChangeBackgroundColor(section);
          }
        }
      });
  
      tl
        .from(titleChars, gsAnimationB)
        .from(body, gsAnimationA)
        .from(icons, gsAnimationB)
        .from(copyright, gsAnimationA);
    });

    // mobile
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "top top",
          scrub: 1,
          onEnter: () => {
            onEnterChangeBackgroundColor(section);
          },
          onLeaveBack: () => {
            onLeaveBackChangeBackgroundColor(section);
          }
        }
      });
  
      tl
        .from(titleChars, gsAnimationB)
        .from(body, gsAnimationA)
        .from(icons, gsAnimationB)
        .from(copyright, gsAnimationA);
    });
  }

})();
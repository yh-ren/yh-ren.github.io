function _initTaglines() {
  const taglines = gsap.utils.toArray('.loading__tagline');
  const tl = gsap.timeline({repeat: -1});
  const repeatDelay = 1.24 * (taglines.length - 1);

  taglines.forEach((tagline) => {
    const splitTagline = new SplitTextJS(tagline);

    tl
      .from(splitTagline.chars, {
        opacity: 0,
        y: 28,
        rotateX: -90,
        stagger: {
          each: 0.02,
          repeat: -1,
          repeatDelay: repeatDelay
        }
      }, "<")
      .to(splitTagline.chars, {
        opacity: 0,
        y: -28,
        rotateX: 90,
        stagger: {
          each: 0.02,
          repeat: -1,
          repeatDelay: repeatDelay
        }
      }, "<1");
  })
}

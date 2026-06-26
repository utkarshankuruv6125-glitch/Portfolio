const hasGsap = typeof gsap !== "undefined";

if (hasGsap && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const entryBtn = document.querySelector(".entrybtn button");
const welcomePage = document.querySelector(".welcomepage");
const welcomePageBtn = document.querySelector("#welcomePageBtn");
const welcomeActiveClass = "welcome-active";
const navButtons = {
    homepagebtn: ".page1",
    aboutpagebtn: ".page2",
    projectpagebtn: ".page3",
    servicepagebtn: ".page4",
    contactpagebtn: ".page5",
};

function setWelcomeActive(isActive) {
    document.body.classList.toggle(welcomeActiveClass, isActive);
    document.documentElement.classList.toggle(welcomeActiveClass, isActive);
}

function lockBody() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function unlockBody() {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
}

function welcomePageAnimation() {
    lockBody();

    if (!hasGsap) {
        return;
    }

    gsap.to(".anime", {
        rotate: 720,
        duration: 8,
        repeat: -1,
        ease: "linear",
    });

    const tl = gsap.timeline();
    tl.from(".status span", {
        y: -70,
        duration: 0.8,
        delay: 0.25,
        stagger: 0.12,
        opacity: 0,
    })
        .from(".fpp1 h1, .fpp1 h4, .fpp1 h2", {
            x: -80,
            duration: 0.8,
            stagger: 0.12,
            opacity: 0,
        })
        .from(".sourcebtns span", {
            y: 50,
            duration: 0.55,
            stagger: 0.1,
            opacity: 0,
        })
        .from(".fpp2", {
            x: 80,
            duration: 0.55,
            opacity: 0,
        })
        .from(".fpp2body", {
            scale: 0.7,
            duration: 0.65,
            opacity: 0,
        })
        .from(".fpp2footer", {
            y: 30,
            duration: 0.45,
            opacity: 0,
        })
        .from(".entrybtn", {
            y: 35,
            duration: 0.45,
            opacity: 0,
        });
}

function welcomePageExitAnimation() {
    if (!welcomePage) {
        return;
    }

    if (!hasGsap) {
        welcomePage.style.display = "none";
        setWelcomeActive(false);
        unlockBody();
        return;
    }

    gsap.timeline({
        onComplete: () => {
            setWelcomeActive(false);
            unlockBody();
        },
    })
        .to(".entrybtn", {
            y: 35,
            duration: 0.2,
            opacity: 0,
        })
        .to(".fpp2", {
            x: 80,
            duration: 0.25,
            opacity: 0,
        })
        .to(".fpp1", {
            x: -80,
            duration: 0.25,
            opacity: 0,
        }, "<")
        .to(".welcomepage", {
            duration: 0.55,
            opacity: 0,
            visibility: "hidden",
            scale: 0.96,
            ease: "power2.inOut",
        });
}

function welcomePageEntryAnimation() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    setWelcomeActive(true);
    lockBody();

    if (!hasGsap) {
        welcomePage.style.display = "grid";
        welcomePage.style.visibility = "visible";
        welcomePage.style.opacity = "1";
        return;
    }

    gsap.set(".entrybtn, .fpp1, .fpp2, .welcomepage", {
        clearProps: "all",
    });

    gsap.timeline()
        .fromTo(".welcomepage", {
            opacity: 0,
            visibility: "visible",
            scale: 1.04,
        }, {
            duration: 0.45,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
        })
        .from(".frontpage", {
            y: 24,
            duration: 0.35,
            opacity: 0,
        });
}

function syncPointer(event) {
    document.documentElement.style.setProperty("--nav-x", event.clientX.toFixed(2));
    document.documentElement.style.setProperty("--nav-y", event.clientY.toFixed(2));
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
    });

    revealItems.forEach((item) => observer.observe(item));
}

function setupNavigation() {
    Object.entries(navButtons).forEach(([buttonId, selector]) => {
        const button = document.querySelector(`#${buttonId}`);
        const section = document.querySelector(selector);

        if (!button || !section) {
            return;
        }

        button.addEventListener("click", () => {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });
}

document.body.addEventListener("pointermove", syncPointer);

if (entryBtn) {
    entryBtn.addEventListener("click", welcomePageExitAnimation);
}

if (welcomePageBtn) {
    welcomePageBtn.addEventListener("click", welcomePageEntryAnimation);
}

const contactForm = document.querySelector(".page5part2");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalText = submitButton?.textContent || "Send Message";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                contactForm.reset();
                const successPopup = document.getElementById("form-success-popup");
                if (successPopup) {
                    successPopup.classList.add("show");
                    setTimeout(() => {
                        successPopup.classList.remove("show");
                    }, 2200);
                }
            } else {
                alert("Message could not be sent. Please try again.");
            }
        } catch (error) {
            alert("Message could not be sent. Please try again.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });
}

setWelcomeActive(true);
welcomePageAnimation();
setupRevealAnimations();
setupNavigation();

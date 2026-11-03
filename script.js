document.body.classList.add("js-enabled");

// Cache the main elements used by the small interaction scripts below.
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionElements = document.querySelectorAll("main section");
const footerText = document.getElementById("footer-text");
const projectCards = document.querySelectorAll("#projects .project-card");
const sectionNavLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const lightbox = document.getElementById("project-lightbox");
const lightboxImage = lightbox ? lightbox.querySelector(".project-lightbox-image") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".project-lightbox-close") : null;
let lightboxTrigger = null;

const revealProjects = () => {
	projectCards.forEach((card) => card.classList.add("project-visible"));
};

if (projectCards.length > 0) {
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (!reducedMotion && "IntersectionObserver" in window) {
		document.documentElement.classList.add("js-reveal");

		try {
			const projectObserver = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.add("project-visible");
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.15 },
			);

			projectCards.forEach((card) => projectObserver.observe(card));
		} catch (error) {
			document.documentElement.classList.remove("js-reveal");
			revealProjects();
		}
	} else {
		revealProjects();
	}
}

if (footerText) {
	// Keep the footer year current without editing the HTML every year.
	footerText.textContent = `Built with HTML, CSS, and JavaScript • ${new Date().getFullYear()}`;
}

if ("IntersectionObserver" in window && sectionNavLinks.length > 0) {
	const sectionLinkMap = new Map(
		sectionNavLinks
			.map((link) => [document.querySelector(link.getAttribute("href")), link])
			.filter(([section]) => section),
	);
	const activeSectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				sectionNavLinks.forEach((link) => {
					const isActive = sectionLinkMap.get(entry.target) === link;
					link.classList.toggle("active", isActive);
					if (isActive) {
						link.setAttribute("aria-current", "true");
					} else {
						link.removeAttribute("aria-current");
					}
				});
			});
		},
		{ rootMargin: "-40% 0px -55% 0px", threshold: 0 },
	);

	sectionLinkMap.forEach((_, section) => activeSectionObserver.observe(section));
}

if (lightbox && lightboxImage && lightboxClose) {
	const closeLightbox = () => {
		lightbox.hidden = true;
		document.body.style.overflow = "";
		if (lightboxTrigger) {
			lightboxTrigger.focus();
		}
	};

	const openLightbox = (trigger) => {
		const image = trigger.querySelector(".project-image");

		if (!image || image.hidden || !image.src) {
			return;
		}

		lightboxTrigger = trigger;
		lightboxImage.src = image.currentSrc || image.src;
		lightboxImage.alt = image.alt;
		lightbox.hidden = false;
		document.body.style.overflow = "hidden";
		lightboxClose.focus();
	};

	document.querySelectorAll(".project-image-wrap").forEach((trigger) => {
		trigger.addEventListener("click", () => openLightbox(trigger));
		trigger.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openLightbox(trigger);
			}
		});
	});

	lightboxClose.addEventListener("click", closeLightbox);
	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox || event.target.hasAttribute("data-lightbox-close")) {
			closeLightbox();
		}
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !lightbox.hidden) {
			closeLightbox();
		}
	});
}

if (navToggle && navLinks) {
	// Open and close the mobile navigation menu.
	navToggle.addEventListener("click", () => {
		const isOpen = navLinks.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});

	// Smooth-scroll to sections and close the menu after a link is clicked.
	navLinks.addEventListener("click", (event) => {
		const link = event.target.closest("a[href^='#']");

		if (!link) {
			return;
		}

		event.preventDefault();

		const targetId = link.getAttribute("href");
		const targetSection = document.querySelector(targetId);

		if (targetSection) {
			const offset = header ? header.offsetHeight : 0;
			const topPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset - 8;

			window.scrollTo({
				top: topPosition,
				behavior: "smooth",
			});
		}

		navLinks.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
	});
}

if ("IntersectionObserver" in window) {
	// Reveal each section as it enters the viewport.
	const sectionObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("section-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.15,
		},
	);

	sectionElements.forEach((section) => {
		sectionObserver.observe(section);
	});

	if (sectionElements[0]) {
		sectionElements[0].classList.add("section-visible");
		sectionObserver.unobserve(sectionElements[0]);
	}
} else {
	sectionElements.forEach((section) => {
		section.classList.add("section-visible");
	});
}

const initialHashSection = location.hash ? document.querySelector(location.hash) : null;

if (initialHashSection) {
	window.addEventListener(
		"load",
		() => {
			const offset = header ? header.offsetHeight : 0;
			const topPosition = initialHashSection.getBoundingClientRect().top + window.pageYOffset - offset - 8;

			window.scrollTo({
				top: topPosition,
				behavior: "auto",
			});
		},
		{ once: true },
	);
}

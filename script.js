document.body.classList.add("js-enabled");

// Cache the main elements used by the small interaction scripts below.
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionElements = document.querySelectorAll("main section");
const footerText = document.getElementById("footer-text");

if (footerText) {
	// Keep the footer year current without editing the HTML every year.
	footerText.textContent = `Built with HTML, CSS, and JavaScript • ${new Date().getFullYear()}`;
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

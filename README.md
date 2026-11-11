# Nithin Thirumani — Developer Portfolio

A ground-up, static personal portfolio with a Dark Tech visual system, built for fast loading and easy hosting on GitHub Pages.

## What is here

- **Solid-black hero with a professional engineering summary** drawn from resume experience, followed by a technology-logo ticker; no decorative background effects
- **Selected projects**: Jarvis, ApplyWise, Microservices based health care monitoring system, and Website for Automobile spare parts store
- **Full-height, winding SVG career journey** with alternating milestones, reverse-on-scroll blue stroke animation, responsive layout, clickable events, and reduced-motion support
- **Education and certifications** presented separately, with experience in the journey and skills in the scrolling logo strip
- **Full-screen mobile menu**, keyboard navigation, reduced-motion support, and semantic page structure
- **Logo-only skills marquee** with original full-color technology logos, seamless right-to-left loop, gradient fade, and hover pause
- **Sticky stacking project cards with image-left, information-right design**, original technology logos and GitHub actions
- **Clean editorial footer** with a bold name, direct email, and GitHub, Gmail, LinkedIn, and iMessage icons
- **Arrow-free controls**, consistent Inter-based labels, and a career SVG that terminates at its final milestone

## Run locally

There are no framework dependencies or build steps.

Open \`index.html\` in your browser, or serve it from a local server:

\`\`\`sh
python -m http.server 8000
\`\`\`

Visit http://localhost:8000.

## Publish on GitHub Pages

In repository **Settings → Pages**, set **Source** to **Deploy from a branch**, then select **main** and **/(root)** and save. The site will be available at:

https://nithin0553.github.io/Nithin-Portfolio/

## Files

- \`index.html\`: all site content and semantic layout
- \`styles.css\`: responsive visual system
- \`script.js\`: mobile navigation, milestone selection and scroll-progress SVG drawing
- \`assets/favicon.svg\`: original N monogram
- \`assets/projects/shop-website-home-4k.webp\`: 3840×2160 upscale of the owner's 1856×868 Shop Website screenshot, white-letterboxed to keep the entire page visible

## Edit content

Project descriptions and links live in \`index.html\`. The career timeline interactions live in \`script.js\`. Update both if your work or employment dates change. No analytics, contact-form backend, chatbot, or secret API keys are included.

**Data notes:** 4+ years refers to combined, nonconsecutive employment and graduate research experience. The 230 automated tests figure represents the *ApplyWise team* at its October 2026 checkpoint. Jarvis and Shop Website use user-supplied homepage screenshots; the other project previews are illustrative, not measured production metrics. The numeric highlights use Inter instead of the former slashed-zero monospace font. Master's graduation is listed as expected in December 2026.

**Repository links:** ApplyWise and Shop-Website link to their public repositories. Jarvis links to its private repository, which visitors cannot access without permission. The healthcare card is labeled as a related but distinct public implementation.

**Footer contact links:** GitHub links to Nithin0553, Gmail opens a mailto composer, LinkedIn links to the verified `/in/nithinthirumani` profile, and the iMessage icon uses an `sms:` URL for the contact phone number supplied on the resume. On supported Apple devices this opens Messages; it may use SMS instead of iMessage depending on registration. Verify the public phone number before publishing.

## Open-source attribution

Technology logos are from [Devicon](https://github.com/devicons/devicon), licensed under the MIT License. See `assets/skills/LICENSE-devicon.txt`. The social footer includes LinkedIn (from Devicon) and Gmail/iMessage icons from [Simple Icons](https://github.com/simple-icons/simple-icons). Product and technology logos remain trademarks of their respective owners; inclusion does not imply endorsement.

© Nithin Thirumani.

Jarvis uses the real dashboard screenshot from `assets/projects/jarvis-dashboard-4k.webp`.

The Jarvis card uses a 3840×2160 high-quality WebP, carefully upscaled from the owner's original 1920×1080 screenshot. It retains the original UI content; the source is not native 4K.

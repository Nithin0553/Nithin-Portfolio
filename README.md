# Nithin Thirumani — Developer Portfolio

A ground-up, static personal portfolio with a Dark Tech visual system, built for fast loading and easy hosting on GitHub Pages.

## What is here

- **Solid-black hero with a professional engineering summary** drawn from resume experience, followed by an interactive three-toolbox skills display; headings and bold project titles use Inter 800 from the same family as the summary, while technical metadata retains Geist Mono
- **Solid-white hero typography** with selective bold technical keywords, no animated gradient or shimmer effect.
- **Selected projects**: Jarvis, ApplyWise, Microservices based health care monitoring system, and Website for Automobile spare parts store
- **Scroll-driven 3D career journey** from Bachelor’s degree (2020–2024) to AD IT Robotics (2022–2024), Master’s study and graduate research (2025–2026 expected graduation), and ApplyWise team leadership (October 2026). The backpack-wearing 3D student travels along the same SVG path as the blue progress line, transforms into an original Boeing-style twin-engine passenger airliner with swept wings, engines, tail, cockpit and windows, then into an older runner wearing a coat and glasses. Walking/running gaits and airplane speed streaks animate **only while scrolling moves the route**; characters stop when scrolling settles, while the airplane gently floats/rocks without speed streaks. The blue stroke now draws from sampled rail geometry to the airplane’s exact 3D anchor, preventing drift on stretched SVGs. The airplane banks around its fuselage center, with a responsive aspect-correct canvas, a slightly larger silhouette, and subtle blue halo. Upward scrolling reverses the journey. Desktop/mobile and reduced-motion/SVG fallbacks remain supported.
- **Education and certifications** presented separately, with experience in the journey and skills inside three interactive toolboxes
- **Full-screen mobile menu**, keyboard navigation, reduced-motion support, and semantic page structure
- **Interactive wooden tool caddies** for Languages, Apps & Data, and Delivery & Testing. Each is an original SVG of a lidless open-top carpenter's wooden box with timber planks, visible woodgrain, and a fixed straight wooden carrying bar on two end uprights. There is no lid, no latch, and no hammer or other physical tools. Clicking releases 14 Devicon logos in their original staggered floating positions; clicking again returns them. Keyboard buttons, Escape, mobile layout, and reduced-motion support remain.
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
- \`script.js\`: mobile navigation, milestone selection and scroll-linked path coordinates for both the blue line and traveler
- \`journey-3d.js\`: original 3D models and animation implemented with Three.js via a pinned ES-module CDN; falls back to built-in SVG figures without WebGL
- \`assets/favicon.svg\`: original N monogram
- \`assets/skills/wooden-toolbox.svg\`: original no-lid wooden tool caddy illustration
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

## Resume download

Desktop and mobile navigation download the owner's supplied, unmodified PDF at `assets/resume/Nithin_Thirumani_Resume.pdf`. This asset is publicly downloadable from the website.

**3D engine:** Three.js 0.170.0 is loaded as an ES module from jsDelivr (MIT license). The models are original procedural meshes: no third-party character models or external images are required. The browser must be able to reach the CDN to enable WebGL; if it cannot, the original SVG traveler remains available.

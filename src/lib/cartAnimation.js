/**
 * Utility to animate a mini product image flying from its current card position
 * directly into the navigation header cart button.
 * 
 * @param {HTMLElement} startElement The source HTML element (e.g. image of the card)
 * @param {string} imageUrl The source image URL
 */
export const animateFlyToCart = (startElement, imageUrl) => {
  const targetElement = document.getElementById("cart-btn");
  if (!targetElement || !startElement) return;

  const startRect = startElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  // Create flyer element
  const flyer = document.createElement("img");
  flyer.src = imageUrl;
  
  // Initial flyer styling
  flyer.style.position = "fixed";
  flyer.style.left = `${startRect.left + startRect.width / 2 - 25}px`;
  flyer.style.top = `${startRect.top + startRect.height / 2 - 25}px`;
  flyer.style.width = "50px";
  flyer.style.height = "50px";
  flyer.style.objectFit = "contain";
  flyer.style.borderRadius = "50%";
  flyer.style.border = "2px solid #9e1c20";
  flyer.style.backgroundColor = "white";
  flyer.style.zIndex = "10000";
  flyer.style.pointerEvents = "none";
  flyer.style.boxShadow = "0 8px 20px rgba(158, 28, 32, 0.25)";
  
  // Custom curve transition for realistic motion
  flyer.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  
  document.body.appendChild(flyer);

  // Trigger reflow to apply CSS transitions
  requestAnimationFrame(() => {
    flyer.style.left = `${targetRect.left + targetRect.width / 2 - 15}px`;
    flyer.style.top = `${targetRect.top + targetRect.height / 2 - 15}px`;
    flyer.style.width = "20px";
    flyer.style.height = "20px";
    flyer.style.opacity = "0.3";
    flyer.style.transform = "scale(0.4) rotate(360deg)";
  });

  // Cleanup & trigger cart icon impact bounce
  setTimeout(() => {
    flyer.remove();
    
    // Add pop-bounce class to cart button
    targetElement.classList.add("animate-bounce-once");
    setTimeout(() => {
      targetElement.classList.remove("animate-bounce-once");
    }, 500);
  }, 800);
};

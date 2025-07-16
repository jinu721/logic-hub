// "use client";

// import { useEffect } from "react";

// export default function FullscreenButton() {
//   const openFullscreen = () => {
//     const elem = document.documentElement;
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen();
//     } else if ((elem as any).webkitRequestFullscreen) {
//       // Safari
//       (elem as any).webkitRequestFullscreen();
//     } else if ((elem as any).msRequestFullscreen) {
//       // IE11
//       (elem as any).msRequestFullscreen();
//     }
//   };

//   return (
//     <button
//       onClick={openFullscreen}
//       className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
//     >
//       Enter Fullscreen
//     </button>
//   );
// }

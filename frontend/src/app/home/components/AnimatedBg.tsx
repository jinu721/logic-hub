import React, { useEffect, useRef } from "react";

const CoolAnimatedBackground = ({ userStatus = "not attempted" }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef<number | null>(null);

  const statusConfig: Record<
    string,
    {
      primary: string;
      secondary: string;
      accent: string;
      particles: number;
    }
  > = {
    "not attempted": {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      particles: 40,
    },
    completed: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
      particles: 60,
    },
    "failed-timeout": {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#fbbf24",
      particles: 30,
    },
    "failed-output": {
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#f87171",
      particles: 35,
    },
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const config = statusConfig[userStatus] || statusConfig["not attempted"];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // const orbs = Array.from({ length: config.particles }, () => ({
    //   x: Math.random() * canvas.width,
    //   y: Math.random() * canvas.height,
    //   radius: Math.random() * 8 + 3,
    //   vx: (Math.random() - 0.5) * 0.8,
    //   vy: (Math.random() - 0.5) * 0.8,
    //   opacity: Math.random() * 0.6 + 0.2,
    //   hue: 0
    // }));

    // const lines = Array.from({ length: 8 }, (_, i) => ({
    //   points: Array.from({ length: 20 }, (_, j) => ({
    //     x: (j / 19) * canvas.width,
    //     y: canvas.height * 0.5 + Math.sin((j + i) * 0.3) * 30,
    //     baseY: canvas.height * 0.5 + Math.sin((j + i) * 0.3) * 30
    //   })),
    //   offset: i * 0.5,
    //   speed: 0.02 + Math.random() * 0.01
    // }));

    let time = 0;

    const animate = () => {
      time = time + 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, `${config.primary}15`);
      gradient.addColorStop(1, `${config.secondary}25`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // lines.forEach((line, lineIndex) => {
      //   ctx.beginPath();
      //   line.points.forEach((point, i) => {
      //     point.y = point.baseY + Math.sin(time * line.speed + point.x * 0.01 + line.offset) * 15;
      //     if (i === 0) {
      //       ctx.moveTo(point.x, point.y);
      //     } else {
      //       ctx.lineTo(point.x, point.y);
      //     }
      //   });

      //   const alpha = Math.sin(time + lineIndex * 0.5) * 0.3 + 0.4;
      //   ctx.strokeStyle = `${config.accent}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      //   ctx.lineWidth = 2;
      //   ctx.stroke();
      // });

      // orbs.forEach((orb) => {
      //   orb.x += orb.vx;
      //   orb.y += orb.vy;

      //   if (orb.x <= orb.radius || orb.x >= canvas.width - orb.radius) orb.vx *= -1;
      //   if (orb.y <= orb.radius || orb.y >= canvas.height - orb.radius) orb.vy *= -1;

      //   const glow = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 3);
      //   glow.addColorStop(0, `${config.primary}${Math.floor(orb.opacity * 0.8 * 255).toString(16).padStart(2, '0')}`);
      //   glow.addColorStop(0.5, `${config.accent}${Math.floor(orb.opacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
      //   glow.addColorStop(1, `${config.secondary}00`);

      //   ctx.fillStyle = glow;
      //   ctx.beginPath();
      //   ctx.arc(orb.x, orb.y, orb.radius * 3, 0, Math.PI * 2);
      //   ctx.fill();

      //   ctx.fillStyle = `${config.primary}${Math.floor(orb.opacity * 255).toString(16).padStart(2, '0')}`;
      //   ctx.beginPath();
      //   ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      //   ctx.fill();
      // });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  },[userStatus]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default CoolAnimatedBackground;

'use client';

import React from "react";
import Image from "next/image";

const randomImages = [
  "https://i.imgur.com/fBhg0Lv.jpeg",
  "https://i.imgur.com/XwhSV1t.png",
  "https://i.imgur.com/85HKzok.png",
  "https://i.imgur.com/2R08smK.gif",
  "https://i.imgur.com/8z3euLw.gif",
  "https://i.imgur.com/Y9zdk4s.jpeg",
  "https://i.imgur.com/oyUdBpy.png",
  "https://i.imgur.com/3zZlZI1.jpeg",
  "https://i.imgur.com/HsOlxIH.png",
  "https://i.imgur.com/S5uHSJG.jpeg",
  "https://i.imgur.com/CghkrZg.jpeg",
  "https://i.imgur.com/UFu2NE0.jpeg",
  "https://i.imgur.com/W4uIgAZ.jpeg",
  "https://i.imgur.com/cmQ05B0.jpeg",
  "https://i.imgur.com/R0NxsZo.gif",
];

export default function RandomCornerImage() {
  const [randomImg, setRandomImg] = React.useState(randomImages[0]);

  React.useEffect(() => {
    const idx = Math.floor(Math.random() * randomImages.length);
    setRandomImg(randomImages[idx]);
  }, []);

  return (
    <Image
      src={randomImg}
      alt="Rastgele köşe görseli"
      width={256}
      height={256}
      className="fixed right-4 bottom-4 object-contain rounded-xl shadow-lg z-50"
      style={{ pointerEvents: "none" }}
    />
  );
} 
type FrameSlice = {
	min: number;
	max: number;
	src: string;
  };
  
  const frameSlices: FrameSlice[] = [
	{ min: 0,    max: 0.6,  src: '/img/frames/498x1080.png' },
	{ min: 0.6,  max: 0.8,  src: '/img/frames/854x1080.png' },
	{ min: 0.8,  max: 1.1,  src: '/img/frames/1209x1080.png' },
	{ min: 1.1,  max: 1.3,  src: '/img/frames/1565x1080.png' },
	{ min: 1.3,  max: 1.6,  src: '/img/frames/1920x1080.png' },
	{ min: 1.6,  max: 2.5,  src: '/img/frames/1920x810.png' },
	{ min: 2.5,  max: Infinity, src: '/img/frames/1920x540.png' }
  ];
  
  function setFrameImage(): void {
	const img = document.getElementById('frameImg') as HTMLImageElement | null;
	if (!img) return;
  
	const w = window.innerWidth;
	const h = window.innerHeight;
	const ratio = w / h;
  
	const found = frameSlices.find(slice => ratio >= slice.min && ratio < slice.max);
	img.src = found ? found.src : '/img/Frame-1920x1080.png';
  }
  
  window.addEventListener('resize', setFrameImage);
  window.addEventListener('DOMContentLoaded', setFrameImage);
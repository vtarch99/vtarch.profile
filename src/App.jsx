import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Menu, X, ExternalLink, MoveRight, Maximize2, Layers, ArrowLeftRight, Calculator, Check, Cpu, Terminal, Command, MonitorPlay, Cuboid, Sparkles, Sun, Moon } from 'lucide-react';

const IMAGES = {
  portrait: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&q=80&w=800", 
  projectLangMai: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1600", 
  projectDamRong: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1600", 
  projectVinhomes: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1600", 
  projectSpaNail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1600", 
  storeJapandi: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800", 
  storeIndochine: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800", 
  compareRender: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600",
  // Ảnh nền Hero Ngày/Đêm
  heroDay: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
  heroNight: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
};

/* ========================================================
   COMPONENT: TILT CARD (THẺ 3D)
======================================================== */
const TiltCard = ({ children, className, onClick, onMouseEnter, onMouseLeave }) => {
  const [style, setStyle] = useState({});
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeaveInner = () => {
    setStyle({ 
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`, 
      transition: 'transform 0.5s ease-out' 
    });
    if(onMouseLeave) onMouseLeave();
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveInner}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/* ========================================================
   COMPONENT: MAGNETIC BUTTON (NÚT TỪ TÍNH)
======================================================== */
const MagneticButton = ({ children, className, onClick, onMouseEnter, onMouseLeave }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeaveInner = () => {
    setPosition({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveInner}
      onMouseEnter={onMouseEnter}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
      }}
    >
      {children}
    </button>
  );
};

/* ========================================================
   MAIN APP
======================================================== */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // States Báo giá
  const [viewsCount, setViewsCount] = useState(3);
  const [needModeling, setNeedModeling] = useState(false);
  const [needAI, setNeedAI] = useState(true);
  const [needAnimation, setNeedAnimation] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // States MỚI: Tính năng siêu cấp
  const [timeMode, setTimeMode] = useState('night');
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    let total = viewsCount * 800000; 
    if (needModeling) total += 2000000; 
    if (needAI) total += (viewsCount * 200000); 
    if (needAnimation) total += 5000000; 
    setEstimatedPrice(total);
  }, [viewsCount, needModeling, needAI, needAnimation]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500); 
      }
      setLoadingProgress(progress);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    if (isLoading || selectedProject || showSecret) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [isLoading, selectedProject, showSecret]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleSliderMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  // Logic 5 Click Hacker
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setShowSecret(true);
      setClickCount(0);
    }
  };

  // Hiệu ứng click chuột nổ tung
  const handleGlobalClick = (e) => {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    document.body.appendChild(particle);
    setTimeout(() => {
      if (document.body.contains(particle)) {
        document.body.removeChild(particle);
      }
    }, 600);
  };

  return (
    <div 
      className="min-h-screen bg-[#120E0B] text-gray-200 font-sans selection:bg-[#D95A2B] selection:text-white cursor-none relative"
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onClick={handleGlobalClick}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@500;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }

        @media (min-width: 1024px) { * { cursor: none !important; } }

        .bg-grid-subtle {
          background-image: 
            linear-gradient(rgba(217, 90, 43, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 90, 43, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .luxury-card {
          border-radius: 2rem; overflow: hidden; position: relative;
          background: rgba(26, 20, 16, 0.6); border: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .luxury-card:hover {
          border-color: rgba(217, 90, 43, 0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(217, 90, 43, 0.15);
        }

        .gradient-overlay { background: linear-gradient(to top, rgba(18,14,11,1) 0%, rgba(18,14,11,0.6) 50%, transparent 100%); }

        .tag-accent {
          background-color: #D95A2B; color: #fff; font-family: 'Space Mono', monospace; font-weight: 700;
          padding: 4px 10px; border-radius: 6px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .tag-outline {
          background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          color: #bfaea3; font-family: 'Space Mono', monospace; font-weight: 700;
          padding: 4px 10px; border-radius: 6px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
        .reveal-on-scroll.revealed { opacity: 1; transform: translateY(0); }

        .btn-outline-luxury {
          background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 30px;
          color: #fff; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease;
        }
        .btn-outline-luxury:hover { border-color: #D95A2B; color: #D95A2B; background: rgba(217, 90, 43, 0.05); }

        .btn-accent { background: #D95A2B; color: #FFF; border-radius: 30px; font-weight: 700; transition: transform 0.2s; }
        .btn-accent:hover { box-shadow: 0 0 20px rgba(217, 90, 43, 0.4); transform: scale(1.02); }

        /* Range Slider */
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%;
          background: #D95A2B; cursor: ew-resize; margin-top: -10px; box-shadow: 0 0 15px rgba(217, 90, 43, 0.5);
        }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(255,255,255,0.1); border-radius: 2px; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #120E0B; }
        ::-webkit-scrollbar-thumb { background: #2A201A; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #D95A2B; }

        .clay-filter { filter: grayscale(100%) contrast(1.1) brightness(1.2) sepia(20%) hue-rotate(5deg); }

        /* HIỆU ỨNG TIA LỬA CLICK */
        .click-particle {
          position: fixed; pointer-events: none; width: 12px; height: 12px; border-radius: 50%;
          background: #D95A2B; transform: translate(-50%, -50%); z-index: 99999;
          animation: burst 0.5s ease-out forwards;
        }
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; box-shadow: 0 0 20px #D95A2B; }
          100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; box-shadow: 0 0 0 #D95A2B; }
        }

        /* GÕ CHỮ CHO TERMINAL MẬT MÃ */
        .typewriter { overflow: hidden; white-space: nowrap; margin: 0; letter-spacing: 0.05em; animation: typing 2s steps(40, end); }
        @keyframes typing { from { width: 0 } to { width: 100% } }
      `}} />

      {/* --- MÀN HÌNH KHỞI ĐỘNG --- */}
      <div className={`fixed inset-0 z-[99999] bg-[#120E0B] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none -translate-y-10'}`}>
        <div className="w-16 h-16 bg-[#D95A2B] rounded-2xl flex items-center justify-center text-white font-black text-2xl font-heading mb-8 shadow-[0_0_30px_rgba(217,90,43,0.3)] animate-pulse">
            NV
        </div>
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-[#D95A2B] transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
        </div>
        <div className="mt-4 font-mono text-[10px] text-[#A48F82] tracking-[0.2em] flex items-center gap-2">
           <span>LOADING_ENVIRONMENT</span> <span className="text-[#D95A2B] font-bold">{loadingProgress}%</span>
        </div>
      </div>

      {/* --- TRẠM LỆNH ẨN (EASTER EGG) --- */}
      <div className={`fixed inset-0 z-[99998] flex items-center justify-center p-4 transition-all duration-500 ${showSecret ? 'opacity-100 pointer-events-auto backdrop-blur-xl bg-black/80' : 'opacity-0 pointer-events-none'}`}>
          <div className={`w-full max-w-2xl bg-[#0a0a0a] border border-[#D95A2B]/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(217,90,43,0.2)] font-mono text-[#D95A2B] transition-transform duration-500 ${showSecret ? 'scale-100' : 'scale-90'}`}>
              <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#D95A2B]/30">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:scale-125 transition-transform" onClick={() => setShowSecret(false)}></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-[10px] opacity-70">admin@nvthanh:~</div>
              </div>
              <div className="p-6 md:p-10 space-y-4">
                  <p className="typewriter text-sm md:text-base">&gt; Cảnh báo: Truy cập hệ thống máy chủ thành công...</p>
                  {showSecret && (
                    <div className="animate-[typing_2s_steps(40,end)_1s_both] overflow-hidden whitespace-nowrap w-0">
                       <p className="text-white mb-2">&gt; Chúc mừng bạn đã tìm ra phân vùng ẩn của hệ thống!</p>
                       <p className="text-gray-400 mb-6">&gt; Hãy chụp màn hình này gửi cho KTS Thanh để kích hoạt mã ưu đãi:</p>
                       <div className="inline-block px-6 py-3 border border-[#D95A2B] bg-[#D95A2B]/10 text-xl font-bold tracking-widest text-[#D95A2B] shadow-[0_0_15px_rgba(217,90,43,0.2)]">
                           VIP_RENDER_2026
                       </div>
                       <p className="text-[10px] text-gray-500 mt-6">&gt; Giảm 15% tổng chi phí. Bấm nút đỏ góc trái để thoát.</p>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {/* --- CUSTOM CURSOR --- */}
      <div 
        className={`hidden lg:flex fixed top-0 left-0 w-8 h-8 border-[1.5px] rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out items-center justify-center mix-blend-screen ${isHovering ? 'scale-150 border-[#D95A2B] bg-[#D95A2B]/20' : 'border-white/50 scale-100'}`}
        style={{ transform: `translate3d(${mousePos.x - 16}px, ${mousePos.y - 16}px, 0)` }}
      >
        <div className={`w-1 h-1 bg-white rounded-full transition-opacity ${isHovering ? 'opacity-0' : 'opacity-100'}`}></div>
      </div>

      <div className="fixed inset-0 bg-grid-subtle pointer-events-none z-0 opacity-40"></div>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-[#120E0B]/80 border-b border-white/5 backdrop-blur-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between relative z-10">
          
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleLogoClick} // ĐÍCH TỚI CỦA EASTER EGG (Click 5 lần)
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
            title="Logo Hệ thống"
          >
            <div className="w-10 h-10 bg-[#D95A2B] rounded-xl flex items-center justify-center text-white font-black text-xl leading-none pt-0.5 group-hover:shadow-[0_0_15px_#D95A2B] transition-all">
              NV
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-bold tracking-widest leading-none font-heading text-white transition-all">THANH.</span>
              <span className="text-[#A48F82] text-[8px] font-mono tracking-[0.2em] uppercase mt-1.5">SYS.ARCH_VISUALIZER</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center space-x-6 mr-4">
               {['Dịch vụ', 'Dự án', 'Báo Giá', 'Liên hệ'].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => scrollToSection(['services', 'projects', 'estimator', 'contact'][idx])} 
                    onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                    className="text-[11px] font-mono text-[#8A796D] hover:text-[#D95A2B] tracking-widest uppercase transition-colors"
                  >
                     {item}
                  </button>
               ))}
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/5 text-white border border-white/10 hover:border-[#D95A2B] hover:text-[#D95A2B] lg:hidden">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <MagneticButton onClick={() => scrollToSection('estimator')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="hidden lg:flex btn-accent px-6 py-2.5 text-[11px] uppercase tracking-widest font-mono">
               Tính Báo Giá
            </MagneticButton>
          </div>

        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-[#120E0B]/98 backdrop-blur-3xl flex flex-col justify-center items-center transition-all duration-400 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-24 right-8 font-mono text-[#D95A2B] text-[10px] flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-[#D95A2B] animate-pulse"></span> ONLINE_STATUS
        </div>
        <nav className="flex flex-col items-center space-y-8 text-center w-full max-w-xs relative">
          {['Trang chủ', 'Dịch vụ', 'Dự án', 'Báo giá tự động', 'Liên hệ'].map((item, idx) => (
            <button key={idx} onClick={() => scrollToSection(['home', 'services', 'projects', 'estimator', 'contact'][idx])} className="text-2xl font-bold text-gray-200 hover:text-[#D95A2B] uppercase tracking-widest transition-colors font-heading">
              {item}
            </button>
          ))}
        </nav>
      </div>

      <main className="pt-24 pb-32 max-w-6xl mx-auto px-4 md:px-6 space-y-32 relative z-10">
        
        {/* 1. HERO SECTION (TÍCH HỢP NGÀY/ĐÊM) */}
        <section id="home" className="relative rounded-3xl overflow-hidden mt-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            {/* Background 2 Lớp Ảnh */}
            <div className="absolute inset-0">
               <img src={IMAGES.heroNight} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${timeMode === 'night' ? 'opacity-100' : 'opacity-0'}`} alt="Night Render" />
               <img src={IMAGES.heroDay} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${timeMode === 'day' ? 'opacity-100' : 'opacity-0'}`} alt="Day Render" />
               <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center pt-20 pb-24 px-4 reveal-on-scroll">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D95A2B]/40 bg-[#D95A2B]/20 backdrop-blur-md mb-8 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D95A2B] animate-pulse"></span>
                  <span className="text-[9px] font-mono text-white uppercase tracking-widest">Architect & AI Visualizer</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] uppercase tracking-tighter text-white font-heading mb-6 drop-shadow-2xl">
                  Nguyễn Văn <br/>
                  <span className="text-[#D95A2B]">Thanh.</span>
                </h1>
                
                <p className="text-sm md:text-base text-gray-200 font-light max-w-lg mx-auto leading-relaxed mb-10 drop-shadow-md">
                  Khai thác sức mạnh công nghệ Render D5 và AI để kiến tạo không gian siêu chân thực. Trải nghiệm kịch bản ánh sáng ngay bên dưới.
                </p>

                {/* Công Tắc Ánh Sáng */}
                <div 
                  className="flex items-center gap-2 p-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full cursor-pointer mb-12 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                >
                   <button 
                     onClick={(e) => { e.stopPropagation(); setTimeMode('day'); }}
                     className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${timeMode === 'day' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                   >
                      <Sun size={14} /> DAY
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setTimeMode('night'); }}
                     className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${timeMode === 'night' ? 'bg-[#D95A2B] text-white shadow-[0_0_15px_rgba(217,90,43,0.5)]' : 'text-gray-400 hover:text-white'}`}
                   >
                      <Moon size={14} /> NIGHT
                   </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <MagneticButton onClick={() => scrollToSection('estimator')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="btn-accent w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,90,43,0.5)]">
                      Báo Giá Tự Động <MoveRight size={14} />
                  </MagneticButton>
                </div>
            </div>
        </section>

        {/* 2. SECTION: DỊCH VỤ & AI */}
        <section id="services" className="reveal-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                
                <div className="lg:col-span-5 space-y-6">
                    <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D95A2B]">&gt; CHUYÊN MÔN KỸ THUẬT</h2>
                    <h3 className="text-3xl font-black tracking-tight font-heading uppercase text-white mb-6">Dịch Vụ <br/><span className="text-[#D95A2B]">Cốt Lõi</span></h3>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-[#D95A2B]/10 flex items-center justify-center text-[#D95A2B] shrink-0">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1 text-sm md:text-base">Diễn họa 3D Kiến trúc</h4>
                                <p className="text-xs text-[#A48F82] leading-relaxed">Kết xuất hình ảnh tĩnh (Still) và Video Animation chân thực bằng D5 Render.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-[#D95A2B]/40 shadow-[0_0_20px_rgba(217,90,43,0.15)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-[#D95A2B] text-white text-[8px] font-bold tracking-widest font-mono z-10">AI POWERED</div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D95A2B]/0 to-[#D95A2B]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="w-12 h-12 rounded-full bg-[#D95A2B]/20 flex items-center justify-center text-[#D95A2B] shrink-0 relative z-10">
                                <Cpu size={20} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-white mb-1 text-sm md:text-base flex items-center gap-2">Trí tuệ Nhân tạo (AI)</h4>
                                <ul className="text-xs text-[#A48F82] leading-relaxed space-y-1 mt-2 font-mono">
                                    <li>&gt; Nâng cấp ảnh Render (Upscale) đạt chuẩn siêu thực.</li>
                                    <li>&gt; Custom GPT tự động Color Grading.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 luxury-card p-8 md:p-10 h-full">
                    <h3 className="text-xl font-bold text-white mb-8 font-heading uppercase">Quy Trình Tiêu Chuẩn</h3>
                    
                    <div className="relative border-l border-white/10 ml-3 space-y-8">
                        <div className="relative pl-8">
                            <div className="absolute w-6 h-6 bg-[#D95A2B] rounded-full -left-[12px] top-0 flex items-center justify-center text-black font-bold text-[10px] font-mono shadow-[0_0_10px_rgba(217,90,43,0.5)]">1</div>
                            <h4 className="text-white font-bold mb-1">Tiếp nhận & Nghiên cứu</h4>
                            <p className="text-xs text-[#A48F82]">Nắm bắt bản vẽ CAD, moodboard và định hướng.</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute w-6 h-6 bg-[#1A1410] border border-white/20 rounded-full -left-[12px] top-0 flex items-center justify-center text-white font-bold text-[10px] font-mono">2</div>
                            <h4 className="text-white font-bold mb-1">Dựng hình thô (Clay)</h4>
                            <p className="text-xs text-[#A48F82]">Chốt góc nhìn và tỷ lệ không gian.</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute w-6 h-6 bg-[#D95A2B]/20 border border-[#D95A2B] rounded-full -left-[12px] top-0 flex items-center justify-center text-[#D95A2B] font-bold text-[10px] font-mono">3</div>
                            <h4 className="text-white font-bold mb-1">Final Render & AI Enhance</h4>
                            <p className="text-xs text-[#A48F82]">Kết xuất độ phân giải cao và Tối ưu chi tiết bằng AI.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        {/* 3. SECTION: KỸ NĂNG SO SÁNH (SLIDER TRƯỚC/SAU) */}
        <section className="reveal-on-scroll">
          <div className="mb-10 px-2 flex flex-col items-center text-center">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 text-[#8A796D]">&gt; INTERACTIVE_VISUALIZATION</h2>
            <h3 className="text-3xl font-black tracking-tight font-heading uppercase text-white">Chất Cảm <span className="text-[#D95A2B]">Vật Liệu</span></h3>
          </div>

          <div 
            className="w-full max-w-5xl mx-auto relative aspect-[4/3] md:aspect-[21/9] rounded-[2rem] overflow-hidden cursor-ew-resize luxury-card select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            ref={sliderRef}
            onMouseDown={(e) => { e.stopPropagation(); setIsDragging(true); }} 
            onTouchStart={(e) => { e.stopPropagation(); setIsDragging(true); }}
            onMouseMove={handleSliderMove} onTouchMove={handleSliderMove}
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
          >
            <img src={IMAGES.compareRender} alt="Final Render" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute top-4 right-4 z-10 tag-accent opacity-90 backdrop-blur-sm shadow-md">FINAL RENDER</div>

            <div 
              className="absolute inset-0 pointer-events-none z-10" 
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
                <img src={IMAGES.compareRender} alt="Clay Model" className="absolute inset-0 w-full h-full object-cover clay-filter pointer-events-none" />
                <div className="absolute top-4 left-4 tag-outline border-white/20 bg-black/40 backdrop-blur-sm text-white shadow-md">CLAY MODEL</div>
            </div>

            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-[#D95A2B] z-20 pointer-events-none shadow-[0_0_10px_rgba(217,90,43,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#120E0B] border-2 border-[#D95A2B] rounded-full flex items-center justify-center text-[#D95A2B] shadow-[0_0_15px_rgba(217,90,43,0.5)]">
                  <ArrowLeftRight size={16} />
               </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION: DỰ ÁN (TILT CARDS) */}
        <section id="projects">
          <div className="mb-12 px-2 flex flex-col items-center text-center reveal-on-scroll">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 text-[#8A796D]">&gt; SELECTED_WORKS</h2>
            <h3 className="text-3xl font-black tracking-tight font-heading uppercase text-white">Dự Án <span className="text-[#D95A2B]">Tiêu Biểu</span></h3>
          </div>

          <div className="space-y-12">
            <TiltCard 
              className="luxury-card aspect-[4/5] sm:aspect-square md:aspect-[16/9] cursor-pointer group reveal-on-scroll"
              onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
              onClick={(e) => { e.stopPropagation(); setSelectedProject({
                title: "Căn Hộ Vinhomes Japandi", tags: ["NỘI THẤT DÂN DỤNG", "120M2", "D5 RENDER"], image: IMAGES.projectVinhomes,
                desc: "Thiết kế nội thất căn hộ 3 phòng ngủ. Áp dụng phong cách Japandi. Tập trung mô phỏng ánh sáng tự nhiên bằng D5 Render."
              })}}
            >
              <img src={IMAGES.projectVinhomes} alt="Vinhomes" className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 gradient-overlay"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
                <div className="max-w-md">
                   <div className="flex flex-wrap gap-2 mb-4">
                     <span className="tag-accent">NỘI THẤT</span>
                     <span className="tag-outline border-white/10">120M2</span>
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-white uppercase leading-snug font-heading mb-2 drop-shadow-md">Căn Hộ Vinhomes Japandi</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#D95A2B] transition-colors backdrop-blur-md">
                   <Maximize2 size={18} />
                </div>
              </div>
            </TiltCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <TiltCard 
                 className="luxury-card aspect-square cursor-pointer group reveal-on-scroll delay-100"
                 onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                 onClick={(e) => { e.stopPropagation(); setSelectedProject({
                    title: "Đầm Rông Resort", tags: ["RESORT", "VISUALIZER"], image: IMAGES.projectDamRong,
                    desc: "Dự án diễn họa 3D cho khu nghỉ dưỡng cao cấp tại Lâm Đồng. Xử lý thảm thực vật đa dạng."
                 })}}
               >
                 <img src={IMAGES.projectDamRong} alt="Đầm Rông" className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute inset-0 gradient-overlay"></div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
                   <div className="flex flex-wrap gap-2 mb-3"><span className="tag-outline border-white/10">RESORT</span></div>
                   <h3 className="text-xl font-bold text-white uppercase font-heading">Đầm Rông Resort</h3>
                 </div>
               </TiltCard>

               <TiltCard 
                 className="luxury-card aspect-square cursor-pointer group reveal-on-scroll delay-200"
                 onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                 onClick={(e) => { e.stopPropagation(); setSelectedProject({
                    title: "Clay Chic Nails & Spa", tags: ["F&B / SPA", "D5 RENDER"], image: IMAGES.projectSpaNail,
                    desc: "Thiết kế chuỗi không gian dịch vụ chăm sóc sắc đẹp."
                 })}}
               >
                 <img src={IMAGES.projectSpaNail} alt="Spa" className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute inset-0 gradient-overlay"></div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
                   <div className="flex flex-wrap gap-2 mb-3"><span className="tag-outline border-white/10">F&B RETAIL</span></div>
                   <h3 className="text-xl font-bold text-white uppercase font-heading">Clay Chic Spa</h3>
                 </div>
               </TiltCard>
            </div>
          </div>
        </section>

        {/* 5. SECTION: HỆ THỐNG BÁO GIÁ TỰ ĐỘNG */}
        <section id="estimator" className="reveal-on-scroll" onClick={(e) => e.stopPropagation()}>
           <div className="luxury-card p-8 md:p-12 border border-[#D95A2B]/30 bg-gradient-to-br from-[#1A1410] to-[#120E0B]">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                  
                  <div className="w-full md:w-1/2 space-y-8">
                      <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D95A2B]/10 rounded border border-[#D95A2B]/20 text-[#D95A2B] text-[10px] font-mono font-bold mb-3">
                             <Calculator size={12}/> AUTO_QUOTE_SYSTEM
                          </div>
                          <h3 className="text-3xl font-black text-white font-heading uppercase mb-2">Dự Toán <span className="text-[#D95A2B]">Chi Phí</span></h3>
                      </div>

                      <div className="space-y-6">
                          <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm font-bold text-white">
                                  <span>Số lượng ảnh (Views)</span>
                                  <span className="text-[#D95A2B] text-xl font-mono">{viewsCount}</span>
                              </div>
                              <input type="range" min="1" max="15" value={viewsCount} onChange={(e) => setViewsCount(parseInt(e.target.value))} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
                              <p className="text-[10px] text-[#A48F82] font-mono text-right">800.000đ / View</p>
                          </div>

                          <div className="space-y-3">
                              <label className="text-sm font-bold text-white mb-2 block">Dịch vụ mở rộng</label>
                              <div className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${needModeling ? 'bg-[#D95A2B]/10 border-[#D95A2B]' : 'bg-white/5 border-white/10'}`} onClick={() => setNeedModeling(!needModeling)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                  <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${needModeling ? 'bg-[#D95A2B] border-[#D95A2B]' : 'border-gray-500'}`}>{needModeling && <Check size={14} className="text-black" />}</div>
                                      <div>
                                          <p className="text-sm text-white font-medium">Dựng hình 3D (Modeling)</p>
                                      </div>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono">+2tr</span>
                              </div>

                              <div className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${needAI ? 'bg-[#D95A2B]/10 border-[#D95A2B]' : 'bg-white/5 border-white/10'}`} onClick={() => setNeedAI(!needAI)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                  <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${needAI ? 'bg-[#D95A2B] border-[#D95A2B]' : 'border-gray-500'}`}>{needAI && <Check size={14} className="text-black" />}</div>
                                      <div>
                                          <p className="text-sm text-white font-medium flex items-center gap-1">Nâng cấp ảnh AI <Cpu size={12} className="text-[#D95A2B]"/></p>
                                      </div>
                                  </div>
                                  <span className="text-xs text-gray-400 font-mono">+200k/view</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="w-full md:w-1/2 bg-[#120E0B] p-6 md:p-8 rounded-2xl border border-white/5 shadow-inner">
                      <h4 className="text-sm text-[#A48F82] font-mono uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Tổng Chi Phí Ước Tính</h4>
                      
                      <div className="flex items-end gap-2 mb-2">
                          <span className="text-4xl md:text-5xl font-black text-[#D95A2B] font-mono">{formatVND(estimatedPrice)}</span>
                      </div>

                      <MagneticButton 
                        onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:vtarch99@gmail.com?subject=Tư vấn Render 3D - Dự toán: ${formatVND(estimatedPrice)}`; }}
                        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
                        className="w-full btn-accent py-4 mt-8 text-sm uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                      >
                         Gửi Yêu Cầu Chốt Deal <MoveRight size={16} />
                      </MagneticButton>
                  </div>

              </div>
           </div>
        </section>

      </main>

      {/* MODAL CHI TIẾT DỰ ÁN */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-500 ${selectedProject ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="absolute inset-0 bg-[#120E0B]/90 backdrop-blur-md" onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></div>
         <div className={`relative w-full max-w-5xl max-h-[90vh] bg-[#1A1410] rounded-3xl overflow-hidden border border-[#D95A2B]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row transition-transform duration-500 ${selectedProject ? 'scale-100' : 'scale-95'}`}>
            <MagneticButton onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#D95A2B] transition-colors" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
               <X size={18} />
            </MagneticButton>
            <div className="w-full md:w-3/5 h-[40vh] md:h-full relative bg-black">
               {selectedProject && <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />}
            </div>
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
               {selectedProject && (
                 <>
                   <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProject.tags.map((tag, idx) => (<span key={tag} className={idx === 0 ? "tag-accent" : "tag-outline"}>{tag}</span>))}
                   </div>
                   <h2 className="text-3xl font-black text-white font-heading uppercase leading-tight mb-6">{selectedProject.title}</h2>
                   <div className="w-12 h-1 bg-[#D95A2B] mb-6"></div>
                   <p className="text-sm text-[#A48F82] leading-relaxed font-light mb-8">{selectedProject.desc}</p>
                   <MagneticButton onClick={(e) => {e.stopPropagation(); setSelectedProject(null); scrollToSection('estimator');}} className="btn-accent w-max px-6 py-3 text-xs uppercase tracking-widest font-mono mt-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      Tính giá dự án này
                   </MagneticButton>
                 </>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}

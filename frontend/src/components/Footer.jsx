export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-12 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black text-white flex items-center justify-center rounded text-[10px] font-bold">AU</div>
          <span className="font-bold text-sm tracking-tight text-gray-900">AUTO ULTIMATE</span>
        </div>
        <p className="text-gray-400 text-xs">
          © 2026 Auto Ultimate Fleet Management. All rights reserved. By <p className="text-[12px] text-black-400 bg-gradient-to-r flex items-center justify-center from-gray-500 to-purple-500 font-bold bg-clip-text text-transparent">
          @Palhetaspedro
        </p>
        </p>
       
        <div className="flex gap-6">
          
          <a href="#" className="text-xs font-bold text-gray-500 hover:text-black">Privacy Policy</a>
          <a href="#" className="text-xs font-bold text-gray-500 hover:text-black">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
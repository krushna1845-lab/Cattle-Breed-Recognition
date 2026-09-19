import farmFriendLogo from "../assets/4563315b392ad10bc248053d2c9862885528b2cf.png";

export function Logo3D() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 logo-3d rounded-2xl floating-animation">
      {/* Farm Friend Logo */}
      <div className="relative z-10 w-full h-full">
        <img 
          src={farmFriendLogo} 
          alt="Farm Friend Logo" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      
      {/* Natural glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-orange-400 opacity-20 pulse-glow"></div>
      
      {/* Additional layer for depth */}
      <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
    </div>
  );
}